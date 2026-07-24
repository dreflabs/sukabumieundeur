import { withTransaction } from '@/lib/db';
import { PoolClient } from 'pg';

export interface CheckoutItem {
  name: string;
  quantity: number;
  categoryId?: string;
  productId?: string;
  variantId?: string;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  courier: string;
}

export interface CheckoutPayload {
  items: CheckoutItem[];
  customer: CustomerDetails;
  shippingCost: number;
  totalAmount: number; // Front-end calculated, to be verified
}

export async function processCheckout(payload: CheckoutPayload, userId: string) {
  const { items, customer, shippingCost } = payload;

  if (!items || items.length === 0) {
    throw new Error('Cart is empty');
  }

  // We use withTransaction to ensure atomic DB operations
  return await withTransaction(async (client: PoolClient) => {
    let backendSubtotal = 0;
    const verifiedItems = [];

    // 1. Verify Prices & Calculate Subtotal
    for (const item of items) {
      if (item.categoryId) {
        const tRes = await client.query(`SELECT price FROM ticket_categories WHERE id = $1`, [item.categoryId]);
        if (tRes.rowCount === 0) throw new Error(`Invalid ticket category: ${item.name}`);
        const price = Number(tRes.rows[0].price);
        backendSubtotal += (price * item.quantity);
        verifiedItems.push({ ...item, realPrice: price, itemType: 'TICKET' });
      } else {
        if (!item.productId) throw new Error(`Missing productId for merch: ${item.name}`);
        if (!item.variantId) throw new Error(`Missing variantId for merch: ${item.name}`);
        
        // Lock the variant row to prevent concurrent overselling
        const vRes = await client.query(`SELECT stock FROM merch_variants WHERE id = $1 FOR UPDATE`, [item.variantId]);
        if (vRes.rowCount === 0) throw new Error(`Merchandise variant not found: ${item.name}`);
        if (vRes.rows[0].stock < item.quantity) throw new Error(`Insufficient stock for: ${item.name}`);

        const mRes = await client.query(`SELECT base_price FROM merch_products WHERE id = $1`, [item.productId]);
        if (mRes.rowCount === 0) throw new Error(`Merchandise not found: ${item.name}`);
        const price = Number(mRes.rows[0].base_price);
        backendSubtotal += (price * item.quantity);
        verifiedItems.push({ ...item, realPrice: price, itemType: 'MERCH' });
      }
    }

    const verifiedTotalAmount = backendSubtotal + shippingCost;
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random()*1000)}`;

    // 2. Insert Order
    const orderRes = await client.query(`
      INSERT INTO orders (
        order_number, user_id, 
        shipping_address, shipping_city, shipping_postal_code, 
        shipping_courier, shipping_cost, total_amount, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING')
      RETURNING id;
    `, [
      orderNumber, userId, customer.address, customer.city, 
      customer.postalCode, customer.courier, shippingCost, verifiedTotalAmount
    ]);

    const orderId = orderRes.rows[0].id;

    // 3. Bulk Insert Order Items
    // Constructing the parameterized bulk insert query
    if (verifiedItems.length > 0) {
      const insertValues: string[] = [];
      const flatParams: any[] = [];
      
      verifiedItems.forEach((vItem, index) => {
        const baseIdx = index * 6;
        insertValues.push(`($${baseIdx + 1}, $${baseIdx + 2}, $${baseIdx + 3}, $${baseIdx + 4}, $${baseIdx + 5}, $${baseIdx + 6})`);
        
        flatParams.push(orderId); // $1
        flatParams.push(vItem.itemType); // $2
        flatParams.push(vItem.itemType === 'TICKET' ? vItem.categoryId : null); // $3
        flatParams.push(vItem.itemType === 'MERCH' ? (vItem.variantId || null) : null); // $4
        flatParams.push(vItem.quantity); // $5
        flatParams.push(vItem.realPrice); // $6
      });

      const bulkInsertQuery = `
        INSERT INTO order_items (order_id, item_type, ticket_category_id, merch_variant_id, quantity, unit_price)
        VALUES ${insertValues.join(', ')}
      `;

      await client.query(bulkInsertQuery, flatParams);
    }

    // 4. Request Midtrans Snap Token
    const midtransServerKey = process.env.MIDTRANS_SERVER_KEY;
    if (!midtransServerKey) {
      throw new Error('Midtrans server key is not configured.');
    }
    
    const authString = Buffer.from(`${midtransServerKey}:`).toString('base64');
    const midtransUrl = process.env.MIDTRANS_URL || 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    const snapPayload = {
      transaction_details: {
        order_id: `EUNDEUR-${orderId}`,
        gross_amount: Math.round(verifiedTotalAmount)
      },
      customer_details: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        shipping_address: {
          first_name: customer.firstName,
          last_name: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          postal_code: customer.postalCode,
          country_code: "IDN"
        }
      }
    };

    const midtransRes = await fetch(midtransUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify(snapPayload)
    });

    const midtransData = await midtransRes.json();

    if (!midtransRes.ok || !midtransData.token) {
      throw new Error(midtransData.error_messages ? midtransData.error_messages.join(', ') : 'Failed to create payment transaction');
    }

    return {
      orderId,
      token: midtransData.token
    };
  });
}

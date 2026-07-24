import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyUserSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await verifyUserSession();
    if (!session || !session.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { reservationId, customerDetails } = body;

    if (!reservationId) {
      return NextResponse.json({ success: false, message: 'Reservation ID is missing' }, { status: 400 });
    }

    // 1. Fetch reservation from DB securely
    const holdQuery = `
      SELECT r.id, r.user_id, r.ticket_category_id, r.quantity, c.price, c.name, r.expires_at
      FROM ticket_reservations r
      JOIN ticket_categories c ON r.ticket_category_id = c.id
      WHERE r.id = $1 AND r.user_id = $2 AND r.status = 'HOLD' AND r.expires_at > NOW()
    `;
    const holdRes = await query<any>(holdQuery, [reservationId, session.id]);

    if (holdRes.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid or expired reservation' }, { status: 404 });
    }

    const holdData = holdRes[0];
    const unitPrice = Number(holdData.price);
    const totalAmount = unitPrice * holdData.quantity;
    
    // Calculate remaining minutes for Midtrans expiry
    const expiryTime = new Date(holdData.expires_at).getTime();
    const nowTime = Date.now();
    const remainingMinutes = Math.max(1, Math.ceil((expiryTime - nowTime) / 60000));

    // 2. Insert Order to DB
    const orderQuery = `
      INSERT INTO orders (
        order_number, user_id, 
        total_amount, status
      )
      VALUES ($1, $2, $3, 'PENDING')
      RETURNING id;
    `;
    
    const orderNumber = `TKT-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    
    const orderRes = await query<{ id: string }>(orderQuery, [
      orderNumber,
      holdData.user_id,
      totalAmount
    ]);
    const orderId = orderRes[0].id;

    // Bind this reservation to the created order ID
    await query(
      `UPDATE ticket_reservations SET order_id = $1 WHERE id = $2`,
      [orderId, reservationId]
    );

    // 3. Request Midtrans Snap Token
    const midtransServerKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-DUMMYKEY123';
    const authString = Buffer.from(`${midtransServerKey}:`).toString('base64');
    const midtransUrl = 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    const snapPayload = {
      transaction_details: {
        order_id: `EUNDEUR-${orderId}`,
        gross_amount: Math.round(totalAmount)
      },
      customer_details: {
        first_name: customerDetails?.firstName || 'Eundeur',
        last_name: customerDetails?.lastName || 'Metalhead',
        email: customerDetails?.email || 'mosher@eundeur.com',
        phone: customerDetails?.phone || '080000000000'
      },
      custom_expiry: {
        expiry_duration: remainingMinutes,
        unit: 'minute'
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

    if (midtransRes.ok && midtransData.token) {
      return NextResponse.json({
        success: true,
        orderId,
        token: midtransData.token
      });
    } else {
      console.error("Midtrans Error:", midtransData);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to create payment transaction' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Ticket Checkout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    const notification = await request.json();

    // Verify signature key (Security)
    const midtransServerKey = process.env.MIDTRANS_SERVER_KEY;
    if (!midtransServerKey) {
      return NextResponse.json({ success: false, message: 'Internal Server Error: Missing Midtrans Configuration' }, { status: 500 });
    }
    
    // Hash format: SHA512(order_id + status_code + gross_amount + server_key)
    const hashData = `${notification.order_id}${notification.status_code}${notification.gross_amount}${midtransServerKey}`;
    const generatedSignature = crypto.createHash('sha512').update(hashData).digest('hex');

    if (generatedSignature !== notification.signature_key) {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 403 });
    }

    // Extract order ID (EUNDEUR-uuid -> uuid)
    const orderId = notification.order_id.replace('EUNDEUR-', '');
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;
    
    let dbStatus = 'PENDING';

    if (transactionStatus == 'capture') {
      if (fraudStatus == 'challenge') {
        dbStatus = 'PENDING'; // Need manual verify
      } else if (fraudStatus == 'accept') {
        dbStatus = 'PAID';
      }
    } else if (transactionStatus == 'settlement') {
      dbStatus = 'PAID';
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
      dbStatus = 'FAILED';
    } else if (transactionStatus == 'pending') {
      dbStatus = 'PENDING';
    }

    // Update database orders table
    const updateQuery = `
      UPDATE orders 
      SET status = $1, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND status != 'PAID'
      RETURNING id, user_id, status as old_status
    `;

    const updatedOrder = await query<{id: string, user_id: string}>(updateQuery, [
      dbStatus, 
      orderId
    ]);

    if (dbStatus === 'FAILED' && updatedOrder.length > 0) {
      // Release quota if expired/canceled immediately
      const holdsToRelease = await query<{id: string, ticket_category_id: string, quantity: number}>(
        `SELECT id, ticket_category_id, quantity 
         FROM ticket_reservations 
         WHERE order_id = $1 AND status = 'HOLD'`,
        [orderId]
      );
      
      for (const hold of holdsToRelease) {
        await query(`UPDATE ticket_reservations SET status = 'EXPIRED' WHERE id = $1`, [hold.id]);
        await query(
          `UPDATE ticket_categories 
           SET available_quota = available_quota + $1, updated_at = NOW() 
           WHERE id = $2`,
          [hold.quantity, hold.ticket_category_id]
        );
      }
    }

    if (dbStatus === 'PAID' && updatedOrder.length > 0) {
      const userId = updatedOrder[0].user_id;
      
      // 1. Fetch HOLD reservations for this order (Legacy/Standard Ticketing Flow)
      const holds = await query<{id: string, ticket_category_id: string, quantity: number}>(
        `SELECT id, ticket_category_id, quantity 
         FROM ticket_reservations 
         WHERE order_id = $1 AND status = 'HOLD'`,
        [orderId]
      );

      // 1.5 Fetch TICKETS from this specific order's order_items (Hybrid Commerce Flow)
      const hybridTickets = await query<{id: string, ticket_category_id: string, quantity: number}>(
        `SELECT id, ticket_category_id, quantity 
         FROM order_items 
         WHERE order_id = $1 AND item_type = 'TICKET'`,
        [orderId]
      );

      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        return NextResponse.json({ success: false, message: 'Internal Server Error: Missing Auth Configuration' }, { status: 500 });
      }
      const secret = new TextEncoder().encode(JWT_SECRET);

      // 2. Generate Tickets and Convert Holds
      for (const hold of holds) {
        for (let i = 0; i < hold.quantity; i++) {
          const ticketCode = `TCK-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
          
          const qrHash = await new SignJWT({ ticketCode, orderId, userId, categoryId: hold.ticket_category_id })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .sign(secret);
          
          await query(
            `INSERT INTO tickets (ticket_code, order_id, user_id, ticket_category_id, qr_code_hash, status)
             VALUES ($1, $2, $3, $4, $5, 'ISSUED')`,
             [ticketCode, orderId, userId, hold.ticket_category_id, qrHash]
          );
        }
        
        // 3. Convert reservation
        await query(`UPDATE ticket_reservations SET status = 'CONVERTED' WHERE id = $1`, [hold.id]);
      }

      // 4. Generate Tickets for Hybrid Commerce Flow
      for (const hTicket of hybridTickets) {
        for (let i = 0; i < hTicket.quantity; i++) {
          const ticketCode = `TCK-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
          
          const qrHash = await new SignJWT({ ticketCode, orderId, userId, categoryId: hTicket.ticket_category_id })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .sign(secret);
          
          await query(
            `INSERT INTO tickets (ticket_code, order_id, user_id, ticket_category_id, qr_code_hash, status)
             VALUES ($1, $2, $3, $4, $5, 'ISSUED')`,
             [ticketCode, orderId, userId, hTicket.ticket_category_id, qrHash]
          );
        }
      }
      
      console.log(`[TICKETING ENGINE] Generated tickets for order ${orderId}. Sending Email (MOCK).`);
    }

    return NextResponse.json({ success: true, message: 'Notification processed' });
  } catch (error) {
    console.error('Midtrans Webhook Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { processCheckout, CheckoutPayload } from '@/lib/services/checkoutService';
import { getUserSessionOrNull } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getUserSessionOrNull();
    if (!session || !session.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please login to checkout.' },
        { status: 401 }
      );
    }

    const body: CheckoutPayload = await request.json();
    const result = await processCheckout(body, session.id);

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      token: result.token
    });

  } catch (error: any) {
    console.error('Checkout API error:', error);
    
    // Distinguish between bad request and internal server error based on error message
    const isClientError = error.message.includes('Invalid') || error.message.includes('Missing') || error.message.includes('not found') || error.message.includes('empty');
    
    return NextResponse.json(
      { success: false, message: isClientError ? error.message : 'Internal Server Error during checkout.' },
      { status: isClientError ? 400 : 500 }
    );
  }
}

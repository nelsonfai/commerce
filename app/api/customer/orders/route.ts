// app/api/customer/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCustomerOrders } from 'lib/customer';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get('first') || '10');
    
    const orders = await getCustomerOrders(first);
    
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch orders' },
      { status: error instanceof Error && error.message === 'Customer not authenticated' ? 401 : 500 }
    );
  }
}
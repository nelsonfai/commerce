// app/api/customer/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCustomer, updateCustomer } from 'lib/customer';
export async function GET() {
  try {
    const customer = await getCustomer();
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Get customer error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json();
    
    const customer = await updateCustomer(updates);
    
    return NextResponse.json({ 
      success: true,
      customer 
    });
  } catch (error) {
    console.error('Update customer error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update profile' },
      { status: 400 }
    );
  }
}

// app/api/auth/register/route.ts
import { createCustomer } from 'lib/customer-delete';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone, acceptsMarketing } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const customer = await createCustomer({
      email,
      password,
      firstName,
      lastName,
      phone,
      acceptsMarketing: acceptsMarketing || false
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Account created successfully',
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Registration failed' },
      { status: 400 }
    );
  }
}

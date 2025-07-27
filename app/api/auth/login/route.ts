// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { customerLogin } from 'lib/customer';
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await customerLogin(email, password);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      expiresAt: result.expiresAt 
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 401 }
    );
  }
}
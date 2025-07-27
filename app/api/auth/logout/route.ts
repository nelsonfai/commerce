// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { customerLogout } from 'lib/customer';

export async function POST(request: NextRequest) {
  try {
    await customerLogout();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Logout successful' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

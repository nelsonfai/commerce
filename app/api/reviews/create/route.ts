// app/api/reviews/create/route.ts
import { createReview } from 'lib/judgeme';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    //console.log('Create review request body:', { ...body, email: '[HIDDEN]' });
    
    // Validate required fields
    if (!body.rating || !body.name || !body.email || !body.body || !body.product_handle || !body.product_id) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure rating is a number
    body.rating = parseInt(body.rating);
    
    const result = await createReview(body);
    
    //console.log('Create review result:', result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
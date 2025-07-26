// app/api/reviews/[handle]/info/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getProductReviewInfo } from 'lib/judgeme';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    
    console.log(`Fetching review info for product: ${handle}`);

    const reviewInfo = await getProductReviewInfo(handle);
    
    if (!reviewInfo) {
      return NextResponse.json(
        { error: 'Failed to fetch review info' },
        { status: 500 }
      );
    }

    return NextResponse.json(reviewInfo);
  } catch (error) {
    console.error('Error in review info API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
// app/api/reviews/[handle]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCombinedProductData } from 'lib/judgeme';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '10');
    const includeProductInfo = searchParams.get('include_product_info') === 'true';

    console.log(`Fetching reviews for product: ${handle}, page: ${page}, include_info: ${includeProductInfo}`);

    const data = await getCombinedProductData(handle, page, perPage);
        
    if (!data) {
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    // Return combined data or just reviews based on request
    if (includeProductInfo) {
      return NextResponse.json(data);
    } else {
      // Return just the reviews data for compatibility
      return NextResponse.json({
        reviews: data.reviews,
        current_page: data.current_page,
        per_page: data.per_page,
        total: data.total
      });
    }
  } catch (error) {
    console.error('Error in reviews API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { getProductReviews } from 'lib/judgeme';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('per_page') || '10', 10);
    const handle = searchParams.get('handle') || '';
    //console.log('Get reviews request:', { handle, page, perPage });

    const data = await getProductReviews(handle, page, perPage);

    if (!data) {
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

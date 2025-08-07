// lib/judgeme.ts - Simplified version
export interface JudgeMeReview {
  id: number;
  title: string;
  body: string;
  rating: number;
  name: string;
  email: string;
  verified: 'verified_buyer' | 'unverified';
  created_at: string;
  updated_at: string;
  pictures?: Array<{
    urls: {
      original: string;
      small: string;
      compact: string;
      huge: string;
    };
  }>;
  reviewer: {
    name: string;
  };
}

export interface JudgeMeReviewsResponse {
  reviews: JudgeMeReview[];
  current_page: number;
  per_page: number;
  total: number;
}

export interface CreateReviewData {
  title: string;
  body: string;
  rating: number;
  name: string;
  email: string;
  product_handle: string;
  product_id?: string;
}

const JUDGEME_API_TOKEN = process.env.JUDGEME_API_TOKEN;
const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;

/**
 * Get product ID by handle - single purpose function
 */
export async function getProductId(productHandle: string): Promise<number | null> {
  if (!JUDGEME_API_TOKEN || !SHOPIFY_DOMAIN) return null;

  try {
    const url = new URL('https://judge.me/api/v1/products/-1');
    url.searchParams.append('api_token', JUDGEME_API_TOKEN);
    url.searchParams.append('shop_domain', SHOPIFY_DOMAIN);
    url.searchParams.append('handle', productHandle);

    const response = await fetch(url.toString());
    if (!response.ok) return null;

    const data = await response.json();
    return data.product?.id || null;
  } catch {
    return null;
  }
}

/**
 * Fetch reviews for a product - single purpose function
 */
export async function getProductReviews(
  productHandle: string,
  page: number = 1,
  perPage: number = 10
): Promise<JudgeMeReviewsResponse | null> {
  if (!JUDGEME_API_TOKEN || !SHOPIFY_DOMAIN) return null;

  try {
    // Get product ID first
    const productId = await getProductId(productHandle);
    if (!productId) return null;

    // Fetch reviews
    const url = new URL('https://judge.me/api/v1/reviews');
    url.searchParams.append('api_token', JUDGEME_API_TOKEN);
    url.searchParams.append('shop_domain', SHOPIFY_DOMAIN);
    url.searchParams.append('product_id', productId.toString());
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', perPage.toString());

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`API error: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return null;
  }
}

export async function createReview(
  reviewData: CreateReviewData
): Promise<{ success: boolean; message: string }> {
  if (!JUDGEME_API_TOKEN || !SHOPIFY_DOMAIN) {
    return { success: false, message: 'Judge.me not configured' };
  }

  try {
    // Extract numeric product ID if it's in gid format
    let productId: number | null = null;
    if (typeof reviewData.product_id === 'string') {
      const matches = reviewData.product_id.match(/(\d+)$/);
      if (matches && matches.length > 1) {
        productId = parseInt(matches[1] ?? '', 10);
      } else {
        productId = null;
      }
    } else if (typeof reviewData.product_id === 'number') {
      productId = reviewData.product_id;
    }

    if (productId === null || isNaN(productId)) {
      return { success: false, message: 'Invalid product_id format' };
    }

    const payload = {
      api_token: JUDGEME_API_TOKEN,
      shop_domain: SHOPIFY_DOMAIN,
      platform: 'shopify',
      title: reviewData.title,
      body: reviewData.body,
      rating: reviewData.rating,
      reviewer_name: reviewData.name,
      email: reviewData.email,
      product_handle: reviewData.product_handle,
      product_id: productId,
      id: productId,
    };


    const response = await fetch('https://judge.me/api/v1/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, message: error.message || 'Failed to submit review' };
    }

    return { success: true, message: 'Review submitted successfully!' };
  } catch {
    return { success: false, message: 'Failed to submit review. Please try again.' };
  }
}


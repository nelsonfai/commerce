// lib/judgeme.ts
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
  pictures: Array<{
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

export interface JudgeMeProductInfo {
  product: {
    id: number;
    handle: string;
    title: string;
    average_rating: number;
    reviews_count: number;
  };
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

// Combined response for efficiency
export interface CombinedReviewData {
  reviews: JudgeMeReview[];
  current_page: number;
  per_page: number;
  total: number;
  product_info: {
    id: number;
    handle: string;
    title: string;
    average_rating: number;
    reviews_count: number;
  };
}

const JUDGEME_API_TOKEN = process.env.JUDGEME_API_TOKEN;
const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;

// In-memory cache for product lookups (expires after 5 minutes)
const productCache = new Map<string, { data: JudgeMeProductInfo; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get product by handle with caching to avoid repeated API calls
 */
async function getProductByHandle(productHandle: string): Promise<JudgeMeProductInfo | null> {
  if (!JUDGEME_API_TOKEN || !SHOPIFY_DOMAIN) {
    return null;
  }

  // Check cache first
  const cached = productCache.get(productHandle);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Using cached product data for: ${productHandle}`);
    return cached.data;
  }

  try {
    const url = new URL('https://judge.me/api/v1/products/-1');
    url.searchParams.append('api_token', JUDGEME_API_TOKEN);
    url.searchParams.append('shop_domain', SHOPIFY_DOMAIN);
    url.searchParams.append('handle', productHandle);

    console.log(`Fetching product data for: ${productHandle}`);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Judge.me API error: ${response.status} - ${errorText}`);
      return null;
    }

    const data = await response.json();
    
    // Cache the result
    if (data.product) {
      productCache.set(productHandle, { data, timestamp: Date.now() });
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Judge.me product by handle:', error);
    return null;
  }
}

/**
 * Fetch reviews AND product info in a single optimized call
 * This eliminates the duplicate product lookup
 */
export async function getCombinedProductData(
  productHandle: string,
  page: number = 1,
  perPage: number = 10
): Promise<CombinedReviewData | null> {
  if (!JUDGEME_API_TOKEN || !SHOPIFY_DOMAIN) {
    console.error('Judge.me API token or Shopify domain not configured');
    return null;
  }

  try {
    // Get product info (with caching)
    const productInfo = await getProductByHandle(productHandle);
    if (!productInfo?.product?.id) {
      console.error(`Product not found for handle: ${productHandle}`);
      return null;
    }

    const productId = productInfo.product.id;
    
    // Fetch reviews for this specific product
    const url = new URL('https://judge.me/api/v1/reviews');
    url.searchParams.append('api_token', JUDGEME_API_TOKEN);
    url.searchParams.append('shop_domain', SHOPIFY_DOMAIN);
    url.searchParams.append('product_id', productId.toString());
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', perPage.toString());

    console.log(`Fetching combined data for product ID: ${productId} (handle: ${productHandle}), page: ${page}`);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Judge.me API error: ${response.status} - ${errorText}`);
      throw new Error(`Judge.me API error: ${response.status}`);
    }

    const reviewsData = await response.json();
    
    // Combine the data
    const combinedData: CombinedReviewData = {
      reviews: reviewsData.reviews || [],
      current_page: reviewsData.current_page || page,
      per_page: reviewsData.per_page || perPage,
      total: reviewsData.total || 0,
      product_info: productInfo.product
    };

    console.log(`Found ${combinedData.reviews.length} reviews for product ${productHandle}`);
    return combinedData;
  } catch (error) {
    console.error('Error fetching combined Judge.me data:', error);
    return null;
  }
}

/**
 * Fetch reviews for a specific product from Judge.me API
 * DEPRECATED: Use getCombinedProductData instead for better performance
 */
export async function getProductReviews(
  productHandle: string,
  page: number = 1,
  perPage: number = 10
): Promise<JudgeMeReviewsResponse | null> {
  const combinedData = await getCombinedProductData(productHandle, page, perPage);
  if (!combinedData) return null;
  
  return {
    reviews: combinedData.reviews,
    current_page: combinedData.current_page,
    per_page: combinedData.per_page,
    total: combinedData.total
  };
}

/**
 * Get product ratings info for a specific product
 * DEPRECATED: Use getCombinedProductData instead for better performance
 */
export async function getProductReviewInfo(
  productHandle: string
): Promise<JudgeMeProductInfo | null> {
  const productInfo = await getProductByHandle(productHandle);
  return productInfo;
}

/**
 * Create a new review for a specific product
 */
export async function createReview(reviewData: CreateReviewData): Promise<{ success: boolean; message: string; data?: any }> {
  if (!JUDGEME_API_TOKEN || !SHOPIFY_DOMAIN) {
    return { success: false, message: 'Judge.me not configured' };
  }

  try {
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
      product_id: reviewData.product_id,
      external_id: reviewData.product_id,
      id: 10134829695303
    };

    console.log('Creating review with payload:', { 
      ...payload, 
      api_token: '[HIDDEN]',
      email: '[HIDDEN]'
    });

    const response = await fetch('https://judge.me/api/v1/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Judge.me API error response:', responseData);
      return { 
        success: false, 
        message: responseData.message || `API error: ${response.status}`,
        data: responseData
      };
    }

    // Clear cache for this product since new review was added
    productCache.delete(reviewData.product_handle);

    console.log('Review created successfully for product:', reviewData.product_handle);
    return { 
      success: true, 
      message: 'Review submitted successfully!',
      data: responseData
    };
  } catch (error) {
    console.error('Error creating review:', error);
    return { success: false, message: 'Failed to submit review. Please try again.' };
  }
}
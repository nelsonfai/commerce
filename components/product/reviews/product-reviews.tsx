// components/product/product-reviews.tsx 
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { JudgeMeReview } from 'lib/judgeme';

interface ProductReviewsProps {
  productId: string;
  productHandle: string;
  productTitle: string;
}

// Star Rating Component (internal)
function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  showRating = false,
  interactive = false,
  onRatingChange
}: {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showRating?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const currentRating = interactive ? (hoverRating || rating) : rating;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(maxRating)].map((_, index) => {
          const isFilled = index < Math.floor(currentRating);
          const isHalf = index === Math.floor(currentRating) && currentRating % 1 !== 0;
          
          return (
            <div 
              key={index} 
              className={`relative ${interactive ? 'cursor-pointer' : ''}`}
              onClick={() => interactive && onRatingChange?.(index + 1)}
              onMouseEnter={() => interactive && setHoverRating(index + 1)}
              onMouseLeave={() => interactive && setHoverRating(0)}
            >
              <svg
                className={`${sizeClasses[size]} text-gray-300`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {(isFilled || isHalf) && (
                <svg
                  className={`${sizeClasses[size]} absolute top-0 left-0 text-yellow-400`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  style={{
                    clipPath: isHalf ? 'inset(0 50% 0 0)' : 'none'
                  }}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
      {showRating && (
        <span className="ml-1 text-sm text-gray-600">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
}

// Rating Breakdown Component
function RatingBreakdown({ reviews, totalReviews, averageRating }: { 
  reviews: JudgeMeReview[], 
  totalReviews: number,
  averageRating: number 
}) {
  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        counts[Math.round(review.rating) as keyof typeof counts]++;
      }
    });
    return counts;
  }, [reviews]);

  const getPercentage = (count: number) => {
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">Product Rating</h3>
      
      <div className="flex items-start gap-8">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <StarRating rating={averageRating} size="md" />
          <div className="text-sm text-gray-600 mt-2">
            {totalReviews} Review{totalReviews !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="flex-1 max-w-md">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium w-2">{rating}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getPercentage(ratingCounts[rating as keyof typeof ratingCounts])}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-10 text-right">
                {getPercentage(ratingCounts[rating as keyof typeof ratingCounts])}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// User Avatar Component
function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0`}>
      {initials}
    </div>
  );
}

// Review Card Component (internal)
function ReviewCard({ review }: { review: JudgeMeReview }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30);
    
    if (diffInMonths > 0) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    } else if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return 'Today';
    }
  };

  return (
    <div className="py-6 border-b border-gray-200 last:border-b-0">
      <div className="flex items-start gap-4">
        <UserAvatar name={review.reviewer.name} />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">{review.reviewer.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <time className="text-sm text-gray-500">
                  {formatDate(review.created_at)}
                </time>
                {review.verified === 'verified_buyer' && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Verified Buyer
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <StarRating rating={review.rating} size="sm" />
          </div>

          {review.title && (
            <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
          )}

          <p className="text-gray-700 mb-3 leading-relaxed">{review.body}</p>

          {review.pictures && review.pictures.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-3">
              {review.pictures.map((picture, index) => (
                <img
                  key={index}
                  src={picture.urls.compact}
                  alt={`Review image ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => window.open(picture.urls.original, '_blank')}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function ProductReviews({ 
  productId, 
  productHandle, 
  productTitle 
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<JudgeMeReview[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    rating: 0,
    name: '',
    email: ''
  });

  // Load initial reviews with optimized single API call
  useEffect(() => {
    const controller = new AbortController();
    loadReviews(1, false, controller.signal);
    
    return () => controller.abort();
  }, [productHandle]);

  const loadReviews = async (page = 1, append = false, signal?: AbortSignal) => {
    if (page === 1) setLoading(true);
    setError('');
    
    try {
      // Use optimized API call that includes product info on first load
      const includeProductInfo = page === 1;
      const url = `/api/reviews/${productHandle}?page=${page}&include_product_info=${includeProductInfo}`;
      
      console.log(`Loading reviews - Page: ${page}, Include Info: ${includeProductInfo}`);
      
      const response = await fetch(url, { signal });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews');
      }

      if (signal?.aborted) return;

      // Handle combined data or reviews-only data
      if (data.product_info) {
        // This is the combined response with product info
        setReviews(data.reviews || []);
        setCurrentPage(data.current_page || 1);
        setHasMore((data.current_page || 1) * (data.per_page || 10) < (data.total || 0));
        setTotalReviews(data.total || 0);
        setAverageRating(data.product_info.average_rating || 0);
        
        console.log(`Loaded combined data - ${data.reviews?.length || 0} reviews, avg rating: ${data.product_info.average_rating}`);
      } else {
        // This is reviews-only response (for pagination)
        if (append) {
          setReviews(prev => [...prev, ...data.reviews]);
        } else {
          setReviews(data.reviews || []);
        }
        setCurrentPage(data.current_page || 1);
        setHasMore((data.current_page || 1) * (data.per_page || 10) < (data.total || 0));
        setTotalReviews(data.total || 0);
        
        console.log(`Loaded reviews page ${page} - ${data.reviews?.length || 0} reviews`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error('Error loading reviews:', error);
      setError(error instanceof Error ? error.message : 'Failed to load reviews');
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  const loadMoreReviews = () => {
    loadReviews(currentPage + 1, true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) {
      setSubmitMessage('Please select a rating');
      return;
    }

    setSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          product_handle: productHandle,
          product_id: productId
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitMessage('Thank you! Your review has been submitted and will appear after moderation.');
        setFormData({ title: '', body: '', rating: 0, name: '', email: '' });
        setShowWriteForm(false);
        // Reload reviews after successful submission
        setTimeout(() => loadReviews(), 2000);
      } else {
        setSubmitMessage(result.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Submit review error:', error);
      setSubmitMessage('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', body: '', rating: 0, name: '', email: '' });
    setShowWriteForm(false);
    setSubmitMessage('');
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="mt-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg p-6 mb-8">
            <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="h-12 w-12 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="flex-1 max-w-md space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-4 bg-gray-300 rounded"></div>
                    <div className="flex-1 h-2 bg-gray-300 rounded"></div>
                    <div className="w-10 h-4 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 pb-6">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading reviews: {error}</p>
          <button 
            onClick={() => loadReviews()}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Rating Breakdown */}
      <RatingBreakdown 
        reviews={reviews} 
        totalReviews={totalReviews} 
        averageRating={averageRating} 
      />

      {/* Customer Reviews Section */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Customer Reviews</h3>
        <button
          onClick={() => setShowWriteForm(true)}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          Write a Review
        </button>
      </div>

      {/* Submit Message */}
      {submitMessage && (
        <div className={`mb-6 p-4 rounded-md ${
          submitMessage.includes('Thank you') || submitMessage.includes('success')
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {submitMessage}
        </div>
      )}

      {/* Write Review Form */}
      {showWriteForm && (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium">Write a Review for {productTitle}</h4>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <StarRating
                rating={formData.rating}
                interactive
                onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Give your review a title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review *
              </label>
              <textarea
                required
                rows={4}
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Share your thoughts about this product..."
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 && !showWriteForm ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this product!</p>
          <button
            onClick={() => setShowWriteForm(true)}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Write First Review
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={loadMoreReviews}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Load More Reviews'}
          </button>
        </div>
      )}
    </div>
  );
}
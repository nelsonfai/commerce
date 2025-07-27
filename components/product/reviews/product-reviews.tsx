// components/product/product-reviews.tsx - With Auth Integration
'use client';

import React, { useState, useEffect } from 'react';
import { JudgeMeReview } from 'lib/judgeme';
import { useAuthContext } from 'contexts/AuthContext';

interface ProductReviewsProps {
  productId: string;
  productHandle: string;
  productTitle: string;
}

// Simple Star Rating Component
function StarRating({ rating, size = 'md', interactive = false, onRatingChange }: {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  const current = interactive ? (hover || rating) : rating;

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClasses[size]} ${star <= current ? 'text-primary' : 'text-slate-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          onClick={() => interactive && onRatingChange?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// Simple Review Card
function ReviewCard({ review }: { review: JudgeMeReview }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
    return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
  };

  const initials = review.reviewer.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="py-6 border-b border-slate-100 last:border-b-0">
      <div className="flex gap-2">
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 shadow-sm">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className=" items-center gap-3 mb-2 pt-1">
            <h4 className="font-medium text-secondary">{review.reviewer.name}</h4>
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            <time className="text-sm text-slate-500">{formatDate(review.created_at)}</time>
          </div>

        </div>

      </div>
      <div className='pl-2'>
        <div className="mb-3">
          <StarRating rating={review.rating} size="sm" />
        </div>
        {review.title && (
          <h5 className="font-medium text-secondary mb-3">{review.title}</h5>
        )}
        <p className="text-slate-600 leading-relaxed">{review.body}</p>
      </div>
    </div>
  );
}

export default function ProductReviews({ productHandle, productTitle, productId }: ProductReviewsProps) {
  const { isAuthenticated, customer } = useAuthContext();
  const [reviews, setReviews] = useState<JudgeMeReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Form state - initialize with user data if authenticated
  const [form, setForm] = useState({
    rating: 0,
    name: isAuthenticated && customer?.firstName ? `${customer.firstName} ${customer.lastName || ''}`.trim() : '',
    email: isAuthenticated && customer?.email ? customer.email : '',
    title: '',
    body: ''
  });

  // Update form when auth state changes
  useEffect(() => {
    if (isAuthenticated && customer) {
      setForm(prev => ({
        ...prev,
        name: customer.firstName ? `${customer.firstName} ${customer.lastName || ''}`.trim() : prev.name,
        email: customer.email || prev.email
      }));
    }
  }, [isAuthenticated, customer]);

  // Load reviews - single useEffect, single purpose
  useEffect(() => {
    loadReviews();
  }, [productHandle]);

  const loadReviews = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);

      const response = await fetch(`/api/reviews?handle=${productHandle}&page=${pageNum}`);
      const data = await response.json();

      if (response.ok) {
        setReviews(prev => append ? [...prev, ...data.reviews] : data.reviews);
        setPage(data.current_page);
        setHasMore(data.current_page * data.per_page < data.total);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) {
      setMessage('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, product_handle: productHandle, product_id: productId })
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Review submitted successfully!');
        // Reset form but keep user info if authenticated
        setForm({
          rating: 0,
          name: isAuthenticated && customer?.firstName ? `${customer.firstName} ${customer.lastName || ''}`.trim() : '',
          email: isAuthenticated && customer?.email ? customer.email : '',
          title: '',
          body: ''
        });
        setShowForm(false);

        const newReview: JudgeMeReview = {
          id: Date.now(),
          rating: form.rating,
          name: form.name,
          email: form.email,
          reviewer: {
            name: form.name,
          },
          title: form.title,
          body: form.body,
          created_at: new Date().toISOString(),
          verified: 'verified_buyer',
          updated_at: ''
        }
        setReviews(prev => [newReview, ...prev]);

      } else {
        setMessage(result.message || 'Failed to submit review');
      }
    } catch {
      setMessage('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      rating: 0,
      name: isAuthenticated && customer?.firstName ? `${customer.firstName} ${customer.lastName || ''}`.trim() : '',
      email: isAuthenticated && customer?.email ? customer.email : '',
      title: '',
      body: ''
    });
    setShowForm(false);
    setMessage('');
  };

  if (loading) {
    return (
      <div className="mt-12 px-4">
        <div className="max-w-7xl  space-y-6">
          <div className="h-8 bg-slate-200 rounded-lg w-64 animate-pulse"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 py-6">
              <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 px-4">
      <div className="max-w-7xl ">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-light text-secondary">Customer Reviews</h3>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-secondary transition-all duration-200 active:scale-95"
          >
            Write Review
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${message.includes('successfully')
              ? 'bg-green-50 border-green-400 text-green-700'
              : 'bg-red-50 border-red-400 text-red-700'
            }`}>
            {message}
          </div>
        )}

        {/* Review Form */}
        {showForm && (
          <div className="mb-8 p-6 bg-slate-50 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-light text-secondary">Write Review for {productTitle}</h4>
              <button
                onClick={resetForm}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={submitReview} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Rating *</label>
                <StarRating
                  rating={form.rating}
                  size="lg"
                  interactive
                  onRatingChange={(rating) => setForm(prev => ({ ...prev, rating }))}
                />
              </div>

              {/* Only show name/email fields if user is not authenticated or info is missing */}
              {(!isAuthenticated || !customer?.displayName || !customer?.email) && (
                <div className="grid md:grid-cols-2 gap-4">
                  {(!isAuthenticated || !customer?.displayName) && (
                    <div className="space-y-1">
                      <input
                        type="text"
                        placeholder="Your name"
                        required
                        value={form.name}
                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-0 py-3 text-secondary bg-transparent border-0 border-b-2 border-slate-200 focus:border-primary focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-400"
                      />
                    </div>
                  )}
                  {(!isAuthenticated || !customer?.email) && (
                    <div className="space-y-1">
                      <input
                        type="email"
                        placeholder="your@email.com"
                        required
                        value={form.email}
                        onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-0 py-3 text-secondary bg-transparent border-0 border-b-2 border-slate-200 focus:border-primary focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-400"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Review title (optional)"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-0 py-3 text-secondary bg-transparent border-0 border-b-2 border-slate-200 focus:border-primary focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1">
                <textarea
                  placeholder="Share your experience with this product"
                  required
                  rows={4}
                  value={form.body}
                  onChange={(e) => setForm(prev => ({ ...prev, body: e.target.value }))}
                  className="w-full px-0 py-3 text-secondary bg-transparent border-0 border-b-2 border-slate-200 focus:border-primary focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-400 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Review'
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 text-slate-600 hover:text-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7" />
              </svg>
            </div>
            <h4 className="text-xl font-light text-secondary mb-2">No reviews yet</h4>
            <p className="text-slate-500 mb-6">Be the first to share your experience!</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-secondary transition-all duration-200 active:scale-95"
            >
              Write First Review
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl">
            <div className="">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => loadReviews(page + 1, true)}
              disabled={loading}
              className="px-6 py-3 text-slate-600 hover:text-secondary border border-slate-200 rounded-full hover:border-slate-300 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? 'Loading...' : 'Load More Reviews'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
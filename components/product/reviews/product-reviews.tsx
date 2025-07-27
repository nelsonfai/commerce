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
          className={`${sizeClasses[size]} ${
            star <= current ? 'text-yellow-400' : 'text-gray-300'
          } ${interactive ? 'cursor-pointer' : ''}`}
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
    <div className="py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
          {initials}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className=" items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{review.reviewer.name}</h4>
            <time className="text-sm text-gray-500 ">{formatDate(review.created_at)}</time>
          </div>
          
          <div className="mb-3">
            <StarRating rating={review.rating} size="sm" />
          </div>
          
          {review.title && (
            <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
          )}
          
          <p className="text-gray-700 leading-relaxed text-capitalize">{review.body}</p>
          
          {review.pictures && review.pictures.length > 0 && (
            <div className="flex gap-2 mt-3">
              {review.pictures.map((picture, index) => (
                <img
                  key={index}
                  src={picture.urls.compact}
                  alt={`Review image ${index + 1}`}
                  className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80"
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
      
      const response = await fetch(`/api/reviews?handle=${productHandle}?page=${pageNum}`);
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
        body: JSON.stringify({ ...form, product_handle: productHandle,product_id:productId })
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
        //loadReviews(); // Reload reviews

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
  };

  if (loading) {
    return (
      <div className="mt-8 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Customer Reviews</h3>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-secondary text-white rounded hover:bg-gray-800"
        >
          Write Review
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded ${
          message.includes('successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message}
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Write Review for {productTitle}</h4>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          
      
          
          <form onSubmit={submitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating *</label>
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
                  <input
                    type="text"
                    placeholder="Name *"
                    required
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                )}
                {(!isAuthenticated || !customer?.email) && (
                  <input
                    type="email"
                    placeholder="Email *"
                    required
                    value={form.email}
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                )}
              </div>
            )}
            
            <input
              type="text"
              placeholder="Review Title (optional)"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            
            <textarea
              placeholder="Write your review *"
              required
              rows={4}
              value={form.body}
              onChange={(e) => setForm(prev => ({ ...prev, body: e.target.value }))}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-secondary text-white rounded hover:bg-gray-800 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded">
          <p className="text-gray-600 mb-4">No reviews yet. Be the first!</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-secondary text-white rounded hover:bg-gray-800"
          >
            Write First Review
          </button>
        </div>
      ) : (
        <div className="border rounded-lg p-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={() => loadReviews(page + 1, true)}
            disabled={loading}
            className="px-6 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
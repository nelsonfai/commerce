'use client';
import React, { ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Snack } from 'types/snack';
import { Product } from 'lib/shopify/types';
import { AddToCart } from 'components/cart/add-to-cart';
import { StarRating, CountryOrigin } from './product-info-components';
import Price from 'components/price';

interface SnackModalProps {
  product?: Product; // Add product prop for Shopify products
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  showQuantityControls?: boolean;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  selectedQuantity?: number;
}

const SnackModal: React.FC<SnackModalProps> = ({ 
  product,
  isOpen, 
  onClose, 
  children,
  showQuantityControls = false,
  onUpdateQuantity,
  selectedQuantity = 0
}) => {
  if (!isOpen || !product) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(product.id, newQuantity);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 bg-white rounded-t-2xl border-b border-slate-200 p-6 pb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-bold text-slate-800 leading-tight">
                {product.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors flex-shrink-0"
            >
              <XMarkIcon className="w-6 h-6 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-6">
          {/* Image */}
          <div className="relative">
            <img
              src={product?.featuredImage.url}
              alt={product.title}
              className="w-full aspect-[4/3] object-cover rounded-xl bg-slate-100"
              loading="lazy"
            />
          </div>

          {/* Country and Rating */}
          <div className="space-y-3">
            <CountryOrigin metafields={product?.metafields ?? []} />
            <StarRating metafields={product?.metafields ?? []} />
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
              Description
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="pb-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
               
                {product.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer with Price and Actions */}
        <div className="flex-shrink-0 bg-white rounded-b-2xl border-t border-slate-200 p-6 pt-4">
          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                Price
              </h3>
              {product && (
                <Price 
                  amount={product.priceRange.maxVariantPrice.amount}
                  currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                  className="text-2xl font-bold text-slate-900" 
                />
              ) }
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {showQuantityControls && selectedQuantity > 0 ? (
              <div className="flex items-center justify-center space-x-4 p-4 bg-slate-50 rounded-xl">
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-700 font-medium hover:bg-slate-100 transition-colors border border-slate-200 shadow-sm"
                  onClick={() => handleUpdateQuantity(selectedQuantity - 1)}
                >
                  −
                </button>
                <span className="text-slate-800 font-semibold text-lg min-w-[3rem] text-center">
                  {selectedQuantity}
                </span>
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-medium hover:bg-secondary transition-colors shadow-sm"
                  onClick={() => handleUpdateQuantity(selectedQuantity + 1)}
                >
                  +
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {product && (
                  <AddToCart 
                    product={product} 
                    className="w-full bg-primary hover:bg-secondary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-sm active:scale-[0.98]"

                  />
                )}
                
                {/* Custom children actions */}
                {children && (
                  <div className="flex items-center justify-center space-x-3">
                    {children}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnackModal;
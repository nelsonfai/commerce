'use client';
import React, { useState, useMemo } from 'react';
import SnackModal from './snack-modal';
import { SelectedItem, Snack } from 'types/snack';
import Link from 'next/link';
import { AddToCart } from 'components/cart/add-to-cart';
import { useRouter } from 'next/navigation';
import { Product } from 'lib/shopify/types';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { StarRating, CountryOrigin } from './product-info-components';
import Price from 'components/price';
import clsx from 'clsx';

interface ProductCardProps {
  // Accept either a Snack or Shopify Product
  product: Product;
  showQuantityControls?: boolean;
  selectedItems?: SelectedItem[];
  onAddToBox?: (product: Product) => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  className?: string;
  cardStyle?: 'default' | 'featured';
  allowClick?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product,
  showQuantityControls = false, 
  selectedItems = [], 
  onAddToBox, 
  onUpdateQuantity,
  className = "",
  cardStyle = "default",
  allowClick = true
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  
  const selectedItem = selectedItems.find(item => item.id === product.id);
  const quantity = selectedItem?.quantity || 0;

  const handleAddToBox = () => {
    if (onAddToBox) {
      onAddToBox(product);
    }
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(product.id, newQuantity);
    }
  };

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };
  
  const closeModal = () => setIsModalOpen(false);
  
  const openProductPage = () => router.push(`/product/${product.handle}`);

  const handleCardClick = () => {
    if (allowClick) {
      openProductPage();
    }
  };

  const handleImageClick = () => {
    if (!allowClick) {
      openModal;
    } else {
      openProductPage();
    }
  };

  // Stop propagation for interactive elements
  const handleInteractiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Featured card style (for home page)
  if (cardStyle === "featured") {
    return (
      <>
        <div 
          className={clsx(
            "flex flex-col h-full transform transition-all duration-300 group cursor-pointer",
            className
          )}
          onClick={handleCardClick}
        >
          <div className="relative rounded-lg overflow-hidden bg-[#f9f7f2]">
            <img
              src={product.featuredImage.url}
              alt={product.title}
              className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 text-center cursor-pointer">
              <p className="text-white text-sm font-light leading-relaxed">{product.description}</p>
            </div>
          </div>
          
          {/* Content with consistent height */}
          <div className="flex-1 flex flex-col justify-between mt-4 ">
            <div className="space-y-2">
              <h3 className="font-medium text-slate-800 text-sm sm:text-base line-clamp-2 leading-tight min-h-[2.5rem]">
                {product.title}
              </h3>
              
              {/* Country and Rating with consistent height */}
              <div className="flex flex-col min-h-[3rem]">
                <CountryOrigin metafields={product?.metafields ?? []} />
                <StarRating metafields={product?.metafields ?? []}  />
              </div>
            </div>
            
            {/* Price at bottom */}
            <div className="pt-2">
              { product && (
                <Price 
                  amount={product.priceRange.maxVariantPrice.amount}
                  currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                  className="text-lg font-bold text-slate-900" 
                />
              ) }
            </div>
          </div>
        </div>

        <SnackModal 
          product={product as Product}
          isOpen={isModalOpen} 
          onClose={closeModal}
          showQuantityControls={showQuantityControls}
          onUpdateQuantity={onUpdateQuantity}
          selectedQuantity={quantity}
        >
          {showQuantityControls && !selectedItem && (
            <button
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-secondary transition-all duration-200 shadow-sm active:scale-[0.98]"
              onClick={handleAddToBox}
            >
              Add to Box
            </button>
          )}
        </SnackModal>
      </>
    );
  }

  return (
    <>
      <div 
        className={clsx(
          "h-full bg-gradient-to-br from-white to-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col cursor-pointer",
          className
        )}
        onClick={handleCardClick}
      >
        {/* Image Section */}
        <div className="relative">
          <div
            className="aspect-[4/3] bg-cover bg-center transition-transform duration-300 hover:scale-105"
            style={{ backgroundImage: `url("${product?.featuredImage.url}")` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section - Flexible height */}
        <div className="flex-1 flex flex-col p-4 space-y-4">
          {/* Title and Country Section */}
          <div className="space-y-3">
            {/* Title with consistent height */}
            <div className="min-h-[3.5rem] flex items-start">
              <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 leading-tight">
                {product.title}
              </h3>
            </div>
            
            {/* Country and Rating with consistent height */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0 min-h-[2.5rem]">
              <div className="flex flex-col space-y-1">
                <CountryOrigin metafields={product?.metafields ?? []} />
                <StarRating metafields={product?.metafields ?? []} />
              </div>
            </div>
          </div>

          {/* Description with consistent height */}
          <div className="min-h-[2.5rem] flex items-start">
            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Tags Section with consistent height */}
          <div className="min-h-[2rem] flex items-start">
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
              <div className="flex items-center space-x-2 flex-nowrap">
                {product.tags && product.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium whitespace-nowrap border border-slate-200">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Price and Actions Section - Always at bottom */}
          <div className="mt-auto pt-4 space-y-4">
            {/* Price */}
            <div className="flex justify-between items-center">
              {product && (
                <Price 
                  amount={product.priceRange.maxVariantPrice.amount}
                  currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                  className="text-xl font-bold text-slate-900" 
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between space-x-3" onClick={handleInteractiveClick}>
              {showQuantityControls && selectedItem ? (
                <div className="flex items-center space-x-3 flex-1 justify-center">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors border border-slate-200"
                    onClick={() => handleUpdateQuantity(quantity - 1)}
                  >
                    −
                  </button>
                  <span className="text-slate-800 font-medium min-w-[2rem] text-center">{quantity}</span>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white font-medium hover:bg-secondary transition-colors shadow-sm"
                    onClick={() => handleUpdateQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 w-full">
                  <div className="flex-1">
                    <AddToCart product={product as Product} compact={true} />
                  </div>
                  <button
                    className="p-2 bg-slate-100 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200 flex items-center justify-center"
                    onClick={openModal}
                  >
                    <InformationCircleIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SnackModal 
        product={product as Product}
        isOpen={isModalOpen} 
        onClose={closeModal}
        showQuantityControls={showQuantityControls}
        onUpdateQuantity={onUpdateQuantity}
        selectedQuantity={quantity}
      >
        {showQuantityControls && !selectedItem && (
          <button
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-secondary transition-all duration-200 shadow-sm active:scale-[0.98]"
            onClick={handleAddToBox}
          >
            Add to Box
          </button>
        )}
      </SnackModal>
    </>
  );
};

export default ProductCard;
'use client';
import React, { useState, useMemo } from 'react';
import SnackModal from './snack-modal';
import { SelectedItem, Snack } from 'types/snack';
import Link from 'next/link';
import { AddToCart } from 'components/cart/add-to-cart';
import { useRouter } from 'next/navigation';
import { Product } from 'lib/shopify/types';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  featuredImage: {
    url: string;
  };
  priceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  tags?: string[];
}

interface ProductCardProps {
  // Accept either a Snack or Shopify Product
  snack?: Snack;
  product?: ShopifyProduct;
  showQuantityControls?: boolean;
  selectedItems?: SelectedItem[];
  onAddToBox?: (snack: Snack) => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  className?: string;
  cardStyle?: 'default' | 'featured';
  allowClick?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  snack,
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
  
  // Transform Shopify product to Snack format
  const transformedSnack: Snack = useMemo(() => {
    if (snack) {
      return snack; // Already in correct format
    }
    
    if (product) {
      return {
        id: product.id,
        name: product.title,
        image: product.featuredImage.url,
        description: product.description || '',
        price: {
          amount: product.priceRange.maxVariantPrice.amount,
          currency: product.priceRange.maxVariantPrice.currencyCode
        },
        country: product.tags?.find(tag => tag.includes('country:'))?.replace('country:', '') || 'Unknown',
        flag: product.tags?.find(tag => tag.includes('flag:'))?.replace('flag:', '') || '🌍',
        tags: product.tags?.filter(tag => !tag.includes('country:') && !tag.includes('flag:')) || [],
        handle: product.handle,
        category: product.tags?.find(tag => tag.includes('category:'))?.replace('category:', '') || undefined
      };
    }
    
    throw new Error('ProductCard: Either snack or product prop must be provided');
  }, [snack, product]);
  
  const selectedItem = selectedItems.find(item => item.id === transformedSnack.id);
  const quantity = selectedItem?.quantity || 0;

  const handleAddToBox = () => {
    if (onAddToBox) {
      onAddToBox(transformedSnack);
    }
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(transformedSnack.id, newQuantity);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openProductPage = () => router.push(`/product/${transformedSnack.handle}`);

  const handleImageClick = () => {
    if (!allowClick) {
      openModal();
    } else {
      openProductPage();
    }
  };

  // Featured card style (for home page)
  if (cardStyle === "featured") {
    return (
      <>
        <div className={`flex flex-col transform transition-all duration-300 group cursor-pointer ${className}`}>
          <div className="relative rounded-lg overflow-hidden border border-gray-100 bg-bgLight">
            <img
              src={transformedSnack.image}
              alt={transformedSnack.name}
              className="aspect-square w-full object-cover"
              loading="lazy"
            />
            <div 
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2 sm:p-4 text-center cursor-pointer"
            >
              <p className="text-white text-xs sm:text-sm">{transformedSnack.description}</p>
            </div>
          </div>
          <div className="mt-2">
            <p className="font-medium text-primary text-sm sm:text-base line-clamp-2">{transformedSnack.name}</p>
            {/* Ultra-small: Stack country info */}
            <div className="xs:flex xs:items-center">
              <p className="text-xs sm:text-sm text-textDark xs:flex xs:items-center">
                <span className="xs:mr-1">{transformedSnack.flag}</span> 
                <span className="xs:inline block">{transformedSnack.country}</span>
              </p>
            </div>
            {transformedSnack.price && (
              <p className="text-xs font-bold mt-1 text-secondary">
                {typeof transformedSnack.price === 'object' ? transformedSnack.price.currency : '$'} {typeof transformedSnack.price === 'object' 
                  ? parseFloat(transformedSnack.price.amount.toString()).toFixed(2)
                  : transformedSnack.price.toFixed(2)
                }
              </p>
            )}
          </div>
        </div>

        <SnackModal 
          snack={transformedSnack} 
          isOpen={isModalOpen} 
          onClose={closeModal}
        >
          {showQuantityControls && selectedItem ? (
            <div className="flex items-center space-x-2">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f9f7f2] text-[#181611] font-bold hover:bg-gray-200 transition-colors"
                onClick={() => handleUpdateQuantity(quantity - 1)}
              >
                -
              </button>
              <span className="text-[#181611] font-medium">{quantity}</span>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f4b625] text-[#181611] font-bold hover:bg-[#e4a615] transition-colors"
                onClick={() => handleUpdateQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          ) : (
            showQuantityControls && (
              <Link
                href={`/product/${transformedSnack.handle}`}
                prefetch={true}
                className="px-4 py-2 bg-[#f4b625] rounded-lg text-[#181611] font-bold hover:bg-[#e4a615] transition-colors"
              >
                View Product
              </Link>
            )
          )}
        </SnackModal>
      </>
    );
  }

  return (
    <>
      <div className={`bg-white rounded-xl overflow-hidden border border-[#e6e3db] shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}>
        <div
          className="aspect-[4/3] bg-cover bg-center cursor-pointer"
          style={{ backgroundImage: `url("${transformedSnack.image}")` }}
          onClick={handleImageClick}
        />
        <div className="p-3 xs:p-4">
          {/* Title and Country - Responsive Layout */}
          <div className="mb-2">
            {/* Ultra-small: Title on its own line */}
            <h3 className="text-base xs:text-lg font-bold text-[#181611] line-clamp-2 xs:flex-1 xs:mr-2 h-12 xs:h-14 leading-6 xs:leading-7 mb-1 xs:mb-0">
              {transformedSnack.name}
            </h3>
            
            {/* Ultra-small: Country info on separate line */}
            <div className="xs:flex xs:justify-between xs:items-start xs:-mt-12">
              <div className="xs:flex-1"></div> {/* Spacer for larger screens */}
              <div className="flex items-center xs:flex-shrink-0">
                <span className="mr-1">{transformedSnack.flag}</span>
                <span className="text-xs xs:text-sm text-[#8a7e60]">{transformedSnack.country}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs xs:text-sm text-[#8a7e60] mb-2 line-clamp-2 h-8 xs:h-10 leading-4 xs:leading-5">
            {transformedSnack.description}
          </p>

          {/* Tags - Responsive scrolling */}
          <div className="flex items-center text-xs xs:text-sm space-x-1 xs:space-x-2 mb-3 overflow-x-auto scrollbar-hide h-6 xs:h-8">
            <div className="flex items-center space-x-1 xs:space-x-2 flex-nowrap">
              {transformedSnack.category && (
                <span className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-[#f9f7f2] rounded-full text-[#8a7e60] whitespace-nowrap flex-shrink-0 text-xs">
                  {transformedSnack.category}
                </span>
              )}
              {transformedSnack.tags && transformedSnack.tags.map(tag => (
                <span key={tag} className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-[#f9f7f2] rounded-full text-[#8a7e60] whitespace-nowrap flex-shrink-0 text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Price and Actions - Ultra-responsive layout */}
          <div className="space-y-2 xs:space-y-0">
            {/* Price - Always on its own line for ultra-small */}
            <div className="xs:flex xs:justify-between xs:items-center">
              <span className="font-bold text-[#181611] text-sm xs:text-base block xs:inline">
                ${typeof transformedSnack.price === 'object' 
                  ? parseFloat(transformedSnack.price.amount.toString()).toFixed(2)
                  : transformedSnack.price?.toFixed(2) || '0.00'
                }
              </span>

              {/* Actions - Responsive layout */}
              <div className="xs:hidden">
                {/* Ultra-small: Stack vertically */}
                {showQuantityControls && selectedItem ? (
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <button
                      className="w-7 h-7 xs:w-8 xs:h-8 flex items-center justify-center rounded-full bg-[#f9f7f2] text-[#181611] font-bold hover:bg-gray-200 transition-colors text-sm"
                      onClick={() => handleUpdateQuantity(quantity - 1)}
                    >
                      -
                    </button>
                    <span className="text-[#181611] font-medium text-sm">{quantity}</span>
                    <button
                      className="w-7 h-7 xs:w-8 xs:h-8 flex items-center justify-center rounded-full bg-[#f4b625] text-[#181611] font-bold hover:bg-[#e4a615] transition-colors text-sm"
                      onClick={() => handleUpdateQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 mt-2">
                    <AddToCart product={product as Product} compact={true} />
                    <button
                      className="w-full p-2 bg-[#f5f5f5] rounded-lg text-[#181611] font-bold hover:bg-gray-200 transition-colors text-sm w-7 h-7 xs:w-8 xs:h-8 flex items-center justify-center"
                      onClick={openModal}
                    >
                      <InformationCircleIcon className="w-4 h-4 inline-block " />
                    </button>
                  </div>
                )}
              </div>

              {/* Normal size and up: Horizontal layout */}
              <div className="hidden xs:flex xs:items-center">
                {showQuantityControls && selectedItem ? (
                  <div className="flex items-center space-x-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f9f7f2] text-[#181611] font-bold hover:bg-gray-200 transition-colors"
                      onClick={() => handleUpdateQuantity(quantity - 1)}
                    >
                      -
                    </button>
                    <span className="text-[#181611] font-medium">{quantity}</span>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f4b625] text-[#181611] font-bold hover:bg-[#e4a615] transition-colors"
                      onClick={() => handleUpdateQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <AddToCart product={product as Product} compact={true} />
                    <button
                      className="px-2 py-2 bg-[#f5f5f5] rounded-lg text-[#181611] font-bold hover:bg-gray-200 transition-colors ml-2"
                      onClick={openModal}
                    >
                      Info
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SnackModal 
        snack={transformedSnack} 
        isOpen={isModalOpen} 
        onClose={closeModal}
      >
        {showQuantityControls && selectedItem ? (
          <div className="flex items-center space-x-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f9f7f2] text-[#181611] font-bold hover:bg-[#e4a615] transition-colors"
              onClick={() => handleUpdateQuantity(quantity - 1)}
            >
              -
            </button>
            <span className="text-[#181611] font-medium">{quantity}</span>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f4b625] text-[#181611] font-bold hover:bg-[#e4a615] transition-colors"
              onClick={() => handleUpdateQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        ) : (
          <button
            className="px-4 py-2 bg-[#f4b625] rounded-lg text-[#181611] font-bold hover:bg-[#e4a615] transition-colors"
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
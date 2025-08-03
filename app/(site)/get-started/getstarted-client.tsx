'use client';
import React, { useState } from 'react';
import {
  GiftIcon,
  UserIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import ProductCard from 'components/product/product-card';
import {addItem}from 'components/cart/actions';
import { Product } from 'lib/shopify/types';

// Types
interface ProductVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface SubscriptionBox extends Product {
  variants: ProductVariant[];
  tags: string[];
}

interface Props {
  subscriptionBoxes: SubscriptionBox[];
  featuredProducts: Product[];
}

interface DurationOption {
  months: number;
  label: string;
  discount: number;
  popular: boolean;
  description: string;
  variant: ProductVariant;
  basePrice: number;
  savings: number;
  currencyCode: string;
}

interface BoxSize {
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  tag: string;
  title: string;
  description: string;
}

export default function SubscriptionBoxClient({ subscriptionBoxes, featuredProducts }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGift, setIsGift] = useState<boolean | null>(null);
  const [selectedBoxSize, setSelectedBoxSize] = useState<BoxSize | null>(null);
  const [selectedBaseProduct, setSelectedBaseProduct] = useState<SubscriptionBox | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<DurationOption | null>(null);

  // Box size configurations
  const boxSizes: BoxSize[] = [
    {
      size: 'SMALL',
      tag: 'box-S',
      title: 'Small Box',
      description: 'Perfect for trying new flavors'
    },
    {
      size: 'MEDIUM', 
      tag: 'box-M',
      title: 'Medium Box',
      description: 'Great for regular snacking'
    },
    {
      size: 'LARGE',
      tag: 'box-L', 
      title: 'Large Box',
      description: 'Ideal for sharing or heavy snackers'
    }
  ];

  // Helper function to format currency
  const formatCurrency = (amount: number, currencyCode: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get all base products (d-1 tag) for the "How Big Can you Go?" section
  const getBaseProducts = (): SubscriptionBox[] => {
    return subscriptionBoxes.filter(box => box.tags.includes('d-1'));
  };

  // Get box size from a product's tags
  const getBoxSizeFromProduct = (product: SubscriptionBox): BoxSize | null => {
    for (const boxSize of boxSizes) {
      if (product.tags.includes(boxSize.tag)) {
        return boxSize;
      }
    }
    return null;
  };

  // Get all duration variants for a specific product's box size
  const getDurationVariants = (selectedProduct: SubscriptionBox): SubscriptionBox[] => {
    const boxSize = getBoxSizeFromProduct(selectedProduct);
    if (!boxSize) return [];
    
    return subscriptionBoxes.filter(box => box.tags.includes(boxSize.tag));
  };

  // Create duration options from variants
  const getDurationOptions = (): DurationOption[] => {
    if (!selectedBaseProduct) return [];
    
    const durationVariants = getDurationVariants(selectedBaseProduct);
    
    if (durationVariants.length === 0) {
      return [];
    }

    // Find the base product (d-1) to get base price
    const baseProduct = durationVariants.find(box => box.tags.includes('d-1'));
    if (!baseProduct) {
      console.warn('No base product (d-1) found for selected product');
      return [];
    }

    // Get the first variant from base product (should only have one variant per product)
    const baseVariant = baseProduct.variants[0];
    if (!baseVariant) {
      return [];
    }

    const baseMonthlyPrice = parseFloat(baseVariant.price.amount);
    const currencyCode = baseVariant.price.currencyCode;

    const durationOptions: DurationOption[] = [];

    // Duration mapping
    const durationMap = {
      'd-1': { months: 1, label: '1 Month', popular: false, description: 'Try it out' },
      'd-3': { months: 3, label: '3 Months', popular: true, description: 'Most popular' },
      'd-6': { months: 6, label: '6 Months', popular: false, description: 'Great value' },
      'd-12': { months: 12, label: '12 Months', popular: false, description: 'Best savings' }
    };

    // Process each duration
    Object.entries(durationMap).forEach(([durationTag, config]) => {
      // Find product with this duration tag
      const durationProduct = durationVariants.find(box => box.tags.includes(durationTag));

      if (durationProduct && durationProduct.variants[0]) {
        const variant = durationProduct.variants[0];
        const variantPrice = parseFloat(variant.price.amount);
        const expectedFullPrice = baseMonthlyPrice * config.months;
        const savings = Math.max(0, expectedFullPrice - variantPrice);
        const discount = expectedFullPrice > 0 ? (savings / expectedFullPrice) * 100 : 0;

        durationOptions.push({
          months: config.months,
          label: config.label,
          discount,
          popular: config.popular,
          description: config.description,
          variant,
          basePrice: baseMonthlyPrice,
          savings,
          currencyCode
        });
      }
    });

    return durationOptions.sort((a, b) => a.months - b.months);
  };

  // Calculate pricing
  const calculateTotalPrice = (): number => {
    if (!selectedDuration) return 0;
    return parseFloat(selectedDuration.variant.price.amount);
  };

  const calculateSavings = (): number => {
    if (!selectedDuration) return 0;
    return selectedDuration.savings;
  };

  const getCurrencyCode = (): string => {
    return selectedDuration?.currencyCode || 'USD';
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return isGift !== null;
      case 2: return selectedBaseProduct !== null;
      case 3: return selectedDuration !== null;
      case 4: return true;
      default: return false;
    }
  };

  // Handle final checkout
  const handleFinalCheckout = async () => {
    if (!selectedBaseProduct || !selectedDuration) return;
  
    const boxSize = getBoxSizeFromProduct(selectedBaseProduct);
  
    try {
      // Customer-friendly attributes for Shopify cart display
      const attributes = [
        {
          key: 'Subscription Details',
          value: `${selectedBaseProduct.title} - 1 snack box/month for ${selectedDuration.months} months. Paid Upfront`
        },
        isGift ? {
          key: 'Gift',
          value: '🎁 Gift subscription'
        } : null,
        {
          key: 'You Saved',
          value: `${getCurrencyCode()} ${calculateSavings().toFixed(2)} (${selectedDuration.discount.toFixed(2)}% off)`
        },
        {
          key: '_internal_box_size',
          value: boxSize?.size || 'UNKNOWN'
        },
        {
          key: '_internal_discount_percentage',
          value: selectedDuration.discount.toFixed(2)
        },
        {
          key: '_internal_total_price',
          value: calculateTotalPrice().toString()
        },
        {
          key: '_internal_savings_amount',
          value: calculateSavings().toString()
        },
        {
          key: '_internal_currency_code',
          value: getCurrencyCode()
        },
        {
          key: '_internal_subscription_duration',
          value: selectedDuration.months.toString()
        },
        {
          key: '_internal_base_monthly_price',
          value: selectedDuration.basePrice.toString()
        }
      ].filter(Boolean) as { key: string; value: string; }[];
  
      // Add the item with its attributes
      await addItem(null, selectedDuration.variant.id, attributes);
  
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('There was an error processing your subscription. Please try again.');
    }
  };

  const steps = [
    'For You or Gift?',
    'Choose Your Box',
    'Select Duration',
    'Add-ons'
  ];

  // Handle empty data gracefully
  if (!subscriptionBoxes.length && !featuredProducts.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-light text-secondary mb-2">Loading subscription options...</h2>
          <p className="text-slate-500">Please wait while we prepare your snack safari!</p>
        </div>
      </div>
    );
  }

  const durationOptions = getDurationOptions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Progress Bar */}
      <div className="bg-white/80 backdrop-blur-sm    border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                  index + 1 <= currentStep 
                    ? 'bg-primary text-white ' 
                    : 'border-2 border-gray-100 text-slate-400 bg-white'
                }`}>
                  {index + 1 < currentStep ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium transition-colors ${
                    index + 1 <= currentStep ? 'text-secondary' : 'text-slate-400'
                  }`}>
                    {step}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-16 h-0.5 ml-6 rounded-full transition-colors ${
                    index + 1 < currentStep ? 'bg-primary' : 'bg-gray-100'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Step 1: Gift or Self */}
        {currentStep === 1 && (
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight text-secondary mb-4 tracking-tight">
              Start Your Snack Safari
            </h1>
            <p className="text-lg sm:text-xl text-slate-500 mb-12 sm:mb-16 font-light">
              Who is this Box for?
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-2xl mx-auto">
              <button
                onClick={() => setIsGift(false)}
                className={`group p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  isGift === false 
                    ? 'border-primary bg-primary text-white    ' 
                    : 'border-gray-100 bg-white text-slate-700 hover:border-primary   '
                }`}
              >
                <UserIcon className={`h-16 w-16 mx-auto mb-6 transition-transform group-hover:scale-110 ${
                  isGift === false ? 'text-white' : 'text-primary'
                }`} />
                <h3 className="text-2xl font-medium mb-3">For Myself</h3>
                <p className="text-sm opacity-80 font-light">Start your own African snack journey</p>
              </button>
              
              <button
                onClick={() => setIsGift(true)}
                className={`group p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  isGift === true 
                    ? 'border-primary bg-primary text-white    ' 
                    : 'border-gray-100 bg-white text-slate-700 hover:border-primary   '
                }`}
              >
                <GiftIcon className={`h-16 w-16 mx-auto mb-6 transition-transform group-hover:scale-110 ${
                  isGift === true ? 'text-white' : 'text-primary'
                }`} />
                <h3 className="text-2xl font-medium mb-3">As a Gift</h3>
                <p className="text-sm opacity-80 font-light">Share the taste of Africa with someone special</p>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Box Size */}
        {currentStep === 2 && (
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-light leading-tight text-secondary mb-4 tracking-tight">
              How Big Can you Go?
            </h2>
            <p className="text-lg sm:text-xl text-slate-500 mb-12 sm:mb-16 font-light">
              {isGift ? "Pick the perfect size for your gift recipient" : "Select the box that fits your snacking style"}
            </p>
            
            {(() => {
              const baseProducts = getBaseProducts();
              
              if (baseProducts.length === 0) {
                return (
                  <div className="text-center py-16">
                    <p className="text-slate-500 text-lg mb-2">No subscription boxes available at the moment.</p>
                    <p className="text-slate-400 text-sm">Please check back later or contact support.</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                  {baseProducts.map((product) => {
                    const boxSize = getBoxSizeFromProduct(product);
                    
                    return (
                      <button
                        key={product.id}
                        onClick={() => {
                          setSelectedBaseProduct(product);
                          setSelectedBoxSize(boxSize);
                          setSelectedDuration(null); // Reset duration when box changes
                        }}
                        className={`group p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                          selectedBaseProduct?.id === product.id 
                            ? 'border-primary bg-white     ' 
                            : 'border-gray-100 bg-white hover:border-primary   '
                        }`}
                      >
                        <div className="aspect-square mb-6 rounded-xl overflow-hidden bg-accent">
                          <img
                            src={product.featuredImage?.url || '/placeholder-box.jpg'}
                            alt={product.featuredImage?.altText || product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-box.jpg';
                            }}
                          />
                        </div>
                        <h3 className="text-2xl font-medium mb-3 text-secondary">{product.title}</h3>
                        <p className="text-slate-600 mb-6 text-sm leading-relaxed font-light">{product.description}</p>
                        <p className="text-sm text-slate-500 mb-2">Starting</p>
                        <div className="text-3xl font-light text-primary">
                          {formatCurrency(parseFloat(product.priceRange.minVariantPrice.amount), product.priceRange.minVariantPrice.currencyCode)}
                          <span className="text-sm font-normal text-slate-500 ml-1">/month</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* Step 3: Duration */}
        {currentStep === 3 && selectedBaseProduct && (
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-light leading-tight text-secondary mb-4 tracking-tight">
              Choose Your Duration
            </h2>
            <p className="text-lg sm:text-xl text-slate-500 mb-12 sm:mb-16 font-light">
              Longer subscriptions mean bigger savings!
            </p>
            
            {durationOptions.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-500 text-lg mb-2">No duration options available for this box.</p>
                <p className="text-slate-400 text-sm">Please try selecting a different box.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {durationOptions.map((duration) => {
                  const variantPrice = parseFloat(duration.variant.price.amount);
                  const expectedFullPrice = duration.basePrice * duration.months;
                  const savings = duration.savings;
                  
                  return (
                    <button
                      key={duration.variant.id}
                      onClick={() => setSelectedDuration(duration)}
                      disabled={!duration.variant.availableForSale}
                      className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                        selectedDuration?.variant.id === duration.variant.id 
                          ? 'border-primary bg-white     ' 
                          : 'border-gray-100 bg-white hover:border-primary   '
                      } ${!duration.variant.availableForSale ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {duration.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-primary text-white px-4 py-1 rounded-full text-xs font-medium  ">
                            POPULAR
                          </span>
                        </div>
                      )}
                      
                      <CalendarDaysIcon className={`h-12 w-12 mx-auto mb-6 transition-all duration-300 group-hover:scale-110 ${
                        selectedDuration?.variant.id === duration.variant.id ? 'text-primary' : 'text-slate-400 group-hover:text-primary'
                      }`} />
                      <h3 className="text-xl font-medium mb-2 text-secondary">{duration.label}</h3>
                      <p className="text-sm text-slate-500 mb-6 font-light">{duration.description}</p>
                      
                      <div className="space-y-2">
                        {savings > 0 && (
                          <div className="text-sm text-slate-400 line-through font-light">
                            {formatCurrency(expectedFullPrice, duration.currencyCode)}
                          </div>
                        )}
                        <div className="text-2xl font-light text-primary">
                          {formatCurrency(variantPrice, duration.currencyCode)}
                        </div>
                        {savings > 0 && (
                          <div className="text-sm font-medium text-secondary">
                            Save {formatCurrency(savings, duration.currencyCode)}
                          </div>
                        )}
                        <div className="text-xs text-slate-400 font-light">
                          {formatCurrency(variantPrice / duration.months, duration.currencyCode)}/month
                        </div>
                      </div>
                      
                      {!duration.variant.availableForSale && (
                        <div className="text-xs text-red-500 mt-3 font-medium">Out of Stock</div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Selected Box Summary */}
            {selectedDuration && selectedBaseProduct && (
              <div className="mt-16 p-6 bg-white/80 rounded-2xl border border-gray-100 backdrop-blur-sm">
                <h3 className="text-lg font-medium mb-6 text-secondary">Your Selection Summary</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img 
                      src={selectedBaseProduct.featuredImage?.url || '/placeholder-box.jpg'} 
                      alt={selectedBaseProduct.title}
                      className="w-16 h-16 rounded-xl object-cover   "
                    />
                    <div className="text-left">
                      <h4 className="font-medium text-secondary">{selectedBaseProduct.title}</h4>
                      <p className="text-sm text-slate-500 font-light">
                        {selectedDuration.label} subscription
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-light text-primary">
                      {formatCurrency(parseFloat(selectedDuration.variant.price.amount), selectedDuration.currencyCode)}
                    </div>
                    {calculateSavings() > 0 && (
                      <div className="text-sm text-secondary font-medium">
                        You save {formatCurrency(calculateSavings(), getCurrencyCode())}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Add-ons */}
        {currentStep === 4 && (
          <div>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-light leading-tight text-secondary mb-4 tracking-tight">
                Enhance Your Experience
              </h2>
              <p className="text-lg sm:text-xl text-slate-500 font-light">
                Add premium items to complement your snack box
              </p>
            </div>
            
            {featuredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-500 text-lg mb-2">No add-on products available at the moment.</p>
                <p className="text-slate-400 text-sm">You can proceed without add-ons.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showQuantityControls={true}
                    allowClick={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-2 justify-between items-center mt-16">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-x-3 rounded-full bg-slate-100 px-6 py-3 text-base font-medium text-slate-600 transition-all hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={!canProceedToNext()}
              className="inline-flex items-center gap-x-3 rounded-full bg-primary px-8 py-3 text-base font-medium text-white transition-all hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed active:scale-95  "
            >
              Continue
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleFinalCheckout}
              disabled={!selectedBaseProduct || !selectedDuration}
              className="inline-flex items-center gap-x-3 rounded-full bg-primary px-8 py-3 text-base font-medium text-white transition-all hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed active:scale-95  "
            >
              Add to Cart
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
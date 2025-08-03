'use client';
import React, { useState, useEffect } from 'react';
import {
    ArrowRightIcon,
    BuildingStorefrontIcon,
    CubeIcon,
    ShareIcon,
    TruckIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import BoxActionButton from './BoxActionButton';
import Image from 'next/image';

const heroImages = [
  {
    image: "/hero/hero_1.png", // Replace with your actual image paths
    alt: "African family enjoying snacks together"
  },
  {
    image: "/hero/hero_2.png",
    alt: "Friends sharing Nyumly snack box"
  },
  {
    image: "/hero/hero_3.png",
    alt: "Happy moment with African snacks"
  }
];

const ImageCarouselSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
     
  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      // After a brief moment, update the index and end transition
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 50); // Very brief delay to trigger the transition
    }, 10000);
         
    return () => clearInterval(interval);
  }, []);

  // Handle manual dot navigation
  const handleDotClick = (index: React.SetStateAction<number>) => {
    if (index !== currentImageIndex && !isTransitioning) {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentImageIndex(index);
        setIsTransitioning(false);
      }, 50);
    }
  };
   
  const currentImage = heroImages[currentImageIndex];
   
  return (
    <>
      <section className="relative min-h-[70vh] md:min-h-[75vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Smooth Transition */}
        <div className="absolute inset-0">
          {/* Main Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
            style={{
              backgroundImage: `url('${currentImage?.image || '/hero/hero_1.png'}')`,
              opacity: isTransitioning ? 0.7 : 1,
            }}
          />
          
          {/* Static fallback image for initial load */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{
              backgroundImage: `url('/hero/hero_1.png')`,
              zIndex: -1 // Behind other images
            }}
          />
          
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/45 bg-opacity-25" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 px-4 py-16 text-center text-white">
          <div className="mx-auto max-w-4xl">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
              <span className="block text-white mb-2">A Taste of Africa in Every Box</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl lg:text-2xl  mb-8 max-w-2xl mx-auto leading-relaxed">
            From nostalgic childhood snacks to hidden gems, experience Africa one bite at a time.</p>
            
            {/* Action Buttons */}
            <div className="flex  gap-2 justify-center items-center">
              <Link href="/store" className="inline-flex items-center gap-x-1 rounded-lg bg-white text-[#E84A25] px-6 py-4 text-base font-bold transition hover:bg-gray-100 shadow-lg cursor-pointer border-2 border-white">
                <BuildingStorefrontIcon className="w-4 h-4" />
                Store
              </Link>
              <button className="inline-flex items-center gap-x-2 rounded-lg bg-[#E84A25] text-white px-6 py-4 text-base font-bold transition hover:bg-[#d43d1a] shadow-lg cursor-pointer border-2 border-[#E84A25]">
               <CubeIcon className="w-4 h-4" />
                Boxes
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                disabled={isTransitioning}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - 3 Steps */}
      <section className="py-8  sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-bgLight">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-center mb-8 sm:mb-10 lg:mb-12 text-secondary">
          How It Works
        </h2>
    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              title: "Pick Your Box",
              description: "Mini, Medium, Large  - choose what suits your snacking style.",
              icon: <CubeIcon className="h-6 w-6" />,
            },
            {
              title: "Get It Delivered",
              description: "Shipped straight to your door, no matter where you are.",
              icon: <TruckIcon className="h-6 w-6" />,
            },
            {
              title: "Snack & Share",
              description: "Taste, smile, and join the conversation with fellow snack lovers.",
              icon: <ShareIcon className="h-6 w-6" />,
            }
          ].map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm transition-transform hover:transform hover:scale-105 duration-300"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 bg-accent text-secondary">
                {step.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-primary">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-textDark">
                {step.description}
              </p>
            </div>
          ))}
        </div>
    
        <div className="mt-6 sm:mt-8 text-center hidden">
          <BoxActionButton
            route="/create-box"
            className="text-sm sm:text-md font-bold inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all hover:bg-opacity-90 bg-accent text-secondary"
          >
            Want to build your own box?
            <ArrowRightIcon className="ml-1 h-4 w-4 sm:hidden" />
            <ArrowRightIcon className="ml-1 h-5 w-5 hidden sm:inline" />
          </BoxActionButton>
        </div>
      </div>
      </section>
    
      {/* Product Showcase Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4 text-secondary">
                  Discover African Flavors
                </h2>
                <p className="text-base sm:text-lg text-textDark max-w-2xl mx-auto">
                  Curated snacks from across Africa, delivered to your doorstep
                </p>
              </div>
      
              <div className="flex flex-col items-center">
                {/* Product Image Stack */}
                <Image
                  src={`/boxes/6.svg`}
                  alt="Snack Box"
                  width={500} 
                  height={500}     
                  />
      
                {/* Disclaimer */}
                <p className="text-xs sm:text-sm text-gray-500 mb-6 italic text-center max-w-md">
                  * Photos are for example purposes only. Snacks will vary each delivery.
                </p>
      
                {/* Pricing */}
                <div className="text-center mb-6">
                  <p className="text-sm sm:text-base font-medium text-textDark mb-2 uppercase tracking-wide">
                    Starting At
                  </p>
                  <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-secondary mb-2">
                    $17.99
                  </p>
                  
                  {/* Reviews */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm sm:text-base text-gray-600 font-medium">
                      2036 reviews
                    </span>
                  </div>
                </div>
      
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <Link 
                  href="/get-started"
                  className="flex-1 bg-primary border-2 border-primary text-white  font-bold py-3 px-6 sm:px-8 rounded-lg  text-center">

                  
                      Get Started
                  </Link>
                  <button 
                  className="flex-1 bg-white border-2 border-primary text-primary hover:bg-blue-50 font-bold py-3 px-6 sm:px-8 rounded-lg transition-colors duration-200 text-center">
                    Give a Gift
                  </button>
                </div>
              </div>
            </div>
          </section>

    </>
  
  );
};

export default ImageCarouselSection;
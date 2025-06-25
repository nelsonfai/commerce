'use client';
import React, { useState, useEffect } from 'react';
import {
    CubeIcon,
    TruckIcon,
    ShareIcon,
    ArrowRightIcon,
  } from '@heroicons/react/24/outline';
export const boximages = [
  {
    image: "/boxes/6.svg",
    name: "Mini Box",
    color: "#E2725B", 
  },
  {
    image: "/boxes/7.svg",
    name: "Medium Box",
    color: "#FFC107", // Turmeric
  },
  {
    image: "/boxes/8.svg",
    name: "Large Box",
    color: "#50C878", // Emerald Green
  },
  {
    image: "/boxes/9.svg",
    name: "Custom Box",
    color: "#3F51B5", // Indigo Blue
  },
];
import BoxActionButton from './BoxActionButton';
import Link from 'next/link';
const ImageCarouselSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Auto-rotate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % boximages.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const currentImage = boximages[currentImageIndex];

  return (
    <>
    <section className="py-8 px-4 bg-white">
      <div className="mx-auto max-w-7xl ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center md:text-left ">
          <div className="flex flex-col ">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-[#E84A25]">
              A Taste of Africa in Every Box
            </h1>
            <p className="mt-6 text-xl text-[#333333] mb-8">
              From nostalgic childhood snacks to hidden gems, experience Africa one bite at a time.
            </p>


            <div className="flex gap-4 justify-center md:justify-start">
              <button className="inline-flex items-center gap-x-2 rounded-xl bg-secondary px-8 py-4 text-base font-bold text-white transition hover:bg-[#d43d1a] shadow-sm cursor-pointer">
                Snack Boxes <ArrowRightIcon className="h-5 w-5" />
              </button>
              <Link href="/store" className="inline-flex items-center gap-x-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-white transition hover:bg-[#d43d1a] shadow-sm cursor-pointer">
                Snack Store <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div className="relative ">
            {/* Image display with color background and fade transition */}
            <div 
              className="relative aspect-square rounded-2xl overflow-hidden "
            >
              <div className={`absolute md:p-6 inset-0 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <img
                  src={currentImage?.image || "/placeholder-box.jpg"}
                  alt={currentImage?.name}
                  className="  object-cover  object-center w-full h-full"
                />
              </div>
              
              {/* Logo repositioned to bottom right corner */}
              <div className="hidden absolute -bottom-6 -right-6 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4" style={{ borderColor: currentImage?.color }}>
                <img
                  src="/SAFARi.svg"
                  alt="Snack Safari Logo"
                  className="w-14 h-14"
                />
              </div>
            </div>
            
      
          </div>
        </div>
      </div>
    </section>
              {/* How It Works - 3 Steps */}
              <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-bgLight">
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
          <div className="relative mb-6 sm:mb-8">
            <div className="relative">
              {/* Red delivery box */}
              <div className="w-48 sm:w-64 md:w-80 h-32 sm:h-40 md:h-48 bg-[#E84A25] rounded-lg shadow-lg mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="text-white font-bold text-lg sm:text-xl md:text-2xl">
                  SNACK SAFARI
                </div>
                <div className="absolute top-2 right-2 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded opacity-20"></div>
              </div>
              
              {/* Snack arrangement */}
              <div className="relative w-48 sm:w-64 md:w-80 h-48 sm:h-56 md:h-64 mx-auto">
                <div className="absolute inset-0 grid grid-cols-4 sm:grid-cols-5 gap-1 sm:gap-2 p-2">
                  {/* Simulated snack packages */}
                  {Array.from({ length: 20 }).map((_, index) => (
                    <div
                      key={index}
                      className={`aspect-square rounded-sm shadow-sm ${
                        index % 5 === 0 ? 'bg-red-500' :
                        index % 5 === 1 ? 'bg-blue-500' :
                        index % 5 === 2 ? 'bg-yellow-500' :
                        index % 5 === 3 ? 'bg-green-500' :
                        'bg-purple-500'
                      }`}
                      style={{
                        transform: `rotate(${(index % 3 - 1) * 5}deg)`,
                      }}
                    >
                      <div className="w-full h-full bg-white bg-opacity-20 rounded-sm"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

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
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 sm:px-8 rounded-lg transition-colors duration-200 text-center"            >
              Get Started
            </Link>
            <button className="flex-1 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 sm:px-8 rounded-lg transition-colors duration-200 text-center">
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
'use client';
import React, { ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Snack } from 'types/snack';

interface SnackModalProps {
  snack: Snack;
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

const SnackModal: React.FC<SnackModalProps> = ({ snack, isOpen, onClose, children }) => {
  if (!isOpen || !snack) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80 bg-opacity-50 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#181611]">{snack.name}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div
          className="aspect-[4/3] bg-cover bg-center mb-4 rounded-lg"
          style={{ backgroundImage: `url("${snack.image}")` }}
        />
        
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="text-[#8a7e60] font-medium">Country:</span>
            <span className="ml-2 flex items-center">
              <span className="mr-1">{snack.flag}</span>
              <span className="text-[#181611]">{snack.country}</span>
            </span>
          </div>
          
          {snack.tags && snack.tags.length > 0 && (
            <div className="flex items-start">
              <span className="text-[#8a7e60] font-medium">Tags:</span>
              <div className="ml-2 flex flex-wrap gap-1">
                {snack.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-[#f9f7f2] rounded-full text-xs text-[#8a7e60]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <span className="text-[#8a7e60] font-medium">Description:</span>
            <p className="mt-1 text-[#181611]">{snack.description}</p>
          </div>
          
          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg text-[#181611]">
                {typeof snack.price === 'object' ? snack.price.currency : '$'}{' '}
                {typeof snack.price === 'object'
                  ? parseFloat(snack.price.amount.toString()).toFixed(2)
                  : snack.price?.toFixed(2) || '0.00'
                }
              </span>
              
              {/* Custom action buttons area */}
              {children && (
                <div className="flex items-center space-x-2">
                  {children}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnackModal;

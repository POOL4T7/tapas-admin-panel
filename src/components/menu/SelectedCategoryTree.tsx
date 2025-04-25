import React, { useState } from 'react';
import { Categories } from '@/types/menu';

interface SelectedCategoryTreeProps {
  selectedCategories: Categories[];
}

export const SelectedCategoryTree: React.FC<SelectedCategoryTreeProps> = ({
  selectedCategories,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
      <button
        className='w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors'
        onClick={(e) => {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }}
        aria-expanded={isExpanded}
      >
        <div className='flex items-center space-x-2'>
          <span className='font-medium text-gray-900'>Selected Categories</span>
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
            {selectedCategories.reduce((acc, cat) => acc + cat.subCategories.length, 0)}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>
      {isExpanded && (
        <div className='p-4 space-y-3'>
          {selectedCategories.map((cat) => (
            <div key={cat.id}>
              <div className='font-medium'>{cat.name}</div>
              <div className='flex flex-wrap gap-2 mt-2'>
                {cat.subCategories.map((sub) => (
                  <span key={sub.id} className='bg-gray-100 px-2 py-1 rounded text-sm'>
                    {sub.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

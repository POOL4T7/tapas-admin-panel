import React, { useState } from 'react';
import { Category } from '@/types/category';
import { SubCategory } from '@/types/sub-category';

interface SelectedCategoryTreeProps {
  categories: Category[];
  subCategories: SubCategory[];
  selectedPairs: { categoryId: string; subCategoryId: string }[];
}

export const SelectedCategoryTree: React.FC<SelectedCategoryTreeProps> = ({
  categories,
  subCategories,
  selectedPairs,
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
            {selectedPairs.length}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
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
        <div className='px-4 pb-4'>
          {selectedPairs.length === 0 ? (
            <div className='text-center py-4'>
              <svg
                className='mx-auto h-12 w-12 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1}
                  d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <p className='mt-1 text-sm text-gray-500'>
                No subcategories selected yet
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {categories
                .filter((cat) =>
                  selectedPairs.some(
                    (p) => String(p.categoryId) === String(cat.id)
                  )
                )
                .map((cat) => (
                  <div key={cat.id} className='bg-gray-50 rounded-lg p-3'>
                    <h3 className='font-medium text-gray-800 flex items-center'>
                      <svg
                        className='w-4 h-4 mr-2 text-gray-500'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                        />
                      </svg>
                      {cat.name}
                    </h3>
                    {selectedPairs.filter(
                      (p) => String(p.categoryId) === String(cat.id)
                    ).length > 0 && (
                      <ul className='mt-2 space-y-1 pl-6'>
                        {selectedPairs
                          .filter(
                            (p) => String(p.categoryId) === String(cat.id)
                          )
                          .map((p) => {
                            const sub = subCategories.find(
                              (s) => String(s.id) === String(p.subCategoryId)
                            );
                            return (
                              sub && (
                                <li key={sub.id} className='flex items-center'>
                                  <span className='w-1.5 h-1.5 rounded-full bg-gray-400 mr-2'></span>
                                  <span className='text-sm text-gray-600'>
                                    {sub.name}
                                  </span>
                                </li>
                              )
                            );
                          })}
                      </ul>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

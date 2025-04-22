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
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-4 bg-gray-50 rounded border border-gray-200 p-3">
      <div
        className="flex items-center justify-between cursor-pointer select-none mb-2"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-semibold text-sm">Selected</span>
        <span className="ml-2">
          {open ? (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </span>
      </div>
      {open && (
        selectedPairs.length === 0 ? (
          <div className="text-xs text-gray-500">No subcategories selected.</div>
        ) : (
          <ul className="text-sm">
            {categories
              .filter((cat) => selectedPairs.some((p) => String(p.categoryId) === String(cat.id)))
              .map((cat) => (
                <li key={cat.id}>
                  <span className="font-semibold">{cat.name}</span>
                  <ul className="ml-4 list-disc">
                    {selectedPairs
                      .filter((p) => String(p.categoryId) === String(cat.id))
                      .map((p) => {
                        const sub = subCategories.find((s) => String(s.id) === String(p.subCategoryId));
                        return sub ? <li key={sub.id}>{sub.name}</li> : null;
                      })}
                  </ul>
                </li>
              ))}
          </ul>
        )
      )}
    </div>
  );
};

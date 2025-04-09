'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SubCategoryForm } from '@/components/sub-category/sub-category-form';
import { SubCategoryTable } from '@/components/sub-category/sub-category-table';
import { SubCategory } from '@/types/sub-category';
import { Category } from '@/types/category';

export default function SubCategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(
    null
  );

  const categories: Category[] = [
    {
      id: '1',
      name: 'Appetizers',
      menuId: '1',
      description: 'Starters and snacks',
      status: 'active',
      displayOrder: 1,
    },
  ];

  const [subCategories, setSubCategories] = useState<SubCategory[]>([
    {
      id: '1',
      name: 'Soups',
      categoryId: '1',
      description: 'Hot and cold soups',
      status: 'active',
      displayOrder: 1,
    },
    {
      id: '2',
      name: 'Salads',
      categoryId: '1',
      description: 'Fresh salads',
      status: 'inactive',
      displayOrder: 2,
    },
  ]);

  const handleDeleteSubCategory = (subCategory: SubCategory) => {
    setSubCategories(subCategories.filter((sc) => sc.id !== subCategory.id));
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    const newSubCategories = [...subCategories];
    const [removed] = newSubCategories.splice(oldIndex, 1);
    newSubCategories.splice(newIndex, 0, removed);

    // Update display orders
    const updatedSubCategories = newSubCategories.map((sc, index) => ({
      ...sc,
      displayOrder: index + 1,
    }));

    setSubCategories(updatedSubCategories);
  };

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-semibold'>Sub Categories</h1>
          <p className='text-muted-foreground mt-1'>
            Manage your menu sub categories
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Sub Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSubCategory ? 'Edit' : 'Add'} Sub Category
              </DialogTitle>
            </DialogHeader>
            <SubCategoryForm
              categories={categories}
              initialData={editingSubCategory || undefined}
              onSubmit={(data) => {
                if (editingSubCategory) {
                  setSubCategories(
                    subCategories.map((sc) =>
                      sc.id === editingSubCategory.id ? { ...sc, ...data } : sc
                    )
                  );
                } else {
                  setSubCategories([
                    ...subCategories,
                    {
                      ...data,
                      id: Math.random().toString(),
                      displayOrder: subCategories.length + 1,
                    },
                  ]);
                }
                setIsDialogOpen(false);
                setEditingSubCategory(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <SubCategoryTable
        subCategories={subCategories}
        categories={categories}
        onEdit={(subCategory) => {
          setEditingSubCategory(subCategory);
          setIsDialogOpen(true);
        }}
        onDelete={handleDeleteSubCategory}
        onReorder={handleReorder}
      />
    </div>
  );
}

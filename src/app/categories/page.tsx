'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Category } from '@/types/category';
import { Menu } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { CategoryTable } from '@/components/category/category-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CategoryForm } from '@/components/category/category-form';

export default function CategoriesPage() {
  // Temporary mock menus - replace with actual menu fetching logic
  const [menus] = useState<Menu[]>([
    {
      id: 'menu1',
      name: 'Main Menu',
      description: 'Our primary dining menu',
      status: 'active',
      displayOrder: 1,
    },
    {
      id: 'menu2',
      name: 'Drinks Menu',
      description: 'Beverages and cocktails',
      status: 'active',
      displayOrder: 2,
    },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'cat1',
      name: 'Hot Beverages',
      menuId: 'menu1',
      description: 'Warm and comforting drinks',
      status: 'active',
      displayOrder: 1,
    },
    {
      id: 'cat2',
      name: 'Cold Beverages',
      menuId: 'menu1',
      description: 'Refreshing chilled drinks',
      status: 'inactive',
      displayOrder: 2,
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleCreateCategory = (newCategory: Category) => {
    const categoryWithId = {
      ...newCategory,
      id: `category_${Date.now()}`,
    };
    setCategories([...categories, categoryWithId]);
    setIsDialogOpen(false);
  };

  const handleEditCategory = (updatedCategory: Category) => {
    setCategories(
      categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategories(categories.filter((c) => c.id !== category.id));
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    const updatedCategories = [...categories];
    const [movedCategory] = updatedCategories.splice(oldIndex, 1);
    updatedCategories.splice(newIndex, 0, movedCategory);

    // Update display orders
    const reorderedCategories = updatedCategories.map((category, index) => ({
      ...category,
      displayOrder: index + 1,
    }));

    setCategories(reorderedCategories);
  };

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Categories</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory(null)}>
              <Plus className='mr-2 h-4 w-4' /> Create Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm
              menus={menus}
              initialData={editingCategory || undefined}
              onSubmit={
                editingCategory ? handleEditCategory : handleCreateCategory
              }
              onCancel={() => {
                setEditingCategory(null);
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <CategoryTable
        categories={categories}
        menus={menus}
        onEdit={(category) => {
          setEditingCategory(category);
          setIsDialogOpen(true);
        }}
        onDelete={handleDeleteCategory}
        onReorder={handleReorder}
      />
    </div>
  );
}

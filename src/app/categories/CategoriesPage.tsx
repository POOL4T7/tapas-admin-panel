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
import { CategoryForm } from '@/components/category/category-form';
import { CategoryTable } from '@/components/category/category-table';
import { Category } from '@/types/category';
import { Menu } from '@/types/menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CategoriesPage() {
  // const [isClient, setIsClient] = useState(false);
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
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  const handleDeleteCategory = (category: Category) => {
    setCategories(categories.filter((c) => c.id !== category.id));
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    const newCategories = [...categories];
    const [removed] = newCategories.splice(oldIndex, 1);
    newCategories.splice(newIndex, 0, removed);

    // Update display orders
    const updatedCategories = newCategories.map((c, index) => ({
      ...c,
      displayOrder: index + 1,
    }));

    setCategories(updatedCategories);
  };

  // Filter categories based on selected menu
  const filteredCategories = selectedMenuId
    ? categories.filter((category) => category.menuId === selectedMenuId)
    : categories;

  // if (!isClient) {
  //   return null;
  // }

  return (
    <div className='p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0 sm:space-x-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-xl sm:text-2xl font-semibold mb-1'>Categories</h1>
          <p className='text-sm text-muted-foreground'>
            Manage your menu categories
          </p>
        </div>

        <div className='flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto'>
          <Select
            value={selectedMenuId || ''}
            onValueChange={(value) => setSelectedMenuId(value || null)}
          >
            <SelectTrigger className='w-full sm:w-[180px]'>
              <SelectValue placeholder='Filter by Menu' />
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='all'>All Menus</SelectItem>
              {menus.map((menu) => (
                <SelectItem key={menu.id} value={menu.id}>
                  {menu.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant='default' className='w-full sm:w-auto'>Add Category</Button>
            </DialogTrigger>
            <DialogContent className='w-[90%] max-w-md max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Edit' : 'Add'} Category
                </DialogTitle>
              </DialogHeader>
              <CategoryForm
                menus={menus}
                initialData={editingCategory || undefined}
                onSubmit={(data) => {
                  if (editingCategory) {
                    setCategories(
                      categories.map((c) =>
                        c.id === editingCategory.id ? { ...c, ...data } : c
                      )
                    );
                  } else {
                    setCategories([
                      ...categories,
                      {
                        ...data,
                        id: Math.random().toString(),
                        displayOrder: categories.length + 1,
                      },
                    ]);
                  }
                  setIsDialogOpen(false);
                  setEditingCategory(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CategoryTable
        categories={filteredCategories}
        menus={menus}
        onEdit={(category) => {
          setEditingCategory(category);
          setIsDialogOpen(true);
        }}
        onDelete={handleDeleteCategory}
        onReorder={handleReorder}
        onStatusToggle={(category, isActive) => {
          setCategories(
            categories.map((c) =>
              c.id === category.id
                ? { ...c, status: isActive ? 'active' : 'inactive' }
                : c
            )
          );
        }}
      />
    </div>
  );
}

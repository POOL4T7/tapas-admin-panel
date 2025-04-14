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
import { Menu } from '@/types/menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SubCategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const menus: Menu[] = [
    {
      id: '1',
      name: 'Main Menu',
      description: 'Our primary dining menu',
      status: 'active',
      displayOrder: 1,
    },
    {
      id: '2',
      name: 'Drinks Menu',
      description: 'Beverages and cocktails',
      status: 'active',
      displayOrder: 2,
    },
  ];

  const categories: Category[] = [
    {
      id: '1',
      name: 'Appetizers',
      menuId: '1',
      description: 'Starters and snacks',
      status: 'active',
      displayOrder: 1,
    },
    {
      id: '2',
      name: 'Main Course',
      menuId: '1',
      description: 'Hearty main dishes',
      status: 'active',
      displayOrder: 2,
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

  // Filter categories based on selected menu
  const filteredCategories = selectedMenuId
    ? categories.filter((category) => category.menuId === selectedMenuId)
    : categories;

  // Filter subcategories based on selected menu and category
  const filteredSubCategories = subCategories.filter((subCategory) => {
    const matchesMenu = selectedMenuId 
      ? filteredCategories.some(cat => cat.id === subCategory.categoryId)
      : true;
    const matchesCategory = selectedCategoryId
      ? subCategory.categoryId === selectedCategoryId
      : true;
    return matchesMenu && matchesCategory;
  });

  const handleDeleteSubCategory = (subCategory: SubCategory) => {
    setSubCategories(subCategories.filter((sc) => sc.id !== subCategory.id));
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    const newSubCategories = [...filteredSubCategories];
    const [removed] = newSubCategories.splice(oldIndex, 1);
    newSubCategories.splice(newIndex, 0, removed);

    // Update display orders
    const updatedSubCategories = newSubCategories.map((sc, index) => ({
      ...sc,
      displayOrder: index + 1,
    }));

    setSubCategories(
      subCategories.map(sc => {
        const updatedSc = updatedSubCategories.find(u => u.id === sc.id);
        return updatedSc ? updatedSc : sc;
      })
    );
  };

  return (
    <div className='p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0 sm:space-x-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-xl sm:text-2xl font-semibold'>Sub Categories</h1>
          <p className='text-sm text-muted-foreground'>
            Manage your menu sub categories
          </p>
        </div>

        <div className='flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto'>
          <Select
            value={selectedMenuId || ''}
            onValueChange={(value) => {
              setSelectedMenuId(value === 'all' ? null : value);
              setSelectedCategoryId(null); // Reset category filter when menu changes
            }}
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

          <Select
            value={selectedCategoryId || ''}
            onValueChange={(value) => 
              setSelectedCategoryId(value === 'all' ? null : value)
            }
            disabled={!selectedMenuId}
          >
            <SelectTrigger className='w-full sm:w-[180px]'>
              <SelectValue placeholder='Filter by Category' />
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='all'>All Categories</SelectItem>
              {filteredCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className='w-full sm:w-auto'>Add Sub Category</Button>
            </DialogTrigger>
            <DialogContent className='w-[90%] max-w-md max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>
                  {editingSubCategory ? 'Edit' : 'Add'} Sub Category
                </DialogTitle>
              </DialogHeader>
              <SubCategoryForm
                menus={menus}
                categories={filteredCategories}
                initialData={editingSubCategory}
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
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditingSubCategory(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <SubCategoryTable
        subCategories={filteredSubCategories}
        categories={filteredCategories}
        menus={menus}
        onEdit={(subCategory) => {
          setEditingSubCategory(subCategory);
          setIsDialogOpen(true);
        }}
        onDelete={handleDeleteSubCategory}
        onReorder={handleReorder}
        onStatusToggle={(subCategory, isActive) => {
          setSubCategories(
            subCategories.map((sc) =>
              sc.id === subCategory.id
                ? { ...sc, status: isActive ? 'active' : 'inactive' }
                : sc
            )
          );
        }}
      />
    </div>
  );
}

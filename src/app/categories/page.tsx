'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CategoryForm } from '@/components/category/category-form';
import { Category } from '@/types/category';
import { Menu } from '@/types/menu';

export default function CategoriesPage() {
  // Temporary mock menus - replace with actual menu fetching logic
  const [menus] = useState<Menu[]>([
    { id: 'menu1', name: 'Beverages', description: '', status: 'active' },
    { id: 'menu2', name: 'Snacks', description: '', status: 'active' },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { 
      id: 'cat1', 
      name: 'Hot Beverages', 
      menuId: 'menu1', 
      description: 'Warm and comforting drinks', 
      status: 'active' 
    },
    { 
      id: 'cat2', 
      name: 'Cold Beverages', 
      menuId: 'menu1', 
      description: 'Refreshing chilled drinks', 
      status: 'inactive' 
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleCreateCategory = (newCategory: Category) => {
    const categoryWithId = { 
      ...newCategory, 
      id: `category_${Date.now()}` 
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const handleStatusToggle = (id: string, isActive: boolean) => {
    setCategories(
      categories.map((category) =>
        category.id === id
          ? { ...category, status: isActive ? 'active' : 'inactive' }
          : category
      )
    );
  };

  const columns: ColumnDef<Category>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'menuId',
      header: 'Menu',
      cell: ({ row }) => {
        const menuId = row.getValue('menuId') as string;
        const menu = menus.find(m => m.id === menuId);
        return <div>{menu?.name || 'Unknown Menu'}</div>;
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div>{row.getValue('description') || 'No description'}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <span
            className={`px-2 py-1 rounded text-xs ${
              status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => {
                setEditingCategory(category);
                setIsDialogOpen(true);
              }}
            >
              <Pencil className='h-4 w-4' />
            </Button>
            {/* Hiding delete icon for now */}
            {/* <Button 
              variant='destructive' 
              size='icon'
              onClick={() => handleDeleteCategory(category.id || '')}
            >
              <Trash2 className='h-4 w-4' />
            </Button> */}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

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
              onSubmit={editingCategory ? handleEditCategory : handleCreateCategory}
              onCancel={() => {
                setEditingCategory(null);
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable 
        columns={columns} 
        data={categories} 
        onStatusToggle={handleStatusToggle}
      />
    </div>
  );
}

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
import { SubCategoryForm } from '@/components/sub-category/sub-category-form';
import { SubCategory } from '@/types/sub-category';
import { Category } from '@/types/category';

export default function SubCategoriesPage() {
  // Temporary mock categories - replace with actual category fetching logic
  const [categories] = useState<Category[]>([
    { 
      id: 'cat1', 
      name: 'Beverages', 
      menuId: 'menu1', 
      description: '', 
      status: 'active' 
    },
  ]);

  const [subCategories, setSubCategories] = useState<SubCategory[]>([
    { 
      id: 'subcat1', 
      name: 'Hot Beverages', 
      categoryId: 'cat1', 
      description: 'Warm and comforting drinks', 
      status: 'active' 
    },
    { 
      id: 'subcat2', 
      name: 'Cold Beverages', 
      categoryId: 'cat1', 
      description: 'Refreshing chilled drinks', 
      status: 'inactive' 
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);

  const handleCreateSubCategory = (newSubCategory: SubCategory) => {
    const subCategoryWithId = { 
      ...newSubCategory, 
      id: `subcategory_${Date.now()}` 
    };
    setSubCategories([...subCategories, subCategoryWithId]);
    setIsDialogOpen(false);
  };

  const handleEditSubCategory = (updatedSubCategory: SubCategory) => {
    setSubCategories(
      subCategories.map((subCategory) => 
        subCategory.id === updatedSubCategory.id ? updatedSubCategory : subCategory
      )
    );
    setEditingSubCategory(null);
    setIsDialogOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteSubCategory = (id: string) => {
    setSubCategories(subCategories.filter((subCategory) => subCategory.id !== id));
  };

  const handleStatusToggle = (id: string, isActive: boolean) => {
    setSubCategories(
      subCategories.map((subCategory) =>
        subCategory.id === id
          ? { ...subCategory, status: isActive ? 'active' : 'inactive' }
          : subCategory
      )
    );
  };

  const columns: ColumnDef<SubCategory>[] = [
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
      accessorKey: 'categoryId',
      header: 'Category',
      cell: ({ row }) => {
        const categoryId = row.getValue('categoryId') as string;
        const category = categories.find(c => c.id === categoryId);
        return <div>{category?.name || 'Unknown Category'}</div>;
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
        const subCategory = row.original;
        return (
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => {
                setEditingSubCategory(subCategory);
                setIsDialogOpen(true);
              }}
            >
              <Pencil className='h-4 w-4' />
            </Button>
            {/* Hiding delete icon for now */}
            {/* <Button 
              variant='destructive' 
              size='icon'
              onClick={() => handleDeleteSubCategory(subCategory.id || '')}
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
        <h1 className='text-2xl font-bold'>Sub Categories</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSubCategory(null)}>
              <Plus className='mr-2 h-4 w-4' /> Create Sub Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSubCategory ? 'Edit Sub Category' : 'Create New Sub Category'}
              </DialogTitle>
            </DialogHeader>
            <SubCategoryForm
              categories={categories}
              initialData={editingSubCategory || undefined}
              onSubmit={editingSubCategory ? handleEditSubCategory : handleCreateSubCategory}
              onCancel={() => {
                setEditingSubCategory(null);
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable 
        columns={columns} 
        data={subCategories} 
        onStatusToggle={handleStatusToggle}
      />
    </div>
  );
}

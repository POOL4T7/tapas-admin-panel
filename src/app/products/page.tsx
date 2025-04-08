'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ProductForm } from '@/components/product/product-form';
import { Product } from '@/types/product';
import { SubCategory } from '@/types/sub-category';

export default function ProductsPage() {
  // Temporary mock sub categories - replace with actual sub category fetching logic
  const [subCategories] = useState<SubCategory[]>([
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
      status: 'active' 
    },
  ]);

  const [products, setProducts] = useState<Product[]>([
    { 
      id: 'prod1', 
      name: 'Espresso', 
      subCategoryId: 'subcat1', 
      description: 'Strong and rich coffee', 
      price: 50, 
      status: 'active' 
    },
    { 
      id: 'prod2', 
      name: 'Iced Tea', 
      subCategoryId: 'subcat2', 
      description: 'Refreshing cold tea', 
      price: 40, 
      status: 'inactive' 
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateProduct = (newProduct: Product) => {
    const productWithId = { 
      ...newProduct, 
      id: `product_${Date.now()}` 
    };
    setProducts([...products, productWithId]);
    setIsDialogOpen(false);
  };

  const handleStatusToggle = (id: string, isActive: boolean) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, status: isActive ? 'active' : 'inactive' } 
        : product
    ));
  };

  const columns: ColumnDef<Product>[] = [
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
      accessorKey: 'subCategoryId',
      header: 'Sub Category',
      cell: ({ row }) => {
        const subCategoryId = row.getValue('subCategoryId') as string;
        const subCategory = subCategories.find(sc => sc.id === subCategoryId);
        return <div>{subCategory?.name || 'Unknown Sub Category'}</div>;
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
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => (
        <div>₹{(row.getValue('price') as number).toFixed(2)}</div>
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
  ];

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Products</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' /> Create Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              subCategories={subCategories}
              onSubmit={handleCreateProduct}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable 
        columns={columns} 
        data={products} 
        onStatusToggle={handleStatusToggle}
      />
    </div>
  );
}

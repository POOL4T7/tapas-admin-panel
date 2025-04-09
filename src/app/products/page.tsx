'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductTable } from '@/components/product/product-table';
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
      status: 'active',
      displayOrder: 1,
    },
    {
      id: 'subcat2',
      name: 'Cold Beverages',
      categoryId: 'cat1',
      description: 'Refreshing chilled drinks',
      status: 'active',
      displayOrder: 2,
    },
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: 'prod1',
      name: 'Espresso',
      subCategoryId: 'subcat1',
      description: 'Strong and rich coffee',
      price: 50,
      status: 'active',
      displayOrder: 1,
    },
    {
      id: 'prod2',
      name: 'Iced Tea',
      subCategoryId: 'subcat2',
      description: 'Refreshing cold tea',
      price: 40,
      status: 'inactive',
      displayOrder: 2,
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleCreateProduct = (newProduct: Product) => {
    const productWithId = {
      ...newProduct,
      id: `product_${Date.now()}`,
      displayOrder: products.length + 1,
    };
    setProducts([...products, productWithId]);
    setIsDialogOpen(false);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (product: Product) => {
    setProducts(products.filter((p) => p.id !== product.id));
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    const updatedProducts = [...products];
    const [movedProduct] = updatedProducts.splice(oldIndex, 1);
    updatedProducts.splice(newIndex, 0, movedProduct);

    // Update display orders
    const reorderedProducts = updatedProducts.map((product, index) => ({
      ...product,
      displayOrder: index + 1,
    }));

    setProducts(reorderedProducts);
  };

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Products</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(null)}>
              <Plus className='h-4 w-4 mr-2' />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Create Product'}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              subCategories={subCategories}
              initialData={editingProduct || undefined}
              onSubmit={editingProduct ? handleEditProduct : handleCreateProduct}
              onCancel={() => {
                setEditingProduct(null);
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ProductTable
        products={products}
        onEdit={(product) => {
          setEditingProduct(product);
          setIsDialogOpen(true);
        }}
        onDelete={handleDeleteProduct}
        onReorder={handleReorder}
      />
    </div>
  );
}

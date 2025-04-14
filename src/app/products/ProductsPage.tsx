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
import { ProductForm } from '@/components/product/product-form';
import { ProductTable } from '@/components/product/product-table';
import { Product } from '@/types/product';
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

export default function ProductsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    string | null
  >(null);

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

  const subCategories: SubCategory[] = [
    {
      id: '1',
      name: 'Cold Appetizers',
      categoryId: '1',
      description: 'Chilled starters',
      status: 'active',
      displayOrder: 1,
    },
    {
      id: '2',
      name: 'Hot Appetizers',
      categoryId: '1',
      description: 'Warm starters',
      status: 'active',
      displayOrder: 2,
    },
  ];

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Caesar Salad',
      subCategoryId: '1',
      description: 'Classic Caesar salad with crisp romaine',
      status: 'active',
      displayOrder: 1,
      price: 8.99,
      menuId: '1',
      categoryId: '1',
    },
    {
      id: '2',
      name: 'Chicken Wings',
      subCategoryId: '2',
      description: 'Spicy buffalo chicken wings',
      status: 'inactive',
      displayOrder: 2,
      price: 10.99,
      menuId: '1',
      categoryId: '2',
    },
  ]);

  // Filter categories based on selected menu
  const filteredCategories = selectedMenuId
    ? categories.filter((category) => category.menuId === selectedMenuId)
    : categories;

  // Filter subcategories based on selected menu and category
  const filteredSubCategories = subCategories.filter((subCategory) => {
    const matchesMenu = selectedMenuId
      ? filteredCategories.some((cat) => cat.id === subCategory.categoryId)
      : true;
    const matchesCategory = selectedCategoryId
      ? subCategory.categoryId === selectedCategoryId
      : true;
    return matchesMenu && matchesCategory;
  });

  // Filter products based on selected menu, category, and subcategory
  const filteredProducts = products.filter((product) => {
    const matchesMenu = selectedMenuId
      ? filteredSubCategories.some((sc) => sc.id === product.subCategoryId)
      : true;
    const matchesCategory = selectedCategoryId
      ? filteredSubCategories.some(
          (sc) =>
            sc.id === product.subCategoryId &&
            sc.categoryId === selectedCategoryId
        )
      : true;
    const matchesSubCategory = selectedSubCategoryId
      ? product.subCategoryId === selectedSubCategoryId
      : true;
    return matchesMenu && matchesCategory && matchesSubCategory;
  });

  const handleDeleteProduct = (product: Product) => {
    setProducts(products.filter((p) => p.id !== product.id));
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    const newProducts = [...filteredProducts];
    const [removed] = newProducts.splice(oldIndex, 1);
    newProducts.splice(newIndex, 0, removed);

    // Update display orders
    const updatedProducts = newProducts.map((p, index) => ({
      ...p,
      displayOrder: index + 1,
    }));

    setProducts(
      products.map((p) => {
        const updatedP = updatedProducts.find((u) => u.id === p.id);
        return updatedP ? updatedP : p;
      })
    );
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleStatusToggle = (product: Product, isActive: boolean) => {
    setProducts(
      products.map((p) =>
        p.id === product.id
          ? { ...p, status: isActive ? 'active' : 'inactive' }
          : p
      )
    );
  };

  return (
    <div className='p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0 sm:space-x-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-xl sm:text-2xl font-semibold'>Products</h1>
          <p className='text-sm text-muted-foreground'>
            Manage your menu products
          </p>
        </div>

        <div className='flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto'>
          <Select
            value={selectedMenuId || ''}
            onValueChange={(value) => {
              setSelectedMenuId(value === 'all' ? null : value);
              setSelectedCategoryId(null); // Reset category filter
              setSelectedSubCategoryId(null); // Reset subcategory filter
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
            onValueChange={(value) => {
              setSelectedCategoryId(value === 'all' ? null : value);
              setSelectedSubCategoryId(null); // Reset subcategory filter
            }}
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

          <Select
            value={selectedSubCategoryId || ''}
            onValueChange={(value) =>
              setSelectedSubCategoryId(value === 'all' ? null : value)
            }
            disabled={!selectedCategoryId}
          >
            <SelectTrigger className='w-full sm:w-[180px]'>
              <SelectValue placeholder='Filter by Sub Category' />
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='all'>All Sub Categories</SelectItem>
              {filteredSubCategories.map((subCategory) => (
                <SelectItem key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className='w-full sm:w-auto'
                onClick={() => setEditingProduct(null)}
              >
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className='w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit' : 'Add'} Product
                </DialogTitle>
              </DialogHeader>
              <ProductForm
                subCategories={filteredSubCategories}
                categories={categories}
                menus={menus}
                initialData={editingProduct || undefined}
                onSubmit={(data) => {
                  if (editingProduct) {
                    setProducts(
                      products.map((p) =>
                        p.id === editingProduct.id ? { ...p, ...data } : p
                      )
                    );
                  } else {
                    setProducts([
                      ...products,
                      {
                        ...data,
                        id: Math.random().toString(),
                        displayOrder: products.length + 1,
                      },
                    ]);
                  }
                  setIsDialogOpen(false);
                  setEditingProduct(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ProductTable
        products={filteredProducts}
        subCategories={filteredSubCategories}
        categories={filteredCategories}
        menus={menus}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onReorder={handleReorder}
        onStatusToggle={handleStatusToggle}
      />
    </div>
  );
}

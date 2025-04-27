'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { ProductForm } from '@/components/product/product-form';
import { ProductTable } from '@/components/product/product-table';
import { Product } from '@/types/product';
import { SubCategory } from '@/types/sub-category';
import { Category } from '@/types/category';
// import { Menu } from '@/types/menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllCategories } from '@/lib/categories-api';
// import { getAllMenus } from '@/lib/menu-api';
import { getAllSubCategories } from '@/lib/sub-categories-api';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from '@/lib/products-api';
import { toast } from 'sonner';

export default function ProductsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  // const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    string | null
  >(null);
  // const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const data = await getAllCategories();
        // const menus = await getAllMenus();
        const subCategories = await getAllSubCategories();
        const productList = await getAllProducts();
        console.log(productList);
        setProducts(productList?.data || []);
        setCategories(
          (data?.data || []).map((cat: Category) => ({
            ...cat,
            status:
              typeof cat.status === 'boolean'
                ? cat.status
                : cat.status === 'active',
          }))
        );
        // setMenus(
        //   (menus?.data || []).map((menu: Menu) => ({
        //     ...menu,
        //     status:
        //       typeof menu.status === 'boolean'
        //         ? menu.status
        //         : menu.status === 'active',
        //   }))
        // );
        setSubCategories(
          (subCategories?.data || []).map((sc: SubCategory) => ({
            ...sc,
            status:
              typeof sc.status === 'boolean'
                ? sc.status
                : sc.status === 'active',
          }))
        );
      } catch {
        console.error('Failed to fetch categories:');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const [products, setProducts] = useState<Product[]>([]);

  // Filter products based on selected menu, category, and subcategory
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategoryId
      ? product.categoryId === parseInt(selectedCategoryId)
      : true;
    const matchesSubCategory = selectedSubCategoryId
      ? product.subCategoryId === parseInt(selectedSubCategoryId)
      : true;
    return matchesCategory && matchesSubCategory;
  });

  const handleCreateProduct = async (newProduct: Omit<Product, 'id'>) => {
    setLoading(true);
    try {
      const created = await createProduct(newProduct);
      setProducts((prev) => [...prev, created?.data]);
      setIsDialogOpen(false);
      toast.success('Item created successfully');
    } catch {
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    setLoading(true);
    try {
      const updated = await updateProduct(updatedProduct.id, updatedProduct);
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updated?.data : p))
      );
      setIsDialogOpen(false);
      setEditingProduct(null);
      toast.success('Item updated successfully');
    } catch {
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setLoading(true);
    try {
      // await apiDeleteSubCategory(productToDelete.id);
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      await deleteProduct(productToDelete.id);
      toast.success('Item deleted successfully');
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const cancelDeleteProduct = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const toggleStatus = async (product: Product) => {
    setLoading(true);
    try {
      await updateProduct(product.id, {
        ...product,
        status: !product.status,
      });
      setProducts(
        products.map((p) =>
          p.id === product.id ? { ...p, status: !p.status } : p
        )
      );
      toast.success('Item status updated');
    } catch {
      toast.error('Failed to update item status');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    // Get the ids of the filtered products (the visible ones)
    const filteredIds = filteredProducts.map((p) => p.id);
    // Find the corresponding indices in products
    const oldGlobalIndex = products.findIndex(
      (p) => p.id === filteredIds[oldIndex]
    );
    const newGlobalIndex = products.findIndex(
      (p) => p.id === filteredIds[newIndex]
    );
    if (oldGlobalIndex === -1 || newGlobalIndex === -1) return;

    // Make a copy and reorder
    const newProducts = [...products];
    const [removed] = newProducts.splice(oldGlobalIndex, 1);
    newProducts.splice(newGlobalIndex, 0, removed);

    // Update display orders for all
    const updatedProducts = newProducts.map((p, index) => ({
      ...p,
      displayOrder: index + 1,
    }));

    setProducts(updatedProducts);
  };

  if (loading) {
    console.log(loading);
    // return <>Loading...</>;
  }

  return (
    <div className='p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0 sm:space-x-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-xl sm:text-2xl font-semibold'>Items</h1>
          <p className='text-sm text-muted-foreground'>Manage your Items</p>
        </div>

        <div className='flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto'>
          <Select
            value={selectedCategoryId || ''}
            onValueChange={(value) => {
              setSelectedCategoryId(value === 'all' ? null : value);
              setSelectedSubCategoryId(null); // Reset subcategory filter
            }}
          >
            <SelectTrigger className='w-full sm:w-[180px]'>
              <SelectValue placeholder='Filter by Category' />
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='all'>All Categories</SelectItem>
              {categories.map((category) => (
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
              {subCategories.map((subCategory) => (
                <SelectItem key={subCategory.id} value={`${subCategory.id}`}>
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
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className='w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit' : 'Add'} Item
                </DialogTitle>
              </DialogHeader>
              <ProductForm
                categories={categories}
                subCategories={subCategories}
                initialData={editingProduct || undefined}
                onSubmit={async (data) => {
                  if (editingProduct) {
                    await handleEditProduct({ ...editingProduct, ...data });
                  } else {
                    await handleCreateProduct(data);
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
        subCategories={subCategories}
        categories={categories}
        // menus={menus}
        onEdit={(product) => {
          setEditingProduct(product);
          setIsDialogOpen(true);
        }}
        onDelete={handleDeleteProduct}
        onReorder={handleReorder}
        onStatusToggle={toggleStatus}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the product &quot;
              {productToDelete?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              className='px-4 py-2 rounded bg-gray-200 hover:bg-gray-300'
              onClick={cancelDeleteProduct}
              type='button'
            >
              Cancel
            </button>
            <button
              className='px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700'
              onClick={confirmDeleteProduct}
              type='button'
              disabled={loading}
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

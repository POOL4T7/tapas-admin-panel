'use client';

import { useEffect, useState } from 'react';
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
import { getAllCategories } from '@/lib/categories-api';
import { getAllMenus } from '@/lib/menu-api';
import { getAllSubCategories } from '@/lib/sub-categories-api';
import {
  createProduct,
  getAllProducts,
  updateProduct,
} from '@/lib/products-api';

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
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const data = await getAllCategories();
        const menus = await getAllMenus();
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
        setMenus(
          (menus?.data || []).map((menu: Menu) => ({
            ...menu,
            status:
              typeof menu.status === 'boolean'
                ? menu.status
                : menu.status === 'active',
          }))
        );
        setSubCategories(
          (subCategories?.data || []).map((sc: SubCategory) => ({
            ...sc,
            status:
              typeof sc.status === 'boolean'
                ? sc.status
                : sc.status === 'active',
          }))
        );
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const [products, setProducts] = useState<Product[]>([]);

  // Filter categories based on selected menu
  const filteredCategories = selectedMenuId
    ? categories.filter(
        (category) => Number(category.menuId) === Number(selectedMenuId)
      )
    : categories;

  // Filter subcategories based on selected menu and category
  const filteredSubCategories = subCategories.filter((subCategory) => {
    const matchesMenu = selectedMenuId
      ? filteredCategories.some(
          (cat) => Number(cat.id) === Number(subCategory.categoryId)
        )
      : true;
    const matchesCategory = selectedCategoryId
      ? Number(subCategory.categoryId) === Number(selectedCategoryId)
      : true;
    return matchesMenu && matchesCategory;
  });

  // Filter products based on selected menu, category, and subcategory
  const filteredProducts = products.filter((product) => {
    const matchesMenu = selectedMenuId
      ? filteredSubCategories.some(
          (sc) => Number(sc.id) === Number(product.subCategoryId)
        )
      : true;
    const matchesCategory = selectedCategoryId
      ? filteredSubCategories.some(
          (sc) =>
            Number(sc.id) === Number(product.subCategoryId) &&
            Number(sc.categoryId) === Number(selectedCategoryId)
        )
      : true;
    const matchesSubCategory = selectedSubCategoryId
      ? Number(product.subCategoryId) === Number(selectedSubCategoryId)
      : true;
    return matchesMenu && matchesCategory && matchesSubCategory;
  });

  const handleCreateProduct = async (newProduct: Omit<Product, 'id'>) => {
    setLoading(true);
    try {
      const created = await createProduct(newProduct);
      setProducts((prev) => [...prev, created?.data]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to create category:', error);
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
    } catch (error) {
      console.error('Failed to update product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    setLoading(true);
    try {
      // await apiDeleteSubCategory(category.id);
      setProducts(products.filter((p) => p.id !== product.id));
    } catch (error) {
      console.error('Failed to delete category:', error);
    } finally {
      setLoading(false);
    }
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
    } catch (error) {
      console.error('Failed to toggle product status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    console.log(loading);
    // return <>Loading...</>;
  }

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
                subCategories={subCategories}
                categories={categories}
                menus={menus}
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
        subCategories={filteredSubCategories}
        categories={filteredCategories}
        menus={menus}
        onEdit={(product) => {
          setEditingProduct(product);
          setIsDialogOpen(true);
        }}
        onDelete={handleDeleteProduct}
        onReorder={handleReorder}
        onStatusToggle={toggleStatus}
      />
    </div>
  );
}

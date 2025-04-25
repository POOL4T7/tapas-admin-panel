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
import { SubCategoryForm } from '@/components/sub-category/sub-category-form';
import { SubCategoryTable } from '@/components/sub-category/sub-category-table';
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
import {
  createSubCategory,
  getAllSubCategories,
  updateSubCategory,
} from '@/lib/sub-categories-api';

export default function SubCategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  // const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const data = await getAllCategories();
        // const menus = await getAllMenus();
        const subCategories = await getAllSubCategories();
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
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Filter subcategories based on selected category
  const filteredSubCategories = subCategories.filter((subCategory) => {
    const matchesCategory = selectedCategoryId
      ? Number(subCategory.categoryId) === Number(selectedCategoryId)
      : true;
    return matchesCategory;
  });

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
      subCategories.map((sc) => {
        const updatedSc = updatedSubCategories.find((u) => u.id === sc.id);
        return updatedSc ? updatedSc : sc;
      })
    );
  };

  const handleCreateSubCategory = async (
    newSubCategory: Omit<SubCategory, 'id'>
  ) => {
    setLoading(true);
    try {
      const created = await createSubCategory(newSubCategory);
      setSubCategories((prev) => [...prev, created?.data]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to create category:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleEditSubCategory = async (updatedCategory: SubCategory) => {
    setLoading(true);
    try {
      const updated = await updateSubCategory(
        String(updatedCategory.id),
        updatedCategory
      );
      setSubCategories((prev) =>
        prev.map((sc) => (sc.id === updatedCategory.id ? updated?.data : sc))
      );
      setIsDialogOpen(false);
      setEditingSubCategory(null);
    } catch (error) {
      console.error('Failed to update category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubCategory = async (subCategory: SubCategory) => {
    setLoading(true);
    try {
      // await apiDeleteSubCategory(category.id);
      setSubCategories(subCategories.filter((sc) => sc.id !== subCategory.id));
    } catch (error) {
      console.error('Failed to delete category:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (category: SubCategory) => {
    setLoading(true);
    try {
      await updateSubCategory(String(category.id), {
        ...category,
        status: !category.status,
      });
      setSubCategories(
        subCategories.map((sc) =>
          sc.id === category.id ? { ...sc, status: !sc.status } : sc
        )
      );
    } catch (error) {
      console.error('Failed to toggle category status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    console.log(loading);
    // return <>Loading...</>;
  }

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
            value={selectedCategoryId || ''}
            onValueChange={(value) =>
              setSelectedCategoryId(value === 'all' ? null : value)
            }
          >
            <SelectTrigger className='w-full sm:w-[180px]'>
              <SelectValue placeholder='Filter by Category' />
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='all'>All Categories</SelectItem>
              {categories?.map((category) => (
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
                // menus={menus || []}
                categories={categories || []}
                initialData={editingSubCategory}
                onSubmit={async (data) => {
                  if (editingSubCategory) {
                    await handleEditSubCategory(editingSubCategory);
                  } else {
                    await handleCreateSubCategory(data);
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
        categories={categories}
        // menus={menus}
        onEdit={(subCategory) => {
          setEditingSubCategory(subCategory);
          setIsDialogOpen(true);
        }}
        onDelete={handleDeleteSubCategory}
        onReorder={handleReorder}
        onStatusToggle={toggleStatus}
      />
    </div>
  );
}

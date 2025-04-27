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
  deleteSubCategory,
  getAllSubCategories,
  updateSubCategory,
} from '@/lib/sub-categories-api';
import { toast } from 'sonner';

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] =
    useState<SubCategory | null>(null);

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
      } catch {
        console.error('Failed to fetch categories');
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

  // const handleReorder = (oldIndex: number, newIndex: number) => {
  //   // Get the ids of the filtered subcategories (the visible ones)
  //   const filteredIds = filteredSubCategories.map((sc) => sc.id);
  //   // Find the corresponding indices in subCategories
  //   const oldGlobalIndex = subCategories.findIndex(
  //     (sc) => sc.id === filteredIds[oldIndex]
  //   );
  //   const newGlobalIndex = subCategories.findIndex(
  //     (sc) => sc.id === filteredIds[newIndex]
  //   );
  //   if (oldGlobalIndex === -1 || newGlobalIndex === -1) return;

  //   // Make a copy and reorder
  //   const newSubCategories = [...subCategories];
  //   const [removed] = newSubCategories.splice(oldGlobalIndex, 1);
  //   newSubCategories.splice(newGlobalIndex, 0, removed);

  //   // Update display orders for all
  //   const updatedSubCategories = newSubCategories.map((sc, index) => ({
  //     ...sc,
  //     displayOrder: index + 1,
  //   }));

  //   setSubCategories(updatedSubCategories);
  // };

  const handleCreateSubCategory = async (
    newSubCategory: Omit<SubCategory, 'id'>
  ) => {
    setLoading(true);
    try {
      const created = await createSubCategory(newSubCategory);
      setSubCategories((prev) => [...prev, created?.data]);
      setIsDialogOpen(false);
      toast.success('Sub-category created successfully');
    } catch {
      toast.error('Failed to create sub-category');
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
      toast.success('Sub-category updated successfully');
    } catch {
      toast.error('Failed to update sub-category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubCategory = async (subCategory: SubCategory) => {
    setSubCategoryToDelete(subCategory);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSubCategory = async () => {
    if (!subCategoryToDelete) return;
    setLoading(true);
    try {
      await deleteSubCategory(subCategoryToDelete.id);
      setSubCategories(
        subCategories.filter((sc) => sc.id !== subCategoryToDelete.id)
      );
      toast.success('Sub-category deleted successfully');
    } catch {
      toast.error('Failed to delete sub-category');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSubCategoryToDelete(null);
    }
  };

  const cancelDeleteSubCategory = () => {
    setDeleteDialogOpen(false);
    setSubCategoryToDelete(null);
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
      toast.success('Sub-category status updated');
    } catch {
      toast.error('Failed to update sub-category status');
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
        // onReorder={handleReorder}
        onStatusToggle={toggleStatus}
      />
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sub Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the sub category &quot;
              {subCategoryToDelete?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              className='px-4 py-2 rounded bg-gray-200 hover:bg-gray-300'
              onClick={cancelDeleteSubCategory}
              type='button'
            >
              Cancel
            </button>
            <button
              className='px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700'
              onClick={confirmDeleteSubCategory}
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

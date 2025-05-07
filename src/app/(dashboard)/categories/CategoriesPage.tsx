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
import { CategoryForm } from '@/components/category/category-form';
import { CategoryTable } from '@/components/category/category-table';
import { Category } from '@/types/category';
import { toast } from 'sonner';
// import { Menu } from '@/types/menu';
import {
  createCategory,
  updateCategory,
  getAllCategories,
  deleteCategory as apiDeleteCategory,
} from '@/lib/categories-api';
// import { getAllMenus } from '@/lib/menu-api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const data = await getAllCategories();
        // const menus = await getAllMenus();
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
      } catch {
        console.error('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const handleCreateCategory = async (newCategory: Omit<Category, 'id'>) => {
    setLoading(true);
    try {
      const created = await createCategory(newCategory);
      setCategories((prev) => [...prev, created?.data]);
      setIsDialogOpen(false);
      toast.success('Category created successfully');
    } catch {
      toast.error('Failed to create category');
    } finally {
      setLoading(false);
    }
  };
  const handleEditCategory = async (updatedCategory: Category) => {
    setLoading(true);
    try {
      const updated = await updateCategory(updatedCategory.id, updatedCategory);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === updatedCategory.id ? updated?.data : cat))
      );
      setIsDialogOpen(false);
      setEditingCategory(null);
      toast.success('Category updated successfully');
    } catch {
      toast.error('Failed to update category');
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteCategory = async (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setLoading(true);
    try {
      await apiDeleteCategory(categoryToDelete.id);
      setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
      toast.success('Category deleted successfully');
    } catch {
      toast.error('Failed to delete category');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const cancelDeleteCategory = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const toggleStatus = async (category: Category) => {
    setLoading(true);
    try {
      await updateCategory(category.id, {
        ...category,
        status: !category.status,
      });
      setCategories(
        categories.map((c) =>
          c.id === category.id ? { ...c, status: !c.status } : c
        )
      );
      toast.success('Category status updated');
    } catch {
      toast.error('Failed to update category status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0 sm:space-x-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-xl sm:text-2xl font-semibold mb-1'>Categories</h1>
          <p className='text-sm text-muted-foreground'>
            Manage your menu categories
          </p>
        </div>

        <div className='flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto'>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant='default'
                className='w-full sm:w-auto'
                onClick={() => setEditingCategory(null)}
              >
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className='w-[90%] max-w-md max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Edit' : 'Add'} Category
                </DialogTitle>
              </DialogHeader>
              <CategoryForm
                // menus={menus || []}
                initialData={editingCategory || undefined}
                onSubmit={(data) => {
                  if (editingCategory) {
                    handleEditCategory({ ...editingCategory, ...data });
                  } else {
                    handleCreateCategory(data);
                  }
                  setIsDialogOpen(false);
                  setEditingCategory(null);
                }}
                loading={loading}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CategoryTable
        categories={categories}
        // menus={menus}
        onEdit={(category) => {
          setEditingCategory(category);
          setIsDialogOpen(true);
        }}
        onDelete={handleDeleteCategory}
        onStatusToggle={toggleStatus}
        isLoading={loading}
      />
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category &quot;{categoryToDelete?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>e
            <button
              className='px-4 py-2 rounded bg-gray-200 hover:bg-gray-300'
              onClick={cancelDeleteCategory}
              type='button'
            >
              Cancel
            </button>
            <button
              className='px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700'
              onClick={confirmDeleteCategory}
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

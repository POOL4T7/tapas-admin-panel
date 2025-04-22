'use client';

import { useState, useEffect } from 'react';
import { Menu } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { MenuTable } from '@/components/menu/menu-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { MenuForm } from '@/components/menu/menu-form';
import { createMenu, updateMenu, getAllMenus } from '@/lib/menu-api';
import { Category } from '@/types/category';
import { SubCategory } from '@/types/sub-category';
import { getAllCategories } from '@/lib/categories-api';
import { getAllSubCategories } from '@/lib/sub-categories-api';

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch menus from the backend
    async function fetchMenus() {
      setLoading(true);
      try {
        const data = await getAllCategories();
        const menus = await getAllMenus();
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
        // Optionally handle error
        console.error('Failed to fetch menus:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenus();
  }, []);

  const handleCreateMenu = async (newMenu: Omit<Menu, 'id'>) => {
    setLoading(true);
    try {
      // Ensure status is boolean
      const created = await createMenu({
        ...newMenu,
        status: newMenu.status,
      });
      setMenus((prev) => [...prev, created?.data]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to create menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMenu = async (updatedMenu: Menu) => {
    setLoading(true);
    try {
      const updated = await updateMenu(updatedMenu.id, {
        ...updatedMenu,
        status: updatedMenu.status,
      });
      setMenus((prev) =>
        prev.map((menu) => (menu.id === updatedMenu.id ? updated?.data : menu))
      );
      setIsDialogOpen(false);
      setEditingMenu(null);
    } catch (error) {
      console.error('Failed to update menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenu = (menu: Menu) => {
    setMenus(menus.filter((m) => m.id !== menu.id));
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    const updatedMenus = [...menus];
    const [movedMenu] = updatedMenus.splice(oldIndex, 1);
    updatedMenus.splice(newIndex, 0, movedMenu);
    // Update display orders
    const reorderedMenus = updatedMenus.map((menu, index) => ({
      ...menu,
      displayOrder: index + 1,
    }));
    setMenus(reorderedMenus);
  };

  const toggleStatus = async (menu: Menu) => {
    try {
      await updateMenu(menu.id, {
        ...menu,
        status: !menu.status,
      });
      setMenus(
        menus.map((m) => (m.id === menu.id ? { ...m, status: !m.status } : m))
      );
    } catch (error) {
      console.error('Failed to toggle menu status:', error);
    }
  };

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Menus</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMenu(null)}>
              <Plus className='h-4 w-4 mr-2' />
              Add Menu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMenu ? 'Edit Menu' : 'Create Menu'}
              </DialogTitle>
            </DialogHeader>
            <MenuForm
              categories={categories}
              subCategories={subCategories}
              initialData={editingMenu || undefined}
              onSubmit={editingMenu ? handleEditMenu : handleCreateMenu}
              onCancel={() => {
                setEditingMenu(null);
                setIsDialogOpen(false);
              }}
              loading={loading}
            />
          </DialogContent>
        </Dialog>
      </div>
      <MenuTable
        menus={menus}
        onEdit={(menu) => {
          setEditingMenu(menu);
          setIsDialogOpen(true);
        }}
        onDelete={handleDeleteMenu}
        onReorder={handleReorder}
        onStatusToggle={toggleStatus}
      />
    </div>
  );
}

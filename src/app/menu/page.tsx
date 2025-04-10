'use client';

import { useState } from 'react';
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
import { MenuForm } from '@/components/menu/menu-form'; // You'll need to create this component

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([
    {
      id: 'menu1',
      name: 'Main Menu',
      description: 'Our primary dining menu',
      status: 'active',
      displayOrder: 1,
    },
    {
      id: 'menu2',
      name: 'Drinks Menu',
      description: 'Beverages and cocktails',
      status: 'active',
      displayOrder: 2,
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  const handleCreateMenu = (newMenu: Menu) => {
    const menuWithId = {
      ...newMenu,
      id: `menu_${Date.now()}`,
      displayOrder: menus.length + 1,
    };
    setMenus([...menus, menuWithId]);
    setIsDialogOpen(false);
  };

  const handleEditMenu = (updatedMenu: Menu) => {
    setMenus(
      menus.map((menu) => (menu.id === updatedMenu.id ? updatedMenu : menu))
    );
    setIsDialogOpen(false);
    setEditingMenu(null);
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
              initialData={editingMenu || undefined}
              onSubmit={editingMenu ? handleEditMenu : handleCreateMenu}
              onCancel={() => {
                setEditingMenu(null);
                setIsDialogOpen(false);
              }}
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
        onStatusToggle={() => {}}
      />
    </div>
  );
}

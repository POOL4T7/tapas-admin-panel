'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil } from 'lucide-react';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MenuForm } from '@/components/menu/menu-form';
import { Menu } from '@/types/menu';

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([
    {
      id: 'menu1',
      name: 'Breakfast Menu',
      description: 'Morning delights',
      status: 'active',
    },
    {
      id: 'menu2',
      name: 'Lunch Menu',
      description: 'Midday meals',
      status: 'inactive',
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  const handleCreateMenu = (newMenu: Menu) => {
    const menuWithId = {
      ...newMenu,
      id: `menu_${Date.now()}`,
    };
    setMenus([...menus, menuWithId]);
    setIsDialogOpen(false);
  };

  const handleEditMenu = (updatedMenu: Menu) => {
    setMenus(
      menus.map((menu) => (menu.id === updatedMenu.id ? updatedMenu : menu))
    );
    setEditingMenu(null);
    setIsDialogOpen(false);
  };

  const handleDeleteMenu = (id: string) => {
    setMenus(menus.filter((menu) => menu.id !== id));
  };

  const handleStatusToggle = (id: string, isActive: boolean) => {
    setMenus(
      menus.map((menu) =>
        menu.id === id
          ? { ...menu, status: isActive ? 'active' : 'inactive' }
          : menu
      )
    );
  };

  const columns: ColumnDef<Menu>[] = [
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
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div>{row.getValue('description') || 'No description'}</div>
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
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const menu = row.original;
        return (
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => {
                setEditingMenu(menu);
                setIsDialogOpen(true);
              }}
            >
              <Pencil className='h-4 w-4' />
            </Button>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => handleDeleteMenu(menu.id || '')}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Menus</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMenu(null)}>
              <Plus className='mr-2 h-4 w-4' /> Create Menu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMenu ? 'Edit Menu' : 'Create New Menu'}
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

      <DataTable
        columns={columns}
        data={menus}
        onStatusToggle={handleStatusToggle}
      />
    </div>
  );
}

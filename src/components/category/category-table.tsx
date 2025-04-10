import { Category } from '@/types/category';
import { Menu } from '@/types/menu';
import { DraggableTable } from '@/components/ui/draggable-table';
import { DraggableRow } from '@/components/ui/draggable-row';
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Menu as MenuIcon, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CategoryTableProps {
  categories: Category[];
  menus: Menu[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
  onStatusToggle: (category: Category, status: boolean) => void;
}

export function CategoryTable({
  categories,
  menus,
  onEdit,
  onDelete,
  onReorder,
  onStatusToggle,
}: CategoryTableProps) {
  const headers = ['S.No', 'Name', 'Menu', 'Description', 'Status', 'Actions'];

  return (
    <TooltipProvider>
      <div className='rounded-md shadow-sm'>
        <DraggableTable
          items={categories}
          onReorder={onReorder}
          headers={headers}
        >
          {categories.map((category, index) => {
            const menu = menus.find((m) => m.id === category.menuId);

            return (
              <DraggableRow key={category.id} id={category.id}>
                <TableCell className='text-center font-mono text-sm'>
                  {index + 1}
                </TableCell>
                <TableCell className='font-medium'>{category.name}</TableCell>
                <TableCell>{menu?.name || 'Unknown Menu'}</TableCell>
                <TableCell className='max-w-[300px]'>
                  {category.description ? (
                    <div className='flex items-center'>
                      <span className='truncate'>{category.description}</span>
                      {category.description.length > 40 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-6 w-6 ml-1'
                            >
                              <Info className='h-3 w-3' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className='max-w-md'>
                            {category.description}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  ) : (
                    <span className='text-muted-foreground text-sm italic'>
                      No description
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger>
                      <Switch
                        checked={category.status === 'active'}
                        onCheckedChange={(checked) =>
                          onStatusToggle(category, checked)
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      {category.status === 'active' ? 'Deactivate' : 'Activate'}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-1'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => onEdit(category)}
                          className='h-8 w-8 rounded-full hover:bg-blue-50 hover:text-blue-600'
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Category</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => onDelete(category)}
                          className='h-8 w-8 rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-600'
                        >
                          <Trash className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Category</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </DraggableRow>
            );
          })}
        </DraggableTable>
        {categories.length === 0 && (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='rounded-full bg-slate-100 p-3 mb-3'>
              <MenuIcon className='h-6 w-6 text-slate-400' />
            </div>
            <h3 className='text-lg font-medium'>No categories found</h3>
            <p className='text-sm text-muted-foreground mt-1'>
              Create a category to get started
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

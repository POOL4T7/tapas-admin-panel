import { SubCategory } from '@/types/sub-category';
import { Category } from '@/types/category';
import { Menu } from '@/types/menu';
import { DraggableTable } from '@/components/ui/draggable-table';
import { DraggableRow } from '@/components/ui/draggable-row';
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Layers } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SubCategoryTableProps {
  subCategories: SubCategory[];
  categories: Category[];
  menus: Menu[];
  onEdit: (subCategory: SubCategory) => void;
  onDelete: (subCategory: SubCategory) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
  onStatusToggle: (subCategory: SubCategory, status: boolean) => void;
}

export function SubCategoryTable({
  subCategories,
  categories,
  menus,
  onEdit,
  onDelete,
  onReorder,
  onStatusToggle,
}: SubCategoryTableProps) {
  const headers = ['S.No', 'Name', 'Menu', 'Category', 'Status', 'Actions'];

  return (
    <TooltipProvider>
      <div className='rounded-md shadow-sm'>
        <DraggableTable
          items={subCategories}
          onReorder={onReorder}
          headers={headers}
        >
          {subCategories.map((subCategory, index) => {
            const category = categories.find(
              (c) => c.id === subCategory.categoryId
            );
            const menu = category
              ? menus.find((m) => m.id === category.menuId)
              : null;

            return (
              <DraggableRow key={subCategory.id} id={subCategory.id}>
                <TableCell className='text-center font-mono text-sm'>
                  {index + 1}
                </TableCell>
                <TableCell className='font-medium'>
                  {subCategory.name}
                </TableCell>
                <TableCell>{menu?.name || 'Unassigned'}</TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Layers className='h-4 w-4 text-muted-foreground' />
                    {category?.name || 'Uncategorized'}
                  </div>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger>
                      <Switch
                        checked={subCategory.status === 'active'}
                        onCheckedChange={(checked) =>
                          onStatusToggle(subCategory, checked)
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      {subCategory.status === 'active'
                        ? 'Deactivate'
                        : 'Activate'}
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
                          onClick={() => onEdit(subCategory)}
                          className='h-8 w-8 rounded-full hover:bg-blue-50 hover:text-blue-600'
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Sub-Category</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => onDelete(subCategory)}
                          className='h-8 w-8 rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-600'
                        >
                          <Trash className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Sub-Category</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </DraggableRow>
            );
          })}
        </DraggableTable>
        {subCategories.length === 0 && (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='rounded-full bg-slate-100 p-3 mb-3'>
              <Layers className='h-6 w-6 text-slate-400' />
            </div>
            <h3 className='text-lg font-medium'>No sub-categories found</h3>
            <p className='text-sm text-muted-foreground mt-1'>
              Create a sub-category to get started
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

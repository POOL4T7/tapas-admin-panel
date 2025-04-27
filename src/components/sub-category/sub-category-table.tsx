import { SubCategory } from '@/types/sub-category';
import { Category } from '@/types/category';
// import { Menu } from '@/types/menu';
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
  // menus: Menu[];
  onEdit: (subCategory: SubCategory) => void;
  onDelete: (subCategory: SubCategory) => void;
  onStatusToggle: (subCategory: SubCategory) => void;
}

export function SubCategoryTable({
  subCategories,
  onEdit,
  onDelete,
  onStatusToggle,
}: SubCategoryTableProps) {
  const headers = ['S.No', 'Name', 'Status', 'Actions'];

  return (
    <TooltipProvider>
      <div className='rounded-lg border  overflow-hidden bg-white'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subCategories.map((subCategory, index) => {
              return (
                <tr
                  key={subCategory.id}
                  className='[&>td]:py-1 hover:bg-gray-50 transition-colors duration-150'
                >
                  <TableCell className=' font-mono text-xs border-b border-gray-100'>
                    <span className='ml-5'>{index + 1}</span>
                  </TableCell>
                  <TableCell className='font-normal text-sm border-b border-gray-100'>
                    {subCategory.name}
                  </TableCell>
                  {/* <TableCell>{menu?.name || 'Unassigned'}</TableCell> */}

                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                        <Switch
                          checked={subCategory.status}
                          onCheckedChange={() => onStatusToggle(subCategory)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        {subCategory.status ? 'Deactivate' : 'Activate'}
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
                            className='h-8 w-8 rounded-full hover:bg-gray-50 hover:text-gray-600'
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
                </tr>
              );
            })}
          </tbody>
        </table>
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

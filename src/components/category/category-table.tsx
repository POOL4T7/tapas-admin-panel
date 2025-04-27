import { Category } from '@/types/category';
// import { Menu } from '@/types/menu';
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
  // menus: Menu[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onStatusToggle: (category: Category) => void;
}

export function CategoryTable({
  categories,
  onEdit,
  onDelete,
  onStatusToggle,
}: CategoryTableProps) {
  const headers = ['S.No', 'Name', 'Description', 'Status', 'Actions'];

  return (
    <TooltipProvider>
      <div className='rounded-lg border overflow-hidden bg-white w-full'>
        <div className='overflow-x-auto w-full'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                {headers.map((header, idx) => (
                  <th
                    key={header}
                    className={
                      'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' +
                      (idx === 0 || header === 'Status' || header === 'Actions'
                        ? ' whitespace-nowrap'
                        : '')
                    }
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => {
                return (
                  <tr
                    key={category.id}
                    className='[&>td]:py-1 hover:bg-gray-50 transition-colors duration-150'
                  >
                    <TableCell className='font-mono text-xs border-b border-gray-100 whitespace-nowrap'>
                      <span className='ml-5'>{index + 1}</span>
                    </TableCell>
                    <TableCell className='font-normal text-sm border-b border-gray-100'>
                      {category.name}
                    </TableCell>

                    <TableCell className='max-w-[300px] text-sm border-b border-gray-100'>
                      {category.description ? (
                        <div className='flex items-center'>
                          <span className='truncate'>
                            {category.description}
                          </span>
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
                    <TableCell className='border-b border-gray-100 whitespace-nowrap'>
                      <Tooltip>
                        <TooltipTrigger>
                          <Switch
                            checked={category.status}
                            onCheckedChange={() => onStatusToggle(category)}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {category.status ? 'Deactivate' : 'Activate'}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className='border-b border-gray-100 whitespace-nowrap'>
                      <div className='flex items-center gap-1'>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => onEdit(category)}
                              className='h-8 w-8 rounded-full hover:bg-gray-50 hover:text-gray-600'
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
                  </tr>
                );
              })}
            </tbody>
          </table>
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
      </div>
    </TooltipProvider>
  );
}

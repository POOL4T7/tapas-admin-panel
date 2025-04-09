import { SubCategory } from '@/types/sub-category';
import { Category } from '@/types/category';
import { DraggableTable } from '@/components/ui/draggable-table';
import { DraggableRow } from '@/components/ui/draggable-row';
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, ListTree, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SubCategoryTableProps {
  subCategories: SubCategory[];
  categories: Category[];
  onEdit: (subCategory: SubCategory) => void;
  onDelete: (subCategory: SubCategory) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
}

export function SubCategoryTable({
  subCategories,
  categories,
  onEdit,
  onDelete,
  onReorder,
}: SubCategoryTableProps) {
  const headers = ['Name', 'Category', 'Description', 'Status', 'Order', 'Actions'];

  return (
    <TooltipProvider>
      <div className='rounded-md shadow-sm'>
        <DraggableTable
          items={subCategories}
          onReorder={onReorder}
          headers={headers}
        >
          {subCategories.map((subCategory) => {
            const category = categories.find((c) => c.id === subCategory.categoryId);

            return (
              <DraggableRow key={subCategory.id} id={subCategory.id}>
                <TableCell className='font-medium'>{subCategory.name}</TableCell>
                <TableCell>
                  <Badge
                    variant='outline'
                    className='flex items-center gap-1 px-2 py-1'
                  >
                    <ListTree className='h-3 w-3' />
                    {category?.name || 'Unknown Category'}
                  </Badge>
                </TableCell>
                <TableCell className='max-w-[300px]'>
                  {subCategory.description ? (
                    <div className='flex items-center'>
                      <span className='truncate'>{subCategory.description}</span>
                      {subCategory.description.length > 40 && (
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
                            {subCategory.description}
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
                  <Badge
                    variant={subCategory.status === 'active' ? 'success' : 'secondary'}
                    className={`w-fit px-2 py-1 ${
                      subCategory.status === 'active'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {subCategory.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className='text-center font-mono text-sm'>
                  {subCategory.displayOrder}
                </TableCell>
                <TableCell>
                  <div className='flex items-center justify-end gap-1'>
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
                      <TooltipContent>Edit Sub Category</TooltipContent>
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
                      <TooltipContent>Delete Sub Category</TooltipContent>
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
              <ListTree className='h-6 w-6 text-slate-400' />
            </div>
            <h3 className='text-lg font-medium'>No sub categories found</h3>
            <p className='text-sm text-muted-foreground mt-1'>
              Create a sub category to get started
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

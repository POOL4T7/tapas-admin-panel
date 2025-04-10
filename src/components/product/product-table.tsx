import { Product } from '@/types/product';
import { SubCategory } from '@/types/sub-category';
import { Category } from '@/types/category';
import { Menu } from '@/types/menu';
import { DraggableTable } from '@/components/ui/draggable-table';
import { DraggableRow } from '@/components/ui/draggable-row';
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Package } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ProductTableProps {
  products: Product[];
  subCategories: SubCategory[];
  categories: Category[];
  menus: Menu[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
  onStatusToggle: (product: Product, status: boolean) => void;
}

export function ProductTable({
  products,
  subCategories,
  categories,
  menus,
  onEdit,
  onDelete,
  onReorder,
  onStatusToggle,
}: ProductTableProps) {
  const headers = [
    'S.No',
    'Name',
    'Menu',
    'Category',
    'Sub Category',
    'Price',
    'Status',
    'Actions',
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <TooltipProvider>
      <div className='rounded-md shadow-sm'>
        <DraggableTable
          items={products}
          onReorder={onReorder}
          headers={headers}
        >
          {products.map((product, index) => {
            const subCategory = subCategories.find(
              (sc) => sc.id === product.subCategoryId
            );
            const category = subCategory 
              ? categories.find((c) => c.id === subCategory.categoryId) 
              : null;
            const menu = category 
              ? menus.find((m) => m.id === category.menuId) 
              : null;

            return (
              <DraggableRow key={product.id} id={product.id}>
                <TableCell className='text-center font-mono text-sm'>
                  {index + 1}
                </TableCell>
                <TableCell className='font-medium'>{product.name}</TableCell>
                <TableCell>{menu?.name || 'Unassigned'}</TableCell>
                <TableCell>{category?.name || 'Unassigned'}</TableCell>
                <TableCell>{subCategory?.name || 'Uncategorized'}</TableCell>
                <TableCell className='font-mono'>
                  {formatPrice(product.price)}
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger>
                      <Switch
                        checked={product.status === 'active'}
                        onCheckedChange={(checked) =>
                          onStatusToggle(product, checked)
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      {product.status === 'active' ? 'Deactivate' : 'Activate'}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <div className='flex items-center justify-end gap-1'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => onEdit(product)}
                          className='h-8 w-8 rounded-full hover:bg-blue-50 hover:text-blue-600'
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Product</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => onDelete(product)}
                          className='h-8 w-8 rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-600'
                        >
                          <Trash className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Product</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </DraggableRow>
            );
          })}
        </DraggableTable>
        {products.length === 0 && (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='rounded-full bg-slate-100 p-3 mb-3'>
              <Package className='h-6 w-6 text-slate-400' />
            </div>
            <h3 className='text-lg font-medium'>No products found</h3>
            <p className='text-sm text-muted-foreground mt-1'>
              Create a product to get started
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

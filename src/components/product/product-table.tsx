import { Product } from '@/types/product';
import { SubCategory } from '@/types/sub-category';
import { Category } from '@/types/category';
// import { Menu } from '@/types/menu';
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

  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onStatusToggle: (product: Product, status: boolean) => void;
}

export function ProductTable({
  products,

  onEdit,
  onDelete,
  onStatusToggle,
}: ProductTableProps) {
  const headers = ['S.No', 'Name', 'Price', 'Status', 'Actions'];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

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
            {products.map((product, index) => {
              return (
                <tr
                  key={product.id}
                  className='[&>td]:py-1 hover:bg-gray-50 transition-colors duration-150'
                >
                  <TableCell className=' font-mono text-xs border-b border-gray-100'>
                    <span className='ml-5'>{index + 1}</span>
                  </TableCell>
                  <TableCell className='font-normal text-sm border-b border-gray-100'>
                    {product.name}
                  </TableCell>
                  <TableCell className='font-mono text-xs border-b border-gray-100'>
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell className='border-b border-gray-100'>
                    <Tooltip>
                      <TooltipTrigger>
                        <Switch
                          checked={product.status}
                          onCheckedChange={(checked) =>
                            onStatusToggle(product, checked)
                          }
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        {product.status ? 'Deactivate' : 'Activate'}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className='border-b border-gray-100'>
                    <div className='flex items-center gap-1'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onEdit(product)}
                            className='h-8 w-8 rounded-full hover:bg-gray-50 hover:text-gray-600'
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
                </tr>
              );
            })}
          </tbody>
        </table>
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

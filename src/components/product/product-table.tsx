import { Product } from '@/types/product';
import { DraggableTable } from '@/components/ui/draggable-table';
import { DraggableRow } from '@/components/ui/draggable-row';
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Package, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onReorder,
}: ProductTableProps) {
  const headers = ['Image', 'Name', 'Description', 'Price', 'Status', 'Order', 'Actions'];

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
          {products.map((product) => (
            <DraggableRow key={product.id} id={product.id}>
              <TableCell>
                {product.image ? (
                  <div className='relative h-10 w-10 rounded-md overflow-hidden'>
                    <Image
                      src={typeof product.image === 'string' ? product.image : URL.createObjectURL(product.image)}
                      alt={product.name}
                      width={40}
                      height={40}
                      className='object-cover'
                    />
                  </div>
                ) : (
                  <div className='h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center'>
                    <Package className='h-5 w-5 text-slate-400' />
                  </div>
                )}
              </TableCell>
              <TableCell className='font-medium'>{product.name}</TableCell>
              <TableCell className='max-w-[300px]'>
                {product.description ? (
                  <div className='flex items-center'>
                    <span className='truncate'>{product.description}</span>
                    {product.description.length > 40 && (
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
                          {product.description}
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
              <TableCell className='font-mono'>
                {formatPrice(product.price)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={product.status === 'active' ? 'success' : 'secondary'}
                  className={`w-fit px-2 py-1 ${
                    product.status === 'active'
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {product.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className='text-center font-mono text-sm'>
                {product.displayOrder}
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
          ))}
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

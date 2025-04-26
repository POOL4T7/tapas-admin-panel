'use client';
import { getProductsByMenu, updateProductByMenuId } from '@/lib/products-api';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MenuProduct } from '@/types/product';
import { DraggableTable } from '@/components/ui/draggable-table';
import { DraggableRow } from '@/components/ui/draggable-row';
import { TableCell } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Package } from 'lucide-react';
import { toast } from 'sonner';

const Page = () => {
  const { id } = useParams();
  const [products, setProducts] = useState<MenuProduct[]>([]);
  const headers = [
    'S.No',
    'Name',
    'category',
    'subcategory',
    'Price',
    'Status',
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductsByMenu(id as string);
        setProducts(data.data);
        // toast.success('Products loaded successfully');
      } catch {
        toast.error('Failed to load products');
      }
    };
    fetchData();
  }, [id]);

  const handleReorder = (oldIndex: number, newIndex: number) => {
    // Get the ids of the filtered products (the visible ones)
    const filteredIds = products.map((p) => p.item.id);
    // Find the corresponding indices in products
    const oldGlobalIndex = products.findIndex(
      (p) => p.item.id === filteredIds[oldIndex]
    );
    const newGlobalIndex = products.findIndex(
      (p) => p.item.id === filteredIds[newIndex]
    );
    if (oldGlobalIndex === -1 || newGlobalIndex === -1) return;

    // Make a copy and reorder
    const newProducts = [...products];
    const [removed] = newProducts.splice(oldGlobalIndex, 1);
    newProducts.splice(newGlobalIndex, 0, removed);

    // Update display orders for all
    const updatedProducts = newProducts.map((p, index) => ({
      ...p,
      displayOrder: index + 1,
    }));

    setProducts(updatedProducts);
    toast.success('Products reordered');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const toggleStatus = async (
    menuId: number,
    checked: boolean,
    productId: number
  ) => {
    try {
      await updateProductByMenuId(String(menuId), [
        {
          itemId: productId,
          active: checked,
        },
      ]);
      setProducts(
        products.map((p) =>
          p.item.id === productId
            ? { ...p, item: { ...p.item, status: !p.item.status } }
            : p
        )
      );
      toast.success('Product status updated');
    } catch {
      toast.error('Failed to update product status');
    }
  };

  return (
    <div>
      <h1 className='text-2xl font-bold'>
        List of items for menu {products?.[0]?.menuName}
      </h1>

      <TooltipProvider>
        <div className='rounded-md shadow-sm'>
          <DraggableTable
            items={products.map((p) => ({ id: String(p.item.id) }))}
            onReorder={handleReorder}
            headers={headers}
          >
            {products.map((product, index) => {
              return (
                <DraggableRow
                  key={product.item.id}
                  id={String(product.item.id)}
                >
                  <TableCell className='text-center font-mono text-sm'>
                    {index + 1}
                  </TableCell>
                  <TableCell className='font-medium'>
                    {product.item.name}
                  </TableCell>
                  <TableCell className='font-medium'>
                    {product.categoryName}
                  </TableCell>
                  <TableCell className='font-medium'>
                    {product.subCategoryName}
                  </TableCell>
                  <TableCell className='font-mono'>
                    {formatPrice(product.item.price)}
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                        <Switch
                          checked={product.item.status}
                          onCheckedChange={(checked) =>
                            toggleStatus(
                              product.menuId,
                              checked,
                              product.item.id
                            )
                          }
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        {product.item.status ? 'Deactivate' : 'Activate'}
                      </TooltipContent>
                    </Tooltip>
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
    </div>
  );
};

export default Page;

'use client';
import {
  getProductsByMenu,
  updateMenuEntityDisplayOrder,
  updateProductByMenuId,
} from '@/lib/products-api';
import { useParams } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Package, Loader2, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

const Page = () => {
  const { id } = useParams();
  const [products, setProducts] = useState<MenuProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedSubCategoryId, setSelectedSubCategoryId] =
    useState<string>('');

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
      setLoading(true);
      try {
        const data = await getProductsByMenu(id as string);
        // const sortedProducts = data.data.sort(
        //   (a: MenuProduct, b: MenuProduct) => {
        //     if (a.categoryDisplayOrder !== b.categoryDisplayOrder) {
        //       return a.categoryDisplayOrder - b.categoryDisplayOrder;
        //     }
        //     if (a.subCategoryDisplayOrder !== b.subCategoryDisplayOrder) {
        //       return a.subCategoryDisplayOrder - b.subCategoryDisplayOrder;
        //     }
        //     return a.itemDisplayOrder - b.itemDisplayOrder;
        //   }
        // );
        setProducts(data.data);
        // toast.success('Products loaded successfully');
      } catch {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const uniqueCategories = useMemo(() => {
    if (!products) return [];
    const categoryMap = new Map<string, { id: string; name: string }>();
    products.forEach((product: MenuProduct) => {
      if (product.category && product.category.id && product.category.name) {
        categoryMap.set(String(product.category.id), {
          id: String(product.category.id),
          name: product.category.name,
        });
      }
    });
    return Array.from(categoryMap.values());
  }, [products]);

  const uniqueSubCategories = useMemo(() => {
    if (!products || !selectedCategoryId) return [];
    const subCategoryMap = new Map<string, { id: string; name: string }>();
    products
      .filter(
        (product: MenuProduct) =>
          String(product.category.id) === selectedCategoryId
      )
      .forEach((product: MenuProduct) => {
        if (
          product.subCategory &&
          product.subCategory.id &&
          product.subCategory.name
        ) {
          subCategoryMap.set(String(product.subCategory.id), {
            id: String(product.subCategory.id),
            name: product.subCategory.name,
          });
        }
      });
    return Array.from(subCategoryMap.values());
  }, [products, selectedCategoryId]);

  const filteredProducts = useMemo(() => {
    return products.filter((product: MenuProduct) => {
      const categoryMatch = selectedCategoryId
        ? String(product.category.id) === selectedCategoryId
        : true;
      const subCategoryMatch = selectedSubCategoryId
        ? String(product.subCategory.id) === selectedSubCategoryId
        : true;
      return categoryMatch && subCategoryMatch;
    });
  }, [products, selectedCategoryId, selectedSubCategoryId]);

  const handleReorder = async (oldIndex: number, newIndex: number) => {
    // Get the ids of the filtered products (the visible ones)
    const reorderedFilteredProducts = [...filteredProducts];
    const [removedItem] = reorderedFilteredProducts.splice(oldIndex, 1);
    reorderedFilteredProducts.splice(newIndex, 0, removedItem);

    // Create a map of id to new display order for quick lookup
    const newOrderMap = new Map<number, number>();
    reorderedFilteredProducts.forEach((p, index) => {
      newOrderMap.set(p.item.id, index + 1); // DRAFT: This assumes displayOrder is 1-based for filtered list
    });

    // Update the original products array while preserving the order of non-filtered items
    let filteredItemCounter = 0;
    const updatedProducts = products.map((p: MenuProduct) => {
      if (
        filteredProducts.find((fp: MenuProduct) => fp.item.id === p.item.id)
      ) {
        // This item is in the filtered list, find its new order
        const orderedItem = reorderedFilteredProducts[filteredItemCounter++];
        return {
          ...orderedItem,
          // DRAFT: Need to decide how to manage itemDisplayOrder if it's global vs category-specific
          // For now, let's assume itemDisplayOrder is what we are reordering locally
          itemDisplayOrder:
            newOrderMap.get(orderedItem.item.id) ||
            orderedItem.itemDisplayOrder,
        };
      } else {
        return p; // Item not in filtered list, keep its existing order/data
      }
    });

    setProducts(updatedProducts); // Update the main products list

    const itemsToUpdateForAPI = reorderedFilteredProducts.map(
      (p: MenuProduct, index) => ({
        menuId: id?.toString() || '',
        itemId: Number(p.item.id),
        itemDisplayOrder: index + 1,
        categoryId: Number(p.category.id),
        subCategoryId: Number(p.subCategory.id), // Corrected to use product.isActive
      })
    );

    if (itemsToUpdateForAPI.length > 0) {
      await updateMenuEntityDisplayOrder(itemsToUpdateForAPI);
      toast.success('Menu Items order updated successfully!');
    } else {
      toast.info('No changes in order to save.');
    }
  };

  // const updateProductOrderInMenu = async (
  //   itemsToUpdate: { itemId: number; displayOrder: number; active: boolean }[]
  // ) => {
  //   if (!id || typeof id !== 'string') {
  //     toast.error('Menu ID is missing.');
  //     return;
  //   }
  //   try {
  //     await updateProductByMenuId(id, itemsToUpdate);
  //     toast.success('Product order updated successfully!');
  //   } catch (error) {
  //     console.error('Failed to update product order:', error);
  //     toast.error('Failed to update product order.');
  //   }
  // };

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
      toast.success('Item status updated');
    } catch {
      toast.error('Failed to update item status');
    }
  };

  return (
    <div className='p-6'>
      <div className='flex flex-wrap justify-between items-center gap-4 mb-6'>
        <h1 className='text-2xl font-semibold'>
          Items for menu:{' '}
          <span className='text-blue-400'>{products?.[0]?.menuName}</span>
        </h1>

        {/* Filters Section - moved to be a flex child */}
        <div className='flex gap-4 items-center'>
          <div className='flex items-center gap-2'>
            <Filter className='h-5 w-5 text-muted-foreground' />
            <span className='font-medium text-sm'>Filter by:</span>
          </div>
          <Select
            value={selectedCategoryId}
            onValueChange={(value) => {
              setSelectedCategoryId(value === 'all' ? '' : value);
              setSelectedSubCategoryId(''); // Reset sub-category when category changes
            }}
          >
            <SelectTrigger className='w-full sm:w-[180px] text-xs h-9'>
              <SelectValue placeholder='All Categories' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Categories</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedSubCategoryId}
            onValueChange={(value) =>
              setSelectedSubCategoryId(value === 'all' ? '' : value)
            }
            disabled={!selectedCategoryId || uniqueSubCategories.length === 0}
          >
            <SelectTrigger className='w-full sm:w-[180px] text-xs h-9'>
              <SelectValue placeholder='All Sub-Categories' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Sub-Categories</SelectItem>
              {uniqueSubCategories.map((subCategory) => (
                <SelectItem key={subCategory.id} value={String(subCategory.id)}>
                  {subCategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <TooltipProvider>
        <div className='rounded-md shadow-sm'>
          <DraggableTable
            items={filteredProducts.map((p: MenuProduct) => ({
              id: String(p.item.id),
            }))}
            onReorder={handleReorder}
            headers={headers}
            // isDragDisabled={loading || filteredProducts.length <= 1}
          >
            {loading ? (
              <tr>
                <TableCell
                  colSpan={headers.length}
                  className='h-24 text-center'
                >
                  <div className='flex items-center justify-center'>
                    <Loader2 className='h-8 w-8 animate-spin text-primary' />
                  </div>
                </TableCell>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <TableCell
                  colSpan={headers.length}
                  className='h-24 text-center'
                >
                  <div className='flex flex-col items-center justify-center py-12 text-center'>
                    <div className='rounded-full bg-slate-100 p-3 mb-3'>
                      <Package className='h-6 w-6 text-slate-400' />
                    </div>
                    <h3 className='text-lg font-medium'>No products found</h3>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Add products to this menu to see them here.
                    </p>
                  </div>
                </TableCell>
              </tr>
            ) : (
              filteredProducts.map((product: MenuProduct, index) => {
                return (
                  <DraggableRow
                    key={product.item.id}
                    id={String(product.item.id)}
                    isDragDisabled={selectedSubCategoryId === ''}
                  >
                    <TableCell className='text-center font-mono text-sm'>
                      {index + 1}
                    </TableCell>
                    <TableCell className='font-medium'>
                      {product.item.name}
                    </TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell>{product.subCategory.name}</TableCell>
                    <TableCell>{formatPrice(product.item.price)}</TableCell>
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
              })
            )}
          </DraggableTable>
          {/* "No products found" message is now handled inside the table */}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Page;

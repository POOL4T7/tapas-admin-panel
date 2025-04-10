'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product } from '@/types/product';
import { SubCategory } from '@/types/sub-category';
import { Menu } from '@/types/menu';
import { Category } from '@/types/category';
import { useState, useEffect, useMemo } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import Image from 'next/image';

const productSchema = z.object({
  menuId: z.string({ required_error: 'Please select a menu' }),
  categoryId: z.string({ required_error: 'Please select a category' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  subCategoryId: z.string({ required_error: 'Please select a sub category' }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'Price must be non-negative' }),
  displayOrder: z.coerce
    .number()
    .min(0, { message: 'Display order must be non-negative' }),
  status: z.enum(['active', 'inactive']),
  image: z.union([z.instanceof(File).optional(), z.string().optional()]),
});

interface ProductFormProps {
  initialData?: Product;
  menus: Menu[];
  categories: Category[];
  subCategories: SubCategory[];
  onSubmit: (data: Product) => void;
  onCancel?: () => void;
}

export function ProductForm({
  initialData,
  menus,
  categories,
  subCategories,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      menuId: initialData?.menuId || '',
      categoryId: initialData?.categoryId || '',
      name: initialData?.name || '',
      subCategoryId: initialData?.subCategoryId || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      displayOrder: initialData?.displayOrder || 0,
      status: initialData?.status || 'active',
      image: initialData?.image,
    },
  });

  // Memoized filtered categories based on selected menu
  const filteredCategories = useMemo(() => {
    const menuId = form.getValues('menuId');
    return categories.filter((cat) => cat.menuId === menuId);
  }, [form, categories]);

  // Memoized filtered subcategories based on selected category
  const filteredSubCategories = useMemo(() => {
    const categoryId = form.getValues('categoryId');
    return subCategories.filter((sub) => sub.categoryId === categoryId);
  }, [form, subCategories]);

  // Reset category and subcategory when menu changes
  useEffect(() => {
    const menuId = form.getValues('menuId');
    if (menuId) {
      form.setValue('categoryId', '');
      form.setValue('subCategoryId', '');
    }
  }, [form]);

  // Reset subcategory when category changes
  useEffect(() => {
    const categoryId = form.getValues('categoryId');
    if (categoryId) {
      form.setValue('subCategoryId', '');
    }
  }, [form]);
 
  const handleSubmit = (values: z.infer<typeof productSchema>) => {
    onSubmit({
      ...values,
      id: initialData?.id || '', // Preserve existing ID if editing
      description: values.description || '', // Ensure description is always a string
      image: values.image, // Pass the uploaded file
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Set file in form
      form.setValue('image', file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setValue('image', undefined);
    // Reset file input
    if (form.getValues('image')) {
      const fileInput = document.getElementById(
        'product-image'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='menuId'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>Menu</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a menu' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {menus.map((menu) => (
                    <SelectItem key={menu.id} value={menu.id || ''}>
                      {menu.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className='text-red-500 text-sm' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='categoryId'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!form.getValues('menuId')}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id || ''}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className='text-red-500 text-sm' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='subCategoryId'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>Sub Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!form.getValues('categoryId')}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a sub category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredSubCategories.map((subCategory) => (
                    <SelectItem
                      key={subCategory.id}
                      value={subCategory.id || ''}
                    >
                      {subCategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className='text-red-500 text-sm' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>Product Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter product name'
                  {...field}
                  className='bg-white border-gray-300 focus:border-primary focus:ring-primary'
                />
              </FormControl>
              <FormMessage className='text-red-500 text-sm' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Enter product description'
                  {...field}
                  rows={3}
                  className='bg-white border-gray-300 focus:border-primary focus:ring-primary resize-none'
                />
              </FormControl>
              <FormMessage className='text-red-500 text-sm' />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold'>Price</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter product price'
                    {...field}
                    className='bg-white border-gray-300 focus:border-primary focus:ring-primary'
                  />
                </FormControl>
                <FormMessage className='text-red-500 text-sm' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='displayOrder'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold'>Display Order</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter display order'
                    {...field}
                    className='bg-white border-gray-300 focus:border-primary focus:ring-primary'
                  />
                </FormControl>
                <FormMessage className='text-red-500 text-sm' />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-2 gap-4 items-center'>
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <div className='flex flex-col space-y-2'>
                  <FormLabel className='font-semibold'>Status</FormLabel>
                  <div className='flex items-center gap-4'>
                    <FormControl>
                      <button
                        type='button'
                        onClick={() =>
                          field.onChange(
                            field.value === 'active' ? 'inactive' : 'active'
                          )
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          field.value === 'active'
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                            field.value === 'active'
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </FormControl>
                    <span className='text-sm font-medium'>
                      {field.value === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <FormMessage className='text-red-500 text-sm' />
                </div>
              </FormItem>
            )}
          />

          <div className='space-y-2'>
            <FormLabel className='font-semibold'>Image</FormLabel>
            <div className='flex items-center space-x-4'>
              <Input
                type='file'
                id='product-image'
                accept='image/*'
                onChange={handleImageChange}
                className='hidden'
              />
              <label
                htmlFor='product-image'
                className='cursor-pointer flex items-center space-x-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
              >
                <ImagePlus className='h-5 w-5 text-primary' />
                <span className='text-gray-700'>Upload Image</span>
              </label>

              {imagePreview && (
                <div className='relative h-20 w-20 group'>
                  <Image
                    src={imagePreview}
                    alt='Product Preview'
                    fill
                    className='object-cover rounded-md shadow-sm'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />
                  <button
                    type='button'
                    onClick={handleRemoveImage}
                    className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex justify-end space-x-2'>
          {onCancel && (
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              className='hover:bg-gray-100'
            >
              Cancel
            </Button>
          )}
          <Button
            type='submit'
            className='bg-primary hover:bg-primary-dark transition-colors'
          >
            {initialData ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

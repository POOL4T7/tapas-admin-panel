'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState } from 'react';
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
import { SubCategory } from '@/types/sub-category';
import { Category } from '@/types/category';
import { Menu } from '@/types/menu';
import { ImagePlus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Switch } from '../ui/switch';

const subCategorySchema = z.object({
  menuId: z.coerce.number({ required_error: 'Please select a menu' }),
  categoryId: z.coerce.number({ required_error: 'Please select a category' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().optional(),
  displayOrder: z.coerce
    .number()
    .min(0, { message: 'Display order must be non-negative' }),
  status: z.boolean(),
  image: z.string().optional(),
});

interface SubCategoryFormProps {
  initialData?: SubCategory | null;
  menus: Menu[];
  categories: Category[];
  onSubmit: (data: SubCategory) => void;
  onCancel?: () => void;
}

export function SubCategoryForm({
  initialData,
  menus,
  categories,
  onSubmit,
  onCancel,
}: SubCategoryFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null
  );

  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  const form = useForm<z.infer<typeof subCategorySchema>>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      menuId: initialData?.menuId || 0,
      categoryId: initialData?.categoryId || 0,
      name: initialData?.name || '',
      description: initialData?.description || '',
      displayOrder: initialData?.displayOrder || 0,
      status: initialData?.status || false,
      image: initialData?.image || '',
    },
  });

  const selectedMenuId = form.watch('menuId');

  useEffect(() => {
    if (selectedMenuId) {
      const filtered = categories.filter(
        (category) => category.menuId === Number(selectedMenuId)
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  }, [selectedMenuId, categories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setValue('image', '');
  };

  const handleSubmit = (values: z.infer<typeof subCategorySchema>) => {
    onSubmit({
      ...values,
      id: initialData?.id || '', // Preserve existing ID if editing
    });
  };
  console.log(initialData);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='space-y-4 sm:space-y-6'
      >
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='menuId'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='font-semibold text-sm sm:text-base'>
                  Menu
                </FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value ? String(field.value) : ''}
                >
                  <FormControl>
                    <SelectTrigger className='w-full bg-white border-gray-300 focus:border-primary focus:ring-primary text-sm sm:text-base'>
                      <SelectValue placeholder='Select a menu' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {menus?.map((menu) => (
                      <SelectItem
                        key={menu.id}
                        value={String(menu.id)}
                        className='text-sm sm:text-base'
                      >
                        {menu.name}
                      </SelectItem>
                    ))}
                    {!menus?.length && (
                      <SelectItem value='' disabled>
                        No menus available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage className='text-red-500 text-xs sm:text-sm' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='categoryId'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold text-sm sm:text-base'>
                  Category
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ? String(field.value) : ''}
                  disabled={!form.getValues('menuId')}
                >
                  <FormControl>
                    <SelectTrigger className='w-full bg-white text-sm sm:text-base'>
                      <SelectValue placeholder='Select a category' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredCategories?.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className='text-red-500 text-xs sm:text-sm' />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold text-sm sm:text-base'>
                  Sub Category Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter sub category name'
                    {...field}
                    className='bg-white text-sm sm:text-base'
                  />
                </FormControl>
                <FormMessage className='text-red-500 text-xs sm:text-sm' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='displayOrder'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold text-sm sm:text-base'>
                  Display Order
                </FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter display order'
                    {...field}
                    className='bg-white text-sm sm:text-base'
                  />
                </FormControl>
                <FormMessage className='text-red-500 text-xs sm:text-sm' />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 gap-4'>
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold text-sm sm:text-base'>
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter sub category description (optional)'
                    {...field}
                    className='bg-white text-sm sm:text-base'
                  />
                </FormControl>
                <FormMessage className='text-red-500 text-xs sm:text-sm' />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-center'>
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem className='w-full flex flex-col justify-center'>
                <FormLabel className='font-semibold text-sm sm:text-base mb-2'>
                  Status
                </FormLabel>
                <div className='flex items-center gap-3'>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id='menu-status-switch'
                    />
                  </FormControl>
                  <span className='text-sm'>
                    {field.value ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <FormMessage className='text-red-500 text-xs sm:text-sm mt-1' />
              </FormItem>
            )}
          />

          <div className='space-y-2'>
            <FormLabel className='font-semibold text-sm sm:text-base'>
              Image
            </FormLabel>
            <div className='flex items-center space-x-4'>
              <Input
                type='file'
                id='sub-category-image'
                accept='image/*'
                onChange={handleImageChange}
                className='hidden'
              />
              <label
                htmlFor='sub-category-image'
                className='cursor-pointer flex items-center space-x-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base'
              >
                <ImagePlus className='h-4 w-4 sm:h-5 sm:w-5 text-primary' />
                <span className='text-gray-700'>Upload Image</span>
              </label>

              {imagePreview && (
                <div className='relative h-16 w-16 sm:h-20 sm:w-20 group'>
                  <Image
                    src={imagePreview}
                    alt='Sub Category Preview'
                    fill
                    className='object-cover rounded-md shadow-sm'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />
                  <button
                    type='button'
                    onClick={handleRemoveImage}
                    className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600'
                  >
                    <Trash2 className='h-3 w-3 sm:h-4 sm:w-4' />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2'>
          {onCancel && (
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              className='w-full sm:w-auto hover:bg-gray-100 text-sm sm:text-base'
            >
              Cancel
            </Button>
          )}
          <Button
            type='submit'
            className='w-full sm:w-auto bg-primary hover:bg-primary-dark transition-colors text-sm sm:text-base'
          >
            Save Sub Category
          </Button>
        </div>
      </form>
    </Form>
  );
}

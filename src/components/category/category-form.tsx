'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ImagePlus, Trash2 } from 'lucide-react';
import Image from 'next/image';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { Category } from '@/types/category';
import { Menu } from '@/types/menu';

const categorySchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  menuId: z.string({ required_error: 'Please select a menu' }),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  image: z.string().optional(),
  displayOrder: z.coerce
    .number()
    .min(0, { message: 'Display order must be non-negative' }),
});

interface CategoryFormProps {
  menus: Menu[];
  initialData?: Category;
  onSubmit: (data: Category) => void;
  onCancel?: () => void;
}

export function CategoryForm({
  menus,
  initialData,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    initialData?.image
  );

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || '',
      menuId: initialData?.menuId || '',
      description: initialData?.description || '',
      status: initialData?.status || 'active',
      image: initialData?.image,
      displayOrder: initialData?.displayOrder || 0,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Set file in form
      // form.setValue('image', file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(undefined);
    form.setValue('image', undefined);
    // Reset file input
    if (form.getValues('image')) {
      const fileInput = document.getElementById(
        'category-image'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleSubmit = (values: z.infer<typeof categorySchema>) => {
    onSubmit({
      ...values,
      id: initialData?.id || '', // Preserve existing ID if editing
      description: values.description || '', // Ensure description is always a string
      image: values.image, // Pass the uploaded file
    });
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='bg-white border-gray-300 focus:border-primary focus:ring-primary'>
                    <SelectValue placeholder='Select a menu' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {menus.map((menu) => (
                    <SelectItem key={menu.id} value={menu.id || 'default'}>
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
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>Category Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter category name'
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
                  placeholder='Enter category description'
                  {...field}
                  rows={3}
                  className='bg-white border-gray-300 focus:border-primary focus:ring-primary resize-none'
                />
              </FormControl>
              <FormMessage className='text-red-500 text-sm' />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-2 gap-4 items-center'>
          <FormField
            control={form.control}
            name='displayOrder'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Order</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter display order'
                    {...field}
                    className='bg-white'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <div className='flex flex-col space-y-2'>
                  <FormLabel>Status</FormLabel>
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
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className='space-y-2'>
          <FormLabel className='font-semibold'>Image</FormLabel>
          <div className='flex items-center space-x-4'>
            <Input
              type='file'
              id='category-image'
              accept='image/*'
              onChange={handleImageChange}
              className='hidden'
            />
            <label
              htmlFor='category-image'
              className='cursor-pointer flex items-center space-x-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
            >
              <ImagePlus className='h-5 w-5 text-primary' />
              <span className='text-gray-700'>Upload Image</span>
            </label>

            {imagePreview && (
              <div className='relative h-20 w-20 group'>
                <Image
                  src={imagePreview}
                  alt='Category Preview'
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

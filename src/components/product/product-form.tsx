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
import { useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import Image from 'next/image';

const productSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  subCategoryId: z.string({ required_error: 'Please select a sub category' }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'Price must be non-negative' }),
  status: z.enum(['active', 'inactive']),
  image: z.string().optional(),
});

interface ProductFormProps {
  initialData?: Product & { imagePreview?: string };
  subCategories: SubCategory[];
  onSubmit: (data: Product) => void;
  onCancel?: () => void;
}

export function ProductForm({
  initialData,
  subCategories,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>();
  // initialData?.imagePreview || initialData?.image || null

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      subCategoryId: initialData?.subCategoryId || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      status: initialData?.status || 'active',
      image: initialData?.image,
    },
  });

  const handleSubmit = (values: z.infer<typeof productSchema>) => {
    onSubmit({
      ...values,
      id: initialData?.id, // Preserve existing ID if editing
      image: values.image,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        // form.setValue('image', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setValue('image', undefined);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
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
          name='subCategoryId'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>Sub Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='bg-white border-gray-300 focus:border-primary focus:ring-primary'>
                    <SelectValue placeholder='Select a sub category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subCategories.map((subCategory) => (
                    <SelectItem
                      key={subCategory.id}
                      value={subCategory.id || 'default'}
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
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>Status</FormLabel>
              <div className='flex items-center space-x-4'>
                <p className='text-sm text-gray-500'>
                  {field.value === 'active'
                    ? 'Product is active'
                    : 'Product is inactive'}
                </p>
                <FormControl>
                  <div className='relative'>
                    <div
                      className={`w-10 h-6 rounded-full transition-colors ${
                        field.value === 'active'
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    <button
                      type='button'
                      onClick={() =>
                        field.onChange(
                          field.value === 'active' ? 'inactive' : 'active'
                        )
                      }
                      className={`absolute top-0 left-0 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                        field.value === 'active'
                          ? 'translate-x-4'
                          : 'translate-x-0'
                      }`}
                    />
                  </div>
                </FormControl>
              </div>
              <FormMessage className='text-red-500 text-sm' />
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

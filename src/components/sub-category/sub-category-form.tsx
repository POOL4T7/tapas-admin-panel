'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';

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
import { ImagePlus, Trash2 } from 'lucide-react';
import Image from 'next/image';

const subCategorySchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  categoryId: z.string({ required_error: 'Please select a category' }),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  image: z.string().optional(),
  displayOrder: z.coerce
    .number()
    .min(0, { message: 'Display order must be non-negative' }),
});

interface SubCategoryFormProps {
  initialData?: SubCategory;
  categories: Category[];
  onSubmit: (data: SubCategory) => void;
  onCancel?: () => void;
}

export function SubCategoryForm({
  initialData,
  categories,
  onSubmit,
  onCancel,
}: SubCategoryFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null
  );

  const form = useForm<z.infer<typeof subCategorySchema>>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      name: initialData?.name || '',
      categoryId: initialData?.categoryId || '',
      description: initialData?.description || '',
      status: initialData?.status || 'active',
      image: initialData?.image || '',
      displayOrder: initialData?.displayOrder || 0,
    },
  });

  const handleSubmit = (values: z.infer<typeof subCategorySchema>) => {
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
    form.setValue('image', '');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sub Category Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter sub category name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='categoryId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id || ''}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Enter sub category description'
                  {...field}
                  rows={2}
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
              <FormLabel className='font-semibold'>Status</FormLabel>
              <div className='flex items-center space-x-4'>
                <p className='text-sm text-gray-500'>
                  {field.value === 'active'
                    ? 'Sub Category is active'
                    : 'Sub Category is inactive'}
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

        <div className='space-y-2'>
          <FormLabel className='font-semibold'>Image</FormLabel>
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
              className='cursor-pointer flex items-center space-x-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
            >
              <ImagePlus className='h-5 w-5 text-primary' />
              <span className='text-gray-700'>Upload Image</span>
            </label>

            {imagePreview && (
              <div className='relative h-20 w-20 group'>
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
                  <Trash2 className='h-4 w-4' />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className='flex justify-end space-x-2'>
          {onCancel && (
            <Button type='button' variant='outline' onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type='submit'>Save Sub Category</Button>
        </div>
      </form>
    </Form>
  );
}

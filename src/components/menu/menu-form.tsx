'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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
import { Menu } from '@/types/menu';
import { Category } from '@/types/category';
import { SubCategory } from '@/types/sub-category';
import { SelectedCategoryTree } from './SelectedCategoryTree';

const menuSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().optional(),
  status: z.boolean(),
  displayOrder: z.coerce
    .number()
    .min(1, { message: 'Display order must be non-negative' }),
});

interface MenuFormProps {
  initialData?: Menu;
  onSubmit: (data: Menu) => void;
  onCancel?: () => void;
  loading?: boolean;
  categories: Category[];
  subCategories: SubCategory[];
}

export function MenuForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
  categories,
  subCategories,
}: MenuFormProps) {
  const form = useForm<z.infer<typeof menuSchema>>({
    resolver: zodResolver(menuSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      status: true, // default to active (true)
      displayOrder: 1,
    },
  });

  const handleSubmit = (values: z.infer<typeof menuSchema>) => {
    onSubmit({
      ...values,
      id: initialData?.id || '', // Preserve existing ID if editing
      description: values.description || '', // Ensure description is always a string
    });
  };

  // --- Category & Subcategory Selection State ---
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedPairs, setSelectedPairs] = useState<{ categoryId: string; subCategoryId: string }[]>([]);

  // Filter subcategories by selected category (ensure string comparison)
  const filteredSubCategories = selectedCategoryId
    ? subCategories.filter((sc) => String(sc.categoryId) === String(selectedCategoryId))
    : [];

  // Handle category select
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(e.target.value);
  };

  // Handle subcategory checkbox (always store IDs as strings)
  const handleSubCategoryChange = (subCategoryId: string, checked: boolean) => {
    if (!selectedCategoryId) return;
    setSelectedPairs((prev) => {
      if (checked) {
        // Add pair if not exists
        if (!prev.some((p) => String(p.categoryId) === String(selectedCategoryId) && String(p.subCategoryId) === String(subCategoryId))) {
          return [...prev, { categoryId: String(selectedCategoryId), subCategoryId: String(subCategoryId) }];
        }
        return prev;
      } else {
        // Remove pair
        return prev.filter((p) => !(String(p.categoryId) === String(selectedCategoryId) && String(p.subCategoryId) === String(subCategoryId)));
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='space-y-4 sm:space-y-6'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold text-sm sm:text-base'>
                Menu Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter menu name'
                  {...field}
                  className='bg-white text-sm sm:text-base'
                />
              </FormControl>
              <FormMessage className='text-red-500 text-xs sm:text-sm' />
            </FormItem>
          )}
        />

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
                    placeholder='Enter menu description'
                    {...field}
                    className='bg-white text-sm sm:text-base'
                  />
                </FormControl>
                <FormMessage className='text-red-500 text-xs sm:text-sm' />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
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
                    value={field.value ?? ''}
                    className='bg-white text-sm sm:text-base'
                  />
                </FormControl>
                <FormMessage className='text-red-500 text-xs sm:text-sm' />
              </FormItem>
            )}
          />

          {/* Status as Switch */}
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
        </div>

        {/* Category & Subcategory Selection */}
        <div className='mb-4'>
          <label className='block font-semibold text-sm sm:text-base mb-2'>Category</label>
          <select
            value={selectedCategoryId}
            onChange={handleCategoryChange}
            className='w-full border rounded p-2 text-sm mb-2'
          >
            <option value=''>-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {filteredSubCategories.length > 0 && (
            <div className='ml-2'>
              <div className='font-semibold text-xs mb-1'>Subcategories:</div>
              {filteredSubCategories.map((sub) => (
                <label key={sub.id} className='flex items-center space-x-2 mb-1'>
                  <input
                    type='checkbox'
                    checked={selectedPairs.some((p) => String(p.categoryId) === String(selectedCategoryId) && String(p.subCategoryId) === String(sub.id))}
                    onChange={(e) => handleSubCategoryChange(sub.id, e.target.checked)}
                  />
                  <span className='text-sm'>{sub.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Selected Category-Subcategory Tree Display */}
        <SelectedCategoryTree
          categories={categories}
          subCategories={subCategories}
          selectedPairs={selectedPairs}
        />

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
            disabled={loading}
          >
            Save Menu
          </Button>
        </div>
      </form>
    </Form>
  );
}

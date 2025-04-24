'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useState, useEffect } from 'react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { subCategoryByCategoryId } from '@/lib/sub-categories-api';
import { SelectedCategoryTree } from './SelectedCategoryTree';

const menuSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().optional(),
  status: z.boolean(),
  displayOrder: z.coerce
    .number()
    .min(1, { message: 'Display order must be at least 1' }),
});

interface MenuFormProps {
  initialData?: Menu;
  onSubmitBasic: (data: Menu) => void;
  onSubmitCategory: (data: {
    categorySelections: { categoryId: string; subCategoryIds: string[] }[];
  }) => void;
  onCancel?: () => void;
  loading?: boolean;
  categories: Category[];
  // subCategories: SubCategory[];
}

export function MenuForm({
  initialData,
  onSubmitBasic,
  onSubmitCategory,
  onCancel,
  loading,
  categories,
}: MenuFormProps) {
  // Basic Details Form
  const form = useForm<z.infer<typeof menuSchema>>({
    resolver: zodResolver(menuSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      status: true,
      displayOrder: 1,
    },
  });

  const handleSubmitBasic = (values: z.infer<typeof menuSchema>) => {
    onSubmitBasic({
      ...values,
      id: initialData?.id || '',
      description: values.description || '',
      categories: [],
      subCategories: [],
    });
  };

  // Category & Subcategory Selection State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [categorySelections, setCategorySelections] = useState<
    { categoryId: string; subCategoryIds: string[] }[]
  >([]);
  const [fetchedSubCategories, setFetchedSubCategories] = useState<
    SubCategory[]
  >([]);

  // Fetch subcategories dynamically when category changes
  useEffect(() => {
    if (!selectedCategoryId) {
      setFetchedSubCategories([]);
      return;
    }
    const fetchSubCategories = async () => {
      try {
        const data = await subCategoryByCategoryId(selectedCategoryId);
        setFetchedSubCategories(data?.data || []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setFetchedSubCategories([]);
      }
    };
    fetchSubCategories();
  }, [selectedCategoryId]);

  // Initialize with existing data if editing
  useEffect(() => {
    if (initialData?.categories) {
      const initialSelections = initialData.categories.map((cat) => ({
        categoryId: String(cat.id),
        subCategoryIds: [], // cat.subCategories?.map((sub) => String(sub.id)) || [],
      }));
      setCategorySelections(initialSelections);
    }
  }, [initialData]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
  };

  const handleSubCategoryChange = (subCategoryId: string, checked: boolean) => {
    setCategorySelections((prev) => {
      const existingIndex = prev.findIndex(
        (sel) => sel.categoryId === selectedCategoryId
      );
      if (existingIndex >= 0) {
        // Update existing selection
        const updated = [...prev];
        const newSubIds = checked
          ? [...updated[existingIndex].subCategoryIds, subCategoryId]
          : updated[existingIndex].subCategoryIds.filter(
              (id) => id !== subCategoryId
            );
        // If no subcategories left, remove the category selection
        if (newSubIds.length === 0) {
          updated.splice(existingIndex, 1);
          return updated;
        }
        updated[existingIndex] = {
          categoryId: selectedCategoryId,
          subCategoryIds: newSubIds,
        };
        return updated;
      } else if (checked) {
        // Add new selection
        return [
          ...prev,
          { categoryId: selectedCategoryId, subCategoryIds: [subCategoryId] },
        ];
      }
      return prev;
    });
  };

  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (categorySelections.length === 0) return;
    onSubmitCategory({
      categorySelections: categorySelections,
    });
  };

  return (
    <div className='space-y-6'>
      <Tabs defaultValue='basic' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='basic'>Basic Details</TabsTrigger>
          <TabsTrigger value='category'>Categories</TabsTrigger>
        </TabsList>

        <TabsContent value='basic'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitBasic)}
              className='space-y-6'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Menu Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter menu name' {...field} />
                    </FormControl>
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
                        placeholder='Enter description'
                        {...field}
                        className='min-h-[100px]'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Status</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className='flex justify-end gap-4'>
                {onCancel && (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={onCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                )}
                <Button type='submit' disabled={loading}>
                  {loading ? 'Saving...' : 'Save Menu'}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value='category'>
          <div>
            <form onSubmit={handleSubmitCategory} className='space-y-8'>
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Category
                    </label>
                    <Select
                      onValueChange={handleCategoryChange}
                      value={selectedCategoryId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select a category' />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {fetchedSubCategories.length > 0 && (
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium'>
                        Subcategories
                      </label>
                      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
                        {fetchedSubCategories.map((sub) => {
                          const checked =
                            categorySelections
                              .find(
                                (sel) => sel.categoryId === selectedCategoryId
                              )
                              ?.subCategoryIds.includes(sub.id) || false;
                          return (
                            <div
                              key={sub.id}
                              className='flex items-center space-x-2'
                            >
                              <Checkbox
                                id={`sub-${sub.id}`}
                                checked={checked}
                                onCheckedChange={(checked) =>
                                  handleSubCategoryChange(
                                    sub.id,
                                    checked as boolean
                                  )
                                }
                              />
                              <label
                                htmlFor={`sub-${sub.id}`}
                                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                              >
                                {sub.name}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Categories & Subcategories Section */}
              {categorySelections.length > 0 && (
                <div className='space-y-4'>
                  <SelectedCategoryTree
                    categories={categories}
                    subCategories={fetchedSubCategories}
                    selectedPairs={categorySelections.flatMap((sel) =>
                      sel.subCategoryIds.map((subId) => ({
                        categoryId: sel.categoryId,
                        subCategoryId: subId,
                      }))
                    )}
                  />
                </div>
              )}

              <div className='flex justify-end gap-4'>
                {onCancel && (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={onCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type='submit'
                  disabled={loading || categorySelections.length === 0}
                >
                  {loading ? 'Saving...' : 'Save Categories'}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

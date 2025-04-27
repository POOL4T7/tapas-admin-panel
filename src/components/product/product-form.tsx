'use client';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, Plus } from 'lucide-react';

import { Product } from '@/types/product';
// import { Menu } from '@/types/menu';
import { Category } from '@/types/category';
import { SubCategory } from '@/types/sub-category';
import { subCategoryByCategoryId } from '@/lib/sub-categories-api';
import { getProductById, uploadProductImage } from '@/lib/products-api';

type ProductFormValues = {
  name: string;
  description?: string;
  price: number;
  displayOrder: number;
  // menuId: number;
  categoryId: number;
  subCategoryId: number;
  status: boolean;
  tags?: string[];
  ingredients?: string[];
  itemsImagePaths?: string[];
  metadata?: string;
};

const productSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'Price must be non-negative' }),
  displayOrder: z.coerce
    .number()
    .min(0, { message: 'Display order must be non-negative' }),
  // menuId: z.coerce.number({ required_error: 'Please select a menu' }),
  categoryId: z.coerce.number({ required_error: 'Please select a category' }),
  subCategoryId: z.coerce.number({
    required_error: 'Please select a sub-category',
  }),
  status: z.boolean(),
  tags: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  itemsImagePaths: z.array(z.string()).optional(),
  metadata: z.string().optional(),
});

type ProductFormProps = {
  // menus: Menu[];
  categories: Category[];
  subCategories: SubCategory[];
  initialData?: Product;
  onSubmit: (data: Omit<Product, 'id'>) => void;
};

export function ProductForm({
  // menus,
  categories,
  initialData,
  onSubmit,
}: ProductFormProps) {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialData?.itemsImagePaths || []
  );
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      displayOrder: initialData?.displayOrder || 0,
      categoryId: initialData?.categoryId || 0,
      subCategoryId: initialData?.subCategoryId || 0,
      status: initialData?.status || false,
      tags: initialData?.tags || [],
      ingredients: initialData?.ingredients || [],
      itemsImagePaths: initialData?.itemsImagePaths || [],
      metadata: initialData?.metadata || '',
    },
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: form.control,
    name: 'tags' as never,
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: form.control,
    name: 'ingredients' as never,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (initialData?.id) {
        const { data: product } = await getProductById(initialData.id);
        form.setValue('name', product.name);
        form.setValue('description', product.description);
        form.setValue('price', product.price);
        form.setValue('displayOrder', product.displayOrder);
        form.setValue('status', product.status);
        form.setValue('tags', product.tags || []);
        form.setValue('ingredients', product.ingredients || []);
        form.setValue('itemsImagePaths', product.itemsImagePaths || []);
        form.setValue('metadata', product.metadata || '');
        setImageUrls(product.itemsImagePaths || []);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchSubCategories() {
      const subCategories = await subCategoryByCategoryId(
        String(form.watch('categoryId'))
      );

      setSubCategories(subCategories?.data || []);
    }
    if (form.watch('categoryId') !== 0) {
      fetchSubCategories();
    }
  }, [form.watch('categoryId')]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;
    console.log(files);
    const newImageFiles = Array.from(files);
    console.log('Selected Files:', newImageFiles);
    const res = await uploadProductImage(
      newImageFiles,
      initialData?.id?.toString() || ''
    );

    const newImageUrls = newImageFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...newImageFiles]);
    setImageUrls((prev) => [...prev, ...res.data]);
    form.setValue('itemsImagePaths', [...imageUrls, ...res.data]);

    // Cleanup object URLs to prevent memory leaks
    return () => {
      newImageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedFiles = imageFiles.filter(
      (_, index) => index !== indexToRemove
    );
    const updatedUrls = imageUrls.filter((_, index) => index !== indexToRemove);

    // Revoke the object URL for the removed image
    URL.revokeObjectURL(imageUrls[indexToRemove]);

    setImageFiles(updatedFiles);
    setImageUrls(updatedUrls);
    form.setValue('itemsImagePaths', updatedUrls);
  };

  const handleSubmit: SubmitHandler<ProductFormValues> = (values) => {
    // Prepare data for submission
    const submissionData = {
      name: values.name.trim(),
      description: values.description?.trim() || '',
      price: Number(values.price),
      displayOrder: Number(values.displayOrder || 0),
      // menuId: values.menuId,
      categoryId: values.categoryId,
      subCategoryId: values.subCategoryId,
      status: values.status,
      tags: values.tags?.filter((tag) => tag.trim() !== '') || [],
      ingredients:
        values.ingredients?.filter((ingredient) => ingredient.trim() !== '') ||
        [],
      images: imageUrls.filter((url) => url.trim() !== ''),
      metadata: values.metadata?.trim() || undefined,
    };

    onSubmit(submissionData);
    toast.success(`${initialData ? 'Product updated' : 'Product created'}!`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* <FormField
            control={form.control}
            name='menuId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Menu</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.resetField('categoryId');
                    form.resetField('subCategoryId');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select Menu' />
                  </SelectTrigger>
                  <SelectContent>
                    {menus?.map((menu) => (
                      <SelectItem key={menu.id} value={String(menu.id)}>
                        {menu.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name='categoryId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.resetField('subCategoryId');
                  }}
                  // disabled={!form.getValues('menuId')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select Category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
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
            name='subCategoryId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub Category</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={field.onChange}
                  disabled={!form.getValues('categoryId')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select Sub Category' />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.map((subCategory) => (
                      <SelectItem
                        key={subCategory.id}
                        value={String(subCategory.id)}
                      >
                        {subCategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='md:col-span-2'>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='md:col-span-2'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder='Product description' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type='number' step='0.01' {...field} />
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
                  <Input type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between'>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <FormLabel>Product Tags</FormLabel>
            <div className='space-y-2'>
              {tagFields.map((field, index) => (
                <div key={field.id} className='flex items-center space-x-2'>
                  <FormControl>
                    <Input
                      placeholder='Enter tag'
                      {...form.register(`tags.${index}` as const)}
                    />
                  </FormControl>
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    onClick={() => removeTag(index)}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ))}
              <Button
                type='button'
                variant='outline'
                onClick={() => appendTag('')}
                className='w-full'
              >
                <Plus className='mr-2 h-4 w-4' /> Add Tag
              </Button>
            </div>
          </div>

          <div>
            <FormLabel>Ingredients</FormLabel>
            <div className='space-y-2'>
              {ingredientFields.map((field, index) => (
                <div key={field.id} className='flex items-center space-x-2'>
                  <FormControl>
                    <Input
                      placeholder='Enter ingredient'
                      {...form.register(`ingredients.${index}` as const)}
                    />
                  </FormControl>
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    onClick={() => removeIngredient(index)}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ))}
              <Button
                type='button'
                variant='outline'
                onClick={() => appendIngredient('')}
                className='w-full'
              >
                <Plus className='mr-2 h-4 w-4' /> Add Ingredient
              </Button>
            </div>
          </div>
        </div>

        <div>
          <FormLabel>Product Images</FormLabel>
          <div className='space-y-2'>
            <Input
              type='file'
              multiple
              accept='image/*'
              onChange={handleImageUpload}
              className='w-full'
            />
            <div className='grid grid-cols-3 gap-2 mt-2'>
              {imageUrls.map((url, index) => (
                <div key={index} className='relative w-full h-24'>
                  <Image
                    src={process.env.NEXT_PUBLIC_SERVER_URL + url}
                    alt={`Product image ${index + 1}`}
                    fill
                    className='object-cover rounded'
                  />
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    className='absolute top-0 right-0 m-1'
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <FormLabel>Metadata</FormLabel>
          <FormControl>
            <Textarea
              placeholder='Enter additional product information (JSON format recommended)'
              {...form.register('metadata')}
              className='w-full min-h-[100px]'
            />
          </FormControl>
        </div>

        <Button type='submit' className='w-full'>
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
}

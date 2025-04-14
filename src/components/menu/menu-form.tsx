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
import { Menu } from '@/types/menu';

const menuSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  displayOrder: z.coerce
    .number()
    .min(1, { message: 'Display order must be non-negative' }),
});

interface MenuFormProps {
  initialData?: Menu;
  onSubmit: (data: Menu) => void;
  onCancel?: () => void;
}

export function MenuForm({ initialData, onSubmit, onCancel }: MenuFormProps) {
  const form = useForm<z.infer<typeof menuSchema>>({
    resolver: zodResolver(menuSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      status: 'active',
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 sm:space-y-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold text-sm sm:text-base'>Menu Name</FormLabel>
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
                <FormLabel className='font-semibold text-sm sm:text-base'>Description</FormLabel>
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
                <FormLabel className='font-semibold text-sm sm:text-base'>Display Order</FormLabel>
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

          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <div className='flex flex-col space-y-2'>
                  <FormLabel className='font-semibold text-sm sm:text-base'>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full bg-white text-sm sm:text-base'>
                        <SelectValue placeholder='Select menu status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='inactive'>Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-red-500 text-xs sm:text-sm' />
                </div>
              </FormItem>
            )}
          />
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
            Save Menu
          </Button>
        </div>
      </form>
    </Form>
  );
}

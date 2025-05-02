'use client';

// Removed unused import
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/types/common';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { loginUser } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const res = await loginUser(values.email, values.password);

      // Server-side cookie setting via API route
      const cookieResponse = await fetch('/api/auth/set-cookie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: res.data.token }),
      });

      if (!cookieResponse.ok) {
        throw new Error('Failed to set authentication cookie');
      }

      // toast.success('Login Successful', {
      //   description: 'Welcome back!',
      // });

      router.push('/menu');
    } catch (error: unknown) {
      console.error(error);
      toast.error('Login Failed', {
        description:
          (error as ApiError)?.response?.data?.message || 'Invalid credentials',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-800'>Login</h1>
          <p className='mt-2 text-sm text-gray-600'>
            Welcome back to Tapas Admin
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='you@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Enter your password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isLoading} className='w-full'>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Form>
        <div className='text-center'>
          <p className='text-sm text-gray-600'>
            Don&apos;t have an account?{' '}
            <Link href='/register' className='text-blue-600 hover:underline'>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

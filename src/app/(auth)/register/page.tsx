'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

// Define error type for API responses
type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

// Registration Form Schema
const registrationSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signupUser } = useAuth();

  // Registration Form
  const registrationForm = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Registration Submit Handler
  const onRegistrationSubmit = async (
    values: z.infer<typeof registrationSchema>
  ) => {
    setIsLoading(true);
    try {
      await signupUser(values.email, values.password);
      router.push(`/verify?email=${encodeURIComponent(values.email)}`);
      toast.info('Verification Code Sent', {
        description: 'Please check your email for the verification code',
      });
    } catch (error: unknown) {
      const err = error as ApiError;
      toast.error('Registration Failed', {
        description:
          err?.response?.data?.message || err?.message || 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Registration Step
  const renderRegistrationStep = () => (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-800'>Register</h1>
          <p className='mt-2 text-sm text-gray-600'>
            Create your Tapas Admin account
          </p>
        </div>
        <Form {...registrationForm}>
          <form
            onSubmit={registrationForm.handleSubmit(onRegistrationSubmit)}
            className='space-y-6'
          >
            <FormField
              control={registrationForm.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='your@email.com'
                      type='email'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registrationForm.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Password'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registrationForm.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Confirm Password'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Continue'}
            </Button>
            <div className='text-center mt-4'>
              <Link
                href='/login'
                className='text-sm text-blue-600 hover:underline'
              >
                Already have an account? Login
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );

  return renderRegistrationStep();
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Suspense } from 'react';

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

// Verification Form Schema
const verificationSchema = z.object({
  verificationCode: z
    .string()
    .min(6, 'Verification code must be 6 digits')
    .max(6, 'Verification code must be 6 digits'),
});

function VerifyEmailForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { otpVerify } = useAuth();

  // Get email from URL search params
  const email = searchParams.get('email');

  // Verification Form
  const verificationForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      verificationCode: '',
    },
  });

  // Redirect if no email is present
  useEffect(() => {
    if (!email) {
      toast.error('Invalid Verification Request', {
        description: 'No email provided for verification',
      });
      router.push('/register');
    }
  }, [email, router]);

  // Verification Submit Handler
  const onVerificationSubmit = async (
    values: z.infer<typeof verificationSchema>
  ) => {
    if (!email) return;

    setIsLoading(true);
    try {
      await otpVerify(email, values.verificationCode);

      toast.success('Verification Successful', {
        description: 'Welcome to Tapas Admin!',
      });
      router.push('/menu');
    } catch (error: unknown) {
      const err = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      toast.error('Verification Failed', {
        description:
          err?.response?.data?.message || err?.message || 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-800'>Verify Email</h1>
        <p className='mt-2 text-sm text-gray-600'>
          Enter the 6-digit verification code sent to {email}
        </p>
      </div>
      <Form {...verificationForm}>
        <form
          onSubmit={verificationForm.handleSubmit(onVerificationSubmit)}
          className='space-y-6'
        >
          <FormField
            control={verificationForm.control}
            name='verificationCode'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter 6-digit code'
                    type='text'
                    inputMode='numeric'
                    pattern='[0-9]*'
                    autoComplete='off'
                    autoCorrect='off'
                    spellCheck='false'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>
          <div className='text-center mt-4'>
            <button
              type='button'
              onClick={() => router.push('/register')}
              className='text-sm text-blue-600 hover:underline'
              disabled={isLoading}
            >
              Back to Registration
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
      <Suspense fallback={<div>Loading verification form...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}

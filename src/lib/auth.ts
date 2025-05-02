import { RegisterData, LoginData } from '@/types/auth';
import { api } from './api';

export const register = async ({ email, password }: RegisterData) => {
  try {
    const res = await api.post('/api/user/register', { email, password });
    console.log('Registration submitted', { email, password });
    return res.data;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};

export const otpVerifyApi = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  try {
    const res = await api.post('/api/user/verify-otp', { email, otp });
    console.log('Otp verification submitted', { email, otp });
    return res.data;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};

export async function login(values: LoginData) {
  try {
    const res = await api.post('/api/user/login', values);
    console.log('Login submitted', values);

    return res.data;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
}

export async function logout() {
  try {
    // Client-side cookie deletion
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    return true;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
}
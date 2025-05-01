import { RegisterData, LoginData } from '@/types/auth';
import { api } from './api';
// import { cookies } from 'next/headers';

export async function register(values: RegisterData) {
  try {
    // TODO: Implement actual registration logic
    const res = await api.post('/api/auth/register', values);
    console.log('Registration submitted', values);
    return res.data;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
}

export async function login(values: LoginData) {
  try {
    // TODO: Implement actual login logic
    const res = await api.post('/api/auth/login', values);
    console.log('Login submitted', values);
    // const cookieStore = await cookies();
    // cookieStore.set('token', res.data.token, {
    //   httpOnly: true,
    //   sameSite: 'strict',
    //   maxAge: 60 * 60 * 24 * 30,
    // });
    return res.data;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
}

export async function logout() {
  try {
    // const cookieStore = await cookies();
    // cookieStore.delete('token');
    return true;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
}


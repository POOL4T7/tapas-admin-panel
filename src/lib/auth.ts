import { RegisterData, LoginData } from '@/types/auth';
import { api } from './api';

export async function register(values: RegisterData) {
  try {
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
    const res = await api.post('/api/auth/login', values);
    console.log('Login submitted', values);

    // Client-side cookie management
    document.cookie = `token=${res.data.token}; path=/; max-age=${
      60 * 60 * 24 * 30
    }; ${
      process.env.NODE_ENV === 'production' ? 'secure; ' : ''
    }httpOnly; sameSite=strict`;

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

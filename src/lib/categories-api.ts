import { Category } from '@/types/category';
import { api } from './api';
import { CategoryMap } from '@/types/menu';

// Function to create a category
export async function createCategory(categoryData: Omit<Category, 'id'>) {
  try {
    const response = await api.post('api/category/create', categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to update a category
export async function updateCategory(
  categoryId: string,
  categoryData: Omit<Category, 'id'>
) {
  try {
    const response = await api.put(
      `/api/category/update/${categoryId}`,
      categoryData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to get all categories
export async function getAllCategories() {
  try {
    const response = await api.get('/api/category');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    const response = await api.delete(`/api/category/delete/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addMenuEntries(data: CategoryMap) {
  try {
    const response = await api.post('/api/menuentry/create', data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateMenuEntries(data: CategoryMap) {
  try {
    const response = await api.put('/api/menuentry/updatebymenuid', data);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function getMenuEntries(menuId: string) {
  try {
    const response = await api.get(`/api/menuentry/with-categories/${menuId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function uploadImage(image: File, categoryId: string) {
  try {
    const formData = new FormData();
    formData.append('categoryId', categoryId);
    formData.append('categoryImageFile', image);
    const response = await api.post('api/category/image/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (!response.data) throw new Error('Failed to upload image');
    return response.data;
  } catch (error) {
    throw error;
  }
}

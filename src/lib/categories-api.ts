import { Category } from '@/types/category';
import { api } from './api';

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

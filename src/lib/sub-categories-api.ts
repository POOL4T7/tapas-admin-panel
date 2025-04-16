import { SubCategory } from '@/types/sub-category';
import { api } from './api';

// Function to create a sub-category
export async function createSubCategory(
  subCategoryData: Omit<SubCategory, 'id'>
) {
  try {
    const response = await api.post('/api/subcategory/create', subCategoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to update a sub-category
export async function updateSubCategory(
  subCategoryId: string,
  subCategoryData: Omit<SubCategory, 'id'>
) {
  try {
    const response = await api.put(
      `/api/subcategory/update/${subCategoryId}`,
      subCategoryData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to get all sub-categories
export async function getAllSubCategories() {
  try {
    const response = await api.get('/api/subcategory');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteSubCategory(subCategoryId: string) {
  try {
    const response = await api.delete(
      `/api/menu/deleteSubCategory/${subCategoryId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

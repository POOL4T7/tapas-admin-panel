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

export async function deleteSubCategory(subCategoryId: number) {
  try {
    const response = await api.delete(
      `/api/subcategory/delete/${subCategoryId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function subCategoryByCategoryId(categoryId: string) {
  try {
    const response = await api.get(`/api/subcategory/categoryId/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function uploadSubCategoryImage(
  image: File,
  subCategoryId: string
) {
  try {
    const formData = new FormData();
    formData.append('subCategoryId', subCategoryId);
    formData.append('subCategoryImageFile', image);
    const response = await api.post('/api/subcategory/image/upload', formData, {
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

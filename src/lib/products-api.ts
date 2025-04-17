import { Product } from '@/types/product';
import { api } from './api';

// Function to create a product
export async function createProduct(productData: Omit<Product, 'id'>) {
  try {
    const response = await api.post('/api/item/create', productData);
    return response.data;
  } catch (error) {
    // Handle error as needed (could expand this based on your error handling strategy)
    throw error;
  }
}

// Function to update a product
export async function updateProduct(
  productId: string,
  productData: Partial<Omit<Product, 'id'>> & { id: string } // This way, id is required to know which product to update, but other fields can be optional.
) {
  try {
    const response = await api.put(
      `/api/item/update/${productId}`,
      productData
    );
    return response.data;
  } catch (error) {
    // Handle error as needed (could expand this based on your error handling strategy)
    throw error;
  }
}

// Function to get all products
export async function getAllProducts() {
  try {
    const response = await api.get('/api/item');
    return response.data;
  } catch (error) {
    // Handle error as needed (could expand this based on your error handling strategy)
    throw error;
  }
}

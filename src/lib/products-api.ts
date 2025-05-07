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
    const response = await api.get('api/item/with-structure');
    return response.data;
  } catch (error) {
    // Handle error as needed (could expand this based on your error handling strategy)
    throw error;
  }
}
// Function to get  specific product
export async function getProductById(productId: string) {
  try {
    const response = await api.get(`api/item/${productId}`);
    return response.data;
  } catch (error) {
    // Handle error as needed (could expand this based on your error handling strategy)
    throw error;
  }
}

export async function getProductsByMenu(menuId: string) {
  try {
    const response = await api.get(`/api/menuentry/${menuId}`);
    return response.data;
  } catch (error) {
    // Handle error as needed (could expand this based on your error handling strategy)
    throw error;
  }
}

export async function updateProductByMenuId(
  productId: string,
  data: { itemId: number; active: boolean }[]
) {
  try {
    const response = await api.put(
      `api/menuentry/itemstatus/update/${productId}`,
      data
    );
    return response.data;
  } catch (error) {
    // Handle error as needed (could expand this based on your error handling strategy)
    throw error;
  }
}

export async function uploadProductImage(images: File[], itemId: string) {
  try {
    const formData = new FormData();
    formData.append('itemId', itemId);
    images.forEach((image) => {
      formData.append('itemImageFiles', image);
    });
    const response = await api.post('/api/item/image/upload', formData, {
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

export async function deleteProduct(productId: string) {
  try {
    const response = await api.delete(`/api/menu/deleteItem/${productId}`);
    return response.data;
  } catch (error) {
    // Handle error as needed (could expand this based on your error handling strategy)
    throw error;
  }
}

type UpdateMenuEntityDisplayOrder = {
  menuId: string;
  itemId: number;
  itemDisplayOrder: number;
  categoryId: number;
  subCategoryId: number;
};

export async function updateMenuEntityDisplayOrder(
  data: UpdateMenuEntityDisplayOrder[]
) {
  try {
    const response = await api.put(
      `/api/menuentry/itemdisplayorder/update`,
      data
    );
    return response.data;
  } catch (error) {
    // Handle error as needed (could expand this based on your error handling strategy)
    throw error;
  }
}

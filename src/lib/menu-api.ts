import { Menu } from '@/types/menu';
import { api } from './api';

// Function to create a menu
export async function createMenu(menuData: Omit<Menu, 'id'>) {
  try {
    const response = await api.post('/api/menu/create', menuData);
    return response.data;
  } catch (error) {
    // Handle error as needed (could expand this based on your error handling strategy)
    throw error;
  }
}

// Function to update a menu
export async function updateMenu(
  menuId: string,
  menuData: Partial<Omit<Menu, 'id'>> & { id: string } // This way, id is required to know which menu to update, but other fields can be optional.
) {
  try {
    const response = await api.put(`/api/menu/update/${menuId}`, menuData);
    return response.data;
  } catch (error) {
    // Handle error as needed (could expand this based on your error handling strategy)
    throw error;
  }
}

// Function to update a menu
export async function getAllMenus() {
  try {
    const response = await api.get('/api/menu/all');
    return response.data;
  } catch (error) {
    // Handle error as needed (could expand this based on your error handling strategy)
    throw error;
  }
}

export async function getMenuById(menuId: string) {
  try {
    const response = await api.get(`api/menu/${menuId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}


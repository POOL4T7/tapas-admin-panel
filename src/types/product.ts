export type Product = {
  id: string;
  name: string;
  subCategoryId: string;
  description?: string;
  price: number;
  status: 'active' | 'inactive';
  image?: File | string;
  displayOrder: number;
  menuId: string;
  categoryId: string;
};

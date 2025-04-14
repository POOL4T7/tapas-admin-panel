export type Product = {
  id: string;
  name: string;
  subCategoryId: string;
  description: string;
  status: 'active' | 'inactive';
  displayOrder: number;
  price: number;
  menuId: string;
  categoryId: string;

  // New fields
  tags?: string[];
  ingredients?: string[];
  images?: string[];
  metadata?: string;
};

export type Product = {
  id: string;
  name: string;
  subCategoryId: number;
  description: string;
  status: boolean;
  displayOrder: number;
  price: number;
  menuId: number;
  categoryId: number;

  // New fields
  tags?: string[];
  ingredients?: string[];
  images?: string[];
  metadata?: string;
};

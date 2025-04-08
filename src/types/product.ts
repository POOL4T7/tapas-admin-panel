export type Product = {
  id?: string;
  name: string;
  subCategoryId: string;
  description?: string;
  price: number;
  status: 'active' | 'inactive';
  image?: string;
};

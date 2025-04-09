export type SubCategory = {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  status: 'active' | 'inactive';
  image?: string;
  displayOrder: number;
};

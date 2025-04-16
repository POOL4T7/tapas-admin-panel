export type SubCategory = {
  id: string;
  name: string;
  categoryId: number;
  menuId: number;
  description?: string;
  status: boolean;
  image?: string;
  displayOrder: number;
};

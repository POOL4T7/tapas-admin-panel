export type SubCategory = {
  id: number;
  name: string;
  categoryId: number;

  description?: string;
  status: boolean;
  image?: string;
  displayOrder: number;
};

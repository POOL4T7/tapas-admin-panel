export type Category = {
  id: string;
  name: string;
  menuId: string;
  description?: string;
  status: 'active' | 'inactive';
  image?: string;
  displayOrder: number;
};

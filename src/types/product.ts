export type Product = {
  id: string;
  name: string;
  subCategoryId: number;
  description: string;
  status: boolean;

  price: number;
  categoryId: number;

  // New fields
  tags?: string[];
  ingredients?: string[];
  itemsImagePaths?: string[];
  allergies?: string;
  tagLine?: string;
  metadata?: string;
};

export type MenuProduct = {
  menuId: number;
  menuName: string;
  categoryId: number;
  categoryName: string;
  subCategoryId: number;
  subCategoryName: string;
  item: {
    id: number;
    name: string;
    description: string;
    imagePath: string | null;
    price: number;
    displayOrder: number | null;
    status: boolean;
  };
};

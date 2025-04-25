// import { Category } from './category';
// import { SubCategory } from './sub-category';

export type Categories = {
  id: number;
  name: string;
  subCategories: {
    id: number;
    name: string;
  }[];
};

export type Menu = {
  id: string;
  name: string;
  description: string;
  status: boolean;
  displayOrder: number;
  // categories: Categories[];
  tagLine: string | null;
  metadata: string | null;
  // subCategories: SubCategory[];
};

export type CategoryMap = {
  menuId: number;
  categorySelections: {
    categoryId: number;
    subCategoryIds: number[];
  }[];
};

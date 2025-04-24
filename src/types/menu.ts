import { Category } from './category';
import { SubCategory } from './sub-category';

export type Menu = {
  id: string;
  name: string;
  description: string;
  status: boolean;
  displayOrder: number;
  categories: Category[];
  subCategories: SubCategory[];
};

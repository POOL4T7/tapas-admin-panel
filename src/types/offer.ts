export type OfferType = 'combo' | 'discount' | 'special';

export interface Offer {
  id: number;
  name: string;
  menuId: number;
  foodItemsInfo: string;
  foodItemsPrice: string;
  foodItemsImagePaths: string[];
  drinkItemsInfo: string;
  drinkItemsPrice: string;
  drinkItemsImagePaths: string[];
  offerImagePath: string | null;
  description: string;
  status: boolean;
}

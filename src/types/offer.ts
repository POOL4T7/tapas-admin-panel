export type OfferType = 'combo' | 'discount' | 'special';

export interface Offer {
  id?: string;
  name: string;
  offerType: OfferType;
  foodItems: string[];
  drinkItems: string[];
  foodItemPrice: number;
  drinkItemPrice: number;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status: 'active' | 'inactive';
  displayOrder: number;
}

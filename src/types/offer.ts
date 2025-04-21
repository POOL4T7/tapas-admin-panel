export type OfferType = 'combo' | 'discount' | 'special';

export interface Offer {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  discountPercentage: number;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  drinks: Item[];
  foods: Item[];
}

export interface Item {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  status: boolean;
}

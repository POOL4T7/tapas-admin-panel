import axios from 'axios';
import { Offer } from '@/types/offer';

export async function getOffers() {
  const res = await axios.get('api/offers/temp/all');
  if (!res.data) throw new Error('Failed to fetch offers');
  return res.data;
}

export async function getOfferById(id: number) {
  const res = await axios.get<Offer>(`/api/offers/temp/${id}`);
  if (!res.data) throw new Error('Failed to fetch offer');
  return res.data;
}

export async function createOffer(offer: Partial<Offer>){
  console.log(offer);
  const res = await axios.post('/api/offers/temp/save', offer);
  if (!res.data) throw new Error('Failed to create offer');
  return res.data;
}

export async function updateOffer(id: number, offer: Partial<Offer>) {
  const res = await axios.post(`/api/offers/temp/save`, offer);
  if (!res.data) throw new Error('Failed to update offer');
  return res.data;
}

export async function deleteOffer(id: number): Promise<void> {
  const res = await axios.delete(`/api/offers/temp/${id}`);
  if (!res) throw new Error('Failed to delete offer');
}

export async function uploadOfferImage(
  files: File[],
  type: string
): Promise<string[]> {
  const formData = new FormData();
  formData.append('fileType', type);
  files.forEach((file) => formData.append('files', file));
  const res = await axios.post('/api/offers/temp/image/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  if (!res.data) throw new Error('Failed to upload image');
  // Some APIs return the URLs directly, some in a field like 'urls' or 'data'.
  // Adjust as needed:
  return res.data.data || res.data.urls || res.data;
}

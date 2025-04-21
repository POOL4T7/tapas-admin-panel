'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import OfferForm from '@/components/offer/OfferForm';
import OfferTable from '@/components/offer/OfferTable';
import { Offer } from '@/types/offer';
import type { OfferFormValues } from '@/components/offer/OfferForm';

const emptyOffer = (): Offer => ({
  id: Date.now(),
  name: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(),
  discountPercentage: 0,
  status: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  drinks: [],
  foods: [],
});

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const handleCreateOffer = (data: OfferFormValues) => {
    setOffers((prev) => [
      ...prev,
      {
        ...data,
        id: Date.now(),
        createdAt: new Date(),
        updatedAt: new Date(),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    ]);
    setIsDialogOpen(false);
    setEditingOffer(null);
  };

  const handleEditOffer = (data: OfferFormValues) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === data.id
          ? {
              ...o,
              ...data,
              updatedAt: new Date(),
              startDate: new Date(data.startDate),
              endDate: new Date(data.endDate),
            }
          : o
      )
    );
    setIsDialogOpen(false);
    setEditingOffer(null);
  };

  const handleDeleteOffer = (offer: Offer) => {
    setOffers((prev) => prev.filter((o) => o.id !== offer.id));
  };

  const toggleStatus = (offer: Offer) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offer.id
          ? { ...o, status: !o.status, updatedAt: new Date() }
          : o
      )
    );
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    setOffers((prev) => {
      const next = [...prev];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      return next;
    });
  };

  return (
    <div className='p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0 sm:space-x-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-xl sm:text-2xl font-semibold'>Offers</h1>
          <p className='text-sm text-muted-foreground'>Manage your offers</p>
        </div>
        <div className='flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto'>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className='w-full sm:w-auto'
                onClick={() => {
                  setEditingOffer(null);
                  setIsDialogOpen(true);
                }}
              >
                Add Offer
              </Button>
            </DialogTrigger>
            <DialogContent className='w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>{editingOffer ? 'Edit' : 'Add'} Offer</DialogTitle>
              </DialogHeader>
              <OfferForm
                offer={editingOffer || emptyOffer()}
                // onChange={() => {}}
                onSubmit={(values) => {
                  if (editingOffer) {
                    handleEditOffer({ ...editingOffer, ...values });
                  } else {
                    handleCreateOffer(values);
                  }
                }}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditingOffer(null);
                }}
                editing={!!editingOffer}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <OfferTable
        offers={offers}
        onEdit={(offer) => {
          setEditingOffer(offer);
          setIsDialogOpen(true);
        }}
        onDelete={handleDeleteOffer}
        onReorder={handleReorder}
        onStatusToggle={toggleStatus}
      />
    </div>
  );
}

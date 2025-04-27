'use client';
import { useState, useEffect } from 'react';
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
import {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from '@/lib/offer-api';
import { getAllMenus } from '@/lib/menu-api';

const emptyOffer = (): Offer => ({
  id: Date.now(),
  name: '',
  menuId: 0,
  foodItemsInfo: '',
  foodItemsPrice: '',
  foodItemsImagePaths: [],
  drinkItemsInfo: '',
  drinkItemsPrice: '',
  drinkItemsImagePaths: [],
  offerImagePath: null,
  description: '',
  status: true,
});

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(false);
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    setLoading(true);
    getAllMenus().then((data) => setMenus(data.data));
    getOffers()
      .then((data) => setOffers(data.data))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateOffer = async (data: OfferFormValues) => {
    setLoading(true);
    try {
      const created = await createOffer(data);
      setOffers((prev) => [
        ...prev,
        {
          ...created,
        },
      ]);
      setIsDialogOpen(false);
      setEditingOffer(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOffer = async (data: OfferFormValues) => {
    setLoading(true);
    try {
      await updateOffer(data.id!, data);
      setOffers((prev) =>
        prev.map((o) =>
          o.id === data.id
            ? {
                id: data.id,
                name: data.name,
                menuId: data.menuId,
                foodItemsInfo: data.foodItemsInfo,
                foodItemsPrice: data.foodItemsPrice,
                foodItemsImagePaths: data.foodItemsImagePaths,
                drinkItemsInfo: data.drinkItemsInfo,
                drinkItemsPrice: data.drinkItemsPrice,
                drinkItemsImagePaths: data.drinkItemsImagePaths,
                offerImagePath: data.offerImagePath,
                description: data.description,
                status: data.status,
              }
            : o
        )
      );
      setIsDialogOpen(false);
      setEditingOffer(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOffer = async (offer: Offer) => {
    setLoading(true);
    try {
      await deleteOffer(offer.id);
      setOffers((prev) => prev.filter((o) => o.id !== offer.id));
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    setOffers((prev) => {
      const next = [...prev];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      return next;
    });
  };

  const toggleStatus = async (offer: Offer) => {
    setLoading(true);
    try {
      const updated = await updateOffer(offer.id, {
        ...offer,
        status: !offer.status,
      });
      setOffers((prev) => prev.map((o) => (o.id === offer.id ? updated : o)));
    } finally {
      setLoading(false);
    }
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
            <DialogContent className='w-[90%] max-w-xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>{editingOffer ? 'Edit' : 'Add'} Offer</DialogTitle>
              </DialogHeader>
              <OfferForm
                offer={editingOffer || emptyOffer()}
                menus={menus}
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
      {loading && <div className='mt-4 text-center'>Loading...</div>}
    </div>
  );
}

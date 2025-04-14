// 'use client';

// import { useState } from 'react';
// import { Plus, Pencil, Trash2 } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '@/components/ui/table';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger
// } from '@/components/ui/dialog';

// import { Offer } from '@/types/offer';
// import { OfferForm } from '@/components/offer/offer-form';

// export default function OffersPage() {
//   const [offers, setOffers] = useState<Offer[]>([]);
//   const [selectedOffer, setSelectedOffer] = useState<Offer | undefined>(undefined);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const handleAddOffer = (newOffer: Omit<Offer, 'id'>) => {
//     const offerWithId = {
//       ...newOffer,
//       id: `offer_${Date.now()}`, // Temporary ID generation
//     };
//     setOffers(prevOffers => [...prevOffers, offerWithId]);
//     setIsDialogOpen(false);
//   };

//   const handleEditOffer = (updatedOffer: Offer) => {
//     setOffers(prevOffers =>
//       prevOffers.map(offer =>
//         offer.id === updatedOffer.id ? updatedOffer : offer
//       )
//     );
//     setIsDialogOpen(false);
//     setSelectedOffer(undefined);
//   };

//   const handleDeleteOffer = (offerId: string) => {
//     setOffers(prevOffers =>
//       prevOffers.filter(offer => offer.id !== offerId)
//     );
//   };

//   const openEditDialog = (offer: Offer) => {
//     setSelectedOffer(offer);
//     setIsDialogOpen(true);
//   };

//   return (
//     <div className='container mx-auto px-4 py-6'>
//       <div className='flex justify-between items-center mb-6'>
//         <h1 className='text-2xl font-bold'>Offers Management</h1>
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <Button onClick={() => setSelectedOffer(undefined)}>
//               <Plus className='mr-2 h-4 w-4' /> Add New Offer
//             </Button>
//           </DialogTrigger>
//           <DialogContent className='sm:max-w-[800px]'>
//             <DialogHeader>
//               <DialogTitle>
//                 {selectedOffer ? 'Edit Offer' : 'Create New Offer'}
//               </DialogTitle>
//             </DialogHeader>
//             <OfferForm
//               initialData={selectedOffer}
//               onSubmit={selectedOffer ? handleEditOffer : handleAddOffer}
//             />
//           </DialogContent>
//         </Dialog>
//       </div>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Name</TableHead>
//             <TableHead>Type</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Display Order</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {offers.map((offer) => (
//             <TableRow key={offer.id}>
//               <TableCell>{offer.name}</TableCell>
//               <TableCell>{offer.offerType}</TableCell>
//               <TableCell>{offer.status}</TableCell>
//               <TableCell>{offer.displayOrder}</TableCell>
//               <TableCell>
//                 <div className='flex space-x-2'>
//                   <Button
//                     variant='outline'
//                     size='sm'
//                     onClick={() => openEditDialog(offer)}
//                   >
//                     <Pencil className='h-4 w-4' />
//                   </Button>
//                   <Button
//                     variant='destructive'
//                     size='sm'
//                     onClick={() => handleDeleteOffer(offer.id!)}
//                   >
//                     <Trash2 className='h-4 w-4' />
//                   </Button>
//                 </div>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

import React from 'react';

const OffersPage = () => {
  return <div>OffersPage</div>;
};

export default OffersPage;

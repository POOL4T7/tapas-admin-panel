'use client';
import { Offer } from '@/types/offer';
import { DraggableTable } from '@/components/ui/draggable-table';
import { DraggableRow } from '@/components/ui/draggable-row';
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Gift } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';
import React from 'react';

interface OfferTableProps {
  offers: Offer[];
  onEdit: (offer: Offer) => void;
  onDelete?: (offer: Offer) => void;
  onReorder?: (oldIndex: number, newIndex: number) => void;
  onStatusToggle?: (offer: Offer, status: boolean) => void;
}

export function OfferTable({
  offers,
  onEdit,
  onDelete,
  onReorder,
  onStatusToggle,
}: OfferTableProps) {
  const headers = [
    'S.No',
    'Name',
    'Menu ID',
    'Offer Image',
    'Description',
    'Food Info',
    'Food Price',
    'Drink Info',
    'Drink Price',
    'Status',
    'Actions',
  ];

  const handleReorder = onReorder || (() => {});

  return (
    <TooltipProvider>
      <div className='rounded-md shadow-sm'>
        <DraggableTable
          items={offers.map((o) => ({ id: String(o.id) }))}
          onReorder={handleReorder}
          headers={headers}
        >
          {offers.map((offer, index) => (
            <DraggableRow key={String(offer.id)} id={String(offer.id)}>
              <TableCell className='text-center font-mono text-sm'>
                {index + 1}
              </TableCell>
              <TableCell className='font-medium'>{offer.name}</TableCell>
              <TableCell>{offer.menuId}</TableCell>
              <TableCell>
                {offer.offerImagePath && (
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_SERVER_URL + offer.offerImagePath
                    }
                    alt='Offer'
                    width={50}
                    height={50}
                    className='rounded border object-cover'
                  />
                )}
              </TableCell>
              <TableCell className='truncate max-w-xs'>
                {offer.description}
              </TableCell>
              <TableCell className='truncate max-w-xs'>
                {offer.foodItemsInfo}
              </TableCell>
              <TableCell>{offer.foodItemsPrice}</TableCell>
              <TableCell className='truncate max-w-xs'>
                {offer.drinkItemsInfo}
              </TableCell>
              <TableCell>{offer.drinkItemsPrice}</TableCell>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger>
                    <Switch
                      checked={!!offer.isActive}
                      onCheckedChange={
                        onStatusToggle
                          ? (checked) => onStatusToggle(offer, checked)
                          : undefined
                      }
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {offer.isActive ? 'Deactivate' : 'Activate'}
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-1'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => onEdit(offer)}
                        className='h-8 w-8 rounded-full hover:bg-blue-50 hover:text-blue-600'
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit Offer</TooltipContent>
                  </Tooltip>
                  {onDelete && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => onDelete(offer)}
                          className='h-8 w-8 rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-600'
                        >
                          <Trash className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Offer</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </TableCell>
            </DraggableRow>
          ))}
        </DraggableTable>
        {offers.length === 0 && (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='rounded-full bg-slate-100 p-3 mb-3'>
              <Gift className='h-6 w-6 text-slate-400' />
            </div>
            <h3 className='text-lg font-medium'>No offers found</h3>
            <p className='text-sm text-muted-foreground mt-1'>
              Create an offer to get started
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

export default OfferTable;

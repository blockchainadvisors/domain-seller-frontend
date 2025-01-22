"use client"

import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import useFetch from '@/services/api/use-fetch'
import { API_URL } from '@/services/api/config'
import moment from 'moment'

export default function Offers() {
  const fetch = useFetch();
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      let currentPage = 1; // Start with the first page
      let hasNextPage = true; // Initialize with true to enter the loop
      const availableOffers = []; // Array to store the results

      while (hasNextPage) {
          const requestUrl = new URL(`${API_URL}/v1/offers?page=${currentPage}`);

          try {
              const res = await fetch(requestUrl);
              if (!res.ok) {
                  throw new Error(`Error fetching page ${currentPage}: ${res.statusText}`);
              }

              const body = await res.json();

              // Add the current page's data to the domains array
              if (body.data) {
                availableOffers.push(...body.data); // Assuming data.items contains the domains
              }

              // Update hasNextPage and increment the page number
              hasNextPage = body.hasNextPage;
              currentPage++;
          } catch (error) {
              console.error(`Failed to fetch data for page ${currentPage}:`, error);
              break; // Exit the loop on error
          }
      }

      // Only show pending offers
      setOffers(availableOffers.filter(offer => (offer.status == "PENDING")));
    })();
  }, []);
  
  return (
    <div>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Offers</h1>
      </div>

      <ul className={`grid sm:grid-cols-1 md:grid-cols-3 gap-2 my-5`}>
        {
          offers.map((offer, i) => (
            <li
              key={i}
              className={`flex flex-col bg-primary text-white rounded-md p-5`}
            >
              <div className='flex items-center justify-between'>
                <p className="pb-5 text-secondary font-bold">Domain.com</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-3 w-full">
                <div className="flex flex-col w-full">
                  <label className="font-bold">Offer Received:</label>
                  <span className='text-green-300 font-bold'>${offer.offer_amount}</span>
                  <small className='text-muted my-2'><span className='font-bold'>From:</span> {offer.user_id.first_name} - <i>{moment(offer.created_at).fromNow(true)} ago</i></small>
                </div>
              </div>

              <div className='flex flex-col gap-2 my-5'>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary">
                      Accept
                    </Button>
                  </DialogTrigger>
                  <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                      <DialogTitle>Accept Offer</DialogTitle>
                    </DialogHeader>

                    <p>This action cannot be reverted. Would you like to proceed?</p>

                    <DialogFooter>
                      <DialogTrigger asChild>
                        <Button variant="destructive">
                          No
                        </Button>
                      </DialogTrigger>
                      <Button type="submit">Yes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      Counter Offer
                    </Button>
                  </DialogTrigger>
                  <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                      <DialogTitle>Counter Offer</DialogTitle>
                      <DialogDescription>
                        Enter your counter offer
                      </DialogDescription>
                    </DialogHeader>

                    <div className='border border-secondary p-3 rounded-md'>
                      <p>Offer Received: <span className='text-secondary font-bold'>${offer.offer_amount}</span></p>
                    </div>

                    <div className='flex flex-col gap-2'>
                      <label className='font-bold'>Your offer:</label>
                      <Input placeholder='0.00' type="number" />
                    </div>

                    <DialogFooter>
                      <Button type="submit">Send offer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                      <DialogTitle>Reject Offer</DialogTitle>
                    </DialogHeader>

                    <p>This action cannot be reverted. Would you like to proceed?</p>

                    <DialogFooter>
                      <DialogTrigger asChild>
                        <Button variant="destructive">
                          No
                        </Button>
                      </DialogTrigger>
                      <Button type="submit">Yes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

            </li>
          ))
        }
      </ul>
    </div>
  )
}

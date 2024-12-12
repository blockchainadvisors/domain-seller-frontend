
"use client"; 

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import  useDomain from "@/services/domains/use-domains";
import { Domain } from '@/services/domains/domains-context';
import React, { useEffect, useState } from 'react'


export default function Bid() {
    // const { selectDomain, clearSelectedDomain } = useDomainActions();
    const { selectedDomain } = useDomain();
    const [currentDomain, setCurrentDomain] = useState<Domain | undefined>(undefined);
    useEffect(() => {
        if (selectedDomain) {
          setCurrentDomain(selectedDomain); // Store the whole domain object
        }
      }, [selectedDomain]);
    // Handling actions (Place Bid, Lease, etc.)
  const handlePlaceBid = () => {
    // Implement the logic to place a bid
    console.log("Placing bid...");
  };

  const handleLeaseNow = () => {
    // Implement the logic for leasing the domain
    console.log("Leasing domain...");
  };

  const handleMakeOffer = () => {
    // Implement the logic for making an offer
    console.log("Making an offer...");
  };
  return (
    <div className='w-full'>
        <div className='relative w-full h-[40vh] -z-[1]'>
            <img src="/domains-bid-banner.png" alt="Banner" className='absolute w-full h-full object-cover' />
            
            <div className='absolute w-full text-white mt-[120px] py-5 px-24 text-center'>
                <h1 className='text-4xl font-semibold'>Unlock your brand with</h1>
                <p className='text-3xl mt-2'>InnovateSphere.com</p>
            </div>
        </div>

        <div className='flex mx-24 mb-10 items-center gap-10 h-full'>
            <div className='w-full h-full'>
                <h2 className='text-xl my-10'>Choose your option to gain access to InnovateSpehere.com</h2>

                <div className='flex flex-col'>
                    <label className='text-lg'>Place your Bid </label>
                    <strong className='text-secondary'>Current Bid: {currentDomain?.current_bid}</strong>

                    <Input placeholder="Enter your offer..." />

                    <small className='text-muted mb-2'>Learn more how our bidding works in our <a href="#">auction guide</a></small>
                    <Button variant="secondary" className='self-start'>Place Bid</Button>
                </div>

                <hr className='my-5'/>

                <div className='flex flex-col'>
                    <label className='text-lg'>Lease Instantly</label>
                    <strong className='text-secondary'>Lease Price: {currentDomain?.lease_price}</strong>

                    <small className='text-muted mb-2'>Secure this premium domain instantly by leasing it at the set price</small>
                    <Button variant="secondary" className='self-start'>Lease Now</Button>
                </div>

                <hr className='my-5'/>

                <div className='flex flex-col'>
                    <label className='text-lg'>Make Your Offer</label>
                    <strong className='text-secondary'>Interested in this domain? Submit your best offer</strong>

                    <Input placeholder="Enter your offer..." />

                    <small className='text-muted mb-2'>Secure this premium domain instantly by leasing it at the set price</small>
                    <Button variant="secondary" className='self-start'>Lease Now</Button>
                </div>
            </div>

            <div className='h-full w-full'>
                <img src="/domain-bid-overview.png" alt="Domain Bid Overview" />
            </div>
        </div>
    
    </div>
  )
}

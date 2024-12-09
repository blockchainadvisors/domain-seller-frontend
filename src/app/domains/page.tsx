import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

export default function Domains() {
  return (
    <div className='w-full'>
        <div className='relative w-full h-[50vh] -z-[1]'>
            <img src="/domains-banner.png" alt="Banner" className='absolute w-full h-full object-cover' />
            
            <div className='absolute w-full text-white mt-[120px] py-5 px-24'>
                <h1 className='text-4xl font-semibold'>Find your next domains within minutes...</h1>
                <p className='mt-5 text-muted'>Discover premium Discover premium domains, place bids, or lease instantly. Start your search now and secure the perfect name for your project! domains, place bids, or lease instantly. Start your search now and secure the perfect name for your project!</p>
            </div>
        </div>
        
        <div className="-mt-[90px] mx-24 px-10 bg-primary p-10 px-24 flex flex-col gap-5 rounded-md">
            <h2 className='text-muted text-2xl'>Search for a domain</h2>
            
            <div className="flex gap-2">
                <Input placeholder='Search for a domain name...' />
                <Button variant='secondary'>Search</Button>
            </div>
        </div>

        <div className='mx-24 my-[12px]'>
            <strong>324 results found</strong>

            <ul className='flex flex-col gap-3 mt-5'>
                {
                    [...Array(5)].map((item, i) => (
                        <li key={i} className='flex items-center justify-between bg-primary text-white rounded-md p-5'>
                            <div className='flex flex-col gap-3 w-full'>
                                innovatesphere.com

                                <div className='flex flex-col'>
                                    <label className='font-bold'>Price:</label>
                                    <span>$32.32</span>
                                </div>
                            </div>

                            <div className='flex flex-col gap-3 w-full'>
                                <div className='flex flex-col'>
                                    <label className='font-bold'>Number of bids:</label>
                                    <span>32</span>
                                </div>
                                <div className='flex flex-col'>
                                    <label className='font-bold'>Time left:</label>
                                    <span>4 mins</span>
                                </div>
                            </div>

                            <Button variant="secondary" className='w-full'>
                                Bid now
                            </Button>
                        </li>
                    ))
                }
            </ul>
        </div>
    </div>
  )
}

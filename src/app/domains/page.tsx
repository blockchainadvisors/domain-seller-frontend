"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { API_URL } from '@/services/api/config';
import useFetch from '@/services/api/use-fetch';
import wrapperFetchJsonResponse from '@/services/api/wrapper-fetch-json-response';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import useDomainActions from '@/services/domains/use-domains-actions';
import { Domain } from '@/services/domains/domains-context';

export default function Domains() {
 
  const { selectDomain } = useDomainActions(); 

    const handleSelectDomain = (domain: Domain) => {
      selectDomain(domain);
    };
  
    const [domains, setDomains] = useState<any[]>([]);
    const [filteredDomains, setFilteredDomains] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);

    const [searchText, setSearchText] = useState<string>('');
    const fetch = useFetch();

    const getDomains = async () => {
        const requestUrl = new URL(`${API_URL}/v1/auctions/available/domain`);

        const res = await fetch(requestUrl, {
            method: "GET"
        });

        const { status, data } = await wrapperFetchJsonResponse(res);
        const responseData = (data as any).data;
        const responseTotal = (data as any).total;

        if (status >= 200) {
            console.log(responseData);
            setDomains(responseData);
            setFilteredDomains(responseData);
            setTotal(responseTotal);
        }
    }

    useEffect(() => {
        (async () => {
            await getDomains();
        })();
    }, []);

    useEffect(() => {
        if (!searchText.length) {
            setFilteredDomains(domains);
        }

        const debounce = setTimeout(() => {
            if (searchText) {
                const items = filteredDomains.filter((item) =>
                    item.url.toLowerCase().startsWith(searchText.toLowerCase())
                )

                setFilteredDomains(items);
            }
        }, 500);

        return () => clearTimeout(debounce);
    }, [searchText]);

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
                    <Input placeholder='Search for a domain name...' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                    <Button variant='secondary'>Search</Button>
                </div>
            </div>

            <div className='mx-24 my-[12px]'>
                <strong>{total} results found</strong>

                <ul className='flex flex-col gap-3 mt-5'>
                    {
                        filteredDomains.length ?
                            filteredDomains.map((domain: any, i: number) => (
                                <li key={i} className='flex items-center justify-between bg-primary text-white rounded-md p-5'>
                                    <div className='flex flex-col gap-3 w-full'>
                                        {domain.url}

                                        <div className='flex flex-col'>
                                            <label className='font-bold'>Price:</label>
                                            <span>${domain.current_bid}</span>
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-3 w-full'>
                                        <div className='flex flex-col'>
                                            <label className='font-bold'>Number of bids:</label>
                                            <span>{domain.total_bids}</span>
                                        </div>
                                        <div className='flex flex-col'>
                                            <label className='font-bold'>Time left:</label>
                                            <span>{domain.end_time}</span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                        asChild
                                        onClick={() => handleSelectDomain(domain)}
                                    >
                                        <Link href={`/domains/${domain.id}`}>
                                        Bid now
                                        </Link>
                                    </Button>
                                </li>
                            ))
                        :
                            <p>No domains available</p>
                    }
                </ul>
            </div>
        </div>
    )
}

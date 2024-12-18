"use client"

import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import withPageRequiredAuth from '@/services/auth/with-page-required-auth'
import useFetch from '@/services/api/use-fetch'
import wrapperFetchJsonResponse from '@/services/api/wrapper-fetch-json-response'
import { API_URL } from '@/services/api/config'
import Link from 'next/link'

function MyBids() {
    const [bids, setBids] = useState<any[]>([]);
    const fetch = useFetch();

    const getBids = async () => {
        const requestUrl = new URL(`${API_URL}/v1/bids/users/my-bids`);

        const res = await fetch(requestUrl, {
            method: "GET"
        });

        const { status, data } = await wrapperFetchJsonResponse(res);
        const responseData = (data as any).data;

        if (status >= 200) {
            setBids(responseData);
        }
    }

    useEffect(() => {
        getBids();
    }, []);

    return (
        <div className='flex flex-col gap-5 mt-5'>
            <h1 className='text-2xl font-bold'>My Active Bids</h1>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Domain</TableHead>
                        <TableHead>Bid Date</TableHead>
                        <TableHead>Auction End Date</TableHead>
                        <TableHead>Auction Status</TableHead>
                        <TableHead>Bid Amount</TableHead>
                        <TableHead>Current Bid</TableHead>
                        <TableHead className="text-right">Bid Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        bids.length ?
                            bids.map((bid, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium">
                                        <Link href={`/domains/${bid.auction_id.id}`}>
                                            {bid.url}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {bid.created_at}
                                    </TableCell>
                                    <TableCell>
                                        {bid.auction_id.end_time}
                                    </TableCell>
                                    <TableCell>
                                        {bid.auction_status}
                                    </TableCell>
                                    <TableCell>
                                        {bid.amount}
                                    </TableCell>
                                    <TableCell>
                                        {bid.auction_id.current_bid}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {bid.bid_status}
                                    </TableCell>
                                </TableRow>
                            )) :
                        <TableRow>
                            <TableCell>No bids</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default withPageRequiredAuth(MyBids)

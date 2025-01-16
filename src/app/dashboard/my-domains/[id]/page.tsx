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

import { Button } from '@/components/ui/button'
import { API_URL } from "@/services/api/config";
import wrapperFetchJsonResponse from '@/services/api/wrapper-fetch-json-response';
import useFetch from '@/services/api/use-fetch';
import { useParams } from 'next/navigation';
import { useMyDomain } from '@/services/domains/my-domains-provider';

export default function MyDomain() {
    const { domain } = useMyDomain();

    return (
        domain ?
            <div className="flex flex-col gap-5 mt-5">

                <h4 className="text-xl font-semibold">Overview</h4>

                {
                    domain ?
                        <ul className='list-disc ml-5'>
                            <li><strong>Status:</strong> {domain.status}</li>
                            <li><strong>Expires:</strong> {domain.expires}</li>
                            <li><strong>Locked:</strong> {domain.locked ? 'YES' : 'NO'}</li>
                            <li><strong>Privacy:</strong> {domain.privacy ? 'YES' : 'NO'}</li>
                            <li><strong>Auto-Renew:</strong> {domain.renewAuto ? 'YES' : 'NO'}</li>
                            <li><strong>Renew Deadline:</strong> {domain.renewDeadline}</li>
                        </ul>
                    : '...'
                }
            </div>
        : '...'
    )
}

"use client"

import React from 'react'
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

function MyDomains() {
    return (
        <div className='flex flex-col gap-5 mt-5'>
            <h1 className='text-2xl font-bold'>My Domains</h1>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow key={1}>
                        <TableCell className="font-medium">1</TableCell>
                        <TableCell>Hello</TableCell>
                        <TableCell>Never</TableCell>
                        <TableCell className="text-right">56</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

export default withPageRequiredAuth(MyDomains)

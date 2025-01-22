"use client"

import useAuth from '@/services/auth/use-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user } = useAuth();
    const pathname = usePathname();

    if (!user) return <p>...</p>


    return (
        <div>
            <ul className='flex gap-5 border border-primary/30 p-2 rounded-md'>
                <li className='group'>
                    <Link href="/dashboard/admin" className={`text-black group-hover:text-secondary group-hover:font-bold ${pathname == '/dashboard/admin' ? 'text-secondary font-bold' : ''}`}>Dashboard</Link>
                </li>
                <li>
                    <Link href="/dashboard/admin/auctions" className={`text-black group-hover:text-secondary group-hover:font-bold ${pathname == '/dashboard/admin/auctions' ? 'text-secondary font-bold' : ''}`}>Auction</Link>
                </li>
                <li>
                    <Link href="/dashboard/admin/offers" className={`text-black group-hover:text-secondary group-hover:font-bold ${pathname == '/dashboard/admin/offers' ? 'text-secondary font-bold' : ''}`}>Offers</Link>
                </li>
            </ul>

            <div className='mt-5'>
                {children}
            </div>
        </div>
    )
}

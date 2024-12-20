"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const pathname = usePathname();

    return (
        <div className='mt-[100px] flex flex-col min-h-screen px-24 w-full h-full mb-5'>
            <div className='flex flex-grow h-full gap-5'>
                <ul className='bg-primary text-white grow p-5 rounded-xl stretch text-lg flex flex-col gap-5'>
                    <li>
                        <Link href="/dashboard/my-bids" className={pathname == '/dashboard/my-bids' ? 'font-bold text-secondary' : 'text-white'}>My Bids</Link>
                    </li>
                    <li>
                        <Link href="/dashboard/my-domains" className={pathname == '/dashboard/my-domains' ? 'font-bold text-secondary' : 'text-white'}>My Domains</Link>
                    </li>
                    <li>
                        <Link href="/dashboard/my-payments" className={pathname == '/payment' ? 'font-bold text-secondary' : 'text-white'}>My Payments</Link>
                    </li>
                    <li>
                        <Link href="/dashboard/settings" className={pathname == '/dashboard/settings' ? 'font-bold text-secondary' : 'text-white'}>Settings</Link>
                    </li>
                  
                </ul>

                <div className='grow-[3] h-full'>
                    {children}
                </div>
            </div>
        </div>
    )
}

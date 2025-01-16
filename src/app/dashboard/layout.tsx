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
        <div className="mt-[100px] px-5 lg:px-24 w-full lg:h-screen mb-5">
            <div className="grid grid-cols-1 lg:grid-cols-4 w-full h-full gap-5">
                {/* Sidebar */}
                <ul className="bg-primary text-white p-5 rounded-xl text-md flex flex-col gap-5">
                    <li>
                        <Link
                            href="/dashboard/my-bids"
                            className={pathname == '/dashboard/my-bids' ? 'font-bold text-secondary' : 'text-white'}
                        >
                            My Bids
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/my-domains"
                            className={pathname == '/dashboard/my-domains' ? 'font-bold text-secondary' : 'text-white'}
                        >
                            My Domains
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/my-payments"
                            className={pathname == '/dashboard/my-payments' ? 'font-bold text-secondary' : 'text-white'}
                        >
                            My Payments
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/settings"
                            className={pathname == '/dashboard/settings' ? 'font-bold text-secondary' : 'text-white'}
                        >
                            Settings
                        </Link>
                    </li>
                </ul>

                {/* Content Section */}
                <div className="col-span-1 lg:col-span-3 h-full">
                    {children}
                </div>
            </div>
        </div>

    )
}

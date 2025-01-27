"use client"

import useAuth from '@/services/auth/use-auth';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import React from 'react'

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const { user, isLoaded } = useAuth();

    if (isLoaded && !user) return redirect("/auth/login");
    
    const NavLink = ({ title, path }: { title: string; path: string }) => {
        const isActivePath = pathname === path;
    
        return (
            <li
                className={`group relative pl-3 ${
                    isActivePath ? "font-bold" : ""
                }`}
            >
                {/* Rounded Border */}
                <span
                    className={`absolute left-0 top-0 h-full transition-all duration-300 ${
                        isActivePath
                            ? "w-1 bg-secondary rounded-md"
                            : "w-0 bg-secondary group-hover:w-1 group-hover:rounded-md"
                    }`}
                ></span>
    
                {/* Link text */}
                <Link
                    href={path}
                    className={`block transition-all duration-300 ${
                        isActivePath
                            ? "text-secondary font-bold"
                            : "text-white group-hover:text-secondary"
                    }`}
                >
                    {title}
                </Link>
            </li>
        );
    };
       

    return (
        <div className="mt-[100px] px-5 lg:px-24 w-full mb-5">
            <div className="grid grid-cols-1 lg:grid-cols-4 w-full h-full gap-5">
                {/* Sidebar */}
                <ul className="bg-primary text-white p-5 rounded-xl text-md flex flex-col gap-5">
                    <NavLink title="My Bids" path="/dashboard/my-bids" />
                    <NavLink title="My Domains" path="/dashboard/my-domains" />
                    <NavLink title="My Payments" path="/dashboard/my-payments" />
                    <NavLink title="Settings" path="/dashboard/settings" />

                    {
                        // @ts-ignore
                        (user && user.role.id >= 1) && (
                            <>
                            <hr />
                            <NavLink title="Admin" path="/dashboard/admin" />
                            </>
                        )
                    }
                </ul>

                {/* Content Section */}
                <div className="col-span-1 lg:col-span-3 h-full">
                    {children}
                </div>
            </div>
        </div>

    )
}

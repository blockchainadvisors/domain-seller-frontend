"use client"

import { Button } from '@/components/ui/button'
import useAuth from '@/services/auth/use-auth'
import useAuthActions from '@/services/auth/use-auth-actions'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { logOut } = useAuthActions();

  return (
    <nav className='fixed top-0 left-0 w-full flex items-center text-white py-5 px-24 justify-between z-[99] bg-primary' aria-label="Header">
      <span>Domain<span className='font-bold text-secondary'>Seller</span></span>

      <ul className='flex gap-5'>
        <li><Link href="/" className={pathname == '/' ? 'text-secondary font-bold' : 'text-white'}>Home</Link></li>
        <li><Link href="/domains" className={pathname == '/domains' ? 'text-secondary font-bold' : 'text-white'}>Domains</Link></li>
        <li><Link href="/" className={pathname == '/testimonials' ? 'text-secondary font-bold' : 'text-white'}>Testimonials</Link></li>
      </ul>

      <div className='flex items-center gap-2'>
        {
          user ?
          <>
            <Button variant="secondary" asChild>
              <Link href="/dashboard/my-bids">Dashboard</Link>
            </Button>
            <Button variant="outline"onClick={logOut}>
              Logout
            </Button>
          </>
          :
          <>
            <Button variant="secondary" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/register">Sign Up</Link>
            </Button>
          </>
        }
      </div>
    </nav>

  )
}

"use client"

import { Button } from '@/components/ui/button'
import useAuth from '@/services/auth/use-auth'
import useAuthActions from '@/services/auth/use-auth-actions'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname = usePathname();
  const [openMobileNav, setOpenMobileNav] = useState<boolean>(false);

  const { user } = useAuth();
  const { logOut } = useAuthActions();

  const pageLinks = [
    { title: "Home", page: "/" },
    { title: "Domains", page: "/domains" },
    { title: "Testimonials", page: "#" }
  ];

  useEffect(() => {
    if (openMobileNav) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "initial";
    }
  }, [openMobileNav])

  useEffect(() => {
    if (openMobileNav) setOpenMobileNav(false);
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 w-full grid grid-cols-3 items-center text-white py-5 px-5 lg:px-24 z-[99] bg-primary" aria-label="Header">
      {/* Logo */}
      <div className="flex justify-start">
        <span>Domain<span className="font-bold text-secondary">Seller</span></span>
      </div>

      {/* Centered Links */}
      <ul className="hidden lg:flex justify-center gap-5">
        {
          pageLinks.map((link, i) => (
            <li key={i}>
              <Link href={link.page} className={pathname == link.page ? 'text-secondary font-bold' : 'text-white'}>
                {link.title}
              </Link>
            </li>
          ))
        }
      </ul>

      {/* Buttons */}
      <div className="hidden lg:flex justify-end gap-2">
        {user ? (
          <>
            <Button variant="secondary" asChild>
              <Link href="/dashboard/my-bids">Dashboard</Link>
            </Button>
            <Button variant="outline" onClick={logOut}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/register">Sign Up</Link>
            </Button>
          </>
        )}
      </div>

      <div className='col-span-2 flex lg:hidden items-center justify-end'>
        <Button size="sm" onClick={() => setOpenMobileNav(!openMobileNav)}>
          <img src="/menu.svg" />
        </Button>
      </div>

      {
        openMobileNav ?
          <div className='fixed top-0 left-0 bg-primary w-full h-full flex flex-col gap-5 items-center justify-center'>
            <Button variant="secondary" className='rounded-full fixed top-5 right-5' onClick={() => setOpenMobileNav(!openMobileNav)}>X</Button>

            <ul className="flex flex-col items-center justify-center gap-5">
              {
                pageLinks.map((link, i) => (
                  <li key={i}>
                    <Link href={link.page} className={pathname == link.page ? 'text-secondary font-bold' : 'text-white'}>
                      {link.title}
                    </Link>
                  </li>
                ))
              }
            </ul>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              {user ? (
                <>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href="/dashboard/my-bids">Dashboard</Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={logOut}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/auth/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          : <></>
      }
    </nav>
  )
}

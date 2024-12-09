import React from 'react'

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div className='flex gap-10 justify-between mt-[120px] mb-10 px-10'>
        <div className='w-full mt-20'>
            {children}
        </div>

        <div className='w-full'>
            <img src="/auth-image.png" alt="" />
        </div>
    </div>
  )
}

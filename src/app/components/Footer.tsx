import React from 'react'

export default function Footer() {
  return (
    <div className='flex flex-col justify-center gap-10 text-center text-sm bg-primary text-white p-10'>
        <div className="flex flex-col md:flex-row justify-center gap-10">
            <ul className='flex flex-col gap-3'>
                <li>Domains</li>
                <li>Owners</li>
                <li>How It Works</li>
            </ul>

            <ul className='flex flex-col gap-3'>
                <li>FAQs</li>
                <li>Blog</li>
                <li>Testimonials</li>
            </ul>

            <ul className='flex flex-col gap-3'>
                <li>Success Stories</li>
                <li>Affiliates</li>
                <li>Studio</li>
            </ul>

            <ul className='flex flex-col gap-3'>
                <li>About</li>
                <li>Why Venture</li>
                <li>Resources</li>
            </ul>
        </div>

        <p className='text-center text-muted'>Made with ♥︎ by Blockchain Advisors Ltd</p>
    </div>
  )
}

"use client"

import React from 'react'
import withPageRequiredAuth from '@/services/auth/with-page-required-auth'

function Settings() {
    return (
        <div className='flex flex-col gap-5 mt-5'>
            <h1 className='text-2xl font-bold'>Settings</h1>

            <p>Coming soon...</p>
        </div>
    )
}

export default withPageRequiredAuth(Settings)
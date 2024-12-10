"use client"

import React from 'react'
import Link from 'next/link'
import withPageRequiredAuth from '@/services/auth/with-page-required-auth'

function Dashboard() {
    return (
        <p>Dashboard Page</p>
    )
}

export default withPageRequiredAuth(Dashboard)
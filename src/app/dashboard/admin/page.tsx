"use client"

import { API_URL } from '@/services/api/config'
import { RoleEnum } from '@/services/api/types/role'
import useFetch from '@/services/api/use-fetch'
import useAuth from '@/services/auth/use-auth'
import withPageRequiredAuth from '@/services/auth/with-page-required-auth'
import React, { useEffect, useState } from 'react'

function AdminPage() {
    const fetch = useFetch();

    const [totalRunningAuctions, setTotalRunningAuctions] = useState<number>(0);
    const [totalEndedAuctions, setTotalEndedAuctions] = useState<number>(0);
    const [totalSales, setTotalSales] = useState<number>(0);

    useEffect(() => {
        const getAvailableDomains = async () => {
            let currentPage = 1; // Start with the first page
            let hasNextPage = true; // Initialize with true to enter the loop
            const auctions = []; // Array to store the results

            while (hasNextPage) {
                const requestUrl = new URL(`${API_URL}/v1/auctions?page=${currentPage}`);

                try {
                    const res = await fetch(requestUrl);
                    if (!res.ok) {
                        throw new Error(`Error fetching page ${currentPage}: ${res.statusText}`);
                    }

                    const body = await res.json();

                    // Add the current page's data to the domains array
                    if (body.data) {
                        auctions.push(...body.data); // Assuming data.items contains the domains
                    }

                    // Update hasNextPage and increment the page number
                    hasNextPage = body.hasNextPage;
                    currentPage++;
                } catch (error) {
                    console.error(`Failed to fetch data for page ${currentPage}:`, error);
                    break; // Exit the loop on error
                }
            }

            // Get all domains that are listed (ready to auction)
            setTotalRunningAuctions(auctions.filter(auction => (auction.status === "ACTIVE")).length);
            setTotalEndedAuctions(auctions.filter(auction => (auction.status === "ENDED")).length);
        }

        const getTotalSales = async () => {
            let currentPage = 1; // Start with the first page
            let hasNextPage = true; // Initialize with true to enter the loop
            const payments = []; // Array to store the results

            while (hasNextPage) {
                const requestUrl = new URL(`${API_URL}/v1/payments?page=${currentPage}`);

                try {
                    const res = await fetch(requestUrl);
                    if (!res.ok) {
                        throw new Error(`Error fetching page ${currentPage}: ${res.statusText}`);
                    }

                    const body = await res.json();

                    // Add the current page's data to the domains array
                    if (body.data) {
                        payments.push(...body.data); // Assuming data.items contains the domains
                    }

                    // Update hasNextPage and increment the page number
                    hasNextPage = body.hasNextPage;
                    currentPage++;
                } catch (error) {
                    console.error(`Failed to fetch data for page ${currentPage}:`, error);
                    break; // Exit the loop on error
                }
            }

            // --------------
            // Old way
            // --------------
            // // Filter to find all paid payments first
            // const paidPayments = payments.filter(payment => (payment.status === "PAID"));
            // // Then total the amount
            // const totalPaid = paidPayments.reduce((previousValue, currentValue) => {
            //     return previousValue + parseInt(currentValue.amount)
            // }, 0);

            // -------------
            // New Way
            // -------------
            // Converting it into 1 loop instead of 2 like above, better performance
            const totalPaid = payments.reduce((total, payment) => {
                return payment.status === 'PAID' ? (total + parseInt(payment.amount)) : total;
            }, 0)

            setTotalSales(totalPaid);
        }

        getTotalSales();
        getAvailableDomains();
    }, []);

    return (
        <div>
            <p>Total Running Auctions: <span className='font-bold'>{totalRunningAuctions}</span></p>
            <p>Total Ended Auctions: <span className="font-bold">{totalEndedAuctions}</span></p>
            <p>Total Sales: <span className="font-bold">${totalSales}</span></p>
        </div>
    )
}


export default withPageRequiredAuth(AdminPage, { roles: [RoleEnum.ADMIN] })
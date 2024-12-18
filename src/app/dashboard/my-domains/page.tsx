"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { API_URL } from "@/services/api/config";
import wrapperFetchJsonResponse from "@/services/api/wrapper-fetch-json-response";
import useFetch from '@/services/api/use-fetch'


type Domain = {
    id: string;
    url: string;
    registration_date: string;
    renewal_price: string;
    status: string;
    expiry_duration: string; // Duration in months
};

function MyDomains() {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetch = useFetch();


    // Helper function to calculate expiration date
    const calculateExpirationDate = (registrationDate: string, duration: string): Date => {
        const regDate = new Date(registrationDate);
        const durationInMonths = parseFloat(duration);
        regDate.setMonth(regDate.getMonth() + durationInMonths);
        return regDate;
    };

    // Helper function to determine if the domain is expired
    const isDomainExpired = (expirationDate: Date): boolean => {
        return expirationDate < new Date();
    };

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const requestUrl = new URL(`${API_URL}/v1/domains/users/my-domains`);

                const response = await fetch(requestUrl, {
                    method: "GET"
                });

                const result = await wrapperFetchJsonResponse(response);
                const data = result.data as any
                if (result.status === 200 && data) {
                    console.log(data)
                    setDomains(data.data); // Update state with the fetched domains
                } else {
                    setError("Failed to fetch domains.");
                }
            } catch (err) {
                console.error("Error fetching domains:", err);
                setError("An error occurred. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchDomains();
    }, []);

    return (
        <div className="flex flex-col gap-5 mt-5">
            <h1 className="text-2xl font-bold">My Domains</h1>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Domain Name</TableHead>
                            <TableHead>Registration Date</TableHead>
                            <TableHead>Expiration Date</TableHead>
                            <TableHead>Renewal Price</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {domains.map((domain) => {
                            const expirationDate = calculateExpirationDate(
                                domain.registration_date,
                                domain.expiry_duration
                            );
                            const isExpired = isDomainExpired(expirationDate);

                            return (
                                <TableRow key={domain.id}>
                                    <TableCell className="font-medium">{domain.url}</TableCell>
                                    <TableCell>{new Date(domain.registration_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{expirationDate.toLocaleDateString()}</TableCell>
                                    <TableCell>${domain.renewal_price}</TableCell>
                                    <TableCell>{isExpired ? "Expired" : "Active"}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}

export default withPageRequiredAuth(MyDomains);

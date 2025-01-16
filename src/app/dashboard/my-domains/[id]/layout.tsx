"use client";

import React, { useEffect, useRef } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { API_URL } from "@/services/api/config";
import wrapperFetchJsonResponse from "@/services/api/wrapper-fetch-json-response";
import useFetch from "@/services/api/use-fetch";
import useAuth from "@/services/auth/use-auth";
import { useMyDomain } from "@/services/domains/my-domains-provider";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const fetch = useFetch();
    const { id } = useParams();
    const { isLoaded } = useAuth();
    const { domain, setDomain } = useMyDomain();

    const getDomainRecords = async () => {
        const requestUrl = new URL(`${API_URL}/v1/dns-settings/domains/${id}/records`);

        const res = await fetch(requestUrl, {
            method: "GET",
        });

        const { status, data } = await wrapperFetchJsonResponse(res);

        return status >= 200 ? data : false;
    };

    const getDomain = async () => {
        const requestUrl = new URL(`${API_URL}/v1/dns-settings/domains/${id}`);

        const res = await fetch(requestUrl, {
            method: "GET",
        });

        const { status, data } = await wrapperFetchJsonResponse(res);
        const records = await getDomainRecords();
        const domainData = { ...(data as any), dnsRecords: records };

        console.log(domainData);

        setDomain(domainData);
    };

    useEffect(() => {
        if (isLoaded) getDomain();
    }, [isLoaded]);

    const isActive = (path: string) => pathname.includes(path);

    return (
        <div className="flex flex-col flex-grow gap-5 mt-5">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/my-bids">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/my-domains">My Domains</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{domain ? domain.domain : "..."}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-2xl font-bold">Manage your domain</h1>

            <ul className="flex flex-col md:flex-row lg:items-center gap-5">
                <li
                    className={
                        isActive("/my-domains") &&
                            !isActive("/manage-dns") &&
                            !isActive("/contact-info")
                            ? "font-bold text-secondary"
                            : "text-black"
                    }
                >
                    <Link
                        href={`/dashboard/my-domains/${id}`}
                    >
                        Overview
                    </Link>
                </li>
                <li
                    className={isActive("/manage-dns") ? "font-bold text-secondary" : ""}
                >
                    <Link
                        href={`/dashboard/my-domains/${id}/manage-dns`}
                    >
                        Manage DNS
                    </Link>
                </li>
                <li
                    className={isActive("/contact-info") ? "font-bold text-secondary" : ""}
                >
                    <Link
                        href={`/dashboard/my-domains/${id}/contact-info`}
                    >
                        Contact Information
                    </Link>
                </li>
            </ul>


            <div className="flex-grow block">{children}</div>
        </div>
    );
}

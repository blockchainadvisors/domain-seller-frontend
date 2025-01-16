"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/services/api/config";
import useFetch from "@/services/api/use-fetch";
import wrapperFetchJsonResponse from "@/services/api/wrapper-fetch-json-response";
import Link from "next/link";
import Countdown from "../components/Countdown";
import useDomainActions from "@/services/domains/use-domains-actions";
import { Domain } from "@/services/domains/domains-context";
import { useSearchParams } from "next/navigation";

export default function Domains() {
  const { selectDomain } = useDomainActions();
  const searchParams = useSearchParams();
  const searchedText = ((searchParams.get("search") && (searchParams.get("search") as string).length) ? searchParams.get("search") : '') as string;

  const handleSelectDomain = (domain: Domain) => {
    selectDomain(domain);
  };
  
  const [domains, setDomains] = useState<any[]>([]);
  const [filteredDomains, setFilteredDomains] = useState<any[]>([]);
  const [expiredDomains, setExpiredDomains] = useState<string[]>([]); // Track expired domains
  const [total, setTotal] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const fetch = useFetch();

  useEffect(() => {
    if (!searchedText || !searchedText.length) return;
    if (!filteredDomains.length) return;

    setSearchText(searchedText);
  }, [searchedText, domains]);

  const getDomains = async () => {
    const requestUrl = new URL(`${API_URL}/v1/auctions/available/domain`);

    const res = await fetch(requestUrl, {
      method: "GET",
    });

    const { status, data } = await wrapperFetchJsonResponse(res);
    const responseData = (data as any).data;
    const responseTotal = (data as any).total;

    if (status >= 200) {
      console.log(responseData);
      setDomains(responseData);
      setFilteredDomains(responseData);
      setTotal(responseTotal);
    }
  };

  useEffect(() => {
    (async () => {
      await getDomains();
    })();
  }, []);

  useEffect(() => {
    if (!searchText.length) {
      setFilteredDomains(domains);
    }

    const debounce = setTimeout(() => {
      if (searchText) {
        const items = filteredDomains.filter((item) =>
          item.url.toLowerCase().startsWith(searchText.toLowerCase())
        );

        setFilteredDomains(items);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchText]);

  useEffect(() => {
    console.log("Expired Domains: ", expiredDomains);
  }, [expiredDomains]);

  const handleCountdownEnd = (domainId: string) => {
    setExpiredDomains((prev) => [...prev, domainId]); // Mark domain as expired
    console.log(`Domain ${domainId} marked as expired`);
  };

  return (
    <div className="w-full">
      <div className="relative w-full h-[50vh] -z-[1]">
        <img
          src="/domains-banner.png"
          alt="Banner"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute w-full text-white mt-[60px] lg:mt-[120px] py-5 px-5 lg:px-60">
          <h1 className="text-2xl lg:text-4xl font-semibold">
            Find your next domains within minutes...
          </h1>
          <p className="text-sm lg:text-md mt-5 text-muted">
            Discover premium domains, place bids, or lease instantly. Start your
            search now and secure the perfect name for your project!
          </p>
        </div>
      </div>

      <div className="-mt-[90px] mx-5 lg:mx-60 px-5 lg:px-10 bg-primary p-10 px-24 flex flex-col gap-5 rounded-md">
        <h2 className="text-muted text-2xl">Search for a domain</h2>

        <div className="flex flex-col lg:flex-row gap-2">
          <Input
            placeholder="Search for a domain name..."
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          <Button variant="secondary">Search</Button>
        </div>
      </div>

      <div className="mx-5 lg:mx-60 my-[12px]">
        <strong>{total} results found</strong>

        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-5">
          {filteredDomains.length ? (
            filteredDomains.map((domain: any, i: number) => (
              <li
                key={i}
                className={`flex flex-col bg-primary text-white rounded-md p-5 ${filteredDomains.length === 1 ? "col-span-2" : ""}`}
              >
                <p className="pb-5 text-secondary font-bold">{domain.url}</p>

                <div className="flex flex-col lg:flex-row gap-3 w-full">
                  <div className="flex flex-col w-full">
                    <label className="font-bold">Price:</label>
                    <span>${domain.current_bid}</span>
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="font-bold">Bids:</label>
                    <span>{domain.total_bids}</span>
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="font-bold">Time left:</label>
                    <Countdown
                      endTime={domain.end_time}
                      onEnd={() => handleCountdownEnd(domain.id)} // Trigger the expiration handler
                    />
                  </div>

                  {/* Button disappears when domain is expired */}
                  {!expiredDomains.includes(domain.id) && (
                    <Button
                      variant="secondary"
                      className="w-full"
                      asChild
                      onClick={() => handleSelectDomain(domain)} // Handle domain selection
                    >
                      <Link href={`/domains/${domain.id}`}>Bid now</Link>
                    </Button>
                  )}
                </div>

              </li>
            ))
          ) : (
            <p>No domains available</p>
          )}
        </ul>
      </div>
    </div>
  );
}

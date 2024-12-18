"use client"; 

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useDomain from "@/services/domains/use-domains";
import { Domain } from '@/services/domains/domains-context';
import React, { useEffect, useState } from 'react';
import wrapperFetchJsonResponse from '@/services/api/wrapper-fetch-json-response';
import { API_URL } from '@/services/api/config';
import { usePathname } from 'next/navigation';
import useFetch from '@/services/api/use-fetch'
import useAuth from '@/services/auth/use-auth';
import withPageRequiredAuth from '@/services/auth/with-page-required-auth';
import { useRouter } from "next/navigation";

 function Bid() {
  const [ domainId, setDomainId] = useState<string>('');
  const [currentDomain, setCurrentDomain] = useState<Domain | undefined>(undefined);
  const [bidAmount, setBidAmount] = useState<number | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [canBid, setCanBid] = useState(false);
  const [canLease, setCanLease] = useState(false);
  const [canMakeOffer, setCanMakeOffer] = useState(false);
  const pathname = usePathname();
  const fetch = useFetch();
  const {user} = useAuth();
  const router = useRouter(); 


  // Fetch domain by ID from the API
  const fetchDomainById = async (domainId: string): Promise<Domain | null> => {
    try {
      const requestUrl = new URL(`${API_URL}/v1/auctions/available/domain/${domainId}`);
      const res = await fetch(requestUrl.toString(), { method: "GET" });
      const { status, data } = await wrapperFetchJsonResponse(res);
      if (status >= 200 && data) {
        return data as Domain; // Return the domain object
      }
      return null;
    } catch (error) {
      console.error("Error fetching domain:", error);
      return null;
    }
  };

  type AuctionValidationResponse = {
    canBid: boolean;
    canLease: boolean;
    canMakeOffer: boolean;
  };

   // Fetch validation data for the auction
   const fetchAuctionValidation = async (auctionId: string) => {
    try {
      const requestUrl = new URL(`${API_URL}/v1/auctions/validate/auction/${auctionId}`);
      const res = await fetch(requestUrl.toString(), { method: "GET" });
      const { status, data } =  await wrapperFetchJsonResponse(res);
      const newData = data as AuctionValidationResponse
      if (status >= 200 && data) {
        setCanBid(newData.canBid);
        setCanLease(newData.canLease);
        setCanMakeOffer(newData.canMakeOffer);
      }
    } catch (error) {
      console.error("Error fetching auction validation:", error);
    }
  };

  // Extract the domain ID from the URL and fetch details
  useEffect(() => {
    const domainId = pathname.split('/').pop();
    if (domainId) {
        setDomainId(domainId)
       fetchDomainById(domainId).then((domain) => {
        setCurrentDomain(domain as any);
        fetchAuctionValidation(domainId);
      });
    }
  }, [pathname]);

  // Handle Place Bid
  const handlePlaceBid = async () => {
    if (!currentDomain) {
      setErrorMessage("Domain details not available.");
      return;
    }

    if (!bidAmount || bidAmount <= currentDomain.current_bid) {
      setErrorMessage("Bid amount must be greater than the current bid.");
      return;
    }

    const payload = {
      amount: bidAmount,
      user_id: user?.id, 
      domain_id: currentDomain.domain_id,
      auction_id: currentDomain.id, // Assuming auction_id is the same as domain_id
    };
    const requestUrl = new URL(`${API_URL}/v1/bids`);
    try {
      const response = await fetch(requestUrl, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const result = await wrapperFetchJsonResponse(response);

      if (result.status === 201) {
        console.log("Bid placed successfully:", result.data);
        setErrorMessage(null);
        alert("Bid placed successfully!");
        // Redirect to "My Bids" page
         router.push("/dashboard/my-bids");   
      } else {
        const res = result.data as any
        //alert(res.errors.message);
        setErrorMessage(res.errors.message);
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  const handleIncreaseBid = async () => {
    if (!currentDomain) {
      setErrorMessage("Domain details not available.");
      return;
    }

    if (!bidAmount || bidAmount <= currentDomain.current_bid) {
      setErrorMessage("Bid amount must be greater than the current bid.");
      return;
    }

    const payload = {
      amount: bidAmount,
      user_id: user?.id,
      auction_id: currentDomain.id, // Assuming auction_id is the same as domain_id
    };
    const requestUrl = new URL(`${API_URL}/v1/bids/increase/${domainId}`);
    try {
      const response = await fetch(requestUrl, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      const result = await wrapperFetchJsonResponse(response);

      if (result.status === 200) {
        console.log("Bid placed successfully:", result.data);
        setErrorMessage(null);
        alert("Bid placed successfully!");
        // Redirect to "My Bids" page
         router.push("/dashboard/my-bids");   
      } else {
        //console.log(result.data)
        const res = result.data as any
        //alert(res.errors.message);
        setErrorMessage(res.errors.message);
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };
  const handleLeaseNow = async () => {
    if (!currentDomain) {
      setErrorMessage("Domain details not available.");
      return;
    }
  
    const payload = {
      domain_id: currentDomain.domain_id,
      auction_id: currentDomain.id, // Assuming auction_id is the same as domain_id
    };
  
    const requestUrl = new URL(`${API_URL}/v1/bids/lease/now`);
  
    try {
      const response = await fetch(requestUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const result = await wrapperFetchJsonResponse(response);
      const data = result.data as any
      if (result.status === 201 && data.payment_url) {
        console.log("Payment URL:", data.payment_url);
        window.open(data.payment_url, "_blank");
      } else {
        const res = result.data as any
        //alert(res.errors.message);
        setErrorMessage(res.errors.message);
      }
    } catch (error) {
      console.error("Error initiating lease:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };
  

  

  return (
    <div className="w-full">
      <div className="relative w-full h-[40vh] -z-[1]">
        <img src="/domains-bid-banner.png" alt="Banner" className="absolute w-full h-full object-cover" />
        <div className="absolute w-full text-white mt-[120px] py-5 px-24 text-center">
          <h1 className="text-4xl font-semibold">Unlock your brand with</h1>
          <p className="text-3xl mt-2">{currentDomain?.url}</p>
        </div>
      </div>

      <div className="flex mx-24 mb-10 items-center gap-10 h-full">
        <div className="w-full h-full">
          <h2 className="text-xl my-10">Choose your option to gain access to {currentDomain?.url}</h2>

          <div className="flex flex-col">
            <label className="text-lg">Place your Bid</label>
            <strong className="text-secondary">Current Bid: {currentDomain?.current_bid}</strong>

            <Input
              placeholder="Enter your offer..."
              value={bidAmount || ""}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              type="number"
            />

            {errorMessage && <small className="text-red-500">{errorMessage}</small>}

            <small className="text-muted mb-2">
              Learn more how our bidding works in our <a href="#">auction guide</a>
            </small>
            {/* Conditionally render buttons */}
            {canBid ? (
                <Button variant="secondary" className="self-start" onClick={handlePlaceBid}>
                Place Bid
                </Button>
            ) : (
                <Button variant="secondary" className="self-start" onClick={handleIncreaseBid}>
                Increase Bid
                </Button>
            )}
          </div>

          <hr className="my-5" />

          {/* Lease Instantly Section */}
          <div className="flex flex-col">
            <label className="text-lg">Lease Instantly</label>
            <strong className="text-secondary">Lease Price: {currentDomain?.lease_price}</strong>
            <small className="text-muted mb-2">
              Secure this premium domain instantly by leasing it at the set price
            </small>
            <Button variant="secondary" className="self-start" onClick={handleLeaseNow} disabled={!canLease}>
              Lease Now
            </Button>
          </div>

          <hr className="my-5" />

          {/* Make Your Offer Section */}
          <div className="flex flex-col">
            <label className="text-lg">Make Your Offer</label>
            <strong className="text-secondary">Interested in this domain? Submit your best offer</strong>
            <Input placeholder="Enter your offer..." />
            <small className="text-muted mb-2">
              Secure this premium domain instantly by leasing it at the set price
            </small>
            <Button variant="secondary" className="self-start" disabled={!canMakeOffer}>
              Make Offer
            </Button>
          </div>
        </div>

        <div className="h-full w-full">
          <img src="/domain-bid-overview.png" alt="Domain Bid Overview" />
        </div>
      </div>
    </div>
  );
}

export default withPageRequiredAuth(Bid);

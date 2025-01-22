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
import ConfirmLeaseModal from "@/app/components/ConfirmLeaseModal";
import { Skeleton } from '@/components/ui/skeleton';

function Bid() {
  const [domainId, setDomainId] = useState<string>('');
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [currentDomain, setCurrentDomain] = useState<Domain | undefined>(undefined);
  const [bidAmount, setBidAmount] = useState<number | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const [canBid, setCanBid] = useState(false);
  const [canLease, setCanLease] = useState(false);
  const [canMakeOffer, setCanMakeOffer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const pathname = usePathname();
  const fetch = useFetch();
  const { user } = useAuth();
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
      const { status, data } = await wrapperFetchJsonResponse(res);
      const newData = data as AuctionValidationResponse
      if (status >= 200 && data) {
        setIsValidated(true);
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
    closeModal();
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
        router.push("/dashboard/my-payments");
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

  const handleMakeOffer = async () => {
    if (!currentDomain) {
      setErrorMessage("Domain details not available.");
      return;
    }

    const requestUrl = new URL(`${API_URL}/v1/offers`);
    
    const payload = {
      user_id: user?.id,
      offer_amount: offerAmount,
      auction_id: currentDomain.id, // Assuming auction_id is the same as domain_id
    };

    try {
      const response = await fetch(requestUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      window.alert("Your offer has been sent!");
    } catch (error) {
      console.error("Error initiating lease:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  }

  useEffect(() => {
    if (currentDomain?.end_time) {
      const intervalId = setInterval(() => {
        const { time, isEnded } = formatTimeRemaining(currentDomain.end_time);
        setTimeRemaining(time);
        setIsAuctionEnded(isEnded); // Set the auction ended state
      }, 1000);

      return () => clearInterval(intervalId); // Clear the interval when component unmounts
    }
  }, [currentDomain]);

  const formatTimeRemaining = (endTime: Date) => {
    const countdownEnd = new Date(endTime).getTime(); // Get the auction end time in milliseconds
    const now = new Date().getTime(); // Current time in milliseconds
  
    const distance = countdownEnd - now; // Difference between current time and auction end time
  
    if (distance <= 0) {
      return { time: 'Auction ended', isEnded: true }; // Auction has ended
    }
  
    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24)); // Days are calculated based on total milliseconds
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Hours are the remainder after days
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); // Minutes are the remainder after hours
    const seconds = Math.floor((distance % (1000 * 60)) / 1000); // Seconds are the remainder after minutes
  
    // Construct the output string
    const time = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  
    return { time, isEnded: false };
  };
  

  return (
    <div className="w-full">
      <div className="relative w-full h-[40vh] -z-[1]">
        <img src="/domains-bid-banner.png" alt="Banner" className="absolute w-full h-full object-cover" />
        <div className="absolute w-full text-white mt-[120px] py-5 px-5 lg:px-24 text-center">
          <h1 className="text-2xl lg:text-4xl font-semibold">Unlock your brand with</h1>
          <p className="text-lg lg:text-3xl mt-2">{currentDomain?.url}</p>
        </div>
      </div>

      <div className="flex mx-5 lg:mx-24 mb-10 items-center gap-10 h-full">
        <div className="w-full h-full">
          <h2 className="text-xl my-10">Choose your option to gain access to {currentDomain?.url}</h2>
          {/* Countdown Timer */}
          <div className="mb-4">
            {currentDomain?.end_time && (
              <div className={`text-lg font-semibold text-red-500 }`}>
                {
                  isAuctionEnded ? 
                    'Auction ended' :
                    timeRemaining ? 
                      `Auction ends in: ${timeRemaining}`
                    :
                    <div className='flex items-center gap-2'>
                      Auction ends in: 
                      
                      <div className='flex flex-col gap-1'>
                        <Skeleton className="w-[100px] h-[6px] rounded-full" />
                        <Skeleton className="w-[50px] h-[6px] rounded-full" />
                      </div>
                    </div>
                }
              </div>
            )}
          </div>
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
            { isValidated ?
                canBid ? (
                  <Button variant="secondary" className="self-start" onClick={handlePlaceBid} disabled={isAuctionEnded}>
                    Place Bid
                  </Button>
                ) : (
                  <Button variant="secondary" className="self-start" onClick={handleIncreaseBid} disabled={isAuctionEnded}>
                    Increase Bid
                  </Button>
                )
              : <div className='flex flex-col gap-1'>
                  <Skeleton className='w-[100px] h-[6px] rounded-full' />
                  <Skeleton className='w-[100px] h-[6px] rounded-full' />
                  <Skeleton className='w-[80px] h-[6px] rounded-full' />
                </div>
            }
          </div>

          <hr className="my-5" />

          {/* Lease Instantly Section */}
          <div className="flex flex-col">
            <label className="text-lg">Lease Instantly</label>
            <strong className="text-secondary">Lease Price: {currentDomain?.lease_price}</strong>
            <small className="text-muted mb-2">
              Secure this premium domain instantly by leasing it at the set price
            </small>
            <div>
              {/* Lease Now Button */}
              <Button variant="secondary" onClick={openModal} disabled={!canLease || isAuctionEnded}>
                Lease Now
              </Button>

              {/* Confirm Lease Modal */}
              <ConfirmLeaseModal isOpen={isModalOpen} onClose={closeModal} onConfirm={handleLeaseNow} />
            </div>
          </div>

          <hr className="my-5" />

          {/* Make Your Offer Section */}
          <div className="flex flex-col">
            <label className="text-lg">Make Your Offer</label>
            <strong className="text-secondary">Interested in this domain? Submit your best offer</strong>
            <Input placeholder="Enter your offer..." value={offerAmount} onChange={(e) => setOfferAmount(parseInt(e.target.value))} />
            <small className="text-muted mb-2">
              Secure this premium domain instantly by leasing it at the set price
            </small>
            <Button variant="secondary" className="self-start" disabled={!canMakeOffer || isAuctionEnded} onClick={handleMakeOffer}>
              Make Offer
            </Button>
          </div>
        </div>

        <div className="hidden lg:block h-full w-full mt-5">
          <img src="/domain-bid-overview.png" alt="Domain Bid Overview" />
        </div>
      </div>
    </div>
  );
}

export default withPageRequiredAuth(Bid);

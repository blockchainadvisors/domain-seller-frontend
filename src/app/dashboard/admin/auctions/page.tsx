"use client"

import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import useFetch from '@/services/api/use-fetch'
import { API_URL } from '@/services/api/config'

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

export default function Auctions() {
    const fetch = useFetch();

    const [availableDomains, setAvailableDomains] = useState<any[]>([]);
    const [availableAuctions, setAvailableAuctions] = useState<any[]>([]);
    
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

    const [auctionDeleteDialogOpen, setAuctionDeleteDialogOpen] = useState<boolean>(false);
    const [editAuctionDialogOpen, setEditAuctionDialogOpen] = useState<boolean>(false);
    
    const [chosenDomainId, setChosenDomainId] = useState<string>('');
    const [minIncrement, setMinIncrement] = useState<number>(0.01);
    const [reservePrice, setReservePrice] = useState<number>(0.01);
    const [leasePrice, setLeasePrice] = useState<number>(0.01);
    const [minimumPrice, setMinimumPrice] = useState<number>(0.01);
    const [expiryDuration, setExpiryDuration] = useState<number>(1);
    const [auctionDuration, setAuctionDuration] = useState<string>('1');

    useEffect(() => {
        (async () => {
            const getAvailableDomains = async () => {
                let currentPage = 1; // Start with the first page
                let hasNextPage = true; // Initialize with true to enter the loop
                const domains = []; // Array to store the results
    
                while (hasNextPage) {
                    const requestUrl = new URL(`${API_URL}/v1/domains?page=${currentPage}`);
    
                    try {
                        const res = await fetch(requestUrl);
                        if (!res.ok) {
                            throw new Error(`Error fetching page ${currentPage}: ${res.statusText}`);
                        }
    
                        const body = await res.json();
    
                        // Add the current page's data to the domains array
                        if (body.data) {
                            domains.push(...body.data); // Assuming data.items contains the domains
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
                setAvailableDomains(domains.filter(domain => (domain.status === "LISTED")));
            }

            const getAvailableAuctions = async () => {
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
                console.log(auctions);
                setAvailableAuctions(auctions);
            }

            await getAvailableAuctions();
            await getAvailableDomains();
        })();
    }, []);

    const resetForm = () => {
        setChosenDomainId('');
        setMinIncrement(0.01);
        setReservePrice(0.01);
        setLeasePrice(0.01);
        setMinimumPrice(0.01);
        setExpiryDuration(1);
        setAuctionDuration('1');
    }

    const generateStartAndEndTime = () => {
        const day = parseInt(auctionDuration);

        if (typeof day !== 'number' || day % 2 === 0 || day < 1) {
            throw new Error("Invalid input: Please provide an odd number of days greater than 0.");
        }

        const now = new Date();
        now.setSeconds(now.getSeconds() + 30); // Add 30 seconds to the current time
        const start_time = now.toISOString();

        const end_time_date = new Date(now);
        end_time_date.setDate(end_time_date.getDate() + day);
        const end_time = end_time_date.toISOString();

        return { start_time, end_time };
    }

    const handleCreateAuction = async () => {
        try {
            const requestUrl = new URL(`${API_URL}/v1/auctions`);
            const { start_time, end_time } = generateStartAndEndTime();

            await fetch(requestUrl, {
                method: "POST",
                body: JSON.stringify({
                    domain_id: chosenDomainId,
                    min_increment: minIncrement,
                    reserve_price: reservePrice,
                    lease_price: leasePrice,
                    min_price: minimumPrice,
                    end_time,
                    start_time,
                    expiry_duration: expiryDuration
                })
            });

            // Reset form
            resetForm();

            // Close drawer
            setDrawerOpen(false);

            // Alert
            window.alert("Your auction is now live!");
        } catch (err) {
            console.log(err);
        }
    }

    const handleEditAuction = async (chosenDomainId: string) => {
        try {
            const requestUrl = new URL(`${API_URL}/v1/auctions/${chosenDomainId}`);

            await fetch(requestUrl, {
                method: "PATCH",
                body: JSON.stringify({
                    domain_id: chosenDomainId,
                    min_increment: minIncrement,
                    reserve_price: reservePrice,
                    lease_price: leasePrice,
                    min_price: minimumPrice
                })
            });

            // Reset form
            resetForm();

            // Close dialog
            setEditAuctionDialogOpen(false);

            // Alert
            window.alert("Auction has been updated!")
        } catch (err) {
            console.log(err);
        }
    }

    const handleDeleteAuction = async (chosenDomainId: string) => {
        try {
            const requestUrl = new URL(`${API_URL}/v1/auctions/${chosenDomainId}`);

            await fetch(requestUrl, {
                method: "DELETE"
            });

            // Close dialog
            setAuctionDeleteDialogOpen(false);

            // Alert
            window.alert("Auction has been deleted!")
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <div className='flex flex-col md:flex-row md:items-center gap-2 justify-between'>
                <h1 className='text-2xl font-bold'>Active Auctions</h1>

                {/* Create Auction */}
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <DrawerTrigger asChild>
                        <Button>Create Auction</Button>
                    </DrawerTrigger>
                    <DrawerContent className='p-5' onInteractOutside={(e) => e.preventDefault()}>
                        <DialogTitle className='my-5'>Create a new auction</DialogTitle>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-5">

                            <div className='flex flex-col gap-2 mb-2'>
                                <label className='font-semibold text'>Select a Domain</label>
                                <Select onValueChange={setChosenDomainId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose domain" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            availableDomains.map(domain => (
                                                <SelectItem key={domain.id} value={domain.id}>{domain.url}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className='flex flex-col gap-2 mb-2'>
                                <div className='flex flex-col leading-tight'>
                                    <label className='font-semibold text'>Minimum Increment</label>
                                    <small className='text-muted'>The minimum increment for each bid</small>
                                </div>

                                <Input placeholder="5" type="number" value={minIncrement} onChange={(e) => setMinIncrement(parseInt(e.target.value))} />
                            </div>

                            <div className='flex flex-col gap-2 mb-2'>
                                <div className='flex flex-col leading-tight'>
                                    <label className='font-semibold text'>Reserve Price ($)</label>
                                    <small className='text-muted'>The price the bid must reached to make a sale</small>
                                </div>

                                <Input placeholder="0" type="number" value={reservePrice} onChange={(e) => setReservePrice(parseInt(e.target.value))} />
                            </div>

                            <div className='flex flex-col gap-2 mb-2'>
                                <div className='flex flex-col leading-tight'>
                                    <label className='font-semibold text'>Lease Price ($)</label>
                                    <small className='text-muted'>The buy it now price</small>
                                </div>

                                <Input placeholder="0" type="number" value={leasePrice} onChange={(e) => setLeasePrice(parseInt(e.target.value))} />
                            </div>

                            <div className='flex flex-col gap-2 mb-2'>
                                <div className='flex flex-col leading-tight'>
                                    <label className='font-semibold text'>Minimum Price ($)</label>
                                    <small className='text-muted'>Initial bid amount</small>
                                </div>

                                <Input placeholder="0" type="number" value={minimumPrice} onChange={(e) => setMinimumPrice(parseInt(e.target.value))} />
                            </div>

                            <div className='flex flex-col gap-2 mb-2'>
                                <div className='flex flex-col leading-tight'>
                                    <label className='font-semibold text'>Expiry Duration</label>
                                    <small className='text-muted'>The number of months the user has access to this domain</small>
                                </div>

                                <Input placeholder="0" type="number" value={expiryDuration} onChange={(e) => setExpiryDuration(parseInt(e.target.value))} />
                            </div>

                            <div className='flex flex-col gap-2 mb-2'>
                                <div className='flex flex-col leading-tight'>
                                    <label className='font-semibold text'>Auction Duration</label>
                                    <small className='text-muted'>The duration of the auction starting today</small>
                                </div>

                                <Select onValueChange={setAuctionDuration}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose auction duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 day</SelectItem>
                                        <SelectItem value="3">3 days</SelectItem>
                                        <SelectItem value="5">5 days</SelectItem>
                                        <SelectItem value="7">7 days</SelectItem>
                                        <SelectItem value="9">9 days</SelectItem>
                                        <SelectItem value="11">11 days</SelectItem>
                                        <SelectItem value="11">13 days</SelectItem>
                                        <SelectItem value="11">15 days</SelectItem>
                                        <SelectItem value="11">17 days</SelectItem>
                                        <SelectItem value="11">19 days</SelectItem>
                                        <SelectItem value="11">21 days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button onClick={handleCreateAuction}>Create Auction</Button>
                    </DrawerContent>
                </Drawer>
            </div>

            <ul className='flex flex-col gap-2 my-5'>
                {
                    availableAuctions.map((auction, i) => (
                        <li
                            key={i}
                            className={`flex flex-col bg-primary text-white rounded-md p-5`}
                        >
                            <div className='flex mb-4 flex-col md:flex-row items-center justify-between'>
                                <p className="pb-5 text-secondary font-bold">{auction.domain_id.url}</p>

                                <div className='flex items-center gap-2'>
                                    {/* Edit Auction */}
                                    <Dialog onOpenChange={setEditAuctionDialogOpen} open={editAuctionDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary" size="sm">
                                                Edit
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                                            <DialogHeader>
                                                <DialogTitle>Edit Auction</DialogTitle>
                                                <DialogDescription>
                                                    Edit the auction lease prices, etc
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="grid grid-cols-2 gap-5">
                                                <div className='flex flex-col gap-2 mb-2'>
                                                    <label className='font-semibold text'>Minimum Increment</label>

                                                    <Input placeholder="5" type="number" onChange={(e) => setMinIncrement(parseInt(e.target.value))} value={minIncrement} />
                                                </div>

                                                <div className='flex flex-col gap-2 mb-2'>
                                                    <label className='font-semibold text'>Reserve Price ($)</label>

                                                    <Input placeholder="0" type="number" onChange={(e) => setReservePrice(parseInt(e.target.value))} value={reservePrice} />
                                                </div>

                                                <div className='flex flex-col gap-2 mb-2'>
                                                    <div className='flex flex-col'>
                                                        <label className='font-semibold text'>Lease Price ($)</label>
                                                        { auction.current_bid.length && <span className='text-xs text-orange-400 font-bold'>Existing bids, updating disabled</span>}
                                                    </div>

                                                    <Input placeholder="0" type="number" onChange={(e) => setLeasePrice(parseInt(e.target.value))} value={leasePrice} disabled={auction.current_bid.length} />
                                                </div>

                                                {/* If auction has bids, don't let admin update this */}
                                                <div className='flex flex-col gap-2 mb-2'>
                                                    <label className='font-semibold text'>Minimum Price ($)</label>

                                                    <Input placeholder="0" type="number" onChange={(e) => setMinimumPrice(parseInt(e.target.value))} value={minimumPrice} />
                                                </div>
                                            </div>

                                            <DialogFooter>
                                                <Button type="submit" onClick={() => handleEditAuction(auction.id)}>Update Auction</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Delete Auction */}
                                    <Dialog onOpenChange={setAuctionDeleteDialogOpen} open={auctionDeleteDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                Delete
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                                            <DialogHeader>
                                                <DialogTitle>Delete Auction</DialogTitle>
                                            </DialogHeader>

                                            <p>This action cannot be reverted. Would you like to proceed?</p>

                                            <DialogFooter>
                                                <DialogTrigger asChild>
                                                    <Button variant="destructive">
                                                        No
                                                    </Button>
                                                </DialogTrigger>
                                                <Button type="submit" onClick={() => handleDeleteAuction(auction.id)}>Yes</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-3 w-full">
                                <div className="flex flex-col w-full">
                                    <label className="font-bold">Minimum Increment:</label>
                                    <span>{auction.min_increment}</span>
                                </div>
                                
                                <div className="flex flex-col w-full">
                                    <label className="font-bold">Reserve Price ($):</label>
                                    <span>{auction.reserve_price}</span>
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="font-bold">Lease Price ($):</label>
                                    <span>{auction.lease_price}</span>
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="font-bold">Minimum Price ($)</label>
                                    <span>{auction.min_price}</span>
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="font-bold">Time left:</label>
                                    {moment(auction.end_time).fromNow(true)} left
                                </div>
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

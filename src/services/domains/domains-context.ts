"use client";

import { createContext } from "react";

// Define the shape of domain data
export interface Domain {
  id: string;
  url: string;
  current_highest_bid: number;
  lease_price: number;
  total_bids: number,
  status: string,
  category: string,
  description?: string,
  end_time: Date,
  domain_id: string
  current_bid: number
}

// Define the DomainContext values
export interface DomainContextType {
  selectedDomain: Domain | null;
  setSelectedDomain: (domain: Domain | null) => void;
}

// Define the DomainActionsContext values
export interface DomainActionsContextType {
  selectDomain: (domain: Domain) => void;
  clearSelectedDomain: () => void;
}

// Create contexts
export const DomainContext = createContext<DomainContextType | undefined>(undefined);
export const DomainActionsContext = createContext<DomainActionsContextType | undefined>(undefined);

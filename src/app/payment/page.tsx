"use client";

import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Link from "next/link";
import { API_URL } from "@/services/api/config";
import wrapperFetchJsonResponse from "@/services/api/wrapper-fetch-json-response";
import useAuth from "@/services/auth/use-auth";

type Payment = {
  id: string;
  status: string;
  amount: string;
  payment_url: string;
  auction_id?: {
    domain_id?: { url: string };
  };
  bid_id?: {
    domain_id?: { url: string };
  };
};

function PaymentPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const {user} = useAuth();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
       
        const requestUrl = new URL(`${API_URL}/api/v1/payments/user/${user?.id}`);

        const response = await fetch(requestUrl, {
            method: "GET"
        });

        const result = await wrapperFetchJsonResponse(response);
        const data = result.data as any
        if (result.status === 200 && data) {
            console.log(data)
            setPayments(data);
        } else {
            setError("Failed to fetch domains.");
        }

        
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <div>Loading...</div>;

  const getDomain = (payment: Payment) => {
    // Check auction_id.domain_id first, fallback to bid_id.domain_id
    return payment.auction_id?.domain_id?.url || payment.bid_id?.domain_id?.url || "Unknown domain";
  };

  return (
    <div>
      <h1>Payments</h1>
      <Tabs>
        <TabList>
          <Tab>All Payments</Tab>
          <Tab>Processing Payments</Tab>
        </TabList>

        {/* All Payments */}
        <TabPanel>
          <div>
            {payments.map((payment) => (
              <div key={payment.id} className="payment-card">
                <p><strong>Amount:</strong> ${payment.amount}</p>
                <p><strong>Status:</strong> {payment.status}</p>
                <p><strong>Domain:</strong> {getDomain(payment)}</p>
                {payment.status !== "PAID" && (
                  <Link href={payment.payment_url}>
                    <button>Pay Now</button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </TabPanel>

        {/* Processing Payments */}
        <TabPanel>
          <div>
            {payments
              .filter((payment) => payment.status === "PROCESSING")
              .map((payment) => (
                <div key={payment.id} className="payment-card">
                  <p><strong>Amount:</strong> ${payment.amount}</p>
                  <p><strong>Status:</strong> {payment.status}</p>
                  <p><strong>Domain:</strong> {getDomain(payment)}</p>
                  <Link href={`${payment.payment_url}?status=PROCESSING`}>
                    <button>View Processing</button>
                  </Link>
                </div>
              ))}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default PaymentPage;
function setError(arg0: string) {
    throw new Error("Function not implemented.");
}


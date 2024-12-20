"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API_URL } from "@/services/api/config";
import wrapperFetchJsonResponse from "@/services/api/wrapper-fetch-json-response";
import useAuth from "@/services/auth/use-auth";
import useFetch from "@/services/api/use-fetch";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

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
  const { user } = useAuth();
  const fetch = useFetch();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const requestUrl = new URL(`${API_URL}/v1/payments/user/${user?.id}`);
        const response = await fetch(requestUrl, { method: "GET" });
        const result = await wrapperFetchJsonResponse(response);
        const data = result.data as any;
        if (result.status === 200 && data) {
          setPayments(data.data);
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
    return payment.auction_id?.domain_id?.url || payment.bid_id?.domain_id?.url || "Unknown domain";
  };

  const allPaymentsTable = (payments: Payment[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Domain</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.length ? (
          payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{getDomain(payment)}</TableCell>
              <TableCell>${payment.amount}</TableCell>
              <TableCell>{payment.status}</TableCell>
              <TableCell>
                {payment.status !== "PAID" ? (
                  <Link href={payment.payment_url}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                      Pay Now
                    </button>
                  </Link>
                ) : (
                  <span className="text-green-600">Paid</span>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No payments found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="flex flex-col gap-5 mt-5">
      <h1 className="text-2xl font-bold">Payments</h1>

      <Tabs>
        <TabList>
          <Tab>All Payments</Tab>
          <Tab>Processing Payments</Tab>
        </TabList>

        {/* All Payments Tab */}
        <TabPanel>
          {allPaymentsTable(payments)}
        </TabPanel>

        {/* Processing Payments Tab */}
        <TabPanel>
          {allPaymentsTable(payments.filter((payment) => payment.status === "PROCESSING"))}
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default withPageRequiredAuth(PaymentPage);

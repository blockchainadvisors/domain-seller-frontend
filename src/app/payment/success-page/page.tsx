"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AiOutlineCheckCircle } from "react-icons/ai"; // Import green check icon

function PaymentSuccess() {
    const router = useRouter();

    const handleDashboardRedirect = () => {
        router.push("/dashboard/my-bids");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-green-100">
            <AiOutlineCheckCircle className="text-green-700 text-9xl mb-5" /> {/* Big green check mark */}
            <h1 className="text-4xl font-bold text-green-700 mb-5">Payment Successful!</h1>
            <p className="text-lg text-gray-600 mb-10">
                Thank you for your payment. Your transaction was completed successfully.
            </p>
            <Button variant="secondary" onClick={handleDashboardRedirect}>
                Go to Dashboard
            </Button>
        </div>
    );
}

export default PaymentSuccess;
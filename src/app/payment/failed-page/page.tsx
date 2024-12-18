"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AiOutlineCloseCircle } from "react-icons/ai"; 

function PaymentFailed() {
    const router = useRouter();

    const handleRetry = () => {
        router.push("/dashboard/payments"); 
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-red-100">
            <AiOutlineCloseCircle className="text-red-700 text-9xl mb-5" /> {/* Big red cross mark */}
            <h1 className="text-4xl font-bold text-red-700 mb-5">Payment Failed</h1>
            <p className="text-lg text-gray-600 mb-10">
                We’re sorry, but your payment could not be processed. Please try again.
            </p>
            <Button variant="secondary" onClick={handleRetry}>
                Retry Payment
            </Button>
        </div>
    );
}

export default PaymentFailed;


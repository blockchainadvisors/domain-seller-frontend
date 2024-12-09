"use client"

import React, { useRef, useState } from "react";
import "./ReviewSlider.css"
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ReviewSlider: React.FC = () => {
    const SPEED_MULTIPLIER = 1;

    const sliderRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        if (sliderRef.current) {
            setStartX(e.pageX - sliderRef.current.offsetLeft);
            setScrollLeft(sliderRef.current.scrollLeft);
        }
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !sliderRef.current) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * SPEED_MULTIPLIER; // Scroll speed multiplier
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (sliderRef.current) {
            setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
            setScrollLeft(sliderRef.current.scrollLeft);
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!sliderRef.current) return;
        e.preventDefault();
        const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * SPEED_MULTIPLIER; // Scroll speed multiplier
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleNextBtn = () => {
        if (sliderRef.current) {
            const cardWidth = sliderRef.current.querySelector('.card')?.clientWidth || 300; // Fallback to 300 if not found
            const gap = parseInt(getComputedStyle(sliderRef.current).gap) || 0; // Get gap between cards
            sliderRef.current.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
        }
    };

    const handlePrevBtn = () => {
        if (sliderRef.current) {
            const cardWidth = sliderRef.current.querySelector('.card')?.clientWidth || 300; // Fallback to 300 if not found
            const gap = parseInt(getComputedStyle(sliderRef.current).gap) || 0; // Get gap between cards
            sliderRef.current.scrollBy({ left: -(cardWidth + gap), behavior: "smooth" });
        }
    };

    return (
        <div
            className="review-slider"
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
        >
            <div className="review-card flex items-center justify-center text-center bg-secondary overflow-hidden">
                <div className="flex flex-col items-center gap-5 p-5">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <strong className="text-lg text-primary">Stella Maris</strong>
                    <p className="text-primary px-64">I remember back in the early 00's when talking to friends about potential domain names that's been taken for years but never really used; parked domains with ridiculous prices making it impossible to acquire them. Whatpopping.com was one of those dream names. Thanks domain sellers for making it possible for me to acquire my dream domain sellers!</p>
                </div>
            </div>

            <div className="review-card flex items-center justify-center text-center bg-secondary/50 overflow-hidden">
                <div className="flex flex-col items-center gap-5 p-5">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <strong className="text-lg text-primary">Andrew Maris</strong>
                    <p className="text-primary px-64">I remember back in the early 00's when talking to friends about potential domain names that's been taken for years but never really used; parked domains with ridiculous prices making it impossible to acquire them. Whatpopping.com was one of those dream names. Thanks domain sellers for making it possible for me to acquire my dream domain sellers!</p>
                </div>
            </div>

            {/* <div className="fixed left-2 top-1/2 -translate-y-1/2">
                <Button onClick={handlePrevBtn}>Left</Button>
            </div>

            <div className="fixed right-2 top-1/2 -translate-y-1/2">
                <Button onClick={handleNextBtn}>Right</Button>
            </div> */}
        </div>
    );
};

export default ReviewSlider;

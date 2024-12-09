"use client"

import React, { useRef, useState } from "react";
import "./Slider.css"
import { Button } from "@/components/ui/button";

const Slider: React.FC = () => {
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
            className="slider"
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
        >
            <div className="card bg-primary rounded-2xl overflow-hidden">
                <img src="/slider.png" className="h-[50%] w-full object-cover" alt="" />
                
                <div className="p-5">
                    <strong className="text-lg">Step 1</strong>
                    <p className="text-muted">Sign up and apply for your domain lease</p>
                </div>
            </div>

            <div className="card bg-primary rounded-2xl overflow-hidden">
                <img src="/slider.png" className="h-[50%] w-full object-cover" alt="" />
                
                <div className="p-5">
                    <strong className="text-lg">Step 2</strong>
                    <p className="text-muted">Once Owner approves, your perpetual lease starts</p>
                </div>
            </div>

            <div className="card bg-primary rounded-2xl overflow-hidden">
                <img src="/slider.png" className="h-[50%] w-full object-cover" alt="" />
                
                <div className="p-5">
                    <strong className="text-lg">Step 3</strong>
                    <p className="text-muted">Make automated monthly payments</p>
                </div>
            </div>

            <div className="card bg-primary rounded-2xl overflow-hidden">
                <img src="/slider.png" className="h-[50%] w-full object-cover" alt="" />
                
                <div className="p-5">
                    <strong className="text-lg">Step 4</strong>
                    <p className="text-muted">Sign up and apply for your domain lease</p>
                </div>
            </div>

            <div className="card bg-primary rounded-2xl overflow-hidden">
                <img src="/slider.png" className="h-[50%] w-full object-cover" alt="" />
                
                <div className="p-5">
                    <strong className="text-lg">Step 5</strong>
                    <p className="text-muted">Sign up and apply for your domain lease</p>
                </div>
            </div>

            <div className="card bg-primary rounded-2xl overflow-hidden">
                <img src="/slider.png" className="h-[50%] w-full object-cover" alt="" />
                
                <div className="p-5">
                    <strong className="text-lg">Step 6</strong>
                    <p className="text-muted">Sign up and apply for your domain lease</p>
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

export default Slider;

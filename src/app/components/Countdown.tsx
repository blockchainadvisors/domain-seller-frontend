import React, { useEffect, useState, useRef } from "react";

interface CountdownProps {
  endTime: string; // The auction's end time
  onEnd?: () => void; // Callback when countdown reaches zero
}

const Countdown: React.FC<CountdownProps> = ({ endTime, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const isExpired = useRef(false); // Use a ref to track if the countdown has expired

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        if (!isExpired.current) {
          isExpired.current = true; // Mark as expired
          setTimeLeft("Time's up"); // Update state to show "Time's up"
          if (onEnd) onEnd(); // Trigger the onEnd callback once
        }
        return; // No need to continue the countdown after expiration
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft(); // Initialize immediately
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [endTime]); // Only depend on `endTime` to avoid unnecessary re-renders

  return <span>{timeLeft}</span>;
};

export default Countdown;


import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Adjusting the lens aperture...",
  "Calibrating the time capacitor...",
  "Applying vintage film grain...",
  "Styling 90s grunge hair...",
  "Reheating the Polaroid chemicals...",
  "Developing the negatives...",
  "Synthesizing 80s synth-pop vibes..."
];

export const LoadingOverlay: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <i className="fa-solid fa-clock-rotate-left text-3xl text-blue-400 animate-pulse"></i>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-2 font-retro tracking-widest text-blue-400">WARPING TIME...</h2>
      <p className="text-slate-400 animate-pulse font-medium">{MESSAGES[msgIndex]}</p>
    </div>
  );
};

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { RevealText } from '../motion/RevealText';
import { Particles } from '../motion/Particles';

interface IntroSectionProps {
  headline: string;
  subtext: string;
  onComplete: () => void;
}

export function IntroSection({ headline, subtext, onComplete }: IntroSectionProps) {
  const [textComplete, setTextComplete] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleTextComplete = () => {
    setTextComplete(true);
    setTimeout(() => setShowButton(true), 300);
  };

  const handleStart = () => {
    setButtonClicked(true);

    // Haptic feedback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([50, 30, 100]);
    }

    setTimeout(() => onComplete(), 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Floating particles background */}
      <Particles
        trigger={true}
        type="float"
        color="gold"
        count={10}
        originX={50}
        originY={100}
      />

      {/* Headline with reveal effect */}
      <h1 className="font-display text-[32px] md:text-[40px] font-semibold text-white leading-[1.15] tracking-tight mb-8">
        <RevealText
          text={headline}
          highlightWords={['mejor', 'pagado']}
          stagger={0.1}
          onComplete={handleTextComplete}
        />
      </h1>

      {/* Subtext */}
      <motion.p
        className="text-[#a0a0a0] text-lg max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: textComplete ? 1 : 0, y: textComplete ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {subtext}
      </motion.p>

      {/* Start button */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: showButton ? 1 : 0,
          scale: showButton ? 1 : 0.9,
        }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      >
        {/* Particles on click */}
        <Particles
          trigger={buttonClicked}
          type="explosion"
          color="gold"
          count={40}
          originX={50}
          originY={50}
        />

        <motion.button
          onClick={handleStart}
          disabled={buttonClicked}
          className={`
            relative px-10 py-4 rounded-xl font-semibold text-lg
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50
            ${buttonClicked
              ? 'bg-[#C9A227] text-black scale-110'
              : 'bg-[#C9A227] text-black hover:scale-105'
            }
          `}
          animate={
            !buttonClicked
              ? {
                  boxShadow: [
                    '0 0 20px rgba(201, 162, 39, 0.3)',
                    '0 0 40px rgba(201, 162, 39, 0.5)',
                    '0 0 20px rgba(201, 162, 39, 0.3)',
                  ],
                }
              : {
                  boxShadow: '0 0 60px rgba(201, 162, 39, 0.8)',
                }
          }
          transition={{ duration: 2, repeat: buttonClicked ? 0 : Infinity }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 flex items-center gap-2">
            COMENZAR
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={buttonClicked ? { x: 10, opacity: 0 } : { x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: buttonClicked ? 0 : Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </motion.svg>
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}

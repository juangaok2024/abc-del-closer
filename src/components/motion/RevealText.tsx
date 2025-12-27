'use client';

import { motion } from 'motion/react';
import { useMemo, useEffect, useRef } from 'react';

interface RevealTextProps {
  text: string;
  highlightWords?: string[];
  stagger?: number;
  className?: string;
  highlightClassName?: string;
  onComplete?: () => void;
  delay?: number;
}

export function RevealText({
  text,
  highlightWords = [],
  stagger = 0.08,
  className = '',
  highlightClassName = '',
  onComplete,
  delay = 0,
}: RevealTextProps) {
  const words = useMemo(() => text.split(' '), [text]);
  const hasCalledComplete = useRef(false);

  const isHighlighted = (word: string) => {
    const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
    return highlightWords.some((hw) => cleanWord.includes(hw.toLowerCase()));
  };

  // Calculate total animation time and trigger onComplete
  const totalDuration = delay + (words.length - 1) * stagger + 0.4; // last word delay + animation duration

  useEffect(() => {
    if (onComplete && !hasCalledComplete.current) {
      const timer = setTimeout(() => {
        hasCalledComplete.current = true;
        onComplete();
      }, totalDuration * 1000 + 100); // Convert to ms and add small buffer
      return () => clearTimeout(timer);
    }
  }, [onComplete, totalDuration]);

  return (
    <span className={`inline ${className}`}>
      {words.map((word, index) => {
        const highlighted = isHighlighted(word);
        const wordDelay = delay + index * stagger;

        return (
          <span key={index} className="inline-block overflow-hidden">
            <motion.span
              className={`inline-block ${highlighted ? highlightClassName || 'gold-text' : ''}`}
              initial={{ y: '100%', opacity: 0, filter: 'blur(4px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{
                duration: 0.4,
                delay: wordDelay,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              {highlighted ? (
                <motion.span
                  className="relative inline-block"
                  animate={{
                    textShadow: [
                      '0 0 0px rgba(201, 162, 39, 0)',
                      '0 0 20px rgba(201, 162, 39, 0.8)',
                      '0 0 10px rgba(201, 162, 39, 0.4)',
                    ],
                  }}
                  transition={{
                    duration: 0.6,
                    delay: wordDelay + 0.3,
                    times: [0, 0.5, 1],
                  }}
                >
                  {word}
                </motion.span>
              ) : (
                word
              )}
            </motion.span>
            {index < words.length - 1 && '\u00A0'}
          </span>
        );
      })}
    </span>
  );
}

// Typewriter effect variant
interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  delay?: number;
}

export function TypewriterText({
  text,
  speed = 0.03,
  className = '',
  onComplete,
  delay = 0,
}: TypewriterTextProps) {
  const characters = useMemo(() => text.split(''), [text]);
  const hasCalledComplete = useRef(false);

  // Calculate total animation time
  const totalDuration = delay + characters.length * speed;

  useEffect(() => {
    if (onComplete && !hasCalledComplete.current) {
      const timer = setTimeout(() => {
        hasCalledComplete.current = true;
        onComplete();
      }, totalDuration * 1000 + 100);
      return () => clearTimeout(timer);
    }
  }, [onComplete, totalDuration]);

  return (
    <span className={className}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.01,
            delay: delay + index * speed,
          }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        className="inline-block w-0.5 h-5 bg-[#C9A227] ml-0.5"
        animate={{ opacity: [1, 0] }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: 'reverse',
          delay: delay + characters.length * speed,
        }}
      />
    </span>
  );
}

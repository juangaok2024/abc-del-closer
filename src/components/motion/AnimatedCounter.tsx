'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
  trigger?: boolean;
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 1.5,
  delay = 0,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
  trigger = true,
}: AnimatedCounterProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const spring = useSpring(from, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
  });

  const display = useTransform(spring, (current) => {
    return `${prefix}${current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${suffix}`;
  });

  useEffect(() => {
    if (trigger && !hasStarted) {
      const timer = setTimeout(() => {
        setHasStarted(true);
        spring.set(to);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [trigger, hasStarted, delay, spring, to]);

  return (
    <motion.span
      ref={ref}
      className={className}
    >
      {display}
    </motion.span>
  );
}

// Preset for money amounts
export function MoneyCounter({
  amount,
  currency = 'USD',
  className = '',
  trigger = true,
  delay = 0,
}: {
  amount: number;
  currency?: string;
  className?: string;
  trigger?: boolean;
  delay?: number;
}) {
  return (
    <AnimatedCounter
      to={amount}
      prefix={currency === 'USD' ? '$' : ''}
      suffix={currency === 'USD' ? ' USD' : ` ${currency}`}
      className={className}
      trigger={trigger}
      delay={delay}
      decimals={0}
    />
  );
}

// Preset for percentage
export function PercentageCounter({
  value,
  className = '',
  trigger = true,
  delay = 0,
}: {
  value: number;
  className?: string;
  trigger?: boolean;
  delay?: number;
}) {
  return (
    <AnimatedCounter
      to={value}
      suffix="%"
      className={className}
      trigger={trigger}
      delay={delay}
      decimals={0}
    />
  );
}

// Counter with animated glow effect
export function GlowingCounter({
  to,
  prefix = '$',
  suffix = '',
  className = '',
  trigger = true,
  delay = 0,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  trigger?: boolean;
  delay?: number;
}) {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      animate={
        trigger
          ? {
              textShadow: [
                '0 0 0px rgba(201, 162, 39, 0)',
                '0 0 20px rgba(201, 162, 39, 0.8)',
                '0 0 10px rgba(201, 162, 39, 0.4)',
              ],
            }
          : {}
      }
      transition={{
        duration: 1,
        delay: delay + 0.5,
        repeat: Infinity,
        repeatDelay: 1,
      }}
    >
      <AnimatedCounter
        to={to}
        prefix={prefix}
        suffix={suffix}
        trigger={trigger}
        delay={delay}
        decimals={0}
      />
    </motion.span>
  );
}

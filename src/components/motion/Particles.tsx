'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
}

interface ParticlesProps {
  trigger?: boolean;
  count?: number;
  color?: 'gold' | 'white' | 'mixed';
  type?: 'explosion' | 'float' | 'confetti';
  originX?: number;
  originY?: number;
  className?: string;
}

const GOLD_COLORS = ['#C9A227', '#e3c565', '#9a7a1a', '#f5d85a'];
const WHITE_COLORS = ['#ffffff', '#f5f5f5', '#e0e0e0', '#d0d0d0'];
const CONFETTI_COLORS = ['#C9A227', '#e3c565', '#ffffff', '#9a7a1a', '#f5d85a'];

export function Particles({
  trigger = false,
  count = 20,
  color = 'gold',
  type = 'explosion',
  originX = 50,
  originY = 50,
  className = '',
}: ParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const prevTriggerRef = useRef(false);

  const getColors = () => {
    switch (color) {
      case 'gold':
        return GOLD_COLORS;
      case 'white':
        return WHITE_COLORS;
      case 'mixed':
        return [...GOLD_COLORS, ...WHITE_COLORS];
      default:
        return GOLD_COLORS;
    }
  };

  useEffect(() => {
    // Only trigger on rising edge (false -> true)
    if (trigger && !prevTriggerRef.current) {
      const colors = getColors();
      const newParticles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: Date.now() + i,
          x: originX,
          y: originY,
          size: type === 'confetti' ? Math.random() * 8 + 4 : Math.random() * 6 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.1,
          duration: type === 'float' ? Math.random() * 2 + 2 : Math.random() * 0.8 + 0.4,
          rotation: Math.random() * 720 - 360,
        });
      }

      setParticles(newParticles);

      // Clean up particles after animation
      const maxDuration = type === 'float' ? 4000 : 1500;
      setTimeout(() => setParticles([]), maxDuration);
    }
    prevTriggerRef.current = trigger;
  }, [trigger, count, originX, originY, type, color]);

  const getAnimationProps = (particle: Particle) => {
    switch (type) {
      case 'explosion':
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 150 + 50;
        return {
          initial: { x: 0, y: 0, opacity: 1, scale: 0 },
          animate: {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            opacity: [1, 1, 0],
            scale: [0, 1.5, 0.5],
            rotate: particle.rotation,
          },
          exit: { opacity: 0 },
          transition: {
            duration: particle.duration,
            delay: particle.delay,
            ease: [0.32, 0, 0.67, 0] as [number, number, number, number],
          },
        };

      case 'float':
        return {
          initial: { y: 0, opacity: 0, scale: 0 },
          animate: {
            y: -200 - Math.random() * 100,
            x: (Math.random() - 0.5) * 100,
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.5],
            rotate: particle.rotation,
          },
          exit: { opacity: 0 },
          transition: {
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeOut' as const,
          },
        };

      case 'confetti':
        return {
          initial: { y: 0, opacity: 1, scale: 1 },
          animate: {
            y: 300 + Math.random() * 100,
            x: (Math.random() - 0.5) * 200,
            opacity: [1, 1, 0],
            rotate: particle.rotation * 2,
            scale: [1, 1, 0.8],
          },
          exit: { opacity: 0 },
          transition: {
            duration: particle.duration + 0.5,
            delay: particle.delay,
            ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
          },
        };

      default:
        return {};
    }
  };

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <AnimatePresence>
        {particles.map((particle) => {
          const props = getAnimationProps(particle);
          return (
            <motion.div
              key={particle.id}
              className={`absolute ${type === 'confetti' ? 'rounded-sm' : 'rounded-full'}`}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: type === 'confetti' ? particle.size * 0.6 : particle.size,
                backgroundColor: particle.color,
                boxShadow: type !== 'confetti' ? `0 0 ${particle.size * 2}px ${particle.color}` : 'none',
              }}
              {...props}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Convenience components for common use cases
export function GoldExplosion({ trigger, originX = 50, originY = 50 }: { trigger: boolean; originX?: number; originY?: number }) {
  return <Particles trigger={trigger} type="explosion" color="gold" count={25} originX={originX} originY={originY} />;
}

export function FloatingParticles({ trigger, originX = 50, originY = 100 }: { trigger: boolean; originX?: number; originY?: number }) {
  return <Particles trigger={trigger} type="float" color="gold" count={15} originX={originX} originY={originY} />;
}

export function Confetti({ trigger }: { trigger: boolean }) {
  return <Particles trigger={trigger} type="confetti" color="mixed" count={40} originX={50} originY={20} />;
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlipCard } from '../motion/FlipCard';
import { InteractiveChecklist } from '../motion/InteractiveChecklist';
import { GatedContent } from '../motion/GatedContent';
import { Particles } from '../motion/Particles';

interface HowtoSectionProps {
  paths: { name: string; steps: string }[];
  requirements: string[];
  quote?: string;
  onComplete: () => void;
}

export function HowtoSection({ paths, requirements, quote, onComplete }: HowtoSectionProps) {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [requirementsComplete, setRequirementsComplete] = useState(false);
  const [showReadyMessage, setShowReadyMessage] = useState(false);

  const allCardsFlipped = flippedCards.size >= paths.length;

  const handleCardFlip = (index: number) => {
    setFlippedCards((prev) => new Set([...prev, index]));
  };

  const handleRequirementsComplete = () => {
    setRequirementsComplete(true);
    setShowReadyMessage(true);
    onComplete();
  };

  const requirementItems = requirements.map((req, index) => ({
    id: `req-${index}`,
    text: req,
    icon: (
      <svg className="w-5 h-5 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }));

  return (
    <div className="space-y-8">
      {/* Paths section */}
      <div className="space-y-4">
        <p className="text-[#808080] text-sm text-center">
          Toca cada camino para ver qué implica
        </p>

        <div className="grid grid-cols-2 gap-4">
          {paths.map((path, index) => {
            const isTraditional = path.name.toLowerCase().includes('tradicional');
            const isFlipped = flippedCards.has(index);

            return (
              <FlipCard
                key={index}
                className="h-[200px]"
                onFlip={() => handleCardFlip(index)}
                hint=""
                front={
                  <div
                    className={`
                      h-full rounded-xl p-4 flex flex-col items-center justify-center text-center
                      ${isTraditional
                        ? 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10'
                        : 'bg-gradient-to-br from-[#C9A227]/10 to-[#0f0f0f] border border-[#C9A227]/20'
                      }
                    `}
                  >
                    <div className={`text-3xl mb-2 ${isTraditional ? 'grayscale' : ''}`}>
                      {isTraditional ? '😩' : '🚀'}
                    </div>
                    <p className={`text-sm font-medium ${isTraditional ? 'text-[#606060]' : 'text-[#C9A227]'}`}>
                      {path.name}
                    </p>
                    <motion.p
                      className="text-[#505050] text-xs mt-2"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Toca para ver
                    </motion.p>
                  </div>
                }
                back={
                  <div
                    className={`
                      h-full rounded-xl p-4 flex flex-col items-center justify-center text-center
                      ${isTraditional
                        ? 'bg-[#1a1a1a] border border-white/10'
                        : 'bg-gradient-to-br from-[#C9A227]/20 to-[#0f0f0f] border border-[#C9A227]/30'
                      }
                    `}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-2"
                    >
                      <p className={`text-xs ${isTraditional ? 'text-[#606060]' : 'text-[#C9A227]'}`}>
                        {path.name}
                      </p>
                      <div className={`text-xs leading-relaxed ${isTraditional ? 'text-[#808080]' : 'text-white/80'}`}>
                        {path.steps.split('→').map((step, i, arr) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            {step.trim()}
                            {i < arr.length - 1 && (
                              <span className={isTraditional ? 'text-red-500/50' : 'text-[#C9A227]'}>
                                {' → '}
                              </span>
                            )}
                          </motion.span>
                        ))}
                      </div>
                      {isTraditional ? (
                        <p className="text-red-400/60 text-xs mt-2">❌ Alto riesgo de abandono</p>
                      ) : (
                        <motion.p
                          className="text-[#C9A227] text-xs mt-2"
                          animate={{
                            textShadow: [
                              '0 0 0px rgba(201, 162, 39, 0)',
                              '0 0 10px rgba(201, 162, 39, 0.5)',
                            ],
                          }}
                          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                        >
                          ✓ Camino probado
                        </motion.p>
                      )}
                    </motion.div>
                  </div>
                }
              />
            );
          })}
        </div>
      </div>

      {/* Requirements section */}
      <GatedContent
        isUnlocked={allCardsFlipped}
        hint="Voltea ambas cartas primero"
      >
        <div className="space-y-4">
          <h3 className="text-white font-medium">¿Qué necesitás para empezar?</h3>
          <p className="text-[#808080] text-sm">Marcá lo que ya tenés:</p>

          <InteractiveChecklist
            items={requirementItems}
            minRequired={2}
            onComplete={handleRequirementsComplete}
            completeMessage="¡Ya estás listo para empezar!"
            emptyMessage="Marcá al menos 2 para continuar"
            instruction=""
          />
        </div>
      </GatedContent>

      {/* Ready message */}
      <AnimatePresence>
        {showReadyMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <Particles
              trigger={true}
              type="explosion"
              color="gold"
              count={30}
              originX={50}
              originY={50}
            />

            {quote && (
              <motion.blockquote
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="border-l-2 border-[#C9A227] pl-4 py-2 text-left"
              >
                <p className="text-[#C9A227] text-sm font-display italic">
                  "{quote}"
                </p>
              </motion.blockquote>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

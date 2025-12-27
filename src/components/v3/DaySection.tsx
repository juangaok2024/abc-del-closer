'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InteractiveChecklist } from '../motion/InteractiveChecklist';
import { GatedContent } from '../motion/GatedContent';
import { Particles, Confetti } from '../motion/Particles';

interface DaySectionProps {
  timeline: { time: string; description: string }[];
  notDo: string[];
  quote?: string;
  onComplete: () => void;
}

export function DaySection({ timeline, notDo, quote, onComplete }: DaySectionProps) {
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(-1);
  const [timelineComplete, setTimelineComplete] = useState(false);
  const [notDoComplete, setNotDoComplete] = useState(false);
  const [showFreedomMessage, setShowFreedomMessage] = useState(false);

  const handleTimelineProgress = () => {
    const nextIndex = currentTimelineIndex + 1;
    setCurrentTimelineIndex(nextIndex);

    // Haptic
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }

    if (nextIndex >= timeline.length - 1) {
      setTimelineComplete(true);
    }
  };

  const handleNotDoComplete = () => {
    setNotDoComplete(true);
    setShowFreedomMessage(true);
    onComplete();
  };

  const notDoItems = notDo.map((item, index) => ({
    id: `notdo-${index}`,
    text: item,
  }));

  return (
    <div className="space-y-8">
      {/* Timeline section */}
      <div className="space-y-4">
        <h3 className="text-white font-medium text-lg">Tu día como Closer:</h3>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-white/10" />

          {/* Timeline items */}
          {timeline.map((item, index) => {
            const isVisible = index <= currentTimelineIndex;
            const isCurrent = index === currentTimelineIndex;
            const isNext = index === currentTimelineIndex + 1;

            return (
              <motion.div
                key={index}
                className="relative pl-12 pb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: isVisible || isNext ? 1 : 0.3 }}
              >
                {/* Timeline dot */}
                <motion.div
                  className={`
                    absolute left-3 w-4 h-4 rounded-full border-2
                    ${isVisible
                      ? 'bg-[#C9A227] border-[#C9A227]'
                      : 'bg-[#0a0a0a] border-white/20'
                    }
                  `}
                  animate={
                    isCurrent
                      ? {
                          boxShadow: [
                            '0 0 0px rgba(201, 162, 39, 0)',
                            '0 0 15px rgba(201, 162, 39, 0.6)',
                            '0 0 0px rgba(201, 162, 39, 0)',
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 1, repeat: Infinity }}
                />

                {/* Content */}
                <AnimatePresence mode="wait">
                  {isVisible ? (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Particles
                        trigger={isCurrent}
                        type="explosion"
                        color="gold"
                        count={10}
                        originX={0}
                        originY={50}
                      />
                      <p className="text-[#C9A227] text-xs font-semibold uppercase tracking-wider mb-1">
                        {item.time}
                      </p>
                      <p className="text-white/90 text-sm">{item.description}</p>
                    </motion.div>
                  ) : isNext ? (
                    <motion.button
                      onClick={handleTimelineProgress}
                      className="text-left w-full group"
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#C9A227]/30 transition-colors"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <p className="text-[#808080] text-xs mb-1">Toca para ver</p>
                        <p className="text-[#606060] text-sm font-medium">{item.time}</p>
                      </motion.div>
                    </motion.button>
                  ) : (
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <p className="text-[#404040] text-xs">{item.time}</p>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Start button if timeline hasn't started */}
        {currentTimelineIndex === -1 && (
          <motion.button
            onClick={handleTimelineProgress}
            className="w-full p-4 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] font-medium"
            animate={{
              boxShadow: [
                '0 0 0px rgba(201, 162, 39, 0)',
                '0 0 20px rgba(201, 162, 39, 0.3)',
                '0 0 0px rgba(201, 162, 39, 0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            whileTap={{ scale: 0.98 }}
          >
            Ver un día típico
          </motion.button>
        )}
      </div>

      {/* "Lo que NO hacés" section */}
      <GatedContent
        isUnlocked={timelineComplete}
        hint="Completa el timeline primero"
      >
        <div className="space-y-4">
          <h3 className="text-white font-medium text-lg">Lo que NO hacés:</h3>
          <p className="text-[#808080] text-sm">Tachá todo lo que no vas a tener que hacer</p>

          <InteractiveChecklist
            items={notDoItems}
            minRequired={notDo.length}
            mode="strikethrough"
            onComplete={handleNotDoComplete}
            completeMessage=""
            instruction=""
          />
        </div>
      </GatedContent>

      {/* Freedom message */}
      <AnimatePresence>
        {showFreedomMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 py-6"
          >
            <Confetti trigger={true} />

            <motion.div
              className="text-4xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              🎉
            </motion.div>

            <motion.p
              className="text-[#C9A227] text-xl font-bold"
              animate={{
                textShadow: [
                  '0 0 0px rgba(201, 162, 39, 0)',
                  '0 0 20px rgba(201, 162, 39, 0.8)',
                  '0 0 10px rgba(201, 162, 39, 0.4)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ¡LIBERTAD!
            </motion.p>

            {quote && (
              <motion.blockquote
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
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

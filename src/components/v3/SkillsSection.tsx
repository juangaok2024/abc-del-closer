'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InteractiveChecklist } from '../motion/InteractiveChecklist';
import { Particles } from '../motion/Particles';

interface Skill {
  title: string;
  points: string[];
}

interface SkillsSectionProps {
  skills: Skill[];
  quote?: string;
  onComplete: () => void;
}

export function SkillsSection({ skills, quote, onComplete }: SkillsSectionProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleSkillSelect = (skillId: string) => {
    if (selectedSkills.includes(skillId)) return;

    setSelectedSkills((prev) => [...prev, skillId]);
    setExpandedSkill(skillId);

    // Check completion (at least 1)
    if (selectedSkills.length === 0) {
      setTimeout(() => {
        setIsComplete(true);
        onComplete();
      }, 1000);
    }
  };

  const checklistItems = skills.map((skill, index) => ({
    id: `skill-${index}`,
    text: skill.title,
    icon: (
      <div className="w-8 h-8 rounded-lg bg-[#C9A227]/10 flex items-center justify-center">
        <span className="text-[#C9A227] font-bold">{index + 1}</span>
      </div>
    ),
  }));

  return (
    <div className="space-y-6">
      {/* Instruction */}
      <motion.p
        className="text-[#808080] text-sm text-center"
        animate={isComplete ? { opacity: 0.5 } : { opacity: [0.6, 1, 0.6] }}
        transition={isComplete ? {} : { duration: 2, repeat: Infinity }}
      >
        {isComplete ? 'Tocá cada una para ver más detalles' : '¿Ya tenés alguna de estas habilidades? Tocá las que sí'}
      </motion.p>

      {/* Skills as interactive cards */}
      <div className="space-y-3">
        {skills.map((skill, index) => {
          const skillId = `skill-${index}`;
          const isSelected = selectedSkills.includes(skillId);
          const isExpanded = expandedSkill === skillId;

          return (
            <motion.div
              key={skillId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <motion.button
                onClick={() => handleSkillSelect(skillId)}
                className={`
                  w-full text-left p-4 rounded-xl transition-all duration-300
                  ${isSelected
                    ? 'bg-[#C9A227]/10 border border-[#C9A227]/30'
                    : 'bg-white/[0.02] border border-white/10 hover:border-white/20'
                  }
                `}
                whileTap={{ scale: 0.98 }}
                layout
              >
                {/* Particles on first select */}
                {isSelected && !isComplete && index === selectedSkills.length - 1 && (
                  <Particles
                    trigger={true}
                    type="explosion"
                    color="gold"
                    count={15}
                    originX={50}
                    originY={50}
                  />
                )}

                <div className="flex items-center gap-4">
                  {/* Number indicator */}
                  <div
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      transition-all duration-300
                      ${isSelected
                        ? 'bg-[#C9A227] text-black'
                        : 'bg-white/5 text-[#808080]'
                      }
                    `}
                  >
                    {isSelected ? (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    ) : (
                      <span className="font-bold">{index + 1}</span>
                    )}
                  </div>

                  {/* Skill title */}
                  <div className="flex-1">
                    <h4
                      className={`font-semibold transition-colors duration-300 ${
                        isSelected ? 'text-[#C9A227]' : 'text-white'
                      }`}
                    >
                      {skill.title}
                    </h4>
                  </div>

                  {/* Expand indicator */}
                  <motion.svg
                    className={`w-5 h-5 transition-colors duration-300 ${
                      isSelected ? 'text-[#C9A227]' : 'text-[#606060]'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                        {skill.points.map((point, pointIndex) => (
                          <motion.p
                            key={pointIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: pointIndex * 0.1 }}
                            className="text-[#a0a0a0] text-sm flex items-start gap-2"
                          >
                            <span className="text-[#C9A227] mt-1">•</span>
                            {point}
                          </motion.p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Completion message */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <Particles
              trigger={true}
              type="confetti"
              color="gold"
              count={30}
              originX={50}
              originY={20}
            />

            {selectedSkills.length === skills.length ? (
              <p className="text-[#C9A227] font-medium">
                ¡Tenés todas! Ya estás más preparado de lo que pensabas
              </p>
            ) : selectedSkills.length >= 2 ? (
              <p className="text-[#C9A227] font-medium">
                ¡Genial! Ya tenés una base sólida
              </p>
            ) : (
              <p className="text-[#a0a0a0]">
                No te preocupes, todas se aprenden y practican
              </p>
            )}

            {/* Quote */}
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

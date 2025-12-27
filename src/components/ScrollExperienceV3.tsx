'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { motion, AnimatePresence } from 'motion/react';
import { steps } from '@/content/steps';
import { ScrollSection } from './ScrollSection';
import { useTracking } from '@/hooks/useTracking';
import {
  IntroSection,
  CloserSection,
  EarningsSection,
  SkillsSection,
  DaySection,
  HowtoSection,
  CTASection,
} from './v3';

const CALENDAR_URL = process.env.NEXT_PUBLIC_CALENDAR_URL || '#';
const STORAGE_KEY = 'abc-closer-section-v3';

export function ScrollExperienceV3() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [sectionCompleted, setSectionCompleted] = useState<Set<number>>(new Set());
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const isAnimatingRef = useRef(false);
  const currentIndexRef = useRef(0);

  // Initialize tracking
  const { trackCTAClick, trackForm } = useTracking({ variant: 'v2' }); // Using v2 tracking

  // Save section to localStorage
  const saveSection = useCallback((index: number) => {
    localStorage.setItem(STORAGE_KEY, index.toString());
  }, []);

  // Mark section as completed (unlocks navigation)
  const completeSection = useCallback((index: number) => {
    setSectionCompleted((prev) => new Set([...prev, index]));
  }, []);

  // Check if can navigate to next section
  const canNavigateToNext = useCallback((fromIndex: number) => {
    return sectionCompleted.has(fromIndex);
  }, [sectionCompleted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Navigate to a specific section
  const goToSection = useCallback((index: number, immediate = false) => {
    if (index < 0 || index >= steps.length) return;
    if (isAnimatingRef.current && !immediate) return;

    // Check if can navigate (section must be completed)
    if (index > currentIndexRef.current && !canNavigateToNext(currentIndexRef.current)) {
      // Show hint animation
      return;
    }

    const sections = sectionsRef.current.filter(Boolean) as HTMLElement[];
    const targetSection = sections[index];
    if (!targetSection || !containerRef.current) return;

    isAnimatingRef.current = true;
    currentIndexRef.current = index;
    setCurrentSection(index);
    saveSection(index);

    // Scroll the section to top before navigating
    targetSection.scrollTop = 0;

    // Animate scroll to section
    gsap.to(containerRef.current, {
      scrollTop: targetSection.offsetTop,
      duration: immediate ? 0 : 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });
  }, [saveSection, canNavigateToNext]);

  // Initialize GSAP Observer
  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    gsap.registerPlugin(Observer);

    // Create Observer for scroll/swipe detection
    const observer = Observer.create({
      target: containerRef.current,
      type: 'wheel,touch',
      wheelSpeed: -1,
      tolerance: 10,
      preventDefault: true, // Prevent scroll - section navigation is gamified
      onUp: () => {
        if (isAnimatingRef.current) return;
        if (!canNavigateToNext(currentIndexRef.current)) return;

        if (currentIndexRef.current < steps.length - 1) {
          goToSection(currentIndexRef.current + 1);
        }
      },
      onDown: () => {
        if (isAnimatingRef.current) return;

        if (currentIndexRef.current > 0) {
          goToSection(currentIndexRef.current - 1);
        }
      },
    });

    return () => {
      observer.kill();
    };
  }, [isMounted, goToSection, canNavigateToNext]);

  // Handle form submission
  const handleFormSubmit = useCallback(async (formData: { name: string; email: string; phone: string }) => {
    setIsSubmittingForm(true);
    try {
      await trackForm(formData);
      window.open(CALENDAR_URL, '_blank');
    } catch {
      window.open(CALENDAR_URL, '_blank');
    } finally {
      setIsSubmittingForm(false);
    }
  }, [trackForm]);

  // Render section content based on step
  const renderSectionContent = (step: typeof steps[0], index: number) => {
    const onComplete = () => {
      completeSection(index);
      // Auto-navigate to next section after completion (with delay)
      setTimeout(() => {
        if (index < steps.length - 1) {
          goToSection(index + 1);
        }
      }, 800);
    };

    switch (step.content.type) {
      case 'intro':
        return (
          <IntroSection
            headline={step.headline}
            subtext={step.content.subtext}
            onComplete={onComplete}
          />
        );

      case 'text':
        return (
          <CloserSection
            paragraphs={step.content.paragraphs}
            quote={step.quote}
            onComplete={onComplete}
          />
        );

      case 'earnings':
        return (
          <EarningsSection
            model={step.content.model}
            example={step.content.example}
            ranges={step.content.ranges}
            quote={step.quote}
            onComplete={onComplete}
          />
        );

      case 'skills':
        return (
          <SkillsSection
            skills={step.content.skills}
            quote={step.quote}
            onComplete={onComplete}
          />
        );

      case 'day':
        return (
          <DaySection
            timeline={step.content.timeline}
            notDo={step.content.notDo}
            quote={step.quote}
            onComplete={onComplete}
          />
        );

      case 'howto':
        return (
          <HowtoSection
            paths={step.content.paths}
            requirements={step.content.requirements}
            quote={step.quote}
            onComplete={onComplete}
          />
        );

      case 'cta':
        return (
          <CTASection
            paragraphs={step.content.paragraphs}
            buttonText={step.content.buttonText}
            subtext={step.content.subtext}
            signature={step.content.signature}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmittingForm}
          />
        );

      default:
        return null;
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-[#C9A227]/20 rounded-full" />
          <div className="absolute inset-0 w-12 h-12 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5" />
        <div className="relative max-w-[480px] mx-auto px-5 py-4">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-[#a0a0a0] font-medium tracking-wide">
              Paso{' '}
              <span className="text-white font-semibold">
                {currentSection + 1}
              </span>{' '}
              de {steps.length}
            </span>
            <span className="gold-text font-semibold tabular-nums">
              {steps[currentSection]?.progress || 0}%
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #9a7a1a 0%, #C9A227 50%, #e3c565 100%)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${steps[currentSection]?.progress || 0}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <nav className="nav-dots">
        {steps.map((_, index) => {
          const isCompleted = sectionCompleted.has(index);
          const isCurrent = currentSection === index;
          const isAccessible = index === 0 || sectionCompleted.has(index - 1);

          return (
            <button
              key={index}
              className={`nav-dot ${isCurrent ? 'active' : ''} ${!isAccessible ? 'opacity-30 cursor-not-allowed' : ''}`}
              onClick={() => isAccessible && goToSection(index)}
              disabled={!isAccessible}
              aria-label={`Ir al paso ${index + 1}`}
            >
              {isCompleted && !isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#C9A227]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Gamification hint */}
      <AnimatePresence>
        {!canNavigateToNext(currentSection) && currentSection < steps.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <motion.div
              className="px-4 py-2 bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/10 rounded-full"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className="text-[#808080] text-sm">
                Completa esta sección para continuar
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Scroll Container */}
      <div
        ref={containerRef}
        className="scroll-container"
      >
        {steps.map((step, index) => (
          <ScrollSection
            key={step.id}
            id={`section-${index}`}
            ref={(el) => { sectionsRef.current[index] = el; }}
            className="pt-24 pb-12"
          >
            <div className="section-content">
              {/* Headline - only for non-intro sections */}
              {step.content.type !== 'intro' && step.content.type !== 'cta' && (
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: currentSection === index ? 1 : 0.3,
                    y: currentSection === index ? 0 : 20,
                  }}
                  transition={{ duration: 0.5 }}
                  className="section-headline font-display text-white mb-8 leading-[1.15] tracking-tight text-[28px] md:text-[34px] font-medium"
                >
                  {step.headline}
                </motion.h1>
              )}

              {/* Section content - V3 uses Motion, not GSAP for animations */}
              <div>
                {renderSectionContent(step, index)}
              </div>
            </div>
          </ScrollSection>
        ))}
      </div>
    </>
  );
}

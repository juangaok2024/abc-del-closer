'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { steps } from '@/content/steps';
import { ScrollSection } from './ScrollSection';
import { StepContent } from './StepContent';
import { ScrollHint } from './ScrollHint';
import { ContinueButton } from './ContinueButton';
import { ContactForm } from './ContactForm';
import { useTracking } from '@/hooks/useTracking';

const CALENDAR_URL = process.env.NEXT_PUBLIC_CALENDAR_URL || '#';
const STORAGE_KEY = 'abc-closer-section';

interface ScrollExperienceProps {
  variant?: 'default' | 'v2';
}

export function ScrollExperience({ variant = 'default' }: ScrollExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const isAnimatingRef = useRef(false);
  const currentIndexRef = useRef(0);

  // Initialize tracking
  const { trackCTAClick, trackForm } = useTracking({ variant });

  // Handle form submission for v2 variant
  const handleFormSubmit = useCallback(async (formData: { name: string; email: string; phone: string }) => {
    setIsSubmittingForm(true);
    try {
      await trackForm(formData);
      setFormSubmitted(true);
      // Redirect to calendar after successful submission
      window.open(CALENDAR_URL, '_blank');
    } catch {
      // Form still submitted even if tracking failed
      setFormSubmitted(true);
      window.open(CALENDAR_URL, '_blank');
    } finally {
      setIsSubmittingForm(false);
    }
  }, [trackForm]);

  const saveSection = useCallback((index: number) => {
    localStorage.setItem(STORAGE_KEY, index.toString());
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Navigate to a specific section
  const goToSection = useCallback((index: number, immediate = false) => {
    if (index < 0 || index >= steps.length) return;
    if (isAnimatingRef.current && !immediate) return;

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
        animateSection(targetSection);
      },
    });
  }, [saveSection]);

  // Animate section content
  const animateSection = (section: HTMLElement) => {
    const headline = section.querySelector('.section-headline');
    const content = section.querySelector('.section-body');
    const cta = section.querySelector('.section-cta');

    gsap.killTweensOf([headline, content, cta]);
    gsap.set([headline, content, cta], { clearProps: 'all' });

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    if (headline) {
      tl.fromTo(
        headline,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    }

    if (content) {
      tl.fromTo(
        content,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.2'
      );
    }

    if (cta) {
      tl.fromTo(
        cta,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.2'
      );
    }
  };

  // Check if current section can scroll internally
  const canSectionScrollDown = useCallback(() => {
    const sections = sectionsRef.current.filter(Boolean) as HTMLElement[];
    const currentSec = sections[currentIndexRef.current];
    if (!currentSec) return false;

    const { scrollTop, scrollHeight, clientHeight } = currentSec;
    // Has more content to scroll down (with 5px tolerance)
    return scrollTop + clientHeight < scrollHeight - 5;
  }, []);

  const canSectionScrollUp = useCallback(() => {
    const sections = sectionsRef.current.filter(Boolean) as HTMLElement[];
    const currentSec = sections[currentIndexRef.current];
    if (!currentSec) return false;

    // Has content above to scroll up (with 5px tolerance)
    return currentSec.scrollTop > 5;
  }, []);

  // Initialize GSAP Observer for scroll/swipe detection
  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    gsap.registerPlugin(Observer);

    const sections = sectionsRef.current.filter(Boolean) as HTMLElement[];

    // Load saved section
    const savedSection = localStorage.getItem(STORAGE_KEY);
    const initialSection = savedSection ? parseInt(savedSection, 10) : 0;

    if (initialSection > 0 && initialSection < sections.length) {
      currentIndexRef.current = initialSection;
      setCurrentSection(initialSection);
      // Immediate scroll without animation
      if (containerRef.current && sections[initialSection]) {
        containerRef.current.scrollTop = sections[initialSection].offsetTop;
      }
    }

    // Animate initial section
    setTimeout(() => {
      if (sections[currentIndexRef.current]) {
        animateSection(sections[currentIndexRef.current]);
      }
    }, 200);

    // Create Observer for scroll/swipe/touch/wheel detection
    const observer = Observer.create({
      target: containerRef.current,
      type: 'wheel,touch',
      wheelSpeed: -1,
      tolerance: 10,
      preventDefault: false, // Allow default scroll for internal section scrolling
      onUp: () => {
        // Scrolling/swiping UP (going to NEXT section)
        if (isAnimatingRef.current) return;

        // If current section can scroll down, don't navigate yet
        if (canSectionScrollDown()) return;

        // At bottom of section content, go to next section
        if (currentIndexRef.current < steps.length - 1) {
          goToSection(currentIndexRef.current + 1);
        }
      },
      onDown: () => {
        // Scrolling/swiping DOWN (going to PREVIOUS section)
        if (isAnimatingRef.current) return;

        // If current section can scroll up, don't navigate yet
        if (canSectionScrollUp()) return;

        // At top of section content, go to previous section
        if (currentIndexRef.current > 0) {
          goToSection(currentIndexRef.current - 1);
        }
      },
    });

    return () => {
      observer.kill();
    };
  }, [isMounted, goToSection, canSectionScrollDown, canSectionScrollUp]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (!isAnimatingRef.current && currentIndexRef.current < steps.length - 1) {
          goToSection(currentIndexRef.current + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (!isAnimatingRef.current && currentIndexRef.current > 0) {
          goToSection(currentIndexRef.current - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToSection]);

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
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${steps[currentSection]?.progress || 0}%`,
                background: 'linear-gradient(90deg, #9a7a1a 0%, #C9A227 50%, #e3c565 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <nav className="nav-dots">
        {steps.map((_, index) => (
          <button
            key={index}
            className={`nav-dot ${currentSection === index ? 'active' : ''}`}
            onClick={() => goToSection(index)}
            aria-label={`Ir al paso ${index + 1}`}
          />
        ))}
      </nav>

      {/* Main Scroll Container */}
      <div
        ref={containerRef}
        className="scroll-container"
      >
        {steps.map((step, index) => {
          const isCTA = step.content.type === 'cta';
          const isIntro = step.content.type === 'intro';

          return (
            <ScrollSection
              key={step.id}
              id={`section-${index}`}
              ref={(el) => { sectionsRef.current[index] = el; }}
              className="pt-24 pb-12"
            >
              <div className="section-content">
                {/* Headline */}
                <h1
                  className={`section-headline font-display text-white mb-8 leading-[1.15] tracking-tight ${
                    isIntro
                      ? 'text-[32px] md:text-[40px] font-semibold'
                      : 'text-[28px] md:text-[34px] font-medium'
                  }`}
                >
                  {isIntro ? (
                    <>
                      {step.headline.split(' ').map((word, i, arr) => (
                        <span
                          key={i}
                          className={
                            word.toLowerCase() === 'mejor' || word.toLowerCase() === 'pagado'
                              ? 'gold-text'
                              : ''
                          }
                        >
                          {word}
                          {i < arr.length - 1 ? ' ' : ''}
                        </span>
                      ))}
                    </>
                  ) : (
                    step.headline
                  )}
                </h1>

                {/* Content */}
                <div className="section-body mb-6">
                  <StepContent step={step} />
                </div>

                {/* CTA Section (only on last step) */}
                {isCTA && step.content.type === 'cta' && (
                  <div className="section-cta space-y-6 mt-6">
                    {variant === 'v2' ? (
                      // V2: Contact form with class context
                      formSubmitted ? (
                        <div className="text-center space-y-4">
                          <div className="w-20 h-20 mx-auto bg-[#C9A227]/10 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-[#C9A227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-white font-semibold text-xl">¡Listo! Ya tenés acceso</p>
                          <p className="text-[#a0a0a0] text-sm">
                            Revisá tu correo. Te enviamos el link a la clase.
                          </p>
                          <p className="text-[#606060] text-xs mt-2">
                            También te abrimos el calendario por si querés agendar ahora.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Class header */}
                          <div className="text-center space-y-3">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#C9A227]/10 rounded-full border border-[#C9A227]/20">
                              <svg className="w-4 h-4 text-[#C9A227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-[#C9A227] text-sm font-medium uppercase tracking-wide">Clase Gratuita</span>
                            </div>
                            <h3 className="text-white text-xl font-semibold">
                              El ABC del Closer Profesional
                            </h3>
                          </div>

                          {/* Benefits list */}
                          <div className="bg-white/[0.02] rounded-xl p-5 border border-white/5">
                            <p className="text-[#a0a0a0] text-sm mb-4">En esta clase vas a descubrir:</p>
                            <ul className="space-y-3">
                              <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-[#C9A227] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-white/90 text-sm">Cómo funcionan las llamadas de cierre</span>
                              </li>
                              <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-[#C9A227] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-white/90 text-sm">El paso a paso para empezar desde cero</span>
                              </li>
                              <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-[#C9A227] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-white/90 text-sm">Si esto realmente es para vos</span>
                              </li>
                            </ul>
                          </div>

                          {/* Divider */}
                          <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-[#606060] text-xs uppercase tracking-wider">Acceso inmediato</span>
                            <div className="flex-1 h-px bg-white/10" />
                          </div>

                          {/* Form section */}
                          <div className="space-y-4">
                            <p className="text-center text-[#a0a0a0] text-sm">
                              Ingresá tus datos para acceder:
                            </p>
                            <ContactForm
                              onSubmit={handleFormSubmit}
                              buttonText="ACCEDER A LA CLASE GRATIS"
                              isSubmitting={isSubmittingForm}
                            />
                          </div>
                        </div>
                      )
                    ) : (
                      // Default: Direct CTA button
                      <ContinueButton
                        onClick={() => {}}
                        text={step.content.buttonText}
                        isExternal
                        href={CALENDAR_URL}
                        onTrack={(href) => trackCTAClick('cta_calendar_click', href)}
                      />
                    )}
                    <p className="text-center text-[#808080] text-sm">
                      {step.content.subtext}
                    </p>
                    <div className="pt-8 border-t border-white/5">
                      <p className="text-center text-[#606060] text-sm font-medium">
                        {step.content.signature}
                      </p>
                    </div>
                  </div>
                )}

                {/* Scroll hint indicator (all sections except last) */}
                {!isCTA && (
                  <ScrollHint onNavigate={() => goToSection(index + 1)} />
                )}
              </div>
            </ScrollSection>
          );
        })}
      </div>
    </>
  );
}

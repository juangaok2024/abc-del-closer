'use client';

import { useStep } from '@/hooks/useStep';
import { steps } from '@/content/steps';
import { ProgressBar } from '@/components/ProgressBar';
import { StepContent } from '@/components/StepContent';
import { ContinueButton } from '@/components/ContinueButton';
import { BackButton } from '@/components/BackButton';

const CALENDAR_URL = process.env.NEXT_PUBLIC_CALENDAR_URL || '#';

export default function Home() {
  const { currentStep, nextStep, prevStep, isLoaded, isFirst } = useStep(steps.length);
  const step = steps[currentStep];

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-[#C9A227]/20 rounded-full" />
          <div className="absolute inset-0 w-12 h-12 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const isCTA = step.content.type === 'cta';
  const isIntro = step.content.type === 'intro';

  return (
    <main className="min-h-screen relative z-10">
      <ProgressBar
        currentStep={currentStep}
        totalSteps={steps.length}
        progress={step.progress}
      />

      <div className="pt-24 pb-12 px-5">
        <div className="max-w-[480px] mx-auto">
          <div
            key={step.id}
            className="animate-fadeInUp"
          >
            {!isFirst && <BackButton onClick={prevStep} />}

            {/* Headline with elegant typography */}
            <h1
              className={`font-display text-white mb-8 leading-[1.15] tracking-tight ${
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
            <div className="mb-10">
              <StepContent step={step} />
            </div>

            {/* CTA Section */}
            <div className={`${isCTA ? 'mt-10' : 'mt-8'}`}>
              {isCTA && step.content.type === 'cta' ? (
                <div className="space-y-6">
                  <ContinueButton
                    onClick={() => {}}
                    text={step.content.buttonText}
                    isExternal
                    href={CALENDAR_URL}
                  />
                  <p className="text-center text-[#808080] text-sm">
                    {step.content.subtext}
                  </p>
                  <div className="pt-8 border-t border-white/5">
                    <p className="text-center text-[#606060] text-sm font-medium">
                      {step.content.signature}
                    </p>
                  </div>
                </div>
              ) : (
                <ContinueButton
                  onClick={nextStep}
                  text={isFirst ? 'Empezar' : 'Continuar'}
                />
              )}
            </div>

            {/* Step indicator dots for mobile */}
            <div className="flex justify-center gap-2 mt-10">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === currentStep
                      ? 'w-6 bg-[#C9A227]'
                      : i < currentStep
                      ? 'w-1.5 bg-[#C9A227]/40'
                      : 'w-1.5 bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

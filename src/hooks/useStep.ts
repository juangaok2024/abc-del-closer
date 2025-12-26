'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'abc-closer-step';

export function useStep(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < totalSteps) {
        setCurrentStep(parsed);
      }
    }
    setIsLoaded(true);
  }, [totalSteps]);

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
      localStorage.setItem(STORAGE_KEY, step.toString());
      // Scroll to top on step change
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    currentStep,
    isLoaded,
    goToStep,
    nextStep,
    prevStep,
    reset,
    isFirst: currentStep === 0,
    isLast: currentStep === totalSteps - 1,
  };
}

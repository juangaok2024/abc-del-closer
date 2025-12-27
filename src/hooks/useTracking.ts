'use client';

import { useEffect, useRef, useCallback } from 'react';
import {
  trackPageView,
  trackButtonClick,
  trackFormSubmit,
  getOrCreateSession,
  type SessionData,
} from '@/lib/tracking';

interface UseTrackingOptions {
  variant?: 'default' | 'v2';
  trackOnMount?: boolean;
}

export function useTracking(options: UseTrackingOptions = {}) {
  const { variant = 'default', trackOnMount = true } = options;
  const hasTrackedPageView = useRef(false);
  const sessionRef = useRef<SessionData | null>(null);

  // Initialize session and track page view on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize session
    sessionRef.current = getOrCreateSession();

    // Track page view (only once per mount)
    if (trackOnMount && !hasTrackedPageView.current) {
      hasTrackedPageView.current = true;
      trackPageView(variant);
    }
  }, [variant, trackOnMount]);

  // Track CTA button click
  const trackCTAClick = useCallback(
    async (buttonAction: string, destinationUrl: string) => {
      await trackButtonClick(buttonAction, destinationUrl, variant);
    },
    [variant]
  );

  // Track form submission (for v2)
  const trackForm = useCallback(
    async (formData: { name: string; email: string; phone: string }) => {
      await trackFormSubmit(formData);
    },
    []
  );

  // Get current session ID
  const getSessionId = useCallback(() => {
    return sessionRef.current?.session_id || null;
  }, []);

  return {
    trackCTAClick,
    trackForm,
    getSessionId,
  };
}

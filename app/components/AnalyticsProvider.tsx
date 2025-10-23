'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import ReactGA from 'react-ga4';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const isEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
    
    if (!isEnabled) {
      return;
    }

    // Initialize PostHog
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    
    if (posthogKey && posthogHost) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            posthog.debug();
          }
        },
        capture_pageview: false, // We'll capture manually
        capture_pageleave: true,
      });
    }

    // Initialize Google Analytics 4
    const ga4MeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
    
    if (ga4MeasurementId) {
      ReactGA.initialize(ga4MeasurementId, {
        gaOptions: {
          debug_mode: process.env.NODE_ENV === 'development',
        },
      });
    }
  }, []);

  return <>{children}</>;
}

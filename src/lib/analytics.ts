// Analytics event tracker
// Supports console logging in dev and integrates with PostHog and Google Analytics 4

import posthog from 'posthog-js';
import ReactGA from 'react-ga4';

type AnalyticsEvent = 
  | 'homepage_view'
  | 'search_initiated'
  | 'supplier_profile_view'
  | 'contact_click'
  | 'rfq_created'
  | 'supplier_registered'
  | 'user_signed_up'
  | 'user_signed_in'

interface EventProperties {
  [key: string]: string | number | boolean | undefined
}

const isDev = process.env.NODE_ENV === 'development'
const isAnalyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'

class Analytics {
  track(event: AnalyticsEvent, properties?: EventProperties): void {
    // Log to console in development
    if (isDev) {
      console.log(`[Analytics] ${event}`, properties || {})
    }

    // Store event in localStorage for dashboard metrics
    try {
      if (typeof window !== 'undefined') {
        const events = this.getStoredEvents()
        events.push({
          event,
          properties,
          timestamp: new Date().toISOString(),
        })
        // Keep only last 100 events
        const recentEvents = events.slice(-100)
        localStorage.setItem('greenchainz_analytics', JSON.stringify(recentEvents))
      }
    } catch (error) {
      console.error('Failed to store analytics event:', error)
    }

    // Track with PostHog
    if (isAnalyticsEnabled && typeof window !== 'undefined' && posthog.__loaded) {
      posthog.capture(event, properties)
    }

    // Track with Google Analytics 4
    if (isAnalyticsEnabled && typeof window !== 'undefined') {
      ReactGA.event({
        category: this.getEventCategory(event),
        action: event,
        label: properties?.label as string | undefined,
        value: properties?.value as number | undefined,
        ...properties,
      })
    }
  }

  private getEventCategory(event: AnalyticsEvent): string {
    if (event.includes('view')) return 'Page Views'
    if (event.includes('click')) return 'User Actions'
    if (event.includes('search')) return 'Search'
    if (event.includes('created') || event.includes('registered') || event.includes('signed')) return 'Conversions'
    return 'General'
  }

  getStoredEvents() {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem('greenchainz_analytics')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  getEventCount(event?: AnalyticsEvent): number {
    const events = this.getStoredEvents()
    if (!event) return events.length
    return events.filter((e: any) => e.event === event).length
  }

  clearEvents(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('greenchainz_analytics')
    }
  }

  // Identify user for analytics platforms
  identify(userId: string, traits?: Record<string, any>): void {
    if (isAnalyticsEnabled && typeof window !== 'undefined') {
      // PostHog identify
      if (posthog.__loaded) {
        posthog.identify(userId, traits)
      }
      
      // GA4 set user properties
      ReactGA.set({ userId, ...traits })
    }
  }

  // Reset user identity (on logout)
  reset(): void {
    if (isAnalyticsEnabled && typeof window !== 'undefined') {
      if (posthog.__loaded) {
        posthog.reset()
      }
    }
  }
}

export const analytics = new Analytics()

// Helper hooks for React components
export function trackPageView(pageName: string) {
  analytics.track('homepage_view', { page: pageName })
}

export function trackSearch(query: string, filters?: Record<string, any>) {
  analytics.track('search_initiated', { query, ...filters })
}

export function trackSupplierView(supplierId: string, supplierName: string) {
  analytics.track('supplier_profile_view', { supplierId, supplierName })
}

export function trackContactClick(supplierId: string) {
  analytics.track('contact_click', { supplierId })
}

export function trackRFQCreated(supplierId: string, details?: Record<string, any>) {
  analytics.track('rfq_created', { supplierId, ...details })
}

export function trackSupplierRegistered(supplierId: string, category?: string) {
  analytics.track('supplier_registered', { supplierId, category })
}

export function trackUserSignedUp(userId: string, method?: string) {
  analytics.track('user_signed_up', { userId, method })
  analytics.identify(userId, { signupMethod: method })
}

export function trackUserSignedIn(userId: string, method?: string) {
  analytics.track('user_signed_in', { userId, method })
  analytics.identify(userId)
}


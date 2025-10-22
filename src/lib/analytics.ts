// Analytics event tracker
// Supports console logging in dev and can be extended for PostHog, Mixpanel, etc.

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

    // TODO: Add PostHog integration
    // if (isAnalyticsEnabled && typeof window !== 'undefined' && (window as any).posthog) {
    //   (window as any).posthog.capture(event, properties)
    // }

    // TODO: Add Mixpanel integration
    // if (isAnalyticsEnabled && typeof window !== 'undefined' && (window as any).mixpanel) {
    //   (window as any).mixpanel.track(event, properties)
    // }
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

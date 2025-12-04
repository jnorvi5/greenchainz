# Analytics Integration Guide

This document describes the analytics implementation for GreenChainz, including PostHog and Google Analytics 4 integration.

## Overview

The analytics system tracks key user events across the platform to help understand user behavior and improve the product. It supports both PostHog and Google Analytics 4.

## Features

- **Dual Platform Support**: Integrates with both PostHog and Google Analytics 4
- **Event Tracking**: Captures key user events automatically
- **User Identification**: Tracks users across sessions
- **Privacy Focused**: Can be completely disabled via environment variable
- **Local Storage Fallback**: Events are stored locally for internal dashboard metrics

## Tracked Events

The following events are automatically tracked:

| Event | Description | Properties |
|-------|-------------|------------|
| `homepage_view` | User visits the homepage | `page` |
| `search_initiated` | User performs a search | `query`, filters |
| `supplier_profile_view` | User views a supplier profile | `supplierId`, `supplierName` |
| `contact_click` | User clicks contact information | `supplierId` |
| `rfq_created` | User creates a request for quote | `supplierId`, details |
| `supplier_registered` | New supplier registers | `supplierId`, `category` |
| `user_signed_up` | New user signs up | `userId`, `method` |
| `user_signed_in` | User signs in | `userId`, `method` |

## Setup Instructions

### 1. Enable Analytics

Set the following environment variable:

```bash
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

### 2. PostHog Setup (Recommended)

PostHog is an open-source product analytics platform that provides powerful insights.

1. Sign up at [posthog.com](https://posthog.com)
2. Create a new project
3. Copy your Project API Key from Settings → Project
4. Add to your environment variables:

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**PostHog Features:**
- Session recordings
- Feature flags
- Funnel analysis
- Cohort analysis
- A/B testing
- Free tier available

### 3. Google Analytics 4 Setup

Google Analytics 4 provides traditional web analytics with Google's ecosystem integration.

1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new GA4 property
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)
4. Add to your environment variables:

```bash
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

**GA4 Features:**
- Standard web analytics
- Conversion tracking
- Audience segmentation
- Integration with Google Ads
- Free for standard use

### 4. Both Services (Maximum Coverage)

You can use both services simultaneously for maximum analytics coverage:

```bash
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Implementation Details

### Analytics Provider

The `AnalyticsProvider` component in `app/components/AnalyticsProvider.tsx` initializes both PostHog and GA4 when the app loads.

### Analytics Class

The `Analytics` class in `src/lib/analytics.ts` provides a unified interface for tracking events across all platforms:

```typescript
import { analytics } from '@/lib/analytics';

// Track an event
analytics.track('supplier_profile_view', {
  supplierId: '123',
  supplierName: 'Green Supplier Co'
});

// Identify a user
analytics.identify('user_123', {
  email: 'user@example.com',
  plan: 'pro'
});

// Reset user identity (on logout)
analytics.reset();
```

### Helper Functions

Convenient helper functions are provided for common events:

```typescript
import { 
  trackPageView,
  trackSearch,
  trackSupplierView,
  trackContactClick,
  trackRFQCreated,
  trackSupplierRegistered,
  trackUserSignedUp,
  trackUserSignedIn
} from '@/lib/analytics';

// Example usage
trackSearch('solar panels', { category: 'renewable-energy' });
trackSupplierView('supplier_123', 'Green Energy Co');
```

## Privacy Considerations

### GDPR Compliance

When using analytics:
1. Update your privacy policy to disclose analytics usage
2. The CookieConsent component should be configured to get user consent
3. Consider implementing a user preference to opt-out of tracking

### Disabling Analytics

To completely disable analytics:

```bash
NEXT_PUBLIC_ANALYTICS_ENABLED=false
```

Or simply omit all analytics environment variables.

### Data Retention

- **PostHog**: Configurable in PostHog dashboard (default: 7 years)
- **Google Analytics 4**: Configurable in GA4 settings (default: 14 months)
- **Local Storage**: Last 100 events only

## Development Mode

In development mode (`NODE_ENV=development`):
- Events are logged to the browser console
- PostHog debug mode is enabled
- GA4 debug mode is enabled

## Troubleshooting

### Events Not Showing in Dashboard

1. Verify `NEXT_PUBLIC_ANALYTICS_ENABLED=true`
2. Check that API keys are correct
3. Open browser console and look for `[Analytics]` logs
4. Verify PostHog/GA4 dashboard is showing real-time events

### Build Errors

If you encounter build errors related to analytics:
1. Ensure all environment variables are set correctly
2. Clear `.next` directory and rebuild
3. Check that posthog-js and react-ga4 packages are installed

### Type Errors

The analytics system is fully typed. If you add custom events:
1. Update the `AnalyticsEvent` type in `src/lib/analytics.ts`
2. Create a helper function for the new event

## Testing

To test analytics in development:

1. Start the development server: `npm run dev`
2. Open browser console
3. Perform actions that trigger events
4. Check console logs for `[Analytics]` messages
5. Verify events in PostHog/GA4 dashboard (real-time view)

## Best Practices

1. **Event Naming**: Use past tense and snake_case (e.g., `supplier_registered`)
2. **Properties**: Include relevant context (IDs, categories, etc.)
3. **User Privacy**: Always respect user privacy preferences
4. **Performance**: Analytics tracking is non-blocking and won't slow down the app
5. **Testing**: Test analytics in staging before production deployment

## Migration from Previous Analytics

If migrating from other analytics platforms:
1. Run both systems in parallel during transition
2. Verify data consistency
3. Update any custom reports or dashboards
4. Remove old analytics code after verification

## Additional Resources

- [PostHog Documentation](https://posthog.com/docs)
- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Analytics Best Practices](https://segment.com/academy/collecting-data/best-practices-for-event-naming/)

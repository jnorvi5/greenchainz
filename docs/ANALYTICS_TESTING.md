# Analytics Testing Guide

This document describes how to manually test the analytics integration.

## Prerequisites

1. Ensure you have PostHog and/or GA4 credentials
2. Update your `.env.local` file with the appropriate environment variables

## Test Setup

### Option 1: Test with Analytics Disabled (Default)

```bash
# In .env.local
NEXT_PUBLIC_ANALYTICS_ENABLED=false
```

This will:
- Log events to browser console in development mode
- Store events in localStorage
- NOT send events to PostHog or GA4

### Option 2: Test with PostHog Only

```bash
# In .env.local
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_POSTHOG_KEY=phc_your_test_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Option 3: Test with GA4 Only

```bash
# In .env.local
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Option 4: Test with Both Services

```bash
# In .env.local
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_POSTHOG_KEY=phc_your_test_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Running Tests

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Open Browser Console

Open your browser's developer tools (F12) and navigate to the Console tab.

### 3. Test Event Tracking

#### Test 1: Homepage View

1. Navigate to `http://localhost:3000`
2. Check console for: `[Analytics] homepage_view { page: 'homepage' }`
3. **PostHog**: Check Events in PostHog dashboard (real-time)
4. **GA4**: Check DebugView in GA4 dashboard

**Expected Result**: Event is logged and sent to configured platforms

#### Test 2: Search Initiated

1. On the homepage, enter a search query (e.g., "solar panels")
2. Click search or press Enter
3. Check console for: `[Analytics] search_initiated { query: 'solar panels', ... }`

**Expected Result**: Event is logged with search query

#### Test 3: Supplier Profile View

1. Click on any supplier from search results
2. Check console for: `[Analytics] supplier_profile_view { supplierId: '...', supplierName: '...' }`

**Expected Result**: Event is logged with supplier details

#### Test 4: Contact Click

1. On a supplier profile page, click on contact email or phone
2. Check console for: `[Analytics] contact_click { supplierId: '...' }`

**Expected Result**: Event is logged with supplier ID

#### Test 5: User Sign-Up

1. Navigate to `/auth`
2. Sign up with a new email
3. Check console for: `[Analytics] user_signed_up { userId: '...', method: 'email' }`

**Expected Result**: 
- Event is logged
- User is identified in analytics platforms
- User ID is associated with future events

#### Test 6: User Sign-In

1. Navigate to `/auth`
2. Sign in with existing credentials
3. Check console for: `[Analytics] user_signed_in { userId: '...', method: 'email' }`

**Expected Result**: 
- Event is logged
- User is identified in analytics platforms

#### Test 7: User Sign-Out

1. Click sign out
2. Check console - analytics should be reset

**Expected Result**: User identity is cleared

### 4. Verify LocalStorage

Open the Application/Storage tab in browser dev tools and check localStorage:

```javascript
// In browser console:
JSON.parse(localStorage.getItem('greenchainz_analytics'))
```

**Expected Result**: Array of recent events (max 100)

## PostHog Verification

1. Log in to your PostHog dashboard
2. Go to "Events" → "Live Events"
3. Perform actions in your app
4. Events should appear in real-time
5. Check that event properties are captured correctly

### PostHog Debug Mode

In development, PostHog runs in debug mode. You can verify by:

```javascript
// In browser console:
posthog.debug()
```

This will log all PostHog operations to the console.

## Google Analytics 4 Verification

1. Log in to your GA4 dashboard
2. Go to "Admin" → "DebugView"
3. Perform actions in your app
4. Events should appear in DebugView
5. Check that event parameters are captured correctly

### GA4 Debug Mode

In development, GA4 runs in debug mode automatically. Events will appear in DebugView immediately.

## Testing User Identification

### Test User Properties

```javascript
// In browser console after signing in:
// For PostHog:
posthog.people.properties

// For GA4:
// User properties are visible in GA4 dashboard under User Explorer
```

**Expected Result**: User properties include email and other traits

## Common Issues and Solutions

### Issue: Events Not Appearing in Console

**Solution**: 
- Verify `NODE_ENV=development`
- Check that you're on the correct page/performing the correct action
- Clear browser cache and reload

### Issue: Events Not Appearing in PostHog

**Solution**:
- Verify `NEXT_PUBLIC_ANALYTICS_ENABLED=true`
- Check PostHog API key is correct
- Check network tab for failed requests to PostHog
- Verify PostHog project is not paused

### Issue: Events Not Appearing in GA4

**Solution**:
- Verify `NEXT_PUBLIC_ANALYTICS_ENABLED=true`
- Check GA4 Measurement ID is correct
- Use DebugView (not real-time reports which have delay)
- Check network tab for failed requests to google-analytics.com

### Issue: TypeScript Errors

**Solution**:
- Ensure all analytics packages are installed: `npm install`
- Run `npm run type-check` to identify issues

### Issue: Build Errors

**Solution**:
- Clear `.next` directory: `rm -rf .next`
- Rebuild: `npm run build`

## Production Testing

When testing in production:

1. Analytics will NOT log to console (unless debug mode is enabled)
2. Use PostHog/GA4 dashboards to verify events
3. Events may take a few seconds to appear in dashboards
4. GA4 real-time reports may have 30-60 second delay

### Enable Debug Logging in Production

To enable console logging in production (for troubleshooting):

```typescript
// Temporarily modify src/lib/analytics.ts
const isDev = true; // Force debug logging
```

**Remember to revert this change after debugging!**

## Test Checklist

- [ ] All 8 event types are tracked correctly
- [ ] Events appear in browser console (development)
- [ ] Events are stored in localStorage
- [ ] Events appear in PostHog dashboard (if configured)
- [ ] Events appear in GA4 DebugView (if configured)
- [ ] User identification works on sign-up
- [ ] User identification works on sign-in
- [ ] User identity resets on sign-out
- [ ] Event properties are captured correctly
- [ ] Build succeeds with analytics enabled
- [ ] Build succeeds with analytics disabled
- [ ] No console errors related to analytics

## Automated Testing (Future)

Consider adding automated tests for:
- Analytics event tracking
- User identification
- Event property validation
- Analytics initialization
- Error handling

Example test framework setup:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

## Performance Testing

Verify that analytics doesn't impact app performance:

1. Open Chrome DevTools → Performance
2. Record a session while using the app
3. Check that analytics calls are non-blocking
4. Verify no significant performance degradation

**Expected Result**: Analytics operations should be async and not block UI

## Privacy Testing

Verify privacy compliance:

1. Test with analytics disabled - no external requests should be made
2. Test cookie consent (if implemented)
3. Verify user can opt-out of tracking
4. Check that sensitive data is not tracked (passwords, payment info, etc.)

## Next Steps

After manual testing:
1. Document any issues found
2. Fix any bugs
3. Update analytics events as needed
4. Consider adding automated tests
5. Deploy to staging for further testing

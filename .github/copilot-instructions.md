# Copilot Instructions for GreenChainz

This document provides guidance for GitHub Copilot when working with the GreenChainz codebase.

## Project Overview

GreenChainz is a sustainable supplier directory platform built with Next.js 15, connecting buyers with verified sustainable suppliers. The platform features advanced search, supplier profiles, RFQ (Request for Quotation) management, and comprehensive analytics.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 4 with custom theme
- **UI Components**: Custom components with Radix UI primitives
- **Analytics**: Vercel Analytics, PostHog, Google Analytics 4
- **Authentication**: Supabase Auth

## Project Structure

```
greenchainz/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── components/        # Reusable UI components
│   ├── dashboard/         # Analytics dashboard
│   └── supplier/[id]/     # Supplier profile pages
├── src/
│   ├── lib/               # Utility libraries
│   │   ├── supabaseClient.ts  # Supabase client
│   │   ├── analytics.ts       # Analytics helpers
│   │   └── auth.ts            # Auth helpers
│   └── types/             # TypeScript type definitions
├── supabase/              # Database migrations and seed data
├── scripts/               # Build and utility scripts
└── public/                # Static assets
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run type checking
npm run type-check

# Show database migration instructions
npm run db:migrate

# Seed demo data
npm run seed:demo
```

## Code Style and Conventions

### TypeScript

- Use TypeScript for all new files
- Define types in `src/types/` for shared types
- Use `@/` path alias for imports from `src/` directory
- Prefer interfaces over type aliases for object shapes

### React Components

- Use functional components with hooks
- Place reusable UI components in `app/components/`
- Use named exports for components
- Follow the existing component patterns with Tailwind CSS classes

### Styling

- Use Tailwind CSS for styling
- Follow the existing color scheme with CSS variables defined in `globals.css`
- Primary color is defined using HSL: `--primary: 142.1 76.2% 36.3%`
- Use the custom theme configuration in `tailwind.config.js`

### API Routes

- Place API routes in `app/api/` directory
- Use Next.js App Router route handlers
- Return proper HTTP status codes and JSON responses
- Handle errors gracefully

### Database

- Use Supabase client from `src/lib/supabaseClient.ts`
- Follow existing table structure (users, suppliers, products, rfqs, rfq_responses)
- Use Row Level Security (RLS) policies

### Analytics

- Use the `analytics` helper from `src/lib/analytics.ts`
- Track events using defined event types
- Log analytics in development mode

## User Roles

The platform has three user roles:
- `buyer` - Can search suppliers and create RFQs
- `supplier` - Can manage profiles and respond to RFQs
- `admin` - Full administrative access

Use helpers from `src/lib/auth.ts`:
- `hasRole()`, `isBuyer()`, `isSupplier()`, `isAdmin()`

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

Optional:
- `NEXT_PUBLIC_ANALYTICS_ENABLED` - Enable external analytics
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog API key
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID` - Google Analytics 4 ID

## Testing

When making changes:
1. Run `npm run lint` to check for linting errors
2. Run `npm run type-check` to verify TypeScript types
3. Run `npm run build` to ensure the build succeeds
4. Test locally with `npm run dev`

## Common Patterns

### Creating a new page

Create a new directory in `app/` with a `page.tsx` file:

```tsx
export default function NewPage() {
  return (
    <main className="max-w-6xl mx-auto p-4">
      {/* Page content */}
    </main>
  );
}
```

### Creating an API route

Create a `route.ts` file in `app/api/`:

```tsx
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data: 'example' });
}
```

### Using Supabase

```tsx
import { supabase } from '@/lib/supabaseClient';

const { data, error } = await supabase
  .from('suppliers')
  .select('*');
```

### Tracking analytics events

```tsx
import { analytics } from '@/lib/analytics';

analytics.track('search_initiated', { query: 'sustainable' });
```

## Key Files Reference

- `app/layout.tsx` - Root layout with navigation and providers
- `app/page.tsx` - Homepage with search functionality
- `src/types/index.ts` - Core TypeScript type definitions
- `src/lib/supabaseClient.ts` - Supabase client configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `next.config.js` - Next.js configuration

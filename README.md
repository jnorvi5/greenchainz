# GreenChainz - Sustainable Supplier Directory

GreenChainz is an investor-ready MVP platform connecting buyers with verified sustainable suppliers. The platform features advanced search, supplier profiles, RFQ management, and comprehensive analytics.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Environment variables configured

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

### Installation

```bash
# Install dependencies
npm install

# Run database migrations (see Database Setup below)
npm run db:migrate

# Seed demo data
npm run seed:demo

# Start development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📊 Database Setup

### 1. Run Migrations

```bash
npm run db:migrate
```

This will display instructions to:
1. Open your Supabase SQL Editor
2. Copy the contents of `supabase/migrations/001_init.sql`
3. Paste and execute in the SQL Editor

The migration creates the following tables:
- `users` - User accounts (buyers, suppliers, admins)
- `suppliers` - Verified sustainable suppliers
- `products` - Products offered by suppliers
- `rfqs` - Request for quotations
- `rfq_responses` - Supplier responses to RFQs

### 2. Seed Demo Data

After running migrations, populate the database with demo data:

```bash
npm run seed:demo
```

This inserts:
- 25+ verified sustainable suppliers across various categories
- 5+ sample products with sustainability metrics

## 🎨 Favicon and PWA Assets

### Current Setup

The project includes auto-generated favicon assets in the `public/` directory:
- `favicon.ico` - Main favicon
- `favicon-16x16.png` - 16x16 favicon
- `favicon-32x32.png` - 32x32 favicon
- `apple-touch-icon.png` - 180x180 Apple touch icon
- `android-chrome-192x192.png` - 192x192 Android icon
- `android-chrome-512x512.png` - 512x512 Android icon
- `manifest.json` - PWA configuration

### Customizing Favicons

To replace with your own logo:

1. **Using Online Tools:**
   - Visit [favicon.io](https://favicon.io/favicon-generator/)
   - Upload your GreenChainz logo
   - Download the generated files
   - Replace files in the `public/` directory

2. **Manual Replacement:**
   - Create PNG files in the required sizes (16x16, 32x32, 180x180, 192x192, 512x512)
   - Place them in the `public/` directory
   - Ensure filenames match the existing convention

3. **Recommended Colors:**
   - Primary Green: `#28a745`
   - Light Green: `#20c997`
   - Dark Green: `#218838`

## 📈 Analytics Dashboard

Access the analytics dashboard at [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

### Features:
- Total visitor events tracked
- Search queries performed
- Supplier database count
- RFQs created
- Conversion funnel visualization
- Platform health metrics

### Analytics Integration

The platform includes:
- **Vercel Analytics** - Production-ready analytics
- **Custom Event Tracker** - Local event storage for development
- Ready for PostHog/Mixpanel integration (see `src/lib/analytics.ts`)

### Tracked Events:
- `homepage_view` - Homepage visits
- `search_initiated` - Search queries
- `supplier_profile_view` - Supplier profile views
- `contact_click` - Contact button clicks
- `rfq_created` - RFQ submissions
- `supplier_registered` - New supplier registrations

## 🏗️ Project Structure

```
greenchainz/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout with Analytics
│   ├── page.tsx               # Homepage with search
│   ├── dashboard/             # Analytics dashboard
│   ├── auth/                  # Authentication pages
│   ├── supplier/[id]/         # Supplier profile pages
│   └── api/                   # API routes
├── src/
│   ├── components/ui/         # Reusable UI components
│   ├── lib/
│   │   ├── supabaseClient.ts  # Unified Supabase client
│   │   ├── analytics.ts       # Analytics helper
│   │   └── auth.ts            # Auth helpers
│   └── types/                 # TypeScript type definitions
├── supabase/
│   ├── migrations/            # Database migrations
│   └── demo-data/             # Seed data (JSON)
├── scripts/
│   ├── seed-demo.ts           # Demo data seeder
│   └── generate-favicons.ts   # Favicon generator
└── public/                    # Static assets
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking

# Database
npm run db:migrate      # Show migration instructions
npm run seed:demo       # Seed demo data
```

## 🎯 Features

### For Buyers
- Advanced supplier search with filters
- Sustainability score rankings
- Certification verification
- RFQ management
- Direct supplier contact

### For Suppliers
- Company profile management
- Product listings
- RFQ responses
- Sustainability metrics tracking

### For Investors
- Analytics dashboard
- Platform metrics
- Conversion tracking
- User engagement insights

## 🔒 Authentication

The platform uses Supabase Auth with support for:
- Email/password authentication
- OAuth providers (configurable)
- Role-based access (buyer/supplier/admin)

Auth helpers are available in `src/lib/auth.ts`:
- `hasRole()` - Check user role
- `isBuyer()`, `isSupplier()`, `isAdmin()` - Role checks
- `getRoleDisplayName()` - Get formatted role name

## 🌱 Sustainability Features

- **Sustainability Scores** - 0-100 rating for each supplier
- **Certifications** - ISO 14001, FSC, GOTS, Fair Trade, etc.
- **Environmental Metrics:**
  - Carbon footprint tracking
  - Renewable energy percentage
  - Waste recycling rate
  - Water usage efficiency
  - Supply chain transparency

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Self-hosted

## 🐛 Troubleshooting

### Build Errors

If you encounter build errors:
```bash
# Clean build cache
rm -rf .next
npm run build
```

### Database Connection Issues

1. Verify environment variables are set correctly
2. Check Supabase project status
3. Ensure migrations have been run
4. Verify RLS policies allow public read access

### Favicon Not Showing

1. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
2. Clear browser cache
3. Verify files exist in `public/` directory
4. Check browser console for 404 errors

## 📝 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is an MVP foundation for investors. For contribution guidelines, please contact the development team.

## 📧 Support

For questions or support:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs` (if available)

---

Built with ❤️ for a sustainable future 🌱

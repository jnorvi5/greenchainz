# GreenChainz Deployment Guide

This guide covers deploying the GreenChainz MVP to production.

## Prerequisites

1. A Supabase account and project
2. A Vercel account (recommended) or any Node.js hosting platform
3. Your repository pushed to GitHub

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details:
   - Name: GreenChainz
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
4. Wait for the project to be provisioned

### 1.2 Run Database Migrations

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run migrations in order:
   - Copy contents of `supabase/migrations/20250101000000_initial_schema.sql` and execute
   - Copy contents of `supabase/migrations/20250101000001_seed_data.sql` and execute

Alternatively, if using Supabase CLI:
```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase db push
```

### 1.3 Configure Authentication

1. Go to Authentication → Settings in Supabase dashboard
2. Set Site URL to your production domain (e.g., `https://greenchainz.com`)
3. Add redirect URLs:
   - `https://greenchainz.com/*`
   - `http://localhost:3000/*` (for local development)
4. Enable desired auth providers (Email, Google, GitHub, etc.)

### 1.4 Get API Keys

1. Go to Settings → API in Supabase dashboard
2. Copy the following values:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key (keep this secure!)

## Step 2: Vercel Deployment

### 2.1 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New..." → "Project"
3. Import your `greenchainz` repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 2.2 Set Environment Variables

In Vercel project settings → Environment Variables, add:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Optional: Email (if using Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### 2.3 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployed site at `https://your-project.vercel.app`

### 2.4 Custom Domain (Optional)

1. Go to Settings → Domains in Vercel
2. Add your custom domain
3. Configure DNS as instructed by Vercel
4. Update `NEXT_PUBLIC_APP_URL` environment variable
5. Update Supabase redirect URLs with your custom domain

## Step 3: Post-Deployment Configuration

### 3.1 Update Supabase Settings

1. Go back to Supabase → Authentication → Settings
2. Update Site URL to your production domain
3. Update Redirect URLs to include your production domain

### 3.2 Test Authentication

1. Visit your deployed site
2. Click "Sign In"
3. Test email authentication
4. Verify redirect works correctly

### 3.3 Verify Analytics

1. Deploy to Vercel automatically includes Vercel Analytics
2. Visit Vercel dashboard → Analytics to see traffic data
3. Analytics will start collecting data immediately

## Step 4: Ongoing Maintenance

### Database Migrations

For future schema changes:

1. Create new migration file in `supabase/migrations/`
2. Use timestamp naming: `YYYYMMDDHHMMSS_description.sql`
3. Test locally with Supabase CLI
4. Apply to production:
   ```bash
   supabase db push --linked
   ```

### Monitoring

- **Vercel Analytics**: Monitor page views, user interactions
- **Supabase Dashboard**: Monitor database usage, API calls
- **Error Tracking**: Consider adding Sentry for error monitoring

### Backups

Supabase automatically backs up your database. To create manual backups:

1. Go to Database → Backups in Supabase dashboard
2. Click "Create backup"

## Alternative Deployment Platforms

### Cloudflare Pages

1. Connect repository to Cloudflare Pages
2. Build settings:
   - Build command: `npm run build`
   - Build output directory: `.next`
3. Set environment variables
4. Deploy

### Railway

1. Create new project from GitHub repository
2. Add environment variables
3. Deploy automatically

### Self-Hosted (Docker)

See `docker-compose.yml` for containerized deployment (coming soon).

## Troubleshooting

### Build Errors

- Verify all environment variables are set
- Check Node.js version (requires 18.x or higher)
- Review build logs for specific errors

### Authentication Issues

- Verify Supabase Site URL matches deployment URL
- Check redirect URLs include your domain
- Ensure CORS settings in Supabase allow your domain

### Database Connection Issues

- Verify Supabase project is active
- Check API keys are correct
- Ensure RLS policies are properly configured

## Security Checklist

- [ ] Environment variables are set (not hardcoded)
- [ ] Service role key is kept secret
- [ ] RLS policies are enabled on all tables
- [ ] HTTPS is enforced
- [ ] CSP headers are configured (optional)
- [ ] Rate limiting is enabled (Vercel does this automatically)

## Performance Optimization

- [ ] Enable Vercel Edge caching
- [ ] Configure image optimization
- [ ] Set up CDN for static assets (Vercel does this automatically)
- [ ] Monitor Core Web Vitals in Vercel Analytics
- [ ] Consider database indexes for search queries

## Next Steps

After successful deployment:

1. Test all user flows (registration, search, supplier profiles)
2. Monitor analytics and error rates
3. Set up custom domain and SSL
4. Configure email templates in Supabase
5. Add more supplier data
6. Implement advanced search features
7. Add payment integration (if needed)
8. Set up monitoring and alerting

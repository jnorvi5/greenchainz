# Hybrid Architecture: Supabase + MongoDB

## Overview

GreenChainz implements a **hybrid data architecture** using Supabase (PostgreSQL) for structured supplier identity data and MongoDB for flexible product catalog data. This architecture is critical for the **"Founding 50" supplier onboarding workflow** and enables efficient ingestion of diverse sustainability product data.

## Why Hybrid Architecture?

### Flexibility
Product sustainability attributes vary wildly between product types:
- **Insulation:** R-Value, thermal conductivity, material composition
- **Concrete:** Cure time, carbon footprint per cubic meter, recycite content
- **Paint:** VOC content, coverage area, drying time
- **Lumber:** FSC certification, species, carbon sequestration data

MongoDB handles schema-less data without migrations, allowing us to ingest products with any combination of attributes.

### Performance
- **"Hot" Data (Auth, Claims, Verification):** Fast SQL queries in Supabase
- **"Cold/Bulky" Data (Product Catalogs):** Flexible document storage in MongoDB

### Scale
We can ingest thousands of products without schema migrations, making rapid onboarding of the "Founding 50" suppliers feasible.

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INGESTION PIPELINE                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   [Supplier Website] ──> [Web Scraper] ──> [Azure OpenAI]          │
│         URL                cheerio          GPT-4o                  │
│                                               │                     │
│                                               ▼                     │
│                                        [Zod Validation]             │
│                                               │                     │
│                    ┌──────────────────────────┴──────────────────┐  │
│                    │                                             │  │
│                    ▼                                             ▼  │
│            ┌──────────────┐                          ┌───────────────┐
│            │  SUPABASE    │                          │   MONGODB     │
│            │  (PostgreSQL)│                          │  (Atlas)      │
│            ├──────────────┤                          ├───────────────┤
│            │ • suppliers  │                          │ • raw_products│
│            │ • users      │                          │   - name      │
│            │ • claims     │                          │   - attributes│
│            │ • auth       │                          │   - certs     │
│            └──────────────┘                          └───────────────┘
│                    │                                             │  │
│                    └─────────────────┬───────────────────────────┘  │
│                                      │                              │
│                                      ▼                              │
│                             [Verification Queue]                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Database Responsibilities

### Supabase (PostgreSQL) - Source of Truth for Identity

| Table | Purpose |
|-------|---------|
| `suppliers` | Supplier identity, contact info, claim status |
| `users` | Authentication, roles, permissions |
| `claims` | Supplier claim tokens and verification status |
| `verification_records` | Audit trail for data verification |

**Why Supabase?**
- ACID transactions for financial/verification data
- Row-Level Security (RLS) for multi-tenant access control
- Real-time subscriptions for live updates
- Built-in authentication

### MongoDB (Atlas) - Flexible Product Catalog

| Collection | Purpose |
|------------|---------|
| `raw_products` | Scraped/ingested product data (unverified) |
| `verified_products` | Curated, verified product catalog |
| `extraction_logs` | AI extraction audit trail |

**Why MongoDB?**
- Schema-less documents for varying product attributes
- Easy horizontal scaling for large catalogs
- Aggregation pipeline for analytics
- No migrations needed for new attribute types

---

## Type Safety with Zod

All data crossing the hybrid boundary is validated with Zod schemas:

### Product Schema (`src/types/schemas/product.schema.ts`)

```typescript
export const RawProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  sustainability_attributes: z.record(z.string(), z.unknown()),
  certifications: z.array(z.string()).optional(),
  supplier_id: z.string().uuid(),
  supplier_name: z.string(),
  verification_status: z.enum(['unverified', 'pending', 'verified', 'rejected']),
  risk_level: z.enum(['low', 'medium', 'high']),
  data_source: z.enum(['scrape', 'manual', 'api', 'pdf_upload']),
  ingested_at: z.date(),
});
```

### Supplier Schema (`src/types/schemas/supplier.schema.ts`)

```typescript
export const SupplierSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Supplier name is required'),
  description: z.string().optional(),
  website: z.string().url('Must be a valid URL'),
  is_claimed: z.boolean().default(false),
  verification_status: z.enum(['unverified', 'pending', 'verified', 'rejected']),
});
```

---

## Integration with Azure AI Foundry

We use **Azure OpenAI** (not the generic OpenAI API) to leverage Microsoft for Startups credits:

### Configuration

```bash
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

### Extraction Prompt

The AI extracts structured data from scraped website content, identifying:
- Supplier name and description
- Products with sustainability attributes
- Certifications (FSC, LEED, Cradle to Cradle, EPD)

---

## "Founding 50" Workflow Support

The hybrid architecture enables rapid onboarding of the initial 50 suppliers:

1. **Ingest:** Scrape supplier website → AI extracts products → Store in MongoDB
2. **Verify:** Human review via admin dashboard → Update verification status
3. **Claim:** Supplier receives claim token → Verifies ownership → Gains edit access
4. **Promote:** Verified products move to curated catalog

### Default States for Ingested Data

All ingested data starts with:
- `verification_status: 'unverified'`
- `risk_level: 'high'`

This ensures no unverified data appears in the public catalog.

---

## API Endpoints

### `POST /api/ingest-supplier`

Hybrid ingestion endpoint that:
1. Scrapes the target URL
2. Extracts data via Azure OpenAI
3. Validates with Zod schemas
4. Writes supplier identity to Supabase
5. Writes product catalog to MongoDB

**Request:**
```bash
curl -X POST http://localhost:3000/api/ingest-supplier \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.havelockwool.com/"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Hybrid Ingestion Complete",
  "data": {
    "supplier_id": "uuid-here",
    "supplier_name": "Havelock Wool",
    "products_ingested": 5,
    "claim_link": "/claim?token=...",
    "verification_status": "unverified"
  }
}
```

---

## Folder Structure

```
src/
├── lib/
│   ├── mongodb.ts          # MongoDB singleton client
│   ├── supabase/
│   │   └── client.ts       # Supabase client utilities
│   └── azure/
│       └── openai.ts       # Azure OpenAI client utilities
├── types/
│   └── schemas/
│       ├── index.ts        # Schema exports
│       ├── product.schema.ts
│       └── supplier.schema.ts
app/
├── api/
│   └── ingest-supplier/
│       └── route.ts        # Hybrid ingestion endpoint
docs/
└── HYBRID_ARCHITECTURE.md  # This documentation
```

---

## Environment Variables

Add these to your `.env.local`:

```bash
# MongoDB (Flex Layer for Product Catalog)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/greenchainz

# Azure OpenAI (AI Foundry - for startup credits)
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

---

## Security Considerations

1. **Service Role Key:** The Supabase service role key bypasses RLS - only use server-side
2. **MongoDB Connection:** Use connection pooling via the singleton pattern
3. **Data Validation:** All external data validated with Zod before storage
4. **Verification Status:** All ingested data marked as `unverified` by default

---

## Future Enhancements

- [ ] PDF upload ingestion (EPD documents, spec sheets)
- [ ] Batch ingestion for multiple URLs
- [ ] Real-time verification dashboard with Supabase subscriptions
- [ ] Product deduplication logic
- [ ] Certification verification via third-party APIs

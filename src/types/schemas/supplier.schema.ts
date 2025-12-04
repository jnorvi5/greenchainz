import { z } from 'zod';

export const SupplierSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Supplier name is required'),
  description: z.string().optional(),
  website: z.string().url('Must be a valid URL'),
  is_claimed: z.boolean().default(false),
  claim_token: z.string().optional(),
  scraped_url: z.string().url().optional(),
  verification_status: z.enum(['unverified', 'pending', 'verified', 'rejected']).default('unverified'),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type Supplier = z.infer<typeof SupplierSchema>;

export const SupplierUpsertSchema = SupplierSchema.pick({
  name: true,
  description: true,
  website: true,
  is_claimed: true,
  scraped_url: true,
});

export type SupplierUpsert = z.infer<typeof SupplierUpsertSchema>;

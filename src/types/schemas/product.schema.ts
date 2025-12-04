import { z } from 'zod';

// Base sustainability attributes that vary by product type
export const SustainabilityAttributesSchema = z.record(z.string(), z.unknown());

// Raw product schema for MongoDB ingestion
export const RawProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  sustainability_attributes: SustainabilityAttributesSchema.optional(),
  certifications: z.array(z.string()).optional(),
  supplier_id: z.string().uuid(),
  supplier_name: z.string(),
  verification_status: z.enum(['unverified', 'pending', 'verified', 'rejected']).default('unverified'),
  risk_level: z.enum(['low', 'medium', 'high']).default('high'),
  data_source: z.enum(['scrape', 'manual', 'api', 'pdf_upload']),
  ingested_at: z.date(),
  verified_at: z.date().optional(),
  verified_by: z.string().optional(),
});

export type RawProduct = z.infer<typeof RawProductSchema>;

// AI Extraction result schema
export const AIExtractionResultSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  products: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    sustainability_attributes: SustainabilityAttributesSchema.optional(),
    certifications: z.array(z.string()).optional(),
  })).optional(),
});

export type AIExtractionResult = z.infer<typeof AIExtractionResultSchema>;

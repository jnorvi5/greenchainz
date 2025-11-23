# GreenChainz Backend (Serverless Architecture)

## Overview

This directory contains the **serverless backend** for GreenChainz - the "Brain" that powers document verification and green certification validation.

## Architecture Pattern: Event-Driven

```
Frontend (Vercel) → Uploads File → Supabase Storage
                                    ↓
                            Database Trigger
                                    ↓
                            Webhook Fires
                                    ↓
                    AWS Lambda (verify-supplier-doc)
                                    ↓
                        AWS Textract Analysis
                                    ↓
                    Updates Supabase with Results
```

## Why AWS Lambda?

**Vercel Limitations:**
- Hobby Plan: 10-second timeout
- Pro Plan: 60-second timeout
- Not suitable for heavy processing (PDF parsing, OCR, AI analysis)

**AWS Lambda Benefits:**
- 15-minute maximum timeout
- Scalable for document processing
- Pay-per-execution (cost-effective)
- Event-driven architecture
- Built-in AWS service integrations

## Directory Structure

```
backend/
├── lambdas/
│   └── verify-supplier-doc/       # Document verification function
│       ├── index.mjs              # Main Lambda handler
│       └── package.json           # Dependencies (@aws-sdk/client-textract)
└── README.md                      # This file
```

## Lambda Functions

### 1. verify-supplier-doc

**Purpose:** Verify green building certifications from uploaded documents

**Trigger:** Supabase webhook when new document is uploaded

**Process:**
1. Receives webhook with `fileUrl` and `documentId`
2. Downloads document from Supabase Storage
3. Sends to AWS Textract for OCR analysis
4. Searches for certification keywords:
   - LEED (Gold, Platinum, Silver, Certified)
   - FSC (Forest Stewardship Council)
   - Certification levels and expiry dates
5. Returns verification status and details
6. Updates Supabase database with results

**Input:**
```json
{
  "fileUrl": "https://supabase-storage-url/document.pdf",
  "documentId": "uuid-here"
}
```

**Output:**
```json
{
  "documentId": "uuid-here",
  "verified": true,
  "details": {
    "type": "LEED",
    "level": "GOLD/PLATINUM",
    "text_found": true,
    "expiry_date": "12/31/2025",
    "raw_text_sample": "LEED GOLD CERTIFIED..."
  }
}
```

## Deployment Steps

### Manual Deployment (Phase 1)

1. **Create Lambda Function in AWS Console:**
   - Name: `greenchainz-verify-doc`
   - Runtime: Node.js 20.x
   - Architecture: x86_64

2. **Set IAM Permissions:**
   - Go to Configuration → Permissions
   - Click the Role Name
   - Attach Policy: `AmazonTextractFullAccess`

3. **Deploy Code:**
   - Copy contents of `backend/lambdas/verify-supplier-doc/index.mjs`
   - Paste into Lambda Code Editor
   - Click "Deploy"

4. **Configure Timeout:**
   - Go to Configuration → General Configuration
   - Set Timeout: 3 minutes (180 seconds)

5. **Test the Function:**
   - Use Test tab with sample event
   - Verify Textract permissions are working

### Automated Deployment (Phase 2)

*Coming Soon: GitHub Actions CI/CD pipeline for automatic Lambda deployments*

## Environment Variables

*To be added:*
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for database updates)

## Cost Estimates

**AWS Lambda:**
- First 1M requests/month: FREE
- After: $0.20 per 1M requests

**AWS Textract:**
- First 1,000 pages/month: FREE
- After: $1.50 per 1,000 pages

**Typical Startup Cost:** $0-5/month for first 1000 documents

## Next Steps

- [ ] Deploy Lambda function to AWS
- [ ] Configure Supabase webhook to trigger Lambda
- [ ] Add database update logic to Lambda
- [ ] Create CI/CD pipeline for automated deployments
- [ ] Add error handling and retry logic
- [ ] Implement logging and monitoring
- [ ] Add support for more certification types

## Testing Locally

*Coming Soon: Local testing setup with AWS SAM*

## Monitoring

**CloudWatch Logs:**
- All Lambda executions are logged
- View logs in AWS Console → CloudWatch → Log Groups

**Metrics to Track:**
- Invocation count
- Error rate
- Duration (latency)
- Textract API calls

---

**Built with:** AWS Lambda + AWS Textract + Supabase + Event-Driven Architecture

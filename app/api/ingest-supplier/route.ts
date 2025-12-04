import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import clientPromise from '@/lib/mongodb';
import { getAzureOpenAIClient, EXTRACTION_PROMPT } from '@/lib/azure/openai';
import { 
  AIExtractionResultSchema, 
  RawProductSchema,
  type RawProduct 
} from '@/types/schemas';

// Supabase Client (For Auth/Claim Token - Relational Source of Truth)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { url } = await req.json();
  
  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 });
  }

  try {
    // 1. Scrape the target URL
    const response = await fetch(url, {
      headers: { 'User-Agent': 'GreenChainz-Bot/1.0 (+https://greenchainz.com/bot)' },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Clean up the HTML - remove non-content elements
    $('script, style, nav, footer, svg, header, aside').remove();
    const cleanText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 15000);

    // 2. AI Extraction via Azure OpenAI
    const azure = getAzureOpenAIClient();
    const completion = await azure.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
      messages: [
        { role: "system", content: EXTRACTION_PROMPT },
        { role: "user", content: `Extract supplier and product data from the following website content:\n\n${cleanText}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 4000,
    });

    const rawResult = JSON.parse(completion.choices[0].message.content || "{}");
    
    // 3. Validate with Zod (Runtime Type Safety)
    const validationResult = AIExtractionResultSchema.safeParse(rawResult);
    
    if (!validationResult.success) {
      console.error('AI extraction validation failed:', validationResult.error);
      return NextResponse.json({ 
        error: 'AI extraction produced invalid data',
        details: validationResult.error.flatten()
      }, { status: 422 });
    }
    
    const extractedData = validationResult.data;

    // 4. HYBRID WRITE: Supplier Identity -> Supabase (SQL)
    const { data: supplier, error: suppError } = await supabase
      .from('suppliers')
      .upsert({
        name: extractedData.name,
        description: extractedData.description,
        website: url,
        is_claimed: false,
        scraped_url: url,
        verification_status: 'unverified',
      }, { onConflict: 'website' })
      .select()
      .single();

    if (suppError) {
      throw new Error(`Supabase error: ${suppError.message}`);
    }

    // 5. HYBRID WRITE: Product Data -> MongoDB (NoSQL Flex Layer)
    let productsIngested = 0;
    
    if (extractedData.products?.length) {
      const mongoClient = await clientPromise;
      const db = mongoClient.db('greenchainz_catalog');
      const collection = db.collection<RawProduct>('raw_products');

      const products: RawProduct[] = extractedData.products.map((p) => {
        const product = RawProductSchema.parse({
          ...p,
          supplier_id: supplier.id,
          supplier_name: supplier.name,
          verification_status: 'unverified',
          risk_level: 'high',
          data_source: 'scrape',
          ingested_at: new Date(),
        });
        return product;
      });

      const insertResult = await collection.insertMany(products);
      productsIngested = insertResult.insertedCount;
    }

    return NextResponse.json({
      success: true,
      message: "Hybrid Ingestion Complete",
      data: {
        supplier_id: supplier.id,
        supplier_name: supplier.name,
        products_ingested: productsIngested,
        claim_link: `/claim?token=${supplier.claim_token}`,
        verification_status: 'unverified',
      }
    });

  } catch (error) {
    console.error('Ingestion error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

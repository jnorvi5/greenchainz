// backend/lambdas/verify-supplier-doc/index.mjs
import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import https from 'https';

const client = new TextractClient({ region: "us-east-1" });

export const handler = async (event) => {
  console.log("EVENT RECEIVED:", JSON.stringify(event));

  try {
    // 1. Parse the input (Supabase Webhook payload)
    const { fileUrl, documentId } = JSON.parse(event.body);

    if (!fileUrl) {
      return { statusCode: 400, body: JSON.stringify({ error: "No fileUrl provided" }) };
    }

    // 2. Download the PDF/Image from the URL
    const fileBuffer = await downloadFile(fileUrl);

    // 3. Send to AWS Textract
    const command = new AnalyzeDocumentCommand({
      Document: { Bytes: fileBuffer },
      FeatureTypes: ["FORMS"]
    });
    const analysis = await client.send(command);

    // 4. Analyze Results (Basic AI Logic)
    // We scan the raw text for our "Green Keywords"
    const rawText = analysis.Blocks
      .filter(block => block.Text)
      .map(block => block.Text)
      .join(" ")
      .toUpperCase();
    
    const isLeed = rawText.includes("LEED");
    const isFsc = rawText.includes("FSC") || rawText.includes("FOREST STEWARDSHIP");
    const isGold = rawText.includes("GOLD") || rawText.includes("PLATINUM");
    const expiryDate = findExpiryDate(rawText);

    const verificationResult = {
      documentId,
      verified: isLeed || isFsc,
      details: {
        type: isLeed ? "LEED" : (isFsc ? "FSC" : "UNKNOWN"),
        level: isGold ? "GOLD/PLATINUM" : "STANDARD",
        text_found: true,
        expiry_date: expiryDate,
        raw_text_sample: rawText.substring(0, 500) // First 500 chars for debugging
      }
    };

    console.log("VERIFICATION COMPLETE:", verificationResult);

    // 5. Return Success
    return {
      statusCode: 200,
      body: JSON.stringify(verificationResult),
    };

  } catch (error) {
    console.error("LAMBDA ERROR:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

// Helper to download file into memory
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
      res.on('error', reject);
    });
  });
}

// Helper to find expiry (Basic Regex implementation)
function findExpiryDate(text) {
  // Simple regex for dates like 12/31/2025 or 2025-12-31
  const dateRegex = /(\d{1,2}\/\d{1,2}\/\d{4})|(\d{4}-\d{1,2}-\d{1,2})/;
  const match = text.match(dateRegex);
  return match ? match[0] : null;
}

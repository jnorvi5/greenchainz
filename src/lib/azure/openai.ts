import { AzureOpenAI } from 'openai';

// Azure OpenAI Client (Using Azure SDK per startup credits requirement)
// Documentation: https://learn.microsoft.com/azure/ai-services/openai/

let azureClient: AzureOpenAI | null = null;

export function getAzureOpenAIClient(): AzureOpenAI {
  if (!azureClient) {
    if (!process.env.AZURE_OPENAI_API_KEY) {
      throw new Error('AZURE_OPENAI_API_KEY is not set');
    }
    if (!process.env.AZURE_OPENAI_ENDPOINT) {
      throw new Error('AZURE_OPENAI_ENDPOINT is not set');
    }
    if (!process.env.AZURE_OPENAI_DEPLOYMENT_NAME) {
      throw new Error('AZURE_OPENAI_DEPLOYMENT_NAME is not set');
    }

    azureClient = new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview",
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
    });
  }
  return azureClient;
}

export const EXTRACTION_PROMPT = `You are an AI assistant extracting supplier and product data for a sustainable construction materials marketplace.
Extract the following information in JSON format:
- name: Company/Supplier name
- description: Brief company description
- products: Array of products with:
  - name: Product name
  - description: Product description
  - category: Product category (e.g., "Insulation", "Concrete", "Paint", "Lumber")
  - sustainability_attributes: Object with relevant sustainability data (varies by product type, e.g., R-Value, VOC content, recycled content percentage, carbon footprint, certifications mentioned)
  - certifications: Array of certification names (e.g., "FSC", "LEED", "Cradle to Cradle", "EPD")

Be thorough but only extract information that is explicitly stated.`;

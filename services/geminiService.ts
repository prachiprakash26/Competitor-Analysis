import { GoogleGenAI, Type } from "@google/genai";
import { Sale, Product, Competitor, Store } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export async function findCompetitors(selectedProduct: Product, allSales: Sale[]): Promise<Competitor[]> {
  const prompt = `
    You are an expert market analyst for the beverage industry. Your task is to identify key competitors for a selected product based on sales data and store locations.

    **Selected Product:**
    - Name: ${selectedProduct.itemDescription}
    - Vendor: ${selectedProduct.vendorName}
    - Category: ${selectedProduct.categoryName}
    - Item Number: ${selectedProduct.itemNumber}

    **Analysis Criteria:**
    A competitor is a product within the same category (${selectedProduct.categoryName}) that is sold in stores geographically close to the stores selling the selected product. Analyze the data to find store clusters and high-traffic areas where multiple competing products are sold.

    **Output Requirements:**
    For each competitor, provide the following:
    1.  **Confidence Score:** A number between 0 and 100 indicating your confidence that this is a strong competitor.
    2.  **Reasoning:** A sharp, concise, point-by-point explanation for your choice. Mention specific factors like sales velocity in overlapping store locations or presence in key store clusters.

    **Sales Data Snippet (for context):**
    ${JSON.stringify(allSales.map(s => ({
        storeNumber: s.storeNumber,
        storeName: s.storeName,
        lat: s.lat,
        lon: s.lon,
        itemNumber: s.itemNumber,
        itemDescription: s.itemDescription,
        vendorName: s.vendorName,
        categoryName: s.categoryName,
        bottlesSold: s.bottlesSold,
    })).slice(0, 100), null, 2)}

    Based on the full dataset provided, identify the top 3-4 competitors for the selected product.
  `;

  const competitorSchema = {
    type: Type.OBJECT,
    properties: {
      itemNumber: { type: Type.STRING },
      itemDescription: { type: Type.STRING },
      vendorName: { type: Type.STRING },
      reasoning: {
        type: Type.STRING,
        description: "A concise, point-by-point explanation of why this is a competitor, mentioning proximity or sales in clustered stores."
      },
      confidence: {
        type: Type.NUMBER,
        description: "A confidence score from 0 to 100."
      },
      competingStoreNumbers: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    required: ["itemNumber", "itemDescription", "vendorName", "reasoning", "confidence", "competingStoreNumbers"]
  };
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            competitors: {
              type: Type.ARRAY,
              description: "A list of the top competitors.",
              items: competitorSchema
            }
          },
          required: ["competitors"]
        }
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    return result.competitors as Competitor[];
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to analyze competitors. The AI model might be unavailable or the request could not be processed.");
  }
}

export async function nameCluster(stores: Store[]): Promise<string> {
    const prompt = `
    You are a helpful geography assistant. Your task is to provide a short, descriptive name for a cluster of stores.
    The name should be concise (max 4 words) and reflect the geographic area or dominant store names in the list.
    Examples: "Downtown Core", "West Des Moines Hub", "University Avenue Retail".

    Here is the list of stores in the cluster:
    ${JSON.stringify(stores.map(s => ({ name: s.storeName, address: s.address })), null, 2)}

    Based on this list, what is a good name for this cluster?
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        let name = response.text.trim().replace(/"/g, '');
        if (name.startsWith('Cluster Name:')) {
            name = name.substring('Cluster Name:'.length).trim();
        }
        return name;
    } catch (error) {
        console.error("Error calling Gemini API for naming cluster:", error);
        return "Unnamed Cluster";
    }
}
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

/* =========================
   Fallback Generator
========================= */
function generateFallbackCode(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

/* =========================
   Generate Short Codes
========================= */
 export async function generateShortCodes(originalUrl: string) {
  if (!originalUrl) {
    throw new Error("Original URL is required");
  }

  try {
    new URL(originalUrl);
  } catch {
    throw new Error("Invalid URL format");
  }

  const prompt = `
Generate shortcodes for a URL shortener.

Rules:
- 1 primary shortcode (5-8 characters)
- 3 alternative shortcodes
- Lowercase
- Alphanumeric only
- No special characters
- No explanations
- Return ONLY JSON

Format:
{
  "suggestedCode": "code",
  "alternativeCodes": ["code1", "code2", "code3"]
}

URL:
${originalUrl}
`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const cleaned = (result.text || "")
      .replace(/```json|```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    if (
      !parsed.suggestedCode ||
      !Array.isArray(parsed.alternativeCodes)
    ) {
      throw new Error("Invalid AI response");
    }

    return {
      suggestedCode: parsed.suggestedCode.toLowerCase(),
      alternativeCodes: parsed.alternativeCodes.map((c: string) =>
        c.toLowerCase()
      ),
    };
  } catch (err) {
    console.warn("Gemini failed — using fallback");

    return {
      suggestedCode: generateFallbackCode(),
      alternativeCodes: [
        generateFallbackCode(),
        generateFallbackCode(),
        generateFallbackCode(),
      ],
    };
  }
}

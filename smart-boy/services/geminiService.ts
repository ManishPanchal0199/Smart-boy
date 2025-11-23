import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// We use Gemini 2.5 Flash for its massive context window and speed, perfect for "In-Context RAG"
const MODEL_NAME = 'gemini-2.5-flash';

// Initialize the client
// NOTE: Process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePdfResponse = async (
  history: { role: string; text: string }[],
  context: string,
  latestQuery: string
): Promise<string> => {
  try {
    // Construct a prompt that includes the context (RAG-style via long context window)
    const systemPrompt = `
You are SMART-BOY, an intelligent research assistant designed to analyze documents.
Use the following document content to answer the user's question.

Guidelines:
1. You MUST cite page numbers provided in the content like [Page X] when answering.
2. If the answer is not in the document, say "I cannot find the answer in the provided document."
3. Format your response using clear Markdown:
   - Use ## Headings for main topics.
   - Use **bold** for key terms and important concepts.
   - Use bullet points for lists.
   - Keep paragraphs concise.

DOCUMENT CONTENT:
${context}
`;

    // We use a chat session to maintain conversation history regarding the document
    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3, // Lower temperature for more factual answers
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result: GenerateContentResponse = await chat.sendMessage({
      message: latestQuery
    });

    return result.text || "No response generated.";

  } catch (error) {
    console.error("Gemini PDF API Error:", error);
    throw error;
  }
};

export const generateVideoNotes = async (videoUrl: string): Promise<string> => {
  try {
    // Enhanced prompt for better summarization and structure
    const prompt = `
      You are an expert educational content analyst. 
      Analyze the YouTube video at this URL: ${videoUrl}.
      
      Your goal is to create a high-quality, structured study guide that summarizes the video's content comprehensively.
      
      Use Google Search to find transcripts, summaries, reviews, and discussions about this video to ensure your notes are accurate and detailed.

      Please output the notes in the following strict Markdown format:

      # [Video Title]

      ## 🎯 Executive Summary
      (A concise paragraph of 3-5 sentences summarizing the main argument and purpose of the video.)

      ## 🔑 Key Concepts
      (A list of the most important ideas. Use **bold** for the concept name.)
      - **Concept Name**: detailed explanation...
      - **Concept Name**: detailed explanation...

      ## 📝 Detailed Breakdown
      (Break the video content down into logical sections with headings. Use ### for section titles.)
      ### [Section Title]
      - Detail point...
      - Detail point...
      
      ## 💎 Key Takeaways & Quotes
      (Bulleted list of actionable advice or memorable quotes)
      - Takeaway 1...
      
      Make the headings bold and clear. Use bullet points for readability.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Enable grounding to find video metadata/content
      }
    });

    let text = response.text || "";
    
    // Append grounding sources if available to add credibility
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && chunks.length > 0) {
      text += "\n\n---\n**Sources & References:**\n";
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          text += `- [${chunk.web.title}](${chunk.web.uri})\n`;
        }
      });
    }

    return text;

  } catch (error) {
    console.error("Gemini Video API Error:", error);
    throw error;
  }
};
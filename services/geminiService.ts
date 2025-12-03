import { GoogleGenAI } from "@google/genai";
import { MOCK_PRODUCTS } from "../constants";

let aiClient: GoogleGenAI | null = null;

// Initialize the client safely
try {
  if (process.env.API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  } else {
    console.warn("API_KEY not found in environment variables. AI features will be disabled.");
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI:", error);
}

export const generateSupportResponse = async (userMessage: string): Promise<string> => {
  if (!aiClient) {
    return "Desculpe, o assistente virtual está indisponível no momento (Chave de API não configurada).";
  }

  try {
    const productContext = MOCK_PRODUCTS.map(p => 
      `- ${p.name}: ${p.price} AOA, Stock: ${p.stock}, Localização: ${p.location}`
    ).join('\n');

    const systemInstruction = `
      Você é o assistente virtual da 'KwanzaLogistics', uma plataforma de comércio e entregas em Angola.
      
      Seu tom deve ser profissional, educado e útil.
      Responda em Português de Portugal/Angola.
      
      Você tem acesso à seguinte lista de produtos disponíveis na plataforma:
      ${productContext}
      
      Se o cliente perguntar sobre produtos, use essa informação.
      Se perguntarem sobre pagamentos, informe que aceitamos Multicaixa Express e Transferência Bancária.
      Se perguntarem sobre entregas, diga que entregamos em todo o território nacional.
      
      Mantenha as respostas curtas e diretas.
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text || "Não consegui processar sua solicitação.";
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.";
  }
};

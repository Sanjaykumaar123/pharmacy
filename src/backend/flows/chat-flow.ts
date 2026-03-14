
// ===================================================================================
// BACKEND (Server-Side)
// ===================================================================================
// This file is a "Server Action" in Next.js, indicated by the 'use server'
// directive. This means all the code in this file, including the AI logic,
// runs exclusively on the server (backend). It is never sent to the user's browser.
// The frontend calls this action as if it were a simple function, but Next.js
// handles the network request behind the scenes.
// ===================================================================================

'use server';
/**
 * @fileOverview A chatbot AI agent for answering questions about medicines.
 *
 * - chatWithAi - A function that handles the chatbot conversation.
 * - ChatInput - The input type for the chatWithAi function.
 * - ChatOutput - The return type for the chatWithAi function.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Medicine } from '@/types/medicine';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// This function is the main entry point called by the frontend.
export async function chatWithAi(input: { history: { role: 'user' | 'assistant', content: string }[], allMedicines: Medicine[] }): Promise<{ response: string }> {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash"
        });

        const availableMedicines = input.allMedicines.map(m => (
            `- Name: ${m.name}
  - Manufacturer: ${m.manufacturer}
  - Batch Number: ${m.batchNo}
  - Expiry Date: ${m.expDate}
  - Description: ${m.description}
  - Stock: ${m.quantity} units`
        )).join('\n');

        const chatHistory = input.history.map(msg => (
            `${msg.role}: ${msg.content}`
        )).join('\n');

        const systemPrompt = `You are a helpful and friendly pharmacy assistant chatbot.
Your goal is to answer questions about the user's medicines.
You must ONLY use the information provided in the "Available Medicines" section below.
Do not provide any medical advice or information not present in the provided data.
If the user asks a question you cannot answer with the provided data, politely say that you cannot answer that question.

Available Medicines:
${availableMedicines}

Chat History:
${chatHistory}
assistant: `;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        return { response: text };
    } catch (error: any) {
        console.error("AI Error:", error);
        throw error;
    }
}


'use server';

import type { Medicine } from '@/types/medicine';

export async function chatWithAi(input: { history: { role: 'user' | 'assistant', content: string }[], allMedicines: Medicine[] }): Promise<{ response: string }> {
    try {
        // Get API key from environment
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            throw new Error(
                'GROQ_API_KEY is not set. Please add it to your .env file in the root directory: GROQ_API_KEY=gsk_your-key-here'
            );
        }

        const availableMedicines = input.allMedicines.map(m => (
            `- Name: ${m.name}
  - Manufacturer: ${m.manufacturer}
  - Batch Number: ${m.batchNo}
  - Expiry Date: ${m.expDate}
  - Description: ${m.description}
  - Stock: ${m.quantity} units`
        )).join('\n');

        const messages = input.history.map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
        }));

        const systemPrompt = `You are a helpful and friendly pharmacy assistant chatbot.
Your goal is to answer questions about the user's medicines.
You must ONLY use the information provided in the "Available Medicines" section below.
Do not provide any medical advice or information not present in the provided data.
If the user asks a question you cannot answer with the provided data, politely say that you cannot answer that question.

Available Medicines:
${availableMedicines}`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Groq API Error: ${error.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const text = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

        return { response: text };
    } catch (error: any) {
        console.error("AI Error:", error);
        throw error;
    }
}

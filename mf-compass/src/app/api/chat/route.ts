import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY; // Fallback for backward compat if needed

export async function POST(request: NextRequest) {
    try {
        if (!apiKey) {
            return NextResponse.json(
                { error: 'AI service is not configured. Please add GEMINI_API_KEY to your .env file.' },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const { message, profile, history } = await request.json();

        // Load Mutual Funds Data
        // Assuming backend is a sibling folder to mf-compass
        const fundsPath = path.resolve(process.cwd(), '../backend/data/mutual_funds.json');
        let topFunds = [];

        try {
            const fileData = fs.readFileSync(fundsPath, 'utf-8');
            const allFunds = JSON.parse(fileData);
            // Filter top funds to provide context (e.g., top 20 by score)
            topFunds = allFunds
                .filter((f: any) => (f.total_score || 0) >= 70)
                .sort((a: any, b: any) => (b.total_score || 0) - (a.total_score || 0))
                .slice(0, 20);
        } catch (e) {
            console.error("Failed to load funds from JSON:", e);
            // Fallback or empty context
        }

        // Build Prompt
        const fundsContext = topFunds.map((fund: any, idx: number) =>
            `${idx + 1}. ${fund.scheme_name} (${fund.fund_category}) - Score: ${fund.total_score}/100 | 1Y: ${fund.returns_1y}% | 3Y: ${fund.returns_3y}% | Risk: ${fund.risk_level}`
        ).join('\n');

        const prompt = `
        You are an expert Mutual Fund Advisor for "MF Compass".
        
        USER PROFILE:
        - Age: ${profile?.age || 'Not provided'}
        - Income: ₹${profile?.monthlyIncome?.toLocaleString('en-IN') || 'Not provided'}
        - Risk: ${profile?.riskType || 'Not provided'}
        - Goal: ${profile?.investmentObjective || 'Not provided'} (${profile?.goalDuration || 'N/A'} yrs)

        TOP RATED FUNDS (Context):
        ${fundsContext}

        USER QUESTION: "${message}"

        INSTRUCTIONS:
        1. Answer the user's question directly and concisely.
        2. If they ask for recommendations, suggest funds ONLY from the provided list that match their risk profile.
        3. Explain WHY a fund is suitable based on their profile (e.g., "Since you are aggressive, X fund with high 3Y returns is good").
        4. Do not hallucinate funds not in the list unless asking for general concepts.
        5. Keep the tone professional, encouraging, and helpful.
        `;

        // Chat History (Gemini format)
        // Note: Gemini API history format is slightly different, but for single turn or simple history we can just append to prompt or use chat session.
        // For simplicity in this stateless route, we'll just send the prompt. 
        // If history is needed, we can append previous Q/A to the prompt text.

        let finalPrompt = prompt;
        if (history && history.length > 0) {
            const historyText = history.map((msg: any) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n');
            finalPrompt = `Previous Conversation:\n${historyText}\n\n${prompt}`;
        }

        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ response: text });

    } catch (error: any) {
        console.error('Chat API error:', error);
        return NextResponse.json({ error: 'Failed to process chat message', details: error?.message }, { status: 500 });
    }
}

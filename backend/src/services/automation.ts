import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { loadFunds } from './engine';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface UserProfile {
    age: number;
    monthlyIncome: number;
    risk: string;
    goalDuration: number;
    investmentObjective: string;
}

interface Recommendation {
    top3: any[];
    allocation: any[];
    sipSuggestion: any;
    alerts: any[];
    explanation: string;
}

export const runAutomation = async (profile: any, holdings: any[] = []) => {
    try {
        // If no API key, throw error to trigger fallback
        if (!process.env.GEMINI_API_KEY) throw new Error("No Gemini API Key");

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const holdingsText = holdings.length > 0
            ? holdings.map(h => `- ${h.fundName} (${h.value})`).join('\n')
            : "None";

        const prompt = `
        Act as an expert financial advisor.
        
        User Profile:
        - Age: ${profile.age}
        - Monthly Income: ${profile.monthlyIncome}
        - Risk Profile: ${profile.riskType || profile.risk}
        - Goal: ${profile.investmentObjective} (${profile.goalDuration} years)
        
        Current Portfolio Holdings:
        ${holdingsText}

        Task:
        1. Analyze the current portfolio and user profile.
        2. Recommend top 3 specific mutual funds to invest in (use real Indian mutual fund names).
        3. Ensure recommendations complement the existing portfolio (e.g., if they have Large Cap, suggest Mid/Small or Flexi Cap for diversification).
        4. Provide a brief 1-sentence reason for each recommendation.

        Output JSON format ONLY:
        {
            "top3": [
                { "fundName": "Fund Name 1", "reason": "Reason 1", "category": "Category 1" },
                { "fundName": "Fund Name 2", "reason": "Reason 2", "category": "Category 2" },
                { "fundName": "Fund Name 3", "reason": "Reason 3", "category": "Category 3" }
            ],
            "explanation": "Brief strategic advice."
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            return {
                ...data,
                alerts: [], // Alerts will be added by simulation
                allocation: [
                    { name: "Equity", value: 70 },
                    { name: "Debt", value: 20 },
                    { name: "Gold", value: 10 }
                ],
                sipSuggestion: {
                    amount: profile.monthlyIncome * 0.2,
                    reason: "Based on the 50-30-20 rule, investing 20% of your income is recommended."
                }
            };
        }
    } catch (error) {
        console.error("Gemini Error or Fallback:", error);
    }

    // Fallback if Gemini fails or no key
    return {
        top3: [
            { fundName: "HDFC Top 100 Fund", reason: "Consistent large-cap performer suitable for long-term growth.", category: "Large Cap" },
            { fundName: "Parag Parikh Flexi Cap Fund", reason: "Diversified exposure across sectors and geographies.", category: "Flexi Cap" },
            { fundName: "Axis Small Cap Fund", reason: "High-growth potential for aggressive wealth creation.", category: "Small Cap" }
        ],
        allocation: [
            { name: "Equity", value: 75 },
            { name: "Debt", value: 20 },
            { name: "Cash", value: 5 }
        ],
        sipSuggestion: {
            amount: profile.monthlyIncome * 0.2,
            reason: "Based on the 50-30-20 rule, investing 20% of your income is recommended."
        },
        alerts: [],
        explanation: `Based on your ${profile.riskType || profile.risk} risk profile and ${profile.goalDuration} year horizon, we recommend a Growth-focused portfolio. The market outlook is currently stable, favoring Equity for wealth creation.`
    };
};

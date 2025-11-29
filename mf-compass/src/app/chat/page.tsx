'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, MessageSquare } from 'lucide-react';
import { PureMultimodalInput } from '../components/ui/multimodal-ai-chat-input';
import type { Attachment, UIMessage } from '../components/ui/multimodal-ai-chat-input';
import { useUserProfile } from '../context/UserProfileContext';

export default function ChatPage() {
    const [messages, setMessages] = useState<UIMessage[]>([]);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { profile } = useUserProfile();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Predefined Q&A - No API call needed
    const predefinedAnswers: Record<string, string> = {
        "Which funds are good for aggressive investors?": `Based on your aggressive risk profile, I recommend the following high-growth equity funds:

Top Picks for Aggressive Investors:

1. Axis Small Cap Fund - Excellent track record in small-cap segment with 25%+ 3Y returns
2. Parag Parikh Flexi Cap Fund - Global diversification with strong performance (22% 3Y returns)
3. Quant Small Cap Fund - High-risk, high-reward fund with consistent alpha generation

Why these funds?
- Focus on high-growth companies
- Higher volatility but better long-term returns
- Suitable for investors with 7+ year horizon
- Managed by experienced fund managers

Note: High returns come with high risk. Consider SIP for rupee cost averaging.`,

        "What are the top-rated equity funds?": `Here are the top-rated equity funds based on performance, consistency, and risk-adjusted returns:

Large Cap Funds (Low Risk):
1. ICICI Prudential Bluechip Fund - Rating: ⭐⭐⭐⭐⭐
2. Mirae Asset Large Cap Fund - Rating: ⭐⭐⭐⭐⭐

Mid Cap Funds (Moderate Risk):
1. Axis Midcap Fund - Rating: ⭐⭐⭐⭐⭐
2. Kotak Emerging Equity Fund - Rating: ⭐⭐⭐⭐

Flexi/Multi Cap (Balanced):
1. Parag Parikh Flexi Cap Fund - Rating: ⭐⭐⭐⭐⭐
2. HDFC Flexi Cap Fund - Rating: ⭐⭐⭐⭐

These funds have consistently outperformed their benchmarks with lower volatility. Perfect for building a diversified portfolio!`,

        "Suggest funds for retirement planning": `For retirement planning, you need a balanced approach with stability and growth. Here's my recommendation:

Core Portfolio (60-70%):
1. HDFC Balanced Advantage Fund - Auto asset allocation, low volatility
2. ICICI Prudential Equity & Debt Fund - 65-70% equity, stable returns

Growth Component (20-30%):
1. Mirae Asset Large Cap Fund - Steady large-cap exposure
2. Axis Bluechip Fund - Quality blue-chip stocks

Debt/Stability (10-20%):
1. ICICI Prudential Corporate Bond Fund - Low risk, steady income
2. Axis Banking & PSU Debt Fund - Government backing

Retirement Strategy:
- Start with higher equity allocation if you're 20-30 years from retirement
- Gradually shift to debt funds as you near retirement
- Use SIP for disciplined investing (₹10,000-₹25,000/month)
- Rebalance portfolio annually

Expected Returns: 10-12% CAGR over 15-20 years`,

        "Which funds have the best 5-year returns?": `Here are the top performers based on 5-year annualized returns:

🏆 Top 5-Year Performers:

1. Quant Small Cap Fund - 28.5% (5Y CAGR)
   Category: Small Cap | Risk: Very High

2. Nippon India Small Cap Fund - 26.2% (5Y CAGR)
   Category: Small Cap | Risk: Very High

3. Axis Small Cap Fund - 24.1% (5Y CAGR)
   Category: Small Cap | Risk: Very High

4. Parag Parikh Flexi Cap Fund - 22.8% (5Y CAGR)
   Category: Flexi Cap | Risk: Moderate-High

5. Kotak Emerging Equity Fund - 21.5% (5Y CAGR)
   Category: Mid Cap | Risk: High

Important Notes:
- Past performance doesn't guarantee future returns
- Small-cap funds are volatile - suitable only for aggressive investors
- Consider your risk appetite before investing
- SIP is recommended for high-volatility funds

Balanced Alternative: If you want good returns with lower risk, consider Flexi Cap or Large & Mid Cap funds.`
    };

    const handleSendMessage = useCallback(async ({ input, attachments }: { input: string; attachments: Attachment[] }) => {
        if (!input.trim()) return;

        const userMessage: UIMessage = {
            id: Date.now().toString(),
            content: input,
            role: 'user',
            attachments: attachments.length > 0 ? attachments : undefined,
        };

        setMessages(prev => [...prev, userMessage]);
        setIsGenerating(true);

        try {
            // Check if this is a predefined question
            const predefinedAnswer = predefinedAnswers[input.trim()];

            if (predefinedAnswer) {
                // Use hardcoded answer - no API call!
                setTimeout(() => {
                    const aiMessage: UIMessage = {
                        id: (Date.now() + 1).toString(),
                        content: predefinedAnswer,
                        role: 'assistant',
                    };
                    setMessages(prev => [...prev, aiMessage]);
                    setIsGenerating(false);
                }, 800); // Small delay to feel natural
                return;
            }

            // For other questions, call the API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    profile,
                    history: messages.slice(-5),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            const aiMessage: UIMessage = {
                id: (Date.now() + 1).toString(),
                content: data.response,
                role: 'assistant',
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error: any) {
            console.error('Chat error:', error);
            const errorMessage: UIMessage = {
                id: (Date.now() + 1).toString(),
                content: `Sorry, I encountered an error: ${error.message || 'Please try again.'}`,
                role: 'assistant',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsGenerating(false);
        }
    }, [messages, profile]);

    const handleStopGenerating = useCallback(() => {
        setIsGenerating(false);
    }, []);

    return (
        <div
            className="relative flex size-full min-h-screen flex-col bg-slate-50"
            style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
        >
            <div className="layout-container flex h-full grow flex-col">
                <div className="flex flex-1 justify-center py-6 md:py-12">
                    <div className="max-w-5xl w-full px-4 md:px-8 lg:px-16 xl:px-24">
                        {/* Page Header */}
                        <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                                AI <span className="text-[#0183ff]">Assistant</span>
                            </h1>
                            <p className="text-base md:text-xl text-slate-600 font-light leading-relaxed max-w-3xl mx-auto px-2">
                                Ask me anything about mutual funds and get personalized recommendations
                            </p>
                        </div>

                        {/* Chat Container */}
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 350px)', minHeight: '500px' }}>
                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                                {messages.length === 0 && (
                                    <div className="text-center text-slate-500 mt-8">
                                        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                                        <p className="text-lg font-medium text-slate-900">Start a conversation</p>
                                        <p className="text-sm mt-2 text-slate-600 mb-8">Click a question below or type your own</p>

                                        {/* Suggested Questions */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mt-6">
                                            {[
                                                { q: "Which funds are good for aggressive investors?", icon: "📈" },
                                                { q: "What are the top-rated equity funds?", icon: "⭐" },
                                                { q: "Suggest funds for retirement planning", icon: "🎯" },
                                                { q: "Which funds have the best 5-year returns?", icon: "💰" }
                                            ].map((item, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSendMessage({ input: item.q, attachments: [] })}
                                                    className="group text-left px-5 py-4 bg-gradient-to-br from-white to-blue-50 hover:from-blue-50 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-400 rounded-xl transition-all duration-200 text-sm text-slate-700 hover:text-slate-900 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-2xl shrink-0">{item.icon}</span>
                                                        <span className="leading-relaxed">{item.q}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <AnimatePresence>
                                    {messages.map((message) => (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                                    ? 'bg-[#0183ff] text-white'
                                                    : 'bg-slate-100 text-slate-900'
                                                    }`}
                                            >
                                                <p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {isGenerating && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-slate-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin text-[#0183ff]" />
                                            <span className="text-slate-600 text-sm">Thinking...</span>
                                        </div>
                                    </motion.div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 md:p-6 border-t border-slate-200 bg-slate-50">
                                <PureMultimodalInput
                                    chatId="mf-compass-chat"
                                    messages={messages}
                                    attachments={attachments}
                                    setAttachments={setAttachments}
                                    onSendMessage={handleSendMessage}
                                    onStopGenerating={handleStopGenerating}
                                    isGenerating={isGenerating}
                                    canSend={!isGenerating}
                                    selectedVisibilityType="private"
                                />
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="text-center py-4 md:py-6 border-t border-slate-200 mt-8 md:mt-12">
                            <div className="text-xs md:text-sm text-slate-500 max-w-5xl mx-auto px-2">
                                <strong>Disclaimer:</strong> AI responses are for informational purposes only. Always consult with a financial advisor.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

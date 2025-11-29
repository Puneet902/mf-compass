'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Loader2 } from 'lucide-react';
import { PureMultimodalInput } from './ui/multimodal-ai-chat-input';
import type { Attachment, UIMessage } from './ui/multimodal-ai-chat-input';
import { useUserProfile } from '../context/UserProfileContext';

export default function ChatInterface() {
    const [isOpen, setIsOpen] = useState(false);
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

    const handleSendMessage = useCallback(async ({ input, attachments }: { input: string; attachments: Attachment[] }) => {
        if (!input.trim()) return;

        // Add user message
        const userMessage: UIMessage = {
            id: Date.now().toString(),
            content: input,
            role: 'user',
            attachments: attachments.length > 0 ? attachments : undefined,
        };

        setMessages(prev => [...prev, userMessage]);
        setIsGenerating(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    profile,
                    history: messages.slice(-5), // Send last 5 messages for context
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();

            // Add AI response
            const aiMessage: UIMessage = {
                id: (Date.now() + 1).toString(),
                content: data.response,
                role: 'assistant',
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: UIMessage = {
                id: (Date.now() + 1).toString(),
                content: 'Sorry, I encountered an error. Please try again.',
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
        <>
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
            >
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">AI Chat</span>
            </button>

            {/* Chat Dialog */}
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto max-w-4xl w-full h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    MF Compass AI Assistant
                                </Dialog.Title>
                                <p className="text-sm text-gray-600 mt-1">
                                    Ask me anything about mutual funds and investments
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 mt-8">
                                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg font-medium">Start a conversation</p>
                                    <p className="text-sm mt-2">Ask me about mutual funds, investment strategies, or fund recommendations</p>
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
                                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-900'
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap">{message.content}</p>
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
                                    <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                                        <span className="text-gray-600">Thinking...</span>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-6 border-t border-gray-200">
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
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    );
}

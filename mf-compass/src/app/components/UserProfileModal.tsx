'use client';

'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { useUserProfile, UserProfile } from '../context/UserProfileContext';

export default function UserProfileModal() {
    const { hasProfile, setProfile } = useUserProfile();
    const [isOpen, setIsOpen] = useState(!hasProfile);

    const [formData, setFormData] = useState<UserProfile>({
        age: 25,
        monthlyIncome: 50000,
        riskType: 'Medium',
        goalDuration: 5,
        investmentObjective: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProfile(formData);
        setIsOpen(false);
    };

    if (hasProfile && !isOpen) return null;

    return (
        <Dialog open={isOpen} onClose={() => { }} className="relative z-50">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-2xl shadow-2xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8"
                    >
                        <Dialog.Title className="text-3xl font-bold mb-2 text-slate-900">
                            Welcome to <span className="text-[#0183ff]">MF Compass</span>
                        </Dialog.Title>
                        <Dialog.Description className="text-slate-600 mb-6">
                            Let's personalize your investment journey. Tell us about yourself to get tailored mutual fund recommendations.
                        </Dialog.Description>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    min="18"
                                    max="100"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0183ff] focus:border-transparent text-slate-900"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Monthly Income (₹)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1000"
                                    value={formData.monthlyIncome}
                                    onChange={(e) => setFormData({ ...formData, monthlyIncome: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0183ff] focus:border-transparent text-slate-900"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Risk Type
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['Low', 'Medium', 'High'] as const).map((risk) => (
                                        <button
                                            key={risk}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, riskType: risk })}
                                            className={`px-4 py-3 rounded-lg font-medium transition-all ${formData.riskType === risk
                                                ? 'bg-[#0183ff] text-white shadow-lg scale-105'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                }`}
                                        >
                                            {risk}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Goal Duration (years)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={formData.goalDuration}
                                    onChange={(e) => setFormData({ ...formData, goalDuration: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0183ff] focus:border-transparent text-slate-900"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Investment Objective
                                </label>
                                <textarea
                                    value={formData.investmentObjective}
                                    onChange={(e) => setFormData({ ...formData, investmentObjective: e.target.value })}
                                    placeholder="e.g., Retirement planning, Child education, Wealth creation..."
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0183ff] focus:border-transparent resize-none text-slate-900"
                                    rows={3}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#0183ff] text-white font-semibold py-4 rounded-lg hover:bg-[#0066cc] transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                            >
                                Get Started
                            </button>
                        </form>
                    </motion.div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}

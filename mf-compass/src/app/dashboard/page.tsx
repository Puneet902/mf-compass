'use client';

import Dashboard from '../components/Dashboard';



export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">MF Compass Dashboard</h1>
                    <p className="text-slate-600 mt-2">AI-Powered Mutual Fund Analysis & Recommendations</p>
                </div>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-slate-800">Agentic Insights</h2>
                        <Dashboard />
                    </section>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { api } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Shield, Download } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
    const { profile, recommendation, analyzeProfile, isLoading } = useStore();
    const [brokerData, setBrokerData] = useState<any>(null);
    const [simulatedAlerts, setSimulatedAlerts] = useState<any[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);

    useEffect(() => {
        if (!recommendation) {
            analyzeProfile();
        }
    }, []);

    const handleImportPortfolio = async () => {
        setIsSimulating(true);
        try {
            const data = await api.fetchBrokerPortfolio();
            setBrokerData(data);

            if (data.holdings) {
                await analyzeProfile(data.holdings);
            }

            addAlert({
                type: 'Success',
                message: 'Portfolio imported from Broker (Simulated). Analysis updated.',
                action: 'View Allocation'
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsSimulating(false);
        }
    };

    const runSimulation = async (type: string) => {
        setIsSimulating(true);
        try {
            let res;
            if (type === 'crash') res = await api.simulateMarketCrash();

            if (res && res.alert) {
                addAlert(res.alert);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSimulating(false);
        }
    };

    const addAlert = (alert: any) => {
        setSimulatedAlerts(prev => [alert, ...prev]);
    };

    if (isLoading) return <div className="p-4 sm:p-8 text-center text-sm sm:text-base">Thinking... (Simulating Agentic Reasoning)</div>;

    return (
        <div className="space-y-4 sm:space-y-8">
            {/* 1. Broker Import Section */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                        <Download className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="hidden sm:inline">Import Portfolio (Simulated Broker)</span>
                        <span className="sm:hidden">Import Portfolio</span>
                    </h3>
                    <button
                        onClick={handleImportPortfolio}
                        disabled={isSimulating}
                        className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {isSimulating ? 'Importing...' : 'Fetch from Broker'}
                    </button>
                </div>

                {brokerData && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100 mb-4 sm:mb-6 grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-6">
                            <div>
                                <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Investor</div>
                                <div className="text-base sm:text-lg font-bold text-blue-900">{brokerData.user?.name || 'Investor'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Age</div>
                                <div className="text-base sm:text-lg font-bold text-blue-900">{brokerData.user?.age || '--'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider">SIP</div>
                                <div className="text-base sm:text-lg font-bold text-blue-900">₹{brokerData.user?.monthlySIP?.toLocaleString() || '--'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Risk</div>
                                <div className="text-base sm:text-lg font-bold text-blue-900">{brokerData.user?.riskProfile || 'Moderate'}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <div className="text-xs sm:text-sm text-slate-500 mb-1">Total Portfolio Value</div>
                                <div className="text-xl sm:text-2xl font-bold text-slate-800">₹{brokerData.totalValue.toLocaleString()}</div>
                                <div className="mt-3 sm:mt-4 space-y-2">
                                    {brokerData.holdings.map((h: any) => (
                                        <div key={h.fundId} className="flex justify-between text-xs sm:text-sm border-b border-slate-50 pb-2">
                                            <span className="truncate mr-2">{h.fundName}</span>
                                            <span className={`flex-shrink-0 ${h.return > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {h.return}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="h-40 sm:h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={brokerData.allocation}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={30}
                                            outerRadius={50}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {brokerData.allocation.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Real-Time Alerts */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-slate-800">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" /> Real-Time Alerts
                    </h3>
                    {!isSimulating && (
                        <button
                            onClick={() => runSimulation('crash')}
                            className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium underline"
                        >
                            Simulate Crash
                        </button>
                    )}
                </div>

                <div className="space-y-2 sm:space-y-3">
                    {recommendation?.alerts?.map((alert: any, idx: number) => (
                        <div key={`rec-${idx}`} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 shrink-0 mt-0.5" />
                            <div>
                                <div className="font-medium text-xs sm:text-sm text-slate-900">{alert.type}: {alert.message}</div>
                                <div className="text-xs text-slate-600 mt-1 font-semibold">Action: {alert.action}</div>
                            </div>
                        </div>
                    ))}

                    {simulatedAlerts.map((alert: any, idx: number) => (
                        <div key={`sim-${idx}`} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-red-50 rounded-lg border border-red-100">
                            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <div className="font-medium text-xs sm:text-sm text-red-900">{alert.type}: {alert.message}</div>
                                <div className="text-xs text-red-700 mt-1 font-semibold">Action: {alert.action}</div>
                            </div>
                        </div>
                    ))}

                    {simulatedAlerts.length === 0 && (!recommendation?.alerts || recommendation.alerts.length === 0) && (
                        <div className="text-slate-400 text-center py-3 sm:py-4 text-xs sm:text-sm">System Stable. No critical alerts.</div>
                    )}
                </div>
            </div>

            {/* 3. Recommendations */}
            {recommendation && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-blue-100">
                    <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5" /> Suggested Moves 
                    </h3>

                    <div>
                        <div className="text-xs sm:text-sm font-medium text-blue-800 mb-2 sm:mb-3">Top 3 Recommended Funds</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                            {recommendation.top3?.map((fund: any, idx: number) => (
                                <div key={idx} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-blue-50 hover:shadow-md transition-shadow">
                                    <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">{fund.category || 'Fund'}</div>
                                    <div className="font-bold text-sm sm:text-base text-slate-800 mb-2 line-clamp-2" title={fund.fundName}>{fund.fundName}</div>
                                    <p className="text-xs text-slate-600 line-clamp-3">{fund.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

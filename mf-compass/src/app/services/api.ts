const BASE_URL = 'http://localhost:4000/api';

export const api = {
    getFunds: async () => {
        const res = await fetch(`${BASE_URL}/funds`);
        if (!res.ok) throw new Error('Failed to fetch funds');
        return res.json();
    },

    getPortfolio: async () => {
        const res = await fetch(`${BASE_URL}/portfolio`);
        if (!res.ok) throw new Error('Failed to fetch portfolio');
        return res.json();
    },

    analyze: async (profile: any, holdings: any[] = []) => {
        const res = await fetch(`${BASE_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile, holdings })
        });
        if (!res.ok) throw new Error('Analysis failed');
        return res.json();
    },

    // Simulation Endpoints
    fetchBrokerPortfolio: async () => {
        const res = await fetch(`${BASE_URL}/broker/fetch`);
        if (!res.ok) throw new Error('Failed to fetch broker portfolio');
        return res.json();
    },

    simulateMarketCrash: async () => {
        const res = await fetch(`${BASE_URL}/simulate/marketCrash`, { method: 'POST' });
        return res.json();
    },

    simulateVolatility: async () => {
        const res = await fetch(`${BASE_URL}/simulate/volatility`, { method: 'POST' });
        return res.json();
    },

    simulateManagerChange: async () => {
        const res = await fetch(`${BASE_URL}/simulate/managerChange`, { method: 'POST' });
        return res.json();
    },

    simulateSectorMismatch: async () => {
        const res = await fetch(`${BASE_URL}/simulate/sectorMismatch`, { method: 'POST' });
        return res.json();
    }
};

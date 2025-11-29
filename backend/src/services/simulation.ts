import fs from 'fs';
import path from 'path';
import { loadFunds } from './engine';

const MARKET_DATA_PATH = path.join(__dirname, '../../../data/market_conditions.json');
const MANAGER_DATA_PATH = path.join(__dirname, '../../../data/fund_manager_changes.json');

export const getBrokerPortfolio = () => {
    // Simulate fetching from Zerodha/Groww
    return {
        user: {
            name: "Puneet",
            age: 25,
            monthlySIP: 15000,
            riskProfile: "Aggressive"
        },
        totalValue: 1250000,
        holdings: [
            { fundId: 1, fundName: "HDFC Top 100 Fund", units: 500, avgNAV: 120, currentNAV: 145, value: 72500, return: 20.8 },
            { fundId: 3, fundName: "SBI Small Cap Fund", units: 200, avgNAV: 80, currentNAV: 110, value: 22000, return: 37.5 },
            { fundId: 5, fundName: "Parag Parikh Flexi Cap", units: 300, avgNAV: 45, currentNAV: 55, value: 16500, return: 22.2 }
        ],
        allocation: [
            { name: "Large Cap", value: 60 },
            { name: "Small Cap", value: 25 },
            { name: "Flexi Cap", value: 15 }
        ]
    };
};

export const simulateMarketCrash = () => {
    const marketData = JSON.parse(fs.readFileSync(MARKET_DATA_PATH, 'utf-8'));
    marketData.volatilityIndex = 42; // High volatility
    marketData.trend = "Bearish";
    marketData.outlook = "Negative";
    // In a real app, we would write this back to file or DB. 
    // For this simulation, we'll just return the modified state to trigger alerts.
    return {
        success: true,
        message: "Market Crash Simulated: VIX spiked to 42",
        data: marketData,
        alert: {
            type: "Critical",
            message: "Market Crash Detected! VIX at 42. Equity markets falling rapidly.",
            action: "Shift SIPs to Debt/Gold Funds immediately."
        }
    };
};

export const simulateVolatilitySpike = () => {
    return {
        success: true,
        message: "Volatility Spike Simulated",
        alert: {
            type: "Warning",
            message: "High Volatility detected in Midcap & Smallcap sectors.",
            action: "Pause Smallcap SIPs. Move to Large Cap."
        }
    };
};

export const simulateManagerChange = () => {
    const funds = loadFunds();
    const randomFund = funds[Math.floor(Math.random() * funds.length)];

    return {
        success: true,
        message: `Manager Change Simulated for ${randomFund.scheme_name}`,
        alert: {
            type: "Risk",
            message: `Fund Manager changed for ${randomFund.scheme_name}. Strategy may shift.`,
            action: "Review Allocation"
        },
        fund: randomFund
    };
};

export const simulateSectorMismatch = () => {
    return {
        success: true,
        message: "Sector Mismatch Simulated",
        alert: {
            type: "Compliance",
            message: "Large Cap fund showing 15% Small Cap allocation. Deviation from mandate.",
            action: "Check Fund Factsheet"
        }
    };
};

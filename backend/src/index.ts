import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { loadFunds, rankFunds } from './services/engine';
import { runAutomation } from './services/automation';
import {
    getBrokerPortfolio,
    simulateMarketCrash,
    simulateVolatilitySpike,
    simulateManagerChange,
    simulateSectorMismatch
} from './services/simulation';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// Health Check
app.get('/', (req, res) => {
    res.send('MF Compass Backend Simulation Running');
});

// Get Funds (Ranked)
app.get('/api/funds', (req, res) => {
    const funds = loadFunds();
    const ranked = rankFunds(funds);
    res.json(ranked);
});

// Get Portfolio
app.get('/api/portfolio', (req, res) => {
    const dataPath = path.join(__dirname, '../../data/user_portfolio.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    res.json(JSON.parse(rawData));
});

// Analyze (Agentic)
app.post('/api/analyze', async (req, res) => {
    const { profile, holdings } = req.body;
    // Simulate n8n/LLM delay
    // setTimeout(() => {
    const result = await runAutomation(profile, holdings);
    res.json(result);
    // }, 1500);
});

// --- SIMULATION ENDPOINTS ---

app.get('/api/broker/fetch', (req, res) => {
    setTimeout(() => {
        res.json(getBrokerPortfolio());
    }, 1000);
});

app.post('/api/simulate/marketCrash', (req, res) => {
    res.json(simulateMarketCrash());
});

app.post('/api/simulate/volatility', (req, res) => {
    res.json(simulateVolatilitySpike());
});

app.post('/api/simulate/managerChange', (req, res) => {
    res.json(simulateManagerChange());
});

app.post('/api/simulate/sectorMismatch', (req, res) => {
    res.json(simulateSectorMismatch());
});

app.listen(PORT, () => {
    console.log(`Backend simulation running on http://localhost:${PORT}`);
});

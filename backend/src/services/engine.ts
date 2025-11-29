import fs from 'fs';
import path from 'path';

export interface Fund {
    id: number;
    kuvera_code: string;
    scheme_name: string;
    fund_category: string;
    fund_type: string;
    returns_1d: number;
    returns_1w: number;
    returns_1y: number;
    returns_3y: number;
    returns_5y: number;
    returns_inception: number;
    volatility: number;
    expense_ratio: number;
    risk: string;
    managerChanged: boolean;
    sectorAllocation: any;
    rollingReturnScore: number;
    consistencyScore: number;
    mood?: string;
    calculatedScore?: number;
    total_score?: number;
    fund_rating?: number;
    fund_house?: string;
    fund_house_name?: string;
    aum?: number;
    last_updated?: string;
}

export const loadFunds = (): Fund[] => {
    const dataPath = path.join(__dirname, '../../../data/mutual_funds.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(rawData);
};

export const calculateScore = (fund: Fund): number => {
    // score = rollingReturnScore*0.4 + consistencyScore*0.3 + (1/volatility)*0.2 + (1/expenseRatio)*0.1

    // Revised formula for this simulation to get a 0-100 score:
    let score = (fund.rollingReturnScore * 4) + (fund.consistencyScore * 3);

    // Add volatility bonus (lower is better)
    if (fund.volatility < 10) score += 20;
    else if (fund.volatility < 15) score += 10;

    // Add expense bonus (lower is better)
    if (fund.expense_ratio < 1.0) score += 10;

    return parseFloat(score.toFixed(2));
};

export const determineMood = (fund: Fund): string => {
    if (fund.volatility > 18) return 'Volatile';
    if (fund.consistencyScore > 9 && fund.volatility < 12) return 'Stable';
    if (fund.returns_1y > 20 && fund.returns_3y > 15) return 'Aggressive';
    if (fund.managerChanged) return 'Uncertain';
    if (fund.returns_1y > fund.returns_3y) return 'Recovering';
    return 'Consistent';
};

export const rankFunds = (funds: Fund[]): Fund[] => {
    return funds.map(fund => ({
        ...fund,
        calculatedScore: calculateScore(fund),
        // Ensure total_score is present, defaulting to calculatedScore if missing in JSON
        total_score: fund.total_score || calculateScore(fund),
        mood: determineMood(fund)
    })).sort((a, b) => (b.total_score || 0) - (a.total_score || 0));
};

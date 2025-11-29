import { create } from 'zustand';
import { api } from '../services/api';

interface UserProfile {
    age: number;
    monthlyIncome: number;
    riskType: string;
    goalDuration: number;
    investmentObjective: string;
}

interface Fund {
    id: number;
    kuvera_code: string;
    scheme_name: string;
    fund_house: string;
    fund_house_name: string;
    fund_category: string;
    fund_type: string;
    returns_1d: number | string | null;
    returns_1w: number | string | null;
    returns_1y: number | string | null;
    returns_3y: number | string | null;
    returns_5y: number | string | null;
    returns_inception: number | string | null;
    total_score: number | string | null;
    aum: number | string | null;
    expense_ratio: number | string | null;
    fund_rating: number | string | null;
    last_updated: string;

    // Additional fields for agentic logic
    volatility?: number;
    risk?: string;
    mood?: string;
    calculatedScore?: number;
}

interface Recommendation {
    top3: any[];
    allocation: any[];
    sipSuggestion: any;
    alerts: any[];
    explanation: string;
}

interface AppState {
    profile: UserProfile;
    funds: Fund[];
    portfolio: any;
    recommendation: Recommendation | null;
    isLoading: boolean;
    error: string | null;

    setProfile: (profile: Partial<UserProfile>) => void;
    fetchFunds: () => Promise<void>;
    fetchPortfolio: () => Promise<void>;
    analyzeProfile: (holdings?: any[]) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
    profile: {
        age: 30,
        monthlyIncome: 50000,
        riskType: 'Moderate',
        goalDuration: 5,
        investmentObjective: 'Wealth Creation'
    },
    funds: [],
    portfolio: null,
    recommendation: null,
    isLoading: false,
    error: null,

    setProfile: (profile) => set((state) => ({
        profile: { ...state.profile, ...profile }
    })),

    fetchFunds: async () => {
        set({ isLoading: true });
        try {
            const funds = await api.getFunds();
            set({ funds, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch funds', isLoading: false });
        }
    },

    fetchPortfolio: async () => {
        try {
            const portfolio = await api.getPortfolio();
            set({ portfolio });
        } catch (error) {
            console.error('Failed to fetch portfolio');
        }
    },

    analyzeProfile: async (holdings: any[] = []) => {
        set({ isLoading: true });
        try {
            const { profile } = get();
            const recommendation = await api.analyze(profile, holdings);
            set({ recommendation, isLoading: false });
        } catch (error) {
            set({ error: 'Analysis failed', isLoading: false });
        }
    }
}));

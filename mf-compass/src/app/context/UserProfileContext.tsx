'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
    age: number;
    monthlyIncome: number;
    riskType: 'Low' | 'Medium' | 'High';
    goalDuration: number;
    investmentObjective: string;
}

interface UserProfileContextType {
    profile: UserProfile | null;
    setProfile: (profile: UserProfile) => void;
    hasProfile: boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
    const [profile, setProfileState] = useState<UserProfile | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load from localStorage on mount
        const stored = localStorage.getItem('mf-compass-user-profile');
        if (stored) {
            try {
                setProfileState(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse user profile:', e);
            }
        }
        setIsLoaded(true);
    }, []);

    const setProfile = (newProfile: UserProfile) => {
        setProfileState(newProfile);
        localStorage.setItem('mf-compass-user-profile', JSON.stringify(newProfile));
    };

    if (!isLoaded) {
        return null; // or a loading spinner
    }

    return (
        <UserProfileContext.Provider value={{ profile, setProfile, hasProfile: !!profile }}>
            {children}
        </UserProfileContext.Provider>
    );
}

export function useUserProfile() {
    const context = useContext(UserProfileContext);
    if (context === undefined) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }
    return context;
}

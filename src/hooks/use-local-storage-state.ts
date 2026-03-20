'use client';

import { useState, useEffect } from 'react';

export function useLocalStorageState<T>(key: string, defaultValue: T) {
    const [state, setState] = useState<T>(defaultValue);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setState(JSON.parse(item));
            }
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
        }
        setIsHydrated(true);
    }, [key]);

    // Save to localStorage when state changes, but only after initial hydration
    useEffect(() => {
        if (!isHydrated) return;
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error writing localStorage key "${key}":`, error);
        }
    }, [key, state, isHydrated]);

    return [state, setState] as const;
}

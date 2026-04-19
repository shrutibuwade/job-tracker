import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(true);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const theme = {
        isDark,
        toggleTheme,
        colors: isDark ? {
            bgPrimary: '#0f0f1a',
            bgSecondary: '#1a1a2e',
            bgCard: '#16213e',
            bgHover: '#1f2b47',
            textPrimary: '#f1f5f9',
            textSecondary: '#94a3b8',
            textMuted: '#64748b',
            border: '#2d3748',
            borderHover: '#4a5568',
            accentPrimary: '#7c3aed',
            accentSecondary: '#4f46e5',
            accentGreen: '#10b981',
            accentYellow: '#f59e0b',
            accentRed: '#ef4444',
            accentBlue: '#3b82f6',
            shadow: '0 4px 24px rgba(0,0,0,0.4)',
            navbarBg: '#1a1a2e',
        } : {
            bgPrimary: '#f8fafc',
            bgSecondary: '#f1f5f9',
            bgCard: '#ffffff',
            bgHover: '#e2e8f0',
            textPrimary: '#0f172a',
            textSecondary: '#475569',
            textMuted: '#94a3b8',
            border: '#e2e8f0',
            borderHover: '#cbd5e1',
            accentPrimary: '#7c3aed',
            accentSecondary: '#4f46e5',
            accentGreen: '#10b981',
            accentYellow: '#f59e0b',
            accentRed: '#ef4444',
            accentBlue: '#3b82f6',
            shadow: '0 4px 24px rgba(0,0,0,0.08)',
            navbarBg: '#ffffff',
        }
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
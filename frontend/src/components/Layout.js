import React from 'react';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext.js';

function Layout({ children }) {
    const { colors } = useTheme();
    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: colors.bgPrimary,
            transition: 'all 0.3s ease'
        }}>
            <Sidebar />
            <main style={{
                marginLeft: '260px',
                flex: 1,
                padding: '2rem',
                minHeight: '100vh',
                backgroundColor: colors.bgPrimary,
                transition: 'all 0.3s ease'
            }}>
                {children}
            </main>
        </div>
    );
}

export default Layout;
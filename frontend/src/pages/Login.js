import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { loginUser } from '../services/api';

function Login() {
    const navigate = useNavigate();
    const { isDark, colors } = useTheme();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await loginUser(formData);
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data || 'Login failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isDark
                ? 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)'
                : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
            padding: '1rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '420px',
                backgroundColor: colors.bgCard,
                borderRadius: '24px',
                padding: '2.5rem',
                border: `1px solid ${colors.border}`,
                boxShadow: isDark
                    ? '0 25px 50px rgba(0,0,0,0.5)'
                    : '0 25px 50px rgba(0,0,0,0.08)'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <span style={{ fontSize: '24px' }}>💼</span>
                    </div>
                    <h1 style={{ fontSize: '22px', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>
                        CareerSync AI
                    </h1>
                    <p style={{ color: colors.textSecondary, fontSize: '14px', margin: '6px 0 0 0' }}>
                        Welcome back! Login to continue
                    </p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        marginBottom: '1.5rem',
                        color: '#ef4444',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '6px' }}>
                            Email
                        </label>
                        <input
                            style={{
                                width: '100%',
                                padding: '11px 14px',
                                borderRadius: '10px',
                                border: `1px solid ${colors.border}`,
                                backgroundColor: colors.bgSecondary,
                                color: colors.textPrimary,
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'border 0.2s'
                            }}
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '6px' }}>
                            Password
                        </label>
                        <input
                            style={{
                                width: '100%',
                                padding: '11px 14px',
                                borderRadius: '10px',
                                border: `1px solid ${colors.border}`,
                                backgroundColor: colors.bgSecondary,
                                color: colors.textPrimary,
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: loading ? colors.border : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login →'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '14px', color: colors.textSecondary, marginTop: '1.5rem' }}>
                    Don't have an account?{' '}
                    <span
                        onClick={() => navigate('/register')}
                        style={{ color: '#7c3aed', cursor: 'pointer', fontWeight: '600' }}
                    >
                        Register here
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;
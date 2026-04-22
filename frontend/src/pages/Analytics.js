import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { useTheme } from '../context/ThemeContext';
import { getDashboardStats, getAllJobs } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const API = 'https://job-tracker-production-ae77.up.railway.app/api';

function Analytics() {
    const { colors } = useTheme();
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [advancedStats, setAdvancedStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }
        const user = JSON.parse(storedUser);
        fetchData(user.id);
    }, []);

    const fetchData = async (userId) => {
        try {
            const [statsRes, advancedRes] = await Promise.all([
                getDashboardStats(userId),
                fetch(`${API}/jobs/${userId}/advanced-stats`)
            ]);
            setStats(statsRes.data);
            const advData = await advancedRes.json();
            setAdvancedStats(advData);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const cardStyle = {
        backgroundColor: colors.bgCard,
        borderRadius: '16px',
        border: `1px solid ${colors.border}`,
        padding: '1.5rem'
    };

    const chartOptions = {
        plugins: { legend: { labels: { color: colors.textSecondary } } },
        scales: {
            x: { ticks: { color: colors.textSecondary }, grid: { color: colors.border } },
            y: { ticks: { color: colors.textSecondary }, grid: { color: colors.border }, beginAtZero: true }
        }
    };

    const doughnutData = {
        labels: ['Applied', 'Interview', 'Offer', 'Rejected'],
        datasets: [{
            data: [
                advancedStats.applied || 0,
                advancedStats.interviews || 0,
                advancedStats.offers || 0,
                advancedStats.rejected || 0
            ],
            backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'],
            borderWidth: 0
        }]
    };

    const weeklyData = {
        labels: Object.keys(advancedStats.weeklyStats || {}),
        datasets: [{
            label: 'Applications',
            data: Object.values(advancedStats.weeklyStats || {}),
            backgroundColor: 'rgba(124, 58, 237, 0.7)',
            borderRadius: 8
        }]
    };

    const monthlyData = {
        labels: Object.keys(advancedStats.monthlyStats || {}),
        datasets: [{
            label: 'Applications',
            data: Object.values(advancedStats.monthlyStats || {}),
            borderColor: '#7c3aed',
            backgroundColor: 'rgba(124, 58, 237, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#7c3aed'
        }]
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
            <p style={{ color: colors.textSecondary }}>Loading analytics...</p>
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>Analytics</h1>
                <p style={{ color: colors.textSecondary, fontSize: '14px', margin: '4px 0 0 0' }}>Deep insights into your job search</p>
            </div>

            {/* Rate Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Response Rate', value: `${advancedStats.responseRate || 0}%`, desc: 'Applications that got a response', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
                    { label: 'Interview Success Rate', value: `${advancedStats.interviewSuccessRate || 0}%`, desc: 'Interviews that led to offers', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
                    { label: 'Rejection Rate', value: `${advancedStats.rejectionRate || 0}%`, desc: 'Applications rejected', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
                ].map((rate, i) => (
                    <div key={i} style={{ ...cardStyle, textAlign: 'center' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: rate.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                            <span style={{ fontSize: '20px', fontWeight: '700', color: rate.color }}>{rate.value}</span>
                        </div>
                        <p style={{ fontWeight: '600', color: colors.textPrimary, margin: '0 0 4px 0', fontSize: '14px' }}>{rate.label}</p>
                        <p style={{ color: colors.textMuted, fontSize: '12px', margin: 0 }}>{rate.desc}</p>
                    </div>
                ))}
            </div>

            {/* Status Breakdown + Weekly */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '1.5rem' }}>
                <div style={cardStyle}>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: colors.textPrimary, marginBottom: '1.5rem' }}>Status Breakdown</h3>
                    <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom', labels: { color: colors.textSecondary, padding: 16 } } } }} />
                </div>
                <div style={cardStyle}>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: colors.textPrimary, marginBottom: '1.5rem' }}>This Week</h3>
                    <Bar data={weeklyData} options={chartOptions} />
                </div>
            </div>

            {/* Monthly Trend */}
            <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: colors.textPrimary, marginBottom: '1.5rem' }}>Monthly Trend</h3>
                <Line data={monthlyData} options={chartOptions} />
            </div>

            {/* Top Companies */}
            {advancedStats.companyStats && Object.keys(advancedStats.companyStats).length > 0 && (
                <div style={cardStyle}>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: colors.textPrimary, marginBottom: '1.5rem' }}>Top Companies Applied</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {Object.entries(advancedStats.companyStats)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([company, count], i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '13px', color: colors.textSecondary, width: '20px' }}>#{i + 1}</span>
                                    <span style={{ fontSize: '14px', color: colors.textPrimary, flex: 1 }}>{company}</span>
                                    <div style={{ width: '120px', height: '6px', backgroundColor: colors.border, borderRadius: '3px' }}>
                                        <div style={{ width: `${(count / Math.max(...Object.values(advancedStats.companyStats))) * 100}%`, height: '6px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: '3px' }} />
                                    </div>
                                    <span style={{ fontSize: '13px', color: colors.textMuted, width: '20px' }}>{count}</span>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Analytics;
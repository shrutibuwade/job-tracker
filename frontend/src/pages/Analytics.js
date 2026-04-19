import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { useTheme } from '../context/ThemeContext';
import { getDashboardStats, getAllJobs } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Analytics() {
    const { colors } = useTheme();
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }
        const user = JSON.parse(storedUser);
        fetchData(user.id);
    }, []);

    const fetchData = async (userId) => {
        try {
            const [statsRes, jobsRes] = await Promise.all([
                getDashboardStats(userId),
                getAllJobs(userId)
            ]);
            setStats(statsRes.data);
            setJobs(jobsRes.data);
        } catch (err) { console.error(err); }
    };

    const doughnutData = {
        labels: ['Applied', 'Interview', 'Offer', 'Rejected'],
        datasets: [{
            data: [
                stats.totalApplications || 0,
                stats.totalInterviews || 0,
                stats.totalOffers || 0,
                stats.totalRejected || 0
            ],
            backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'],
            borderWidth: 0
        }]
    };

    const monthlyData = () => {
        const months = {};
        jobs.forEach(job => {
            if (job.appliedDate) {
                const month = job.appliedDate.substring(0, 7);
                months[month] = (months[month] || 0) + 1;
            }
        });
        const sorted = Object.keys(months).sort();
        return {
            labels: sorted,
            datasets: [{
                label: 'Applications',
                data: sorted.map(m => months[m]),
                backgroundColor: 'rgba(124, 58, 237, 0.7)',
                borderRadius: 8
            }]
        };
    };

    const cardStyle = {
        backgroundColor: colors.bgCard,
        borderRadius: '16px',
        border: `1px solid ${colors.border}`,
        padding: '1.5rem'
    };

    return (
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.textPrimary, marginBottom: '4px' }}>Analytics</h1>
            <p style={{ color: colors.textSecondary, fontSize: '14px', marginBottom: '2rem' }}>Visual overview of your job search</p>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '2rem' }}>
                {[
                    { label: 'Total', value: stats.totalApplications || 0, color: '#7c3aed' },
                    { label: 'Interviews', value: stats.totalInterviews || 0, color: '#f59e0b' },
                    { label: 'Offers', value: stats.totalOffers || 0, color: '#10b981' },
                    { label: 'Rejected', value: stats.totalRejected || 0, color: '#ef4444' },
                ].map((s, i) => (
                    <div key={i} style={{ ...cardStyle, textAlign: 'center' }}>
                        <p style={{ fontSize: '32px', fontWeight: '700', color: s.color, margin: 0 }}>{s.value}</p>
                        <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '4px 0 0 0' }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                <div style={cardStyle}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary, marginBottom: '1.5rem' }}>Status Breakdown</h3>
                    <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom', labels: { color: colors.textSecondary, padding: 16 } } } }} />
                </div>
                <div style={cardStyle}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary, marginBottom: '1.5rem' }}>Applications Over Time</h3>
                    <Bar data={monthlyData()} options={{
                        plugins: { legend: { display: false } },
                        scales: {
                            x: { ticks: { color: colors.textSecondary }, grid: { color: colors.border } },
                            y: { ticks: { color: colors.textSecondary }, grid: { color: colors.border } }
                        }
                    }} />
                </div>
            </div>
        </div>
    );
}

export default Analytics;
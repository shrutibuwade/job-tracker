import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiPlus, FiCalendar, FiClock, FiBriefcase, FiTrash2, FiMail } from 'react-icons/fi';

function Interviews() {
    const { colors } = useTheme();
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        company: '', role: '', date: '',
        time: '', type: 'Technical', notes: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }
        const saved = localStorage.getItem('interviews');
        if (saved) setInterviews(JSON.parse(saved));
    }, []);

    const saveInterviews = (data) => {
        setInterviews(data);
        localStorage.setItem('interviews', JSON.stringify(data));
    };

    const handleAdd = (e) => {
        e.preventDefault();
        const newInterview = { ...formData, id: Date.now() };
        saveInterviews([...interviews, newInterview]);
        setFormData({ company: '', role: '', date: '', time: '', type: 'Technical', notes: '' });
        setShowForm(false);
    };

    const handleSendReminder = async (interview) => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
        const response = await fetch('http://localhost:8080/api/email/interview-reminder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                name: user.name,
                company: interview.company,
                role: interview.role,
                date: interview.date,
                time: interview.time,
                type: interview.type
            })
        });
        if (response.ok) {
            alert('Reminder email sent to ' + user.email + '!');
        } else {
            alert('Failed to send email!');
        }
    } catch (err) {
        alert('Failed to send email!');
    }
};

    const handleDelete = (id) => {
        if (window.confirm('Delete this interview?')) {
            saveInterviews(interviews.filter(i => i.id !== id));
        }
    };

    const typeColors = {
        'Technical': { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
        'HR': { color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
        'Managerial': { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
        'System Design': { color: '#7c3aed', bg: 'rgba(124,58,237,0.15)' }
    };

    const cardStyle = {
        backgroundColor: colors.bgCard,
        borderRadius: '16px',
        border: `1px solid ${colors.border}`,
        padding: '1.25rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.bgSecondary,
        color: colors.textPrimary,
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '13px',
        fontWeight: '500',
        color: colors.textSecondary,
        marginBottom: '6px'
    };

    const upcoming = interviews.filter(i => new Date(i.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
    const past = interviews.filter(i => new Date(i.date) < new Date()).sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>Interview Scheduler</h1>
                    <p style={{ color: colors.textSecondary, fontSize: '14px', margin: '4px 0 0 0' }}>Schedule and track your interviews</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                >
                    <FiPlus size={16} /> Schedule Interview
                </button>
            </div>

            {/* Add Form Modal */}
            {showForm && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div style={{ backgroundColor: colors.bgCard, borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '520px', border: `1px solid ${colors.border}` }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: colors.textPrimary, marginBottom: '1.5rem' }}>📅 Schedule Interview</h3>
                        <form onSubmit={handleAdd}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Company</label>
                                    <input style={inputStyle} type="text" placeholder="e.g. Google" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Role</label>
                                    <input style={inputStyle} type="text" placeholder="e.g. SDE-1" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Date</label>
                                    <input style={inputStyle} type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Time</label>
                                    <input style={inputStyle} type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Interview Type</label>
                                    <select style={inputStyle} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option>Technical</option>
                                        <option>HR</option>
                                        <option>Managerial</option>
                                        <option>System Design</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Notes</label>
                                    <input style={inputStyle} type="text" placeholder="Any notes..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                                    Schedule
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', backgroundColor: colors.bgSecondary, color: colors.textSecondary, border: `1px solid ${colors.border}`, borderRadius: '10px', fontSize: '15px', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Upcoming Interviews */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary, marginBottom: '1rem' }}>
                    🔔 Upcoming ({upcoming.length})
                </h2>
                {upcoming.length === 0 ? (
                    <div style={{ backgroundColor: colors.bgCard, padding: '2rem', borderRadius: '16px', border: `1px solid ${colors.border}`, textAlign: 'center' }}>
                        <FiCalendar size={32} color={colors.textMuted} />
                        <p style={{ color: colors.textSecondary, margin: '12px 0 0 0' }}>No upcoming interviews scheduled</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {upcoming.map(interview => (
                            <div key={interview.id} style={cardStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FiBriefcase size={20} color="white" />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary, margin: 0 }}>{interview.company}</h3>
                                        <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '2px 0' }}>{interview.role}</p>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <span style={{ fontSize: '12px', color: colors.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <FiCalendar size={12} /> {interview.date}
                                            </span>
                                            <span style={{ fontSize: '12px', color: colors.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <FiClock size={12} /> {interview.time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: typeColors[interview.type]?.color, backgroundColor: typeColors[interview.type]?.bg }}>
                                        {interview.type}
                                    </span>
                                    <button onClick={() => handleSendReminder(interview)} style={{ padding: '6px 12px', backgroundColor: 'rgba(124,58,237,0.1)', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
    <FiMail size={14} /> Remind
</button>
<button onClick={() => handleDelete(interview.id)} style={{ padding: '6px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
    <FiTrash2 size={14} />
</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Past Interviews */}
            {past.length > 0 && (
                <div>
                    <h2 style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary, marginBottom: '1rem' }}>
                        ✅ Past ({past.length})
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {past.map(interview => (
                            <div key={interview.id} style={{ ...cardStyle, opacity: 0.6 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '15px', fontWeight: '600', color: colors.textPrimary, margin: 0 }}>{interview.company}</h3>
                                        <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '2px 0 0 0' }}>{interview.role} • {interview.date} • {interview.time}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: typeColors[interview.type]?.color, backgroundColor: typeColors[interview.type]?.bg }}>
                                        {interview.type}
                                    </span>
                                    <button onClick={() => handleDelete(interview.id)} style={{ padding: '6px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Interviews;
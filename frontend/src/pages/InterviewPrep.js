import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const API = 'https://job-tracker-production-ae77.up.railway.app/api';

function InterviewPrep() {
    const { colors } = useTheme();
    const navigate = useNavigate();
    const [role, setRole] = useState('Software Engineer');
    const [company, setCompany] = useState('');
    const [level, setLevel] = useState('Fresher');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }
    }, []);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API}/ai/interview-prep`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, company, level })
            });
            const data = await response.json();
            setQuestions(data.questions);
            setActiveCategory('All');
        } catch (err) {
            alert('Failed to generate questions!');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', 'DSA', 'Java', 'Spring Boot', 'HR'];

    const filteredQuestions = activeCategory === 'All'
        ? questions
        : questions.filter(q => q.category === activeCategory);

    const categoryColors = {
        'DSA': { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
        'Java': { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
        'Spring Boot': { color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
        'HR': { color: '#7c3aed', bg: 'rgba(124,58,237,0.15)' }
    };

    const inputStyle = {
        width: '100%', padding: '11px 14px', borderRadius: '10px',
        border: `1px solid ${colors.border}`, backgroundColor: colors.bgSecondary,
        color: colors.textPrimary, fontSize: '14px', outline: 'none', boxSizing: 'border-box'
    };

    const cardStyle = {
        backgroundColor: colors.bgCard, borderRadius: '16px',
        border: `1px solid ${colors.border}`, padding: '1.5rem', marginBottom: '1rem'
    };

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>
                    AI Interview Prep 🎯
                </h1>
                <p style={{ color: colors.textSecondary, fontSize: '14px', margin: '4px 0 0 0' }}>
                    Practice interview questions tailored to your role
                </p>
            </div>

            {/* Input Section */}
            <div style={cardStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '6px' }}>Target Role</label>
                        <input style={inputStyle} type="text" placeholder="e.g. Software Engineer" value={role} onChange={e => setRole(e.target.value)} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '6px' }}>Company (optional)</label>
                        <input style={inputStyle} type="text" placeholder="e.g. Google, Amazon" value={company} onChange={e => setCompany(e.target.value)} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '6px' }}>Experience Level</label>
                        <select style={inputStyle} value={level} onChange={e => setLevel(e.target.value)}>
                            <option>Fresher</option>
                            <option>0-1 years</option>
                            <option>1-3 years</option>
                            <option>3-5 years</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    style={{
                        width: '100%', padding: '12px',
                        background: loading ? colors.border : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                        color: 'white', border: 'none', borderRadius: '10px',
                        fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? '🤖 Generating Questions...' : '🎯 Generate Interview Questions'}
                </button>
            </div>

            {/* Questions */}
            {questions.length > 0 && (
                <div>
                    {/* Category Filter */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500',
                                    cursor: 'pointer', border: 'none',
                                    backgroundColor: activeCategory === cat ? '#7c3aed' : colors.bgCard,
                                    color: activeCategory === cat ? 'white' : colors.textSecondary,
                                    border: `1px solid ${activeCategory === cat ? '#7c3aed' : colors.border}`
                                }}
                            >
                                {cat} {cat !== 'All' && `(${questions.filter(q => q.category === cat).length})`}
                            </button>
                        ))}
                    </div>

                    {/* Question Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {filteredQuestions.map((q, i) => (
                            <div key={i} style={{
                                backgroundColor: colors.bgCard, borderRadius: '12px',
                                border: `1px solid ${colors.border}`, overflow: 'hidden'
                            }}>
                                <div
                                    onClick={() => setExpandedId(expandedId === i ? null : i)}
                                    style={{
                                        padding: '1rem 1.25rem', display: 'flex',
                                        justifyContent: 'space-between', alignItems: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                                            fontWeight: '600', whiteSpace: 'nowrap',
                                            color: categoryColors[q.category]?.color,
                                            backgroundColor: categoryColors[q.category]?.bg
                                        }}>
                                            {q.category}
                                        </span>
                                        <p style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500', margin: 0 }}>
                                            {q.question}
                                        </p>
                                    </div>
                                    <span style={{ color: colors.textMuted, flexShrink: 0, marginLeft: '12px' }}>
                                        {expandedId === i ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                                    </span>
                                </div>
                                {expandedId === i && (
                                    <div style={{
                                        padding: '1rem 1.25rem', borderTop: `1px solid ${colors.border}`,
                                        backgroundColor: colors.bgSecondary
                                    }}>
                                        <p style={{ color: colors.textSecondary, fontSize: '14px', margin: 0, lineHeight: 1.7 }}>
                                            💡 {q.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default InterviewPrep;
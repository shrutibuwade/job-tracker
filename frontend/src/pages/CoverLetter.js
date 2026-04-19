import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiCopy, FiDownload, FiFileText, FiUser, FiAlertCircle } from 'react-icons/fi';

const API = 'http://localhost:8080/api';

function CoverLetter() {
    const { colors } = useTheme();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [skills, setSkills] = useState([]);
    const [education, setEducation] = useState([]);
    const [company, setCompany] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [tone, setTone] = useState('Professional');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchProfileData(parsedUser.id);
    }, []);

    const fetchProfileData = async (userId) => {
        try {
            const [basicRes, skillsRes, eduRes] = await Promise.all([
                fetch(`${API}/user-profile/${userId}`),
                fetch(`${API}/profile/${userId}/skills`),
                fetch(`${API}/profile/${userId}/education`)
            ]);
            const basicData = await basicRes.json();
            const skillsData = await skillsRes.json();
            const eduData = await eduRes.json();
            if (basicData?.id) setProfile(basicData);
            setSkills(skillsData);
            setEducation(eduData);
        } catch (err) { console.error(err); }
    };

    const handleGenerate = async () => {
        if (!company) { alert('Please enter company name!'); return; }
        setLoading(true);
        try {
            const skillNames = skills.map(s => s.name).join(', ');
            const edu = education[0];
            const response = await fetch(`${API}/ai/cover-letter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: user?.name,
                    skills: skillNames || profile?.skills || '',
                    bio: profile?.bio || '',
                    degree: edu?.degree || profile?.degree || '',
                    college: edu?.college || profile?.college || '',
                    targetRole: profile?.targetRole || 'Software Engineer',
                    jobDescription: jobDescription,
                    company: company,
                    experienceLevel: profile?.experienceLevel || 'Fresher',
                    tone: tone
                })
            });
            const data = await response.json();
            setCoverLetter(data.coverLetter);
        } catch (err) {
            alert('Failed to generate cover letter!');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(coverLetter);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const handleDownload = () => {
        const blob = new Blob([coverLetter], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Cover_Letter_${company}.txt`;
        a.click();
        URL.revokeObjectURL(url);
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

    const profileComplete = profile && skills.length > 0 && education.length > 0;

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>
                    Cover Letter Generator ✉️
                </h1>
                <p style={{ color: colors.textSecondary, fontSize: '14px', margin: '4px 0 0 0' }}>
                    Generate personalized cover letters using your profile data
                </p>
            </div>

            {/* Profile Status Banner */}
            <div style={{
                ...cardStyle,
                background: profileComplete
                    ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))'
                    : 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))',
                border: `1px solid ${profileComplete ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {profileComplete
                        ? <FiUser size={20} color="#10b981" />
                        : <FiAlertCircle size={20} color="#f59e0b" />
                    }
                    <div>
                        <p style={{ color: colors.textPrimary, fontWeight: '600', margin: 0, fontSize: '14px' }}>
                            {profileComplete ? '✅ Profile data loaded!' : '⚠️ Complete your profile for better results!'}
                        </p>
                        <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '2px 0 0 0' }}>
                            {profileComplete
                                ? `Skills: ${skills.slice(0, 4).map(s => s.name).join(', ')}... • ${education[0]?.degree} from ${education[0]?.college}`
                                : <span onClick={() => navigate('/profile')} style={{ color: '#f59e0b', cursor: 'pointer', textDecoration: 'underline' }}>Click here to complete profile →</span>
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Job Details */}
            <div style={cardStyle}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiFileText size={18} color="#7c3aed" /> Job Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '6px' }}>Company Name *</label>
                        <input style={inputStyle} type="text" placeholder="e.g. Google, Microsoft" value={company} onChange={e => setCompany(e.target.value)} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '6px' }}>Tone</label>
                        <select style={inputStyle} value={tone} onChange={e => setTone(e.target.value)}>
                            <option>Professional</option>
                            <option>Enthusiastic</option>
                            <option>Formal</option>
                            <option>Friendly</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '6px' }}>Job Description (recommended)</label>
                    <textarea
                        style={{ ...inputStyle, height: '120px', resize: 'vertical' }}
                        placeholder="Paste the job description for a more tailored letter..."
                        value={jobDescription}
                        onChange={e => setJobDescription(e.target.value)}
                    />
                </div>
            </div>

            {/* Generate Button */}
            <button
                onClick={handleGenerate}
                disabled={loading}
                style={{
                    width: '100%', padding: '14px',
                    background: loading ? colors.border : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    color: 'white', border: 'none', borderRadius: '12px',
                    fontSize: '16px', fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginBottom: '1.5rem'
                }}
            >
                {loading ? '✍️ Generating...' : '✉️ Generate Cover Letter'}
            </button>

            {/* Result */}
            {coverLetter && (
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary, margin: 0 }}>
                            Your Cover Letter 🎉
                        </h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: copied ? 'rgba(16,185,129,0.1)' : 'rgba(124,58,237,0.1)', color: copied ? '#10b981' : '#7c3aed', border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(124,58,237,0.3)'}`, borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>
                                <FiCopy size={14} /> {copied ? 'Copied!' : 'Copy'}
                            </button>
                            <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>
                                <FiDownload size={14} /> Download
                            </button>
                        </div>
                    </div>
                    <textarea
                        style={{ ...inputStyle, height: '450px', resize: 'vertical', lineHeight: '1.8', fontFamily: 'Georgia, serif', fontSize: '14px' }}
                        value={coverLetter}
                        onChange={e => setCoverLetter(e.target.value)}
                    />
                    <p style={{ color: colors.textMuted, fontSize: '12px', margin: '8px 0 0 0' }}>
                        💡 You can edit the letter directly before copying or downloading!
                    </p>
                </div>
            )}
        </div>
    );
}

export default CoverLetter;
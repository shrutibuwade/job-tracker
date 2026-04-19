import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiUpload, FiFileText, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';

import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

function ResumeMatcher() {
    const { colors } = useTheme();
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState('');

    const extractTextFromPDF = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ') + '\n';
        }
        return text;
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFileName(file.name);
        try {
            const text = await extractTextFromPDF(file);
            setResumeText(text);
        } catch (err) {
            alert('Error reading PDF. Please try again!');
        }
    };

    const handleMatch = async () => {
        if (!resumeText || !jobDescription) {
            alert('Please upload resume and paste job description!');
            return;
        }
        setLoading(true);
        setResult(null);
        try {const response = await fetch('http://localhost:8080/api/ai/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        resume: resumeText.substring(0, 2000),
        jobDescription: jobDescription.substring(0, 1000)
    })
});
const data = await response.json();
setResult(data);} catch (err) {
            alert('AI analysis failed. Please try again!');
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 70) return '#10b981';
        if (score >= 40) return '#f59e0b';
        return '#ef4444';
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
        boxSizing: 'border-box',
        resize: 'vertical'
    };

    const cardStyle = {
        backgroundColor: colors.bgCard,
        borderRadius: '16px',
        border: `1px solid ${colors.border}`,
        padding: '1.5rem'
    };

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>
                    Resume Matcher AI 🔥
                </h1>
                <p style={{ color: colors.textSecondary, fontSize: '14px', margin: '4px 0 0 0' }}>
                    Upload your resume and paste job description to see your match score
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                {/* Resume Upload */}
                <div style={cardStyle}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiFileText size={18} color="#7c3aed" /> Your Resume
                    </h3>
                    <label style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        borderRadius: '12px',
                        border: `2px dashed ${colors.border}`,
                        cursor: 'pointer',
                        marginBottom: '1rem',
                        backgroundColor: colors.bgSecondary
                    }}>
                        <FiUpload size={32} color="#7c3aed" style={{ marginBottom: '8px' }} />
                        <p style={{ color: colors.textPrimary, fontWeight: '500', margin: 0 }}>
                            {fileName || 'Click to upload PDF'}
                        </p>
                        <p style={{ color: colors.textMuted, fontSize: '12px', margin: '4px 0 0 0' }}>PDF files only</p>
                        <input type="file" accept=".pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
                    </label>
                    {resumeText && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '13px' }}>
                            <FiCheckCircle size={16} /> Resume loaded successfully!
                        </div>
                    )}
                </div>

                {/* Job Description */}
                <div style={cardStyle}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiFileText size={18} color="#4f46e5" /> Job Description
                    </h3>
                    <textarea
                        style={{ ...inputStyle, height: '180px' }}
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                </div>
            </div>

            {/* Analyze Button */}
            <button
                onClick={handleMatch}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: loading ? colors.border : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginBottom: '1.5rem'
                }}
            >
                {loading ? '🤖 Analyzing with AI...' : '🚀 Analyze Match'}
            </button>

            {/* Results */}
            {result && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Score */}
                    <div style={{ ...cardStyle, textAlign: 'center' }}>
                        <p style={{ color: colors.textSecondary, fontSize: '14px', margin: '0 0 8px 0' }}>Match Score</p>
                        <p style={{ fontSize: '64px', fontWeight: '800', color: getScoreColor(result.matchScore), margin: 0, lineHeight: 1 }}>
                            {result.matchScore}%
                        </p>
                        <p style={{ color: colors.textSecondary, fontSize: '14px', margin: '12px 0 0 0' }}>{result.summary}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {/* Matching Skills */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#10b981', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiCheckCircle size={16} /> Matching Skills
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {result.matchingSkills.map((skill, i) => (
                                    <span key={i} style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', color: '#10b981', backgroundColor: 'rgba(16,185,129,0.15)' }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Missing Skills */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiXCircle size={16} /> Missing Skills
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {result.missingSkills.map((skill, i) => (
                                    <span key={i} style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.15)' }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: '15px', fontWeight: '600', color: colors.textPrimary, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiAlertCircle size={16} color="#f59e0b" /> Suggestions to Improve
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {result.suggestions.map((s, i) => (
                                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'white', flexShrink: 0 }}>
                                        {i + 1}
                                    </span>
                                    <p style={{ color: colors.textSecondary, fontSize: '14px', margin: 0, lineHeight: 1.6 }}>{s}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResumeMatcher;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiBriefcase, FiTrendingUp, FiAward, FiXCircle,  FiFileText, FiX, FiBell } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { getAllJobs, addJob, updateJob, deleteJob, filterByStatus, searchByCompany, getDashboardStats } from '../services/api';

function Dashboard() {
    const navigate = useNavigate();
    const { colors } = useTheme();
    const [user, setUser] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [notes, setNotes] = useState([]);
    const [noteForm, setNoteForm] = useState({ note: '', reminderDate: '', reminderTime: '' });
    const [toast, setToast] = useState('');
    const [editJob, setEditJob] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [formData, setFormData] = useState({
    jobTitle: '', companyName: '',
    status: 'Applied', notes: '',
    appliedDate: '', jobUrl: '',
    jobDescription: ''
});

    const [jobUrl, setJobUrl] = useState('');
const [fetchingUrl, setFetchingUrl] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchJobs(parsedUser.id);
        fetchStats(parsedUser.id);
    }, []);

    const fetchJobs = async (userId) => {
        try {
            const response = await getAllJobs(userId);
            setJobs(response.data);
        } catch (err) { console.error(err); }
    };

    const fetchStats = async (userId) => {
        try {
            const response = await getDashboardStats(userId);
            setStats(response.data);
        } catch (err) { console.error(err); }
    };

    const handleFetchJob = async () => {
    if (!jobUrl) { alert('Please enter a job URL!'); return; }
    setFetchingUrl(true);
    try {
        const response = await fetch('http://localhost:8080/api/fetch/job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: jobUrl })
        });
        const data = await response.json();
        if (data.success === 'true') {
           let cleanTitle = data.jobTitle;
if (cleanTitle.includes(' hiring ')) {
    cleanTitle = cleanTitle.split(' hiring ')[1].split(' in ')[0].trim();
} else if (cleanTitle.includes(' - ')) {
    cleanTitle = cleanTitle.split(' - ')[0].trim();
}
setFormData({
    ...formData,
    jobTitle: cleanTitle,
    companyName: data.companyName,
    notes: data.description,
    jobUrl: jobUrl
});
            alert('Job details fetched successfully!');
        } else {
            alert('Could not fetch job details. Please fill manually!');
        }
    } catch (err) {
        alert('Failed to fetch job details!');
    } finally {
        setFetchingUrl(false);
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting formData:', formData);
        try {
            if (editJob) {
                await updateJob(editJob.id, formData);
            } else {
                await addJob(user.id, formData);
            }
            setShowForm(false);
            setEditJob(null);
            setFormData({ jobTitle: '', companyName: '', status: 'Applied', notes: '', appliedDate: '', jobUrl: '', jobDescription: '' });
            if (editJob && formData.status !== editJob.status) {
    await fetch('http://localhost:8080/api/email/application-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: user.email,
            name: user.name,
            company: formData.companyName,
            role: formData.jobTitle,
            status: formData.status
        })
    });
}
            fetchJobs(user.id);
            fetchStats(user.id);
        } catch (err) { 
    console.log('Error:', err.response?.data);
    console.log('Error status:', err.response?.status);
    alert('Something went wrong: ' + JSON.stringify(err.response?.data)); 
}
    };

    const handleEdit = (job) => {
        setEditJob(job);
        setFormData({
            jobTitle: job.jobTitle,
            companyName: job.companyName,
            status: job.status,
            notes: job.notes,
            appliedDate: job.appliedDate
        });
        setShowForm(true);
    };

    const handleDelete = async (jobId) => {
        if (window.confirm('Are you sure?')) {
            await deleteJob(jobId);
            fetchJobs(user.id);
            fetchStats(user.id);
        }
    };

    const handleFilter = async (status) => {
        setStatusFilter(status);
        if (status === '') { fetchJobs(user.id); }
        else {
            const response = await filterByStatus(user.id, status);
            setJobs(response.data);
        }
    };
    const handleOpenNotes = async (job) => {
    setSelectedJob(job);
    setShowNotes(true);
    try {
        const response = await fetch(`http://localhost:8080/api/notes/${job.id}`);
        const data = await response.json();
        setNotes(data);
    } catch (err) { console.error(err); }
};

const handleAddNote = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`http://localhost:8080/api/notes/${selectedJob.id}/${user.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noteForm)
        });
        const saved = await response.json();
        setNotes([...notes, saved]);
        setNoteForm({ note: '', reminderDate: '', reminderTime: '' });
        setShowNotes(false);
        // Show success toast
        setToast('Note added successfully! 📝');
        setTimeout(() => setToast(''), 3000);
    } catch (err) { alert('Failed to add note!'); }
};

const handleDeleteNote = async (noteId) => {
    await fetch(`http://localhost:8080/api/notes/${noteId}`, { method: 'DELETE' });
    setNotes(notes.filter(n => n.id !== noteId));
};

const handleNoteReminder = async (note) => {
    try {
        await fetch('http://localhost:8080/api/email/interview-reminder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                name: user.name,
                company: selectedJob.companyName,
                role: selectedJob.jobTitle,
                date: note.reminderDate,
                time: note.reminderTime,
                type: 'Reminder'
            })
        });
        alert('Reminder email sent! 📧');
    } catch (err) { alert('Failed to send reminder!'); }
};

    const handleSearch = async (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value === '') { fetchJobs(user.id); }
        else {
            const response = await searchByCompany(user.id, e.target.value);
            setJobs(response.data);
        }
    };

    const statusConfig = {
        'Applied': { color: colors.accentBlue, bg: 'rgba(59, 130, 246, 0.15)' },
        'Interview': { color: colors.accentYellow, bg: 'rgba(245, 158, 11, 0.15)' },
        'Offer': { color: colors.accentGreen, bg: 'rgba(16, 185, 129, 0.15)' },
        'Rejected': { color: colors.accentRed, bg: 'rgba(239, 68, 68, 0.15)' }
    };

    const statCards = [
        { label: 'Total Applications', value: stats.totalApplications || 0, icon: <FiBriefcase size={20} />, color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.15)' },
        { label: 'Interviews', value: stats.totalInterviews || 0, icon: <FiTrendingUp size={20} />, color: colors.accentYellow, bg: 'rgba(245, 158, 11, 0.15)' },
        { label: 'Offers', value: stats.totalOffers || 0, icon: <FiAward size={20} />, color: colors.accentGreen, bg: 'rgba(16, 185, 129, 0.15)' },
        { label: 'Rejected', value: stats.totalRejected || 0, icon: <FiXCircle size={20} />, color: colors.accentRed, bg: 'rgba(239, 68, 68, 0.15)' }
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: colors.bgPrimary, transition: 'all 0.3s ease' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>
                    Dashboard
                </h1>
                <p style={{ color: colors.textSecondary, margin: '4px 0 0 0', fontSize: '14px' }}>
                    Track and manage your job applications
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '2rem' }}>
                {statCards.map((stat, i) => (
                    <div key={i} style={{
                        backgroundColor: colors.bgCard,
                        padding: '1.25rem',
                        borderRadius: '16px',
                        border: `1px solid ${colors.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: stat.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: stat.color,
                            flexShrink: 0
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: '28px', fontWeight: '700', color: colors.textPrimary, margin: 0, lineHeight: 1 }}>{stat.value}</p>
                            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '4px 0 0 0' }}>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                    <FiSearch size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
                    <input
                        style={{
                            width: '100%',
                            padding: '10px 14px 10px 36px',
                            borderRadius: '10px',
                            border: `1px solid ${colors.border}`,
                            backgroundColor: colors.bgCard,
                            color: colors.textPrimary,
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                        type="text"
                        placeholder="Search by company..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div style={{ position: 'relative' }}>
                    <FiFilter size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
                    <select
                        style={{
                            padding: '10px 14px 10px 36px',
                            borderRadius: '10px',
                            border: `1px solid ${colors.border}`,
                            backgroundColor: colors.bgCard,
                            color: colors.textPrimary,
                            fontSize: '14px',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                        value={statusFilter}
                        onChange={(e) => handleFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <button
                    onClick={() => { setShowForm(true); setEditJob(null); setFormData({ jobTitle: '', companyName: '', status: 'Applied', notes: '', appliedDate: '', jobUrl: '', jobDescription: '' }); }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    <FiPlus size={16} /> Add Job
                </button>
            </div>

            {/* Job Form Modal */}
            {showForm && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div style={{
                        backgroundColor: colors.bgCard,
                        borderRadius: '20px',
                        padding: '2rem',
                        width: '100%',
                        maxWidth: '560px',
                        border: `1px solid ${colors.border}`,
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: colors.textPrimary, marginBottom: '1.5rem' }}>
                            {editJob ? '✏️ Edit Job' : '➕ Add New Job'}
                        </h3>
                        {!editJob && (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        <input
            style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: `1px solid ${colors.border}`, backgroundColor: colors.bgSecondary, color: colors.textPrimary, fontSize: '14px', outline: 'none' }}
            type="text"
            placeholder="Paste job URL to auto-fill (LinkedIn, Naukri, Indeed)..."
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
        />
        <button
            type="button"
            onClick={handleFetchJob}
            disabled={fetchingUrl}
            style={{ padding: '10px 16px', background: fetchingUrl ? colors.border : 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: fetchingUrl ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
        >
            {fetchingUrl ? '⏳ Fetching...' : '🔗 Auto Fill'}
        </button>
    </div>
)}
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                {[
                                    { label: 'Job Title', key: 'jobTitle', type: 'text', placeholder: 'e.g. Software Engineer' },
                                    { label: 'Company Name', key: 'companyName', type: 'text', placeholder: 'e.g. Google' },
                                ].map(field => (
                                    <div key={field.key}>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '6px' }}>{field.label}</label>
                                        <input
                                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${colors.border}`, backgroundColor: colors.bgSecondary, color: colors.textPrimary, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            value={formData[field.key]}
                                            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                            required
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '6px' }}>Status</label>
                                    <select
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${colors.border}`, backgroundColor: colors.bgSecondary, color: colors.textPrimary, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option>Applied</option>
                                        <option>Interview</option>
                                        <option>Offer</option>
                                        <option>Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '6px' }}>Applied Date</label>
                                    <input
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${colors.border}`, backgroundColor: colors.bgSecondary, color: colors.textPrimary, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                        type="date"
                                        value={formData.appliedDate}
                                        onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                        <div style={{ marginTop: '16px' }}>
    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '6px' }}>Notes</label>
    <textarea
        style={{ height: '80px', width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${colors.border}`, backgroundColor: colors.bgSecondary, color: colors.textPrimary, fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
        placeholder="Any notes about this application..."
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
    />
</div>
<div style={{ marginTop: '16px' }}>
    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '6px' }}>Job Description (paste for Resume Matcher)</label>
    <textarea
        style={{ height: '80px', width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${colors.border}`, backgroundColor: colors.bgSecondary, color: colors.textPrimary, fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
        placeholder="Paste full job description here..."
        value={formData.jobDescription || ''}
        onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
    />
</div>
                            
                            <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                                    {editJob ? 'Update Job' : 'Add Job'}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); setEditJob(null); }} style={{ flex: 1, padding: '12px', backgroundColor: colors.bgSecondary, color: colors.textSecondary, border: `1px solid ${colors.border}`, borderRadius: '10px', fontSize: '15px', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Notes Modal */}
{showNotes && selectedJob && (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
        <div style={{ backgroundColor: colors.bgCard, borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '560px', border: `1px solid ${colors.border}`, maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>📝 Notes</h3>
                    <p style={{ color: colors.textSecondary, fontSize: '13px', margin: '4px 0 0 0' }}>{selectedJob.jobTitle} at {selectedJob.companyName}</p>
                </div>
                <button onClick={() => setShowNotes(false)} style={{ padding: '6px', backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}`, borderRadius: '8px', cursor: 'pointer', color: colors.textSecondary, display: 'flex', alignItems: 'center' }}>
                    <FiX size={16} />
                </button>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} style={{ marginBottom: '1.5rem' }}>
                <textarea
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${colors.border}`, backgroundColor: colors.bgSecondary, color: colors.textPrimary, fontSize: '14px', outline: 'none', boxSizing: 'border-box', height: '80px', resize: 'vertical', marginBottom: '12px' }}
                    placeholder="Add a note about this job application..."
                    value={noteForm.note}
                    onChange={e => setNoteForm({ ...noteForm, note: e.target.value })}
                    required
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>Reminder Date (optional)</label>
                        <input
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${colors.border}`, backgroundColor: colors.bgSecondary, color: colors.textPrimary, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                            type="date"
                            value={noteForm.reminderDate}
                            onChange={e => setNoteForm({ ...noteForm, reminderDate: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>Reminder Time (optional)</label>
                        <input
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${colors.border}`, backgroundColor: colors.bgSecondary, color: colors.textPrimary, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                            type="time"
                            value={noteForm.reminderTime}
                            onChange={e => setNoteForm({ ...noteForm, reminderTime: e.target.value })}
                        />
                    </div>
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    Add Note
                </button>
            </form>

            {/* Notes List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notes.length === 0 ? (
                    <p style={{ color: colors.textMuted, textAlign: 'center', fontSize: '14px', padding: '1rem' }}>No notes yet. Add your first note above!</p>
                ) : (
                    notes.map(note => (
                        <div key={note.id} style={{ backgroundColor: colors.bgSecondary, padding: '1rem', borderRadius: '12px', border: `1px solid ${colors.border}` }}>
                            <p style={{ color: colors.textPrimary, fontSize: '14px', margin: '0 0 8px 0', lineHeight: 1.6 }}>{note.note}</p>
                            {note.reminderDate && (
                                <p style={{ color: colors.textMuted, fontSize: '12px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    🔔 Reminder: {note.reminderDate} {note.reminderTime && `at ${note.reminderTime}`}
                                </p>
                            )}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {note.reminderDate && (
                                    <button onClick={() => handleNoteReminder(note)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', backgroundColor: 'rgba(124,58,237,0.1)', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                                        <FiBell size={12} /> Send Reminder
                                    </button>
                                )}
                                <button onClick={() => handleDeleteNote(note.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                                    <FiTrash2 size={12} /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
)}

            {/* Job List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {jobs.length === 0 ? (
                    <div style={{ backgroundColor: colors.bgCard, padding: '4rem', borderRadius: '16px', textAlign: 'center', border: `1px solid ${colors.border}` }}>
                        <FiBriefcase size={48} color={colors.textMuted} style={{ marginBottom: '1rem' }} />
                        <p style={{ color: colors.textSecondary, fontSize: '16px', margin: 0 }}>No job applications yet.</p>
                        <p style={{ color: colors.textMuted, fontSize: '14px', margin: '8px 0 0 0' }}>Click "+ Add Job" to get started!</p>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <div key={job.id} style={{
                            backgroundColor: colors.bgCard,
                            padding: '1.25rem 1.5rem',
                            borderRadius: '16px',
                            border: `1px solid ${colors.border}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.2s ease'
                        }}>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary, margin: '0 0 4px 0' }}>{job.jobTitle}</h3>
                                <p style={{ fontSize: '14px', color: '#7c3aed', margin: '0 0 4px 0', fontWeight: '500' }}>{job.companyName}</p>
                                <p style={{ fontSize: '12px', color: colors.textMuted, margin: 0 }}>Applied: {job.appliedDate}</p>
                                {job.notes && <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '6px 0 0 0' }}>{job.notes}</p>}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                <span style={{
                                    padding: '4px 14px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: statusConfig[job.status]?.color,
                                    backgroundColor: statusConfig[job.status]?.bg
                                }}>
                                    {job.status}
                                </span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => handleOpenNotes(job)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>
    <FiFileText size={13} /> Notes
</button>
                                    <button onClick={() => handleEdit(job)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', border: '1px solid rgba(124, 58, 237, 0.3)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>
                                        <FiEdit2 size={13} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(job.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>
                                        <FiTrash2 size={13} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* Toast Notification */}
        {toast && (
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                backgroundColor: '#10b981',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                zIndex: 9999,
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                ✅ {toast}
            </div>
        )}
        </div>
    );
}
export default Dashboard;
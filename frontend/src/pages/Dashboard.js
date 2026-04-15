import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAllJobs, addJob, updateJob,
    deleteJob, filterByStatus,
    searchByCompany, getDashboardStats
} from '../services/api';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [editJob, setEditJob] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [formData, setFormData] = useState({
        jobTitle: '', companyName: '',
        status: 'Applied', notes: '', appliedDate: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchJobs(parsedUser.id);
        fetchStats(parsedUser.id);
    }, []);

    const fetchJobs = async (userId) => {
        try {
            const response = await getAllJobs(userId);
            setJobs(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStats = async (userId) => {
        try {
            const response = await getDashboardStats(userId);
            setStats(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editJob) {
                await updateJob(editJob.id, formData);
            } else {
                await addJob(user.id, formData);
            }
            setShowForm(false);
            setEditJob(null);
            setFormData({ jobTitle: '', companyName: '', status: 'Applied', notes: '', appliedDate: '' });
            fetchJobs(user.id);
            fetchStats(user.id);
        } catch (err) {
            alert('Something went wrong!');
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
        if (window.confirm('Are you sure you want to delete this job?')) {
            await deleteJob(jobId);
            fetchJobs(user.id);
            fetchStats(user.id);
        }
    };

    const handleFilter = async (status) => {
        setStatusFilter(status);
        if (status === '') {
            fetchJobs(user.id);
        } else {
            const response = await filterByStatus(user.id, status);
            setJobs(response.data);
        }
    };

    const handleSearch = async (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value === '') {
            fetchJobs(user.id);
        } else {
            const response = await searchByCompany(user.id, e.target.value);
            setJobs(response.data);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const statusColors = {
        'Applied': '#3b82f6',
        'Interview': '#f59e0b',
        'Offer': '#10b981',
        'Rejected': '#ef4444'
    };

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <div style={styles.navbar}>
                <h2 style={styles.logo}>Job Tracker</h2>
                <div style={styles.navRight}>
                    <span style={styles.navUser}>👋 {user?.name}</span>
                    <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div style={styles.content}>
                {/* Stats Cards */}
                <div style={styles.statsGrid}>
                    {[
                        { label: 'Total Applications', value: stats.totalApplications, color: '#4f46e5' },
                        { label: 'Interviews', value: stats.totalInterviews, color: '#f59e0b' },
                        { label: 'Offers', value: stats.totalOffers, color: '#10b981' },
                        { label: 'Rejected', value: stats.totalRejected, color: '#ef4444' }
                    ].map((stat, i) => (
                        <div key={i} style={styles.statCard}>
                            <p style={styles.statLabel}>{stat.label}</p>
                            <p style={{ ...styles.statValue, color: stat.color }}>{stat.value || 0}</p>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div style={styles.controls}>
                    <input
                        style={styles.searchInput}
                        type="text"
                        placeholder="Search by company..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <select
                        style={styles.filterSelect}
                        value={statusFilter}
                        onChange={(e) => handleFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <button style={styles.addBtn} onClick={() => { setShowForm(true); setEditJob(null); setFormData({ jobTitle: '', companyName: '', status: 'Applied', notes: '', appliedDate: '' }); }}>
                        + Add Job
                    </button>
                </div>

                {/* Job Form */}
                {showForm && (
                    <div style={styles.formCard}>
                        <h3 style={styles.formTitle}>{editJob ? 'Edit Job' : 'Add New Job'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGrid}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Job Title</label>
                                    <input style={styles.input} type="text" placeholder="e.g. Software Engineer" value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} required />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Company Name</label>
                                    <input style={styles.input} type="text" placeholder="e.g. Google" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} required />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Status</label>
                                    <select style={styles.input} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                        <option>Applied</option>
                                        <option>Interview</option>
                                        <option>Offer</option>
                                        <option>Rejected</option>
                                    </select>
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Applied Date</label>
                                    <input style={styles.input} type="date" value={formData.appliedDate} onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })} required />
                                </div>
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Notes</label>
                                <textarea style={{ ...styles.input, height: '80px' }} placeholder="Any notes..." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                            </div>
                            <div style={styles.formButtons}>
                                <button type="submit" style={styles.submitBtn}>{editJob ? 'Update Job' : 'Add Job'}</button>
                                <button type="button" style={styles.cancelBtn} onClick={() => { setShowForm(false); setEditJob(null); }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Job List */}
                <div style={styles.jobList}>
                    {jobs.length === 0 ? (
                        <div style={styles.emptyState}>
                            <p>No job applications yet. Click "+ Add Job" to get started!</p>
                        </div>
                    ) : (
                        jobs.map((job) => (
                            <div key={job.id} style={styles.jobCard}>
                                <div style={styles.jobLeft}>
                                    <h3 style={styles.jobTitle}>{job.jobTitle}</h3>
                                    <p style={styles.jobCompany}>{job.companyName}</p>
                                    <p style={styles.jobDate}>Applied: {job.appliedDate}</p>
                                    {job.notes && <p style={styles.jobNotes}>{job.notes}</p>}
                                </div>
                                <div style={styles.jobRight}>
                                    <span style={{ ...styles.statusBadge, backgroundColor: statusColors[job.status] }}>
                                        {job.status}
                                    </span>
                                    <div style={styles.jobActions}>
                                        <button style={styles.editBtn} onClick={() => handleEdit(job)}>Edit</button>
                                        <button style={styles.deleteBtn} onClick={() => handleDelete(job.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'sans-serif' },
    navbar: { backgroundColor: '#4f46e5', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logo: { color: 'white', margin: 0, fontSize: '20px' },
    navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
    navUser: { color: 'white', fontSize: '14px' },
    logoutBtn: { backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
    content: { maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '2rem' },
    statCard: { backgroundColor: 'white', padding: '1.2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', textAlign: 'center' },
    statLabel: { fontSize: '13px', color: '#666', margin: '0 0 8px 0' },
    statValue: { fontSize: '28px', fontWeight: '700', margin: 0 },
    controls: { display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' },
    searchInput: { flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', minWidth: '200px' },
    filterSelect: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
    addBtn: { padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
    formCard: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '1.5rem' },
    formTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '1rem', color: '#1a1a2e' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    inputGroup: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#333', marginBottom: '6px' },
    input: { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
    formButtons: { display: 'flex', gap: '12px' },
    submitBtn: { padding: '10px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
    cancelBtn: { padding: '10px 24px', backgroundColor: 'white', color: '#666', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
    jobList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    emptyState: { backgroundColor: 'white', padding: '3rem', borderRadius: '12px', textAlign: 'center', color: '#666' },
    jobCard: { backgroundColor: 'white', padding: '1.2rem 1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    jobLeft: { flex: 1 },
    jobTitle: { fontSize: '16px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 4px 0' },
    jobCompany: { fontSize: '14px', color: '#4f46e5', margin: '0 0 4px 0', fontWeight: '500' },
    jobDate: { fontSize: '12px', color: '#999', margin: '0 0 4px 0' },
    jobNotes: { fontSize: '13px', color: '#666', margin: 0 },
    jobRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' },
    statusBadge: { padding: '4px 12px', borderRadius: '20px', color: 'white', fontSize: '12px', fontWeight: '500' },
    jobActions: { display: 'flex', gap: '8px' },
    editBtn: { padding: '6px 14px', backgroundColor: 'white', border: '1px solid #4f46e5', color: '#4f46e5', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
    deleteBtn: { padding: '6px 14px', backgroundColor: 'white', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }
};

export default Dashboard;
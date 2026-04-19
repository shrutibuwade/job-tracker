import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiUser, FiMail, FiPhone, FiLinkedin, FiSave, FiCamera, FiGithub, FiBook, FiAward, FiBriefcase, FiCode, FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiX } from 'react-icons/fi';

const API = 'http://localhost:8080/api';

function Profile() {
    const { colors } = useTheme();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [basicInfo, setBasicInfo] = useState({ phone: '', linkedin: '', github: '', portfolio: '', bio: '' });
    const [educations, setEducations] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [skills, setSkills] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [projects, setProjects] = useState([]);
    const [basicSaved, setBasicSaved] = useState(false);

    // Modal states
    const [eduModal, setEduModal] = useState(false);
    const [expModal, setExpModal] = useState(false);
    const [skillModal, setSkillModal] = useState(false);
    const [certModal, setCertModal] = useState(false);
    const [projModal, setProjModal] = useState(false);

    // Form states
    const [eduForm, setEduForm] = useState({ degree: '', college: '', board: '', startYear: '', endYear: '', cgpa: '', description: '' });
    const [expForm, setExpForm] = useState({ company: '', role: '', location: '', startDate: '', endDate: '', currentlyWorking: false, description: '' });
    const [skillForm, setSkillForm] = useState({ name: '', proficiency: 'Intermediate' });
    const [certForm, setCertForm] = useState({ name: '', issuer: '', issueDate: '', expiryDate: '', url: '', credentialId: '' });
    const [projForm, setProjForm] = useState({ title: '', description: '', techStack: '', githubUrl: '', liveUrl: '', startDate: '', endDate: '' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchAll(parsedUser.id);
        const savedPhoto = localStorage.getItem('photo_' + parsedUser.id);
        if (savedPhoto) setPhoto(savedPhoto);
    }, []);

    const fetchAll = async (userId) => {
        try {
            const [eduRes, expRes, skillRes, certRes, projRes, basicRes] = await Promise.all([
                fetch(`${API}/profile/${userId}/education`),
                fetch(`${API}/profile/${userId}/experience`),
                fetch(`${API}/profile/${userId}/skills`),
                fetch(`${API}/profile/${userId}/certifications`),
                fetch(`${API}/profile/${userId}/projects`),
                fetch(`${API}/user-profile/${userId}`)
            ]);
            setEducations(await eduRes.json());
            setExperiences(await expRes.json());
            setSkills(await skillRes.json());
            setCertifications(await certRes.json());
            setProjects(await projRes.json());
            const basicData = await basicRes.json();
            if (basicData && basicData.id) setBasicInfo(basicData);
        } catch (err) { console.error(err); }
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            setPhoto(e.target.result);
            localStorage.setItem('photo_' + user.id, e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const saveBasicInfo = async () => {
        await fetch(`${API}/user-profile/${user.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(basicInfo)
        });
        setBasicSaved(true);
        setTimeout(() => setBasicSaved(false), 3000);
    };

    const saveItem = async (endpoint, form, setList, closeModal, resetForm) => {
        try {
            const res = await fetch(`${API}/profile/${user.id}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const saved = await res.json();
            setList(prev => form.id
                ? prev.map(i => i.id === saved.id ? saved : i)
                : [...prev, saved]);
            closeModal(false);
            resetForm();
        } catch (err) { alert('Failed to save!'); }
    };

    const deleteItem = async (endpoint, id, setList) => {
        if (!window.confirm('Delete this item?')) return;
        await fetch(`${API}/profile/${endpoint}/${id}`, { method: 'DELETE' });
        setList(prev => prev.filter(i => i.id !== id));
    };

    const inputStyle = {
        width: '100%', padding: '10px 14px', borderRadius: '10px',
        border: `1px solid ${colors.border}`, backgroundColor: colors.bgSecondary,
        color: colors.textPrimary, fontSize: '14px', outline: 'none', boxSizing: 'border-box'
    };

    const cardStyle = {
        backgroundColor: colors.bgCard, borderRadius: '16px',
        border: `1px solid ${colors.border}`, padding: '1.5rem', marginBottom: '1rem'
    };

    const modalStyle = {
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '1rem'
    };

    const modalCardStyle = {
        backgroundColor: colors.bgCard, borderRadius: '20px', padding: '2rem',
        width: '100%', maxWidth: '560px', border: `1px solid ${colors.border}`,
        maxHeight: '90vh', overflowY: 'auto'
    };

    const labelStyle = {
        display: 'block', fontSize: '13px', fontWeight: '500',
        color: colors.textSecondary, marginBottom: '6px'
    };

    const SectionHeader = ({ icon, title, onAdd }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {icon} {title}
            </h3>
            <button onClick={onAdd} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                <FiPlus size={14} /> Add
            </button>
        </div>
    );

    const ItemActions = ({ onEdit, onDelete }) => (
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button onClick={onEdit} style={{ padding: '6px', backgroundColor: 'rgba(124,58,237,0.1)', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <FiEdit2 size={13} />
            </button>
            <button onClick={onDelete} style={{ padding: '6px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <FiTrash2 size={13} />
            </button>
        </div>
    );

    const ModalHeader = ({ title, onClose }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>{title}</h3>
            <button onClick={onClose} style={{ padding: '6px', backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: colors.textSecondary }}>
                <FiX size={16} />
            </button>
        </div>
    );

    const SaveBtn = ({ onClick, label }) => (
        <button onClick={onClick} style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            {label}
        </button>
    );

    const CancelBtn = ({ onClick }) => (
        <button onClick={onClick} style={{ flex: 1, padding: '11px', backgroundColor: colors.bgSecondary, color: colors.textSecondary, border: `1px solid ${colors.border}`, borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>
            Cancel
        </button>
    );

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>Profile</h1>
                <p style={{ color: colors.textSecondary, fontSize: '14px', margin: '4px 0 0 0' }}>Build your professional profile</p>
            </div>

            {/* Photo + Basic */}
            <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: photo ? 'none' : 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: '700', color: 'white', overflow: 'hidden', border: `3px solid ${colors.border}` }}>
                        {photo ? <img src={photo} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <label style={{ position: 'absolute', bottom: 0, right: 0, width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `2px solid ${colors.bgCard}` }}>
                        <FiCamera size={14} color="white" />
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                    </label>
                </div>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: colors.textPrimary, margin: '0 0 4px 0' }}>{user?.name}</h2>
                    <p style={{ color: colors.textSecondary, fontSize: '14px', margin: 0 }}>{user?.email}</p>
                </div>
            </div>

            {/* Personal Info */}
            <div style={cardStyle}>
                <SectionHeader icon={<FiUser size={18} color="#7c3aed" />} title="Personal Information" onAdd={saveBasicInfo} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={labelStyle}><FiPhone size={12} style={{ marginRight: '4px' }} />Phone</label>
                        <input style={inputStyle} placeholder="+91 9876543210" value={basicInfo.phone || ''} onChange={e => setBasicInfo({ ...basicInfo, phone: e.target.value })} />
                    </div>
                    <div>
                        <label style={labelStyle}><FiLinkedin size={12} style={{ marginRight: '4px' }} />LinkedIn</label>
                        <input style={inputStyle} placeholder="https://linkedin.com/in/yourname" value={basicInfo.linkedin || ''} onChange={e => setBasicInfo({ ...basicInfo, linkedin: e.target.value })} />
                    </div>
                    <div>
                        <label style={labelStyle}><FiGithub size={12} style={{ marginRight: '4px' }} />GitHub</label>
                        <input style={inputStyle} placeholder="https://github.com/yourusername" value={basicInfo.github || ''} onChange={e => setBasicInfo({ ...basicInfo, github: e.target.value })} />
                    </div>
                    <div>
                        <label style={labelStyle}>Portfolio</label>
                        <input style={inputStyle} placeholder="https://yourportfolio.com" value={basicInfo.portfolio || ''} onChange={e => setBasicInfo({ ...basicInfo, portfolio: e.target.value })} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Bio / Summary</label>
                        <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} placeholder="Write a short professional summary..." value={basicInfo.bio || ''} onChange={e => setBasicInfo({ ...basicInfo, bio: e.target.value })} />
                    </div>
                </div>
                <button onClick={saveBasicInfo} style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: basicSaved ? '#10b981' : 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    <FiSave size={14} /> {basicSaved ? 'Saved! ✅' : 'Save Info'}
                </button>
            </div>

            {/* Education */}
            <div style={cardStyle}>
                <SectionHeader icon={<FiBook size={18} color="#3b82f6" />} title="Education" onAdd={() => { setEduForm({ degree: '', college: '', board: '', startYear: '', endYear: '', cgpa: '', description: '' }); setEduModal(true); }} />
                {educations.length === 0 ? (
                    <p style={{ color: colors.textMuted, fontSize: '14px', textAlign: 'center', padding: '1rem' }}>No education added yet. Click Add to get started!</p>
                ) : (
                    educations.map(edu => (
                        <div key={edu.id} style={{ padding: '1rem', backgroundColor: colors.bgSecondary, borderRadius: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontWeight: '600', color: colors.textPrimary, margin: '0 0 4px 0' }}>{edu.degree}</p>
                                <p style={{ color: '#3b82f6', fontSize: '14px', margin: '0 0 4px 0' }}>{edu.college}</p>
                                <p style={{ color: colors.textMuted, fontSize: '13px', margin: 0 }}>{edu.startYear} - {edu.endYear} {edu.cgpa && `• CGPA: ${edu.cgpa}`}</p>
                            </div>
                            <ItemActions
                                onEdit={() => { setEduForm(edu); setEduModal(true); }}
                                onDelete={() => deleteItem('education', edu.id, setEducations)}
                            />
                        </div>
                    ))
                )}
            </div>

            {/* Experience */}
            <div style={cardStyle}>
                <SectionHeader icon={<FiBriefcase size={18} color="#10b981" />} title="Experience" onAdd={() => { setExpForm({ company: '', role: '', location: '', startDate: '', endDate: '', currentlyWorking: false, description: '' }); setExpModal(true); }} />
                {experiences.length === 0 ? (
                    <p style={{ color: colors.textMuted, fontSize: '14px', textAlign: 'center', padding: '1rem' }}>No experience added yet. Click Add to get started!</p>
                ) : (
                    experiences.map(exp => (
                        <div key={exp.id} style={{ padding: '1rem', backgroundColor: colors.bgSecondary, borderRadius: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontWeight: '600', color: colors.textPrimary, margin: '0 0 4px 0' }}>{exp.role}</p>
                                <p style={{ color: '#10b981', fontSize: '14px', margin: '0 0 4px 0' }}>{exp.company} {exp.location && `• ${exp.location}`}</p>
                                <p style={{ color: colors.textMuted, fontSize: '13px', margin: 0 }}>{exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}</p>
                                {exp.description && <p style={{ color: colors.textSecondary, fontSize: '13px', margin: '6px 0 0 0' }}>{exp.description}</p>}
                            </div>
                            <ItemActions
                                onEdit={() => { setExpForm(exp); setExpModal(true); }}
                                onDelete={() => deleteItem('experience', exp.id, setExperiences)}
                            />
                        </div>
                    ))
                )}
            </div>

            {/* Skills */}
            <div style={cardStyle}>
                <SectionHeader icon={<FiCode size={18} color="#f59e0b" />} title="Skills" onAdd={() => { setSkillForm({ name: '', proficiency: 'Intermediate' }); setSkillModal(true); }} />
                {skills.length === 0 ? (
                    <p style={{ color: colors.textMuted, fontSize: '14px', textAlign: 'center', padding: '1rem' }}>No skills added yet. Click Add to get started!</p>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {skills.map(skill => (
                            <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
                                <span style={{ fontSize: '13px', fontWeight: '500', color: '#7c3aed' }}>{skill.name}</span>
                                <span style={{ fontSize: '11px', color: colors.textMuted }}>• {skill.proficiency}</span>
                                <button onClick={() => deleteItem('skills', skill.id, setSkills)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', padding: 0 }}>
                                    <FiX size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Certifications */}
            <div style={cardStyle}>
                <SectionHeader icon={<FiAward size={18} color="#f59e0b" />} title="Certifications" onAdd={() => { setCertForm({ name: '', issuer: '', issueDate: '', expiryDate: '', url: '', credentialId: '' }); setCertModal(true); }} />
                {certifications.length === 0 ? (
                    <p style={{ color: colors.textMuted, fontSize: '14px', textAlign: 'center', padding: '1rem' }}>No certifications added yet. Click Add to get started!</p>
                ) : (
                    certifications.map(cert => (
                        <div key={cert.id} style={{ padding: '1rem', backgroundColor: colors.bgSecondary, borderRadius: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontWeight: '600', color: colors.textPrimary, margin: '0 0 4px 0' }}>{cert.name}</p>
                                <p style={{ color: '#f59e0b', fontSize: '14px', margin: '0 0 4px 0' }}>{cert.issuer}</p>
                                <p style={{ color: colors.textMuted, fontSize: '13px', margin: 0 }}>Issued: {cert.issueDate} {cert.expiryDate && `• Expires: ${cert.expiryDate}`}</p>
                                {cert.url && <a href={cert.url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><FiExternalLink size={12} /> View Certificate</a>}
                            </div>
                            <ItemActions
                                onEdit={() => { setCertForm(cert); setCertModal(true); }}
                                onDelete={() => deleteItem('certifications', cert.id, setCertifications)}
                            />
                        </div>
                    ))
                )}
            </div>

            {/* Projects */}
            <div style={cardStyle}>
                <SectionHeader icon={<FiCode size={18} color="#7c3aed" />} title="Projects" onAdd={() => { setProjForm({ title: '', description: '', techStack: '', githubUrl: '', liveUrl: '', startDate: '', endDate: '' }); setProjModal(true); }} />
                {projects.length === 0 ? (
                    <p style={{ color: colors.textMuted, fontSize: '14px', textAlign: 'center', padding: '1rem' }}>No projects added yet. Click Add to get started!</p>
                ) : (
                    projects.map(proj => (
                        <div key={proj.id} style={{ padding: '1rem', backgroundColor: colors.bgSecondary, borderRadius: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: '600', color: colors.textPrimary, margin: '0 0 4px 0' }}>{proj.title}</p>
                                {proj.description && <p style={{ color: colors.textSecondary, fontSize: '13px', margin: '0 0 6px 0' }}>{proj.description}</p>}
                                {proj.techStack && <p style={{ color: '#7c3aed', fontSize: '12px', margin: '0 0 6px 0' }}>🛠 {proj.techStack}</p>}
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}><FiGithub size={12} /> GitHub</a>}
                                    {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" style={{ color: '#10b981', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}><FiExternalLink size={12} /> Live Demo</a>}
                                </div>
                            </div>
                            <ItemActions
                                onEdit={() => { setProjForm(proj); setProjModal(true); }}
                                onDelete={() => deleteItem('projects', proj.id, setProjects)}
                            />
                        </div>
                    ))
                )}
            </div>

            {/* Education Modal */}
            {eduModal && (
                <div style={modalStyle}>
                    <div style={modalCardStyle}>
                        <ModalHeader title="🎓 Add Education" onClose={() => setEduModal(false)} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Degree / Course</label>
                                <input style={inputStyle} placeholder="e.g. B.Tech Computer Science" value={eduForm.degree} onChange={e => setEduForm({ ...eduForm, degree: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>College / University</label>
                                <input style={inputStyle} placeholder="e.g. IIT Delhi" value={eduForm.college} onChange={e => setEduForm({ ...eduForm, college: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Start Year</label>
                                <input style={inputStyle} placeholder="e.g. 2021" value={eduForm.startYear} onChange={e => setEduForm({ ...eduForm, startYear: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>End Year</label>
                                <input style={inputStyle} placeholder="e.g. 2025" value={eduForm.endYear} onChange={e => setEduForm({ ...eduForm, endYear: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>CGPA / Percentage</label>
                                <input style={inputStyle} placeholder="e.g. 8.5" value={eduForm.cgpa} onChange={e => setEduForm({ ...eduForm, cgpa: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Board / Affiliation</label>
                                <input style={inputStyle} placeholder="e.g. RGPV" value={eduForm.board} onChange={e => setEduForm({ ...eduForm, board: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Description (optional)</label>
                                <textarea style={{ ...inputStyle, height: '70px', resize: 'vertical' }} placeholder="Any extra details..." value={eduForm.description} onChange={e => setEduForm({ ...eduForm, description: e.target.value })} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
                            <SaveBtn onClick={() => saveItem('education', eduForm, setEducations, setEduModal, () => setEduForm({ degree: '', college: '', board: '', startYear: '', endYear: '', cgpa: '', description: '' }))} label="Save Education" />
                            <CancelBtn onClick={() => setEduModal(false)} />
                        </div>
                    </div>
                </div>
            )}

            {/* Experience Modal */}
            {expModal && (
                <div style={modalStyle}>
                    <div style={modalCardStyle}>
                        <ModalHeader title="💼 Add Experience" onClose={() => setExpModal(false)} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Company</label>
                                <input style={inputStyle} placeholder="e.g. Google" value={expForm.company} onChange={e => setExpForm({ ...expForm, company: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Role</label>
                                <input style={inputStyle} placeholder="e.g. Software Engineer Intern" value={expForm.role} onChange={e => setExpForm({ ...expForm, role: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Location</label>
                                <input style={inputStyle} placeholder="e.g. Bangalore, Remote" value={expForm.location} onChange={e => setExpForm({ ...expForm, location: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Start Date</label>
                                <input style={inputStyle} type="date" value={expForm.startDate} onChange={e => setExpForm({ ...expForm, startDate: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>End Date</label>
                                <input style={inputStyle} type="date" value={expForm.endDate} disabled={expForm.currentlyWorking} onChange={e => setExpForm({ ...expForm, endDate: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="checkbox" checked={expForm.currentlyWorking} onChange={e => setExpForm({ ...expForm, currentlyWorking: e.target.checked })} />
                                <label style={{ color: colors.textSecondary, fontSize: '14px' }}>Currently Working</label>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Description</label>
                                <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} placeholder="Describe your role and responsibilities..." value={expForm.description} onChange={e => setExpForm({ ...expForm, description: e.target.value })} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
                            <SaveBtn onClick={() => saveItem('experience', expForm, setExperiences, setExpModal, () => setExpForm({ company: '', role: '', location: '', startDate: '', endDate: '', currentlyWorking: false, description: '' }))} label="Save Experience" />
                            <CancelBtn onClick={() => setExpModal(false)} />
                        </div>
                    </div>
                </div>
            )}

            {/* Skill Modal */}
            {skillModal && (
                <div style={modalStyle}>
                    <div style={{ ...modalCardStyle, maxWidth: '400px' }}>
                        <ModalHeader title="🛠 Add Skill" onClose={() => setSkillModal(false)} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Skill Name</label>
                                <input style={inputStyle} placeholder="e.g. Java, React, MySQL" value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Proficiency Level</label>
                                <select style={inputStyle} value={skillForm.proficiency} onChange={e => setSkillForm({ ...skillForm, proficiency: e.target.value })}>
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                    <option>Expert</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
                            <SaveBtn onClick={() => saveItem('skills', skillForm, setSkills, setSkillModal, () => setSkillForm({ name: '', proficiency: 'Intermediate' }))} label="Add Skill" />
                            <CancelBtn onClick={() => setSkillModal(false)} />
                        </div>
                    </div>
                </div>
            )}

            {/* Certification Modal */}
            {certModal && (
                <div style={modalStyle}>
                    <div style={modalCardStyle}>
                        <ModalHeader title="🏆 Add Certification" onClose={() => setCertModal(false)} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Certification Name</label>
                                <input style={inputStyle} placeholder="e.g. AWS Certified Developer" value={certForm.name} onChange={e => setCertForm({ ...certForm, name: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Issuing Organization</label>
                                <input style={inputStyle} placeholder="e.g. Amazon Web Services" value={certForm.issuer} onChange={e => setCertForm({ ...certForm, issuer: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Credential ID</label>
                                <input style={inputStyle} placeholder="e.g. ABC123XYZ" value={certForm.credentialId} onChange={e => setCertForm({ ...certForm, credentialId: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Issue Date</label>
                                <input style={inputStyle} type="date" value={certForm.issueDate} onChange={e => setCertForm({ ...certForm, issueDate: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Expiry Date (optional)</label>
                                <input style={inputStyle} type="date" value={certForm.expiryDate} onChange={e => setCertForm({ ...certForm, expiryDate: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Certificate URL</label>
                                <input style={inputStyle} placeholder="https://credential.net/..." value={certForm.url} onChange={e => setCertForm({ ...certForm, url: e.target.value })} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
                            <SaveBtn onClick={() => saveItem('certifications', certForm, setCertifications, setCertModal, () => setCertForm({ name: '', issuer: '', issueDate: '', expiryDate: '', url: '', credentialId: '' }))} label="Save Certification" />
                            <CancelBtn onClick={() => setCertModal(false)} />
                        </div>
                    </div>
                </div>
            )}

            {/* Project Modal */}
            {projModal && (
                <div style={modalStyle}>
                    <div style={modalCardStyle}>
                        <ModalHeader title="🚀 Add Project" onClose={() => setProjModal(false)} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Project Title</label>
                                <input style={inputStyle} placeholder="e.g. CareerSync AI" value={projForm.title} onChange={e => setProjForm({ ...projForm, title: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Description</label>
                                <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} placeholder="Describe what this project does..." value={projForm.description} onChange={e => setProjForm({ ...projForm, description: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Tech Stack</label>
                                <input style={inputStyle} placeholder="e.g. Java, Spring Boot, React, MySQL" value={projForm.techStack} onChange={e => setProjForm({ ...projForm, techStack: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>GitHub URL</label>
                                <input style={inputStyle} placeholder="https://github.com/..." value={projForm.githubUrl} onChange={e => setProjForm({ ...projForm, githubUrl: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Live URL</label>
                                <input style={inputStyle} placeholder="https://yourapp.vercel.app" value={projForm.liveUrl} onChange={e => setProjForm({ ...projForm, liveUrl: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Start Date</label>
                                <input style={inputStyle} type="date" value={projForm.startDate} onChange={e => setProjForm({ ...projForm, startDate: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>End Date</label>
                                <input style={inputStyle} type="date" value={projForm.endDate} onChange={e => setProjForm({ ...projForm, endDate: e.target.value })} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
                            <SaveBtn onClick={() => saveItem('projects', projForm, setProjects, setProjModal, () => setProjForm({ title: '', description: '', techStack: '', githubUrl: '', liveUrl: '', startDate: '', endDate: '' }))} label="Save Project" />
                            <CancelBtn onClick={() => setProjModal(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
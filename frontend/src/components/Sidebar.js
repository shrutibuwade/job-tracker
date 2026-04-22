import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiBarChart2, FiCalendar, FiFileText, FiLogOut, FiBriefcase, FiSun, FiMoon, FiUser, FiBookOpen } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const menuItems = [
    { icon: <FiGrid size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FiBarChart2 size={20} />, label: 'Analytics', path: '/analytics' },
    { icon: <FiCalendar size={20} />, label: 'Interviews', path: '/interviews' },
    { icon: <FiFileText size={20} />, label: 'Resume Matcher', path: '/resume-matcher' },
    { icon: <FiFileText size={20} />, label: 'Cover Letter', path: '/cover-letter' },
    { icon: <FiBookOpen size={20} />, label: 'Interview Prep', path: '/interview-prep' },
    { icon: <FiUser size={20} />, label: 'Profile', path: '/profile' },
];

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, toggleTheme, colors } = useTheme();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const photo = localStorage.getItem('photo_' + user?.id);
    const [profileCompletion, setProfileCompletion] = useState(0);

useEffect(() => {
    const calculateCompletion = async () => {
        if (!user?.id) return;
        try {
            const [basicRes, eduRes, skillRes, certRes, projRes, expRes] = await Promise.all([
                fetch(`http://localhost:8080/api/user-profile/${user.id}`),
                fetch(`http://localhost:8080/api/profile/${user.id}/education`),
                fetch(`http://localhost:8080/api/profile/${user.id}/skills`),
                fetch(`http://localhost:8080/api/profile/${user.id}/certifications`),
                fetch(`http://localhost:8080/api/profile/${user.id}/projects`),
                fetch(`http://localhost:8080/api/profile/${user.id}/experience`)
            ]);
            const basic = await basicRes.json();
            const edu = await eduRes.json();
            const skills = await skillRes.json();
            const certs = await certRes.json();
            const projs = await projRes.json();
            const exps = await expRes.json();

            let score = 0;
            if (basic?.phone) score += 10;
            if (basic?.linkedin) score += 10;
            if (basic?.github) score += 10;
            if (basic?.bio) score += 10;
            if (photo) score += 10;
            if (edu?.length > 0) score += 15;
            if (skills?.length > 0) score += 10;
            if (certs?.length > 0) score += 10;
            if (projs?.length > 0) score += 10;
            if (exps?.length > 0) score += 5;

            setProfileCompletion(score);
        } catch (err) { console.error(err); }
    };
    calculateCompletion();
}, [user?.id]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div style={{
            width: '260px',
            minHeight: '100vh',
            backgroundColor: colors.bgSecondary,
            borderRight: `1px solid ${colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem 1rem',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 100,
            transition: 'all 0.3s ease'
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', padding: '0 0.5rem' }}>
                <FiBriefcase size={24} color="#7c3aed" />
                <span style={{ fontSize: '20px', fontWeight: '700', color: colors.textPrimary }}>CareerSync</span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#7c3aed', backgroundColor: 'rgba(124, 58, 237, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>AI</span>
            </div>

            {/* User Info */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: colors.bgCard,
                padding: '1rem',
                borderRadius: '16px',
                marginBottom: '2rem',
                border: `1px solid ${colors.border}`,
                background: `linear-gradient(135deg, ${colors.bgCard}, ${colors.bgSecondary})`
            }}>
                <div style={{
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: photo ? 'none' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700',
    color: 'white',
    flexShrink: 0,
    overflow: 'hidden',
    border: `2px solid ${colors.border}`
}}>
    {photo
        ? <img src={photo} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : user?.name?.charAt(0).toUpperCase()
    }
</div>
                <div style={{ overflow: 'hidden' }}>
    <p style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary, margin: 0 }}>{user?.name}</p>
    <p style={{ fontSize: '11px', color: colors.textMuted, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
        <div style={{ height: '3px', width: '60px', backgroundColor: colors.border, borderRadius: '2px' }}>
            <div style={{ height: '3px', width: `${profileCompletion * 0.6}px`, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: '2px', transition: 'width 0.3s ease' }} />
</div>
    <span style={{ fontSize: '10px', color: profileCompletion === 100 ? '#10b981' : colors.textMuted }}>
    {profileCompletion === 100 ? '✅ Complete!' : `${profileCompletion}% done`}
</span>
    </div>
</div>
            </div>

            {/* Menu Items */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {menuItems.map((item) => (
                    <div
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            position: 'relative',
                            backgroundColor: location.pathname === item.path ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                            color: location.pathname === item.path ? colors.textPrimary : colors.textSecondary,
                            transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ color: location.pathname === item.path ? '#7c3aed' : colors.textSecondary, flexShrink: 0 }}>
                            {item.icon}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>
                        {location.pathname === item.path && (
                            <div style={{
                                position: 'absolute',
                                right: 0,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '3px',
                                height: '20px',
                                backgroundColor: '#7c3aed',
                                borderRadius: '2px'
                            }} />
                        )}
                    </div>
                ))}
            </nav>

            {/* Theme Toggle */}
            <div
                onClick={toggleTheme}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    backgroundColor: colors.bgCard,
                    border: `1px solid ${colors.border}`
                }}
            >
                {isDark
                    ? <FiSun size={20} color="#f59e0b" />
                    : <FiMoon size={20} color="#7c3aed" />
                }
                <span style={{ fontSize: '14px', fontWeight: '500', color: colors.textPrimary }}>
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                </span>
            </div>

            {/* Logout */}
            <div
                onClick={handleLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)'
                }}
            >
                <FiLogOut size={20} color="#ef4444" />
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#ef4444' }}>Logout</span>
            </div>
        </div>
    );
}

export default Sidebar;
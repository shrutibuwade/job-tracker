import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Interviews from './pages/Interviews';
import Profile from './pages/Profile';
import CoverLetter from './pages/CoverLetter';
import InterviewPrep from './pages/InterviewPrep';
import ResumeMatcher from './pages/ResumeMatcher';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
        <Route path="/interviews" element={<Layout><Interviews /></Layout>} />
        <Route path="/resume-matcher" element={<Layout><ResumeMatcher /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/cover-letter" element={<Layout><CoverLetter /></Layout>} />
        <Route path="/interview-prep" element={<Layout><InterviewPrep /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Devpost from './pages/Devpost';
import Devfolio from './pages/Devfolio';
import Unstop from './pages/Unstop';
import Hack2skill from './pages/Hack2skill';
import AdminPanel from './pages/AdminPanel';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/devpost" element={<Devpost />} />
          <Route path="/devfolio" element={<Devfolio />} />
          <Route path="/unstop" element={<Unstop />} />
          <Route path="/hack2skill" element={<Hack2skill />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
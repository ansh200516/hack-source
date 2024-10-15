// src/pages/LoginPage.js

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ButtonPrimary } from '../components/shadcn/Button';
import { Cross1Icon } from '@radix-ui/react-icons';

const LoginPage = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) {
    // If user is already authenticated, redirect based on role
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5213/api/login', {
        username,
        password,
      });

      const { access_token, user: userData } = response.data;

      login(access_token, userData); // Stores the token and user data

      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred during login.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
            <button
              type="button"
              onClick={() => setError('')}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <Cross1Icon className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>
        <ButtonPrimary
          type="submit"
          className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded hover:scale-105 transition-transform"
        >
          Login
        </ButtonPrimary>
      </form>
    </div>
  );
};

export default LoginPage;
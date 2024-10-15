// src/contexts/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          // Optionally, decode the token or fetch user data from an endpoint
          const decoded = parseJwt(token);
          setUser(decoded.user);
        } catch (error) {
          console.error('Invalid token or error fetching user:', error);
          setToken('');
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = (token, userData) => {
    setToken(token);
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
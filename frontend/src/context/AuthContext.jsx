import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/initialData';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'dion_ventures_auth_user';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load user from localStorage', e);
    }
    return INITIAL_USERS[0]; // Default to Super Admin
  });

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } catch (e) {
      console.error('Failed to persist auth user', e);
    }
  }, [currentUser]);

  const login = (userIdOrRole) => {
    const found = INITIAL_USERS.find(
      u => u.id.toLowerCase() === userIdOrRole.toLowerCase() || u.role.toLowerCase() === userIdOrRole.toLowerCase()
    );
    if (found) {
      setCurrentUser(found);
      return { success: true, user: found };
    }
    // Fallback: create mock user if not found in pre-set list
    const fallbackUser = {
      id: userIdOrRole.toUpperCase(),
      name: 'Operations User',
      role: 'guard',
      roleLabel: 'Duty Personnel',
      title: 'Security Operator',
      email: `${userIdOrRole.toLowerCase()}@dionventures.internal`,
      phone: '+91 98000 00000',
      avatar: 'OP',
      station: 'Station #01',
      status: 'active',
      permissions: ['gate']
    };
    setCurrentUser(fallbackUser);
    return { success: true, user: fallbackUser };
  };

  const switchRole = (roleKey) => {
    const target = INITIAL_USERS.find(u => u.role === roleKey);
    if (target) {
      setCurrentUser(target);
    }
  };

  const logout = () => {
    // Return to login screen
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider value={{ currentUser, login, switchRole, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

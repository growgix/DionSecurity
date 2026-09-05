import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setUnauthorizedHandler } from '../services/api';

const AuthContext = createContext();

const formatUser = (raw) => {
  if (!raw) return null;
  const role = raw.role || 'guard';
  const roleLabel = role === 'admin' ? 'Super Admin' : (role === 'supervisor' ? 'Field Supervisor' : 'Main Gate Guard');
  const title = role === 'admin' ? 'Estate Operations Lead' : (role === 'supervisor' ? 'Workforce & Facilities Supervisor' : 'Perimeter Security Officer');
  const permissions = role === 'admin' ? ['all'] : (role === 'supervisor' ? ['workforce', 'tasks', 'attendance', 'payments'] : ['gate', 'visitor', 'scan']);

  return {
    ...raw,
    roleLabel,
    title,
    permissions
  };
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Handle session expirations on protected API calls
    setUnauthorizedHandler(() => {
      if (isMounted) {
        setCurrentUser(null);
      }
    });

    // Check active session on startup / page refresh
    async function checkSession() {
      try {
        const res = await api.getMe();
        if (res && res.data && isMounted) {
          setCurrentUser(formatUser(res.data));
        }
      } catch (err) {
        // 401 on startup is normal unauthenticated state
        if (isMounted) {
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      if (res && res.data && res.data.user) {
        const formatted = formatUser(res.data.user);
        setCurrentUser(formatted);
        return { success: true, user: formatted };
      }
      return { success: false, error: res?.message || 'Authentication failed' };
    } catch (err) {
      return {
        success: false,
        error: err.message,
        status: err.status
      };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      // Gracefully handle logout errors
    } finally {
      setCurrentUser(null);
    }
    return { success: true };
  };

  const switchRole = () => {
    console.warn('[Auth] Role is governed by server sessions. Please log in with credentials for the target role.');
  };

  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, switchRole, isAuthenticated, isLoading }}>
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

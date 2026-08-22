import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          const authUser = {
            id: userData.userId,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            employeeId: userData.employeeId,
            profilePictureUrl: userData.profilePictureUrl
          };
          setUser(authUser);
          localStorage.setItem('user', JSON.stringify(authUser));
        } catch (err) {
          console.error("Session verification failed", err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    const authUser = {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      employeeId: data.employeeId,
      profilePictureUrl: data.profilePictureUrl
    };
    setUser(authUser);
    localStorage.setItem('user', JSON.stringify(authUser));
    return authUser;
  };

  const signUp = async (signUpData) => {
    const data = await authService.signUp(signUpData);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    const authUser = {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      employeeId: data.employeeId,
      profilePictureUrl: data.profilePictureUrl
    };
    setUser(authUser);
    localStorage.setItem('user', JSON.stringify(authUser));
    return authUser;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUserProfileState = (updatedFields) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signUp, logout, updateUserProfileState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

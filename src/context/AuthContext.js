import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/authServices';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // load user from localStorage on mount
  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  const signIn = async creds => {
    const u = await apiLogin(creds);
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const signUp = async info => {
    const u = await apiRegister(info);
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const signOut = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

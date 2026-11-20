import React, { createContext, useContext, useState } from 'react';
import { googleLogout } from '@react-oauth/google';

const AuthContext = createContext();

function readStoredUser() {
  try {
    const storedUser = localStorage.getItem('wali_kelas_user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = (payload, role = 'Wali Kelas') => {
    const userData = {
      token: payload.token || '',
      name: payload.name || 'User',
      email: payload.email || '',
      picture: payload.picture || '',
      managedClass: payload.managedClass || '', // The class this user belongs to or manages
      role // 'Wali Kelas', 'Ketua Kelas', 'Sekretaris', 'Bendahara'
    };

    setUser(userData);
    localStorage.setItem('wali_kelas_user', JSON.stringify(userData));
  };

  const logout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('wali_kelas_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

import { useState, useCallback } from 'react';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const STORAGE_KEY = 'admin_token';
const TOKEN_VALUE = 'authenticated';

function getStoredAuth() {
  try {
    return localStorage.getItem(STORAGE_KEY) === TOKEN_VALUE;
  } catch {
    return false;
  }
}

export default function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(getStoredAuth);

  const login = useCallback((username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      try {
        localStorage.setItem(STORAGE_KEY, TOKEN_VALUE);
      } catch {
        // localStorage unavailable — auth won't persist but session works
      }
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable
    }
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}

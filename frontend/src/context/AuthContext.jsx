import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = not loaded/logged-out, object = logged in
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("icen_token");
    if (!token) { setLoading(false); return; }
    axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data))
      .catch(() => { localStorage.removeItem("icen_token"); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem("icen_token", data.access_token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("icen_token");
    setUser(null);
  };

  const authHeader = () => {
    const t = localStorage.getItem("icen_token");
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, authHeader, API }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

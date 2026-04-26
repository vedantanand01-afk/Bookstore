import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('booknest_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('booknest_token'));
  const [loading, setLoading] = useState(() => !!localStorage.getItem('booknest_token') && !localStorage.getItem('booknest_user'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      if (!user) {
        setLoading(true);
        axios
          .get('http://localhost:5555/auth/me')
          .then((response) => {
            setUser(response.data.user);
          })
          .catch(() => {
            logout();
          })
          .finally(() => setLoading(false));
      }
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:5555/auth/login', { email, password });
    const { token: accessToken, user: profile } = response.data;
    localStorage.setItem('booknest_token', accessToken);
    localStorage.setItem('booknest_user', JSON.stringify(profile));
    setToken(accessToken);
    setUser(profile);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    return profile;
  };

  const register = async (name, email, password) => {
    const response = await axios.post('http://localhost:5555/auth/register', { name, email, password });
    const { token: accessToken, user: profile } = response.data;
    localStorage.setItem('booknest_token', accessToken);
    localStorage.setItem('booknest_user', JSON.stringify(profile));
    setToken(accessToken);
    setUser(profile);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    return profile;
  };

  const logout = () => {
    localStorage.removeItem('booknest_token');
    localStorage.removeItem('booknest_user');
    delete axios.defaults.headers.common.Authorization;
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

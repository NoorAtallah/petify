import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from '../componants/api/axios'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);
      if (token && isTokenValid(token)) {
        setIsAuthenticated(true);
        const userInfo = JSON.parse(localStorage.getItem('user'));
        console.log('User info from localStorage:', userInfo);
        setUser(userInfo);
        
        // Fetch subscription details
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get('/profile', config);
          setSubscription(response.data.subscription);
        } catch (error) {
          console.error('Error fetching subscription details:', error);
        }
      } else {
        console.log('Token invalid or not present, logging out');
        logout();
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userInfo, token) => {
    if (token && isTokenValid(token)) {
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      console.log('Token from localStorage:', token);
      console.log('User info from localStorage:', userInfo);
      setUser(userInfo);

      // Optionally, fetch subscription details on login if necessary
      const fetchSubscription = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get('/profile', config);
          setSubscription(response.data.subscription);
        } catch (error) {
          console.error('Error fetching subscription details after login:', error);
        }
      };
      fetchSubscription();
    } else {
      console.error('Attempted to login with an invalid token');
      logout();
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setSubscription(null); // Clear subscription on logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, subscription }}>
      {children}
    </AuthContext.Provider>
  );
};

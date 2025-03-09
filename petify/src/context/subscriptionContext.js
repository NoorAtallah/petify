import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../../src/componants/api/axios';
import { AuthContext } from './AuthContext';

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // Getting the logged-in user from AuthContext
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user || !user.id) return; // Ensure the user object is valid
  
      try {
        const response = await axios.get(`/pay/subscriptions/${user.id}/status`);
        setIsSubscribed(response.data.isSubscribed);
      } catch (error) {
        console.error('Error fetching subscription status:', error);
        setIsSubscribed(false); // Handle error and fallback
      } finally {
        setLoading(false);
      }
    };
  
    if (user) {
      checkSubscription();
    }
  }, [user]);
  
  return (
    <SubscriptionContext.Provider value={{ isSubscribed, loading }}>
      {!loading && children}
    </SubscriptionContext.Provider>
  );
};

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from './api/axios';

const SubscriptionStatsDashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalTransactions: 0 });

  useEffect(() => {
    const fetchSubscriptionStats = async () => {
      try {
        const response = await axios.get('/admin/subscription-stats');
        setStats(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSubscriptionStats();
  }, []);

  const data = [
    { name: 'Total Revenue', value: stats.totalRevenue },
    { name: 'Total Transactions', value: stats.totalTransactions },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Subscription Stats</h2>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-2 gap-6 p-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
            <p className="text-4xl font-bold">JD{stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Total Transactions</h3>
            <p className="text-4xl font-bold">{stats.totalTransactions.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-6 bg-gray-50 p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatsDashboard;
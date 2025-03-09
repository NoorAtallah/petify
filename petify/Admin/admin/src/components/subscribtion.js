import React, { useState, useEffect } from 'react';
import axios from './api/axios';

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const subscriptionsPerPage = 5;

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await axios.get('/admin/subscriptions');
                setSubscriptions(response.data);
            } catch (err) {
                setError('Failed to fetch subscriptions');
            }
            setLoading(false);
        };
        fetchSubscriptions();
    }, []);

    const updateSubscriptionStatus = async (id, newStatus) => {
        try {
            await axios.patch(`/admin/subscriptions/${id}`, { isActive: newStatus });
            setSubscriptions(subscriptions.map(sub => sub._id === id ? { ...sub, isActive: newStatus } : sub));
        } catch (err) {
            setError('Failed to update subscription status');
        }
    };

    const deleteSubscription = async (id) => {
        if (window.confirm('Are you sure you want to delete this subscription?')) {
            try {
                await axios.delete(`/admin/subscriptions/${id}`);
                setSubscriptions(subscriptions.filter(sub => sub._id !== id));
            } catch (err) {
                setError('Failed to delete subscription');
            }
        }
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const indexOfLastSubscription = currentPage * subscriptionsPerPage;
    const indexOfFirstSubscription = indexOfLastSubscription - subscriptionsPerPage;
    const currentSubscriptions = subscriptions.slice(indexOfFirstSubscription, indexOfLastSubscription);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
                {error}
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                    <span className="text-blue-700 font-medium">
                        Total: {subscriptions.length}
                    </span>
                </div>
            </div>

            {subscriptions.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-600">No subscriptions found</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentSubscriptions.map((subscription, index) => (
                                    <tr key={subscription._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 text-sm text-gray-500">
                                            {(currentPage - 1) * subscriptionsPerPage + index + 1}
                                        </td>
                                        <td className="py-4 px-6 font-medium">
                                            {subscription.user?.fullName || 'N/A'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700">
                                                {subscription.plan}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {new Date(subscription.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                subscription.isActive 
                                                    ? 'bg-green-50 text-green-700' 
                                                    : 'bg-red-50 text-red-700'
                                            }`}>
                                                {subscription.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <button
                                                onClick={() => updateSubscriptionStatus(subscription._id, !subscription.isActive)}
                                                className={`px-4 py-2 mr-2 rounded-lg text-sm font-medium transition-colors ${
                                                    subscription.isActive 
                                                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}
                                            >
                                                {subscription.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                           
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center py-4">
                        {Array.from({ length: Math.ceil(subscriptions.length / subscriptionsPerPage) }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={`mx-1 px-4 py-2 rounded-lg text-sm font-medium ${
                                    currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subscriptions;

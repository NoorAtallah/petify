import React, { useEffect, useState } from 'react';
import axios from './api/axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(activeTab === 'users' ? '/admin/users' : '/admin/vets');
      if (activeTab === 'users') {
        setUsers(res.data);
      } else {
        setVets(res.data);
      }
      setLoading(false);
    } catch (err) {
      setError('Error fetching data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    setCurrentPage(1);
  }, [activeTab]);

  const paginateData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const toggleActiveStatus = async (userId, currentStatus) => {
    try {
      await axios.patch(`/admin/users/${userId}`, { isActive: !currentStatus });
      setUsers(users.map(user => user._id === userId ? { ...user, isActive: !currentStatus } : user));
    } catch (err) {
      setError('Error updating status');
    }
  };

  const renderTableRows = (data) => {
    return paginateData(data).map((user, index) => (
      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
        <td className="py-4 px-6 border-b text-gray-500 text-sm">
          {index + 1 + (currentPage - 1) * itemsPerPage}
        </td>
        <td className="py-4 px-6 border-b font-medium">{user.fullName}</td>
        <td className="py-4 px-6 border-b text-gray-600">{user.email}</td>
        <td className="py-4 px-6 border-b">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            {user.role}
          </span>
        </td>
        <td className="py-4 px-6 border-b">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            user.isActive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td className="py-4 px-6 border-b">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              user.isActive 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
            onClick={() => toggleActiveStatus(user._id, user.isActive)}
          >
            {user.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </td>
      </tr>
    ));
  };

  const renderPagination = () => {
    const dataLength = activeTab === 'users' ? users.length : vets.length;
    const totalPages = Math.ceil(dataLength / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center mt-6">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 mx-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 mx-1 text-sm rounded ${
              currentPage === idx + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
            } hover:bg-blue-200`}
          >
            {idx + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 mx-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
      {error}
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Users & Vets</h2>

      <div className="mb-6 bg-white rounded-lg p-1 inline-flex shadow-sm">
        <button
          className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'vets'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('vets')}
        >
          Vets
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeTab === 'users' ? renderTableRows(users) : renderTableRows(vets)}
            </tbody>
          </table>
        </div>
      </div>

      {renderPagination()}
    </div>
  );
};

export default Users;

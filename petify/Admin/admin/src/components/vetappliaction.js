import React, { useState, useEffect } from 'react';
import axios from './api/axios';

const VetApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/vet-applications');
      setApplications(response.data);
      setError(null);
    } catch (error) {
      setError('Error fetching vet applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`/admin/vet-applications/${id}/approve`);
      setApplications(applications.filter(app => app._id !== id));
      setSelectedApplication(null);
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md';
      successDiv.textContent = 'Vet application approved successfully!';
      document.body.appendChild(successDiv);
      setTimeout(() => document.body.removeChild(successDiv), 3000);
    } catch (error) {
      setError('Failed to approve vet application');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`/admin/vet-applications/${id}/reject`);
      setApplications(applications.filter(app => app._id !== id));
      setSelectedApplication(null);
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md';
      successDiv.textContent = 'Vet application rejected successfully!';
      document.body.appendChild(successDiv);
      setTimeout(() => document.body.removeChild(successDiv), 3000);
    } catch (error) {
      setError('Failed to reject vet application');
    }
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
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Vet Applications</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {applications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No pending applications
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app._id}
                  onClick={() => setSelectedApplication(app)}
                  className={`p-6 cursor-pointer transition-colors ${
                    selectedApplication?._id === app._id
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{app.fullName}</h4>
                      <p className="text-sm text-gray-500 mt-1">{app.email}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Application Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Application Details</h3>
          </div>
          
          {selectedApplication ? (
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Full Name</label>
                      <p className="mt-1 text-gray-900">{selectedApplication.fullName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="mt-1 text-gray-900">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Phone</label>
                      <p className="mt-1 text-gray-900">{selectedApplication.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Submitted</label>
                      <p className="mt-1 text-gray-900">
                        {new Date(selectedApplication.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Cover Letter</label>
                  <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedApplication.coverLetter}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4 border-t">
                  <button
                    onClick={() => handleApprove(selectedApplication._id)}
                    className="flex-1 bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Approve Application
                  </button>
                  <button
                    onClick={() => handleReject(selectedApplication._id)}
                    className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Reject Application
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              Select an application to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VetApplications;
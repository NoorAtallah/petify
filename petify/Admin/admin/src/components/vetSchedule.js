import React, { useState, useEffect } from 'react';
import axios from './api/axios';

const VetSchedules = () => {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchVetSchedules();
  }, []);

  const fetchVetSchedules = async () => {
    try {
      const response = await axios.get('/vets/schedules/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setVets(response.data.vets);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vet schedules');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    try {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return time;
    }
  };

  const filteredVets = vets.filter(vet => 
    `${vet.firstName} ${vet.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vet.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVets = filteredVets.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Veterinarian Schedules</h2>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search veterinarians..."
            className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Vet Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedVets.map((vet) => (
          <div 
            key={vet._id}
            className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                {vet.firstName} {vet.lastName}
              </h3>
              <p className="text-sm text-gray-600">{vet.email}</p>
            </div>

            <div className="p-4">
              {vet.schedule && vet.schedule.length > 0 ? (
                <div className="space-y-2">
                  {vet.schedule.map((schedule, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200"
                    >
                      <span className="font-medium capitalize text-gray-700">
                        {schedule.day}
                      </span>
                      <span className="text-gray-600">
                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No schedule set</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredVets.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No veterinarians found</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 
              ${currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg transition-colors duration-200
              ${currentPage === totalPages 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default VetSchedules;
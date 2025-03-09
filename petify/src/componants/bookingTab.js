import React, { useEffect, useState } from 'react';
import axios from './api/axios';
import { Calendar, Clock, Mail, User, Video, Check } from 'lucide-react';
import ConsultationForm from './history'; // Import ConsultationForm component

const BookingTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(5);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/book/bookings');
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const markCompleted = async (bookingId) => {
    try {
      await axios.put(`/book/${bookingId}/mark-completed`);
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: 'Completed' }
            : booking
        )
      );
    } catch (error) {
      console.error('Error marking booking as completed:', error);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    return booking.status.toLowerCase() === filter;
  });

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-bermuda"></div>
    </div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {error}</span>
    </div>;
  }

  return (
    <div className="booking-tab p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-brown">Booking Management</h2>
        <ConsultationForm /> {/* Add the button from ConsultationForm here */}
      </div>

      <div className="flex justify-between items-center mb-8">
        <p className="text-brown text-lg">Manage your veterinary appointments efficiently.</p>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {currentBookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-2xl text-brown mb-4">No bookings found</p>
          <p className="text-gray-600">There are currently no bookings matching your filter.</p>
        </div>
      ) : (
        <div className="grid gap-6 mb-8">
          {currentBookings.map((booking) => (
            <div
              key={booking._id}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ${
                booking.status === 'Completed' ? 'opacity-70' : 'hover:shadow-lg'
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-brown flex items-center">
                    <User className="mr-2" size={20} /> {booking.username}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    booking.status === 'Completed' ? 'bg-green text-white' : 'bg-bermuda text-brown'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-brown flex items-center">
                    <Mail className="mr-2" size={16} /> {booking.email}
                  </p>
                  <p className="text-brown flex items-center">
                    <Calendar className="mr-2" size={16} /> {new Date(booking.date).toLocaleDateString()}
                  </p>
                  <p className="text-brown flex items-center">
                    <Clock className="mr-2" size={16} /> {booking.timeSlot}
                  </p>
                  <p className="text-green flex items-center">
                    <Video className="mr-2" size={16} />
                    <a href={booking.zoomLink} className="underline hover:text-bermuda transition duration-300">
                      Join Zoom Meeting
                    </a>
                  </p>
                </div>
              </div>
              {booking.status !== 'Completed' && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <button
                    className="w-full px-4 py-2 bg-brown text-white rounded hover:bg-bermuda transition duration-300 flex items-center justify-center"
                    onClick={() => markCompleted(booking._id)}
                  >
                    <Check className="mr-2" size={16} /> Mark as Completed
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        {Array.from({ length: Math.ceil(filteredBookings.length / bookingsPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-4 py-2 rounded-full ${
              currentPage === index + 1
                ? 'bg-green text-white'
                : 'bg-customGray text-brown hover:bg-bermuda hover:text-white'
            } transition duration-300`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookingTab;

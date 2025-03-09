import React, { useState, useEffect, useContext } from 'react';
import axios from './api/axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Clock, User, Mail, ChevronRight } from 'lucide-react';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    date: '',
    timeSlot: '',
  });
  const [bookedSlots, setBookedSlots] = useState([]);
  const [useRegisteredEmail, setUseRegisteredEmail] = useState(false); // Step 1: New state for checkbox

  const { user } = useContext(AuthContext);

  const availableTimeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM',
  ];

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (formData.date) {
        try {
          const res = await axios.get(`/book/bookings?date=${formData.date}`);
          if (res.data.success) {
            setBookedSlots(res.data.bookings.map(booking => booking.timeSlot));
          }
        } catch (error) {
          console.error('Error fetching booked slots:', error);
        }
      }
    };
    fetchBookedSlots();
  }, [formData.date]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setUseRegisteredEmail(e.target.checked); // Step 2: Update state for checkbox
    if (e.target.checked) {
      setFormData({ ...formData, email: user.email }); // Use registered email if checkbox is checked
    } else {
      setFormData({ ...formData, email: '' }); // Clear email if unchecked
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = user?.id || localStorage.getItem('userId');
    const token = user?.token || localStorage.getItem('token');

    if (!userId || !token) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please log in to make a booking.',
      });
      return;
    }

    const bookingData = {
      ...formData,
      userId,
    };

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post('/book/bookings', bookingData, config);

      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Booking confirmed!',
          text: 'Check your email for the Zoom link.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to confirm booking.',
          text: 'Please try again later.',
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Session already booked',
        text: 'This session is already booked. Please choose another time slot.',
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-customGray rounded-2xl shadow-lg mt-10 mb-10">
      <h1 className="text-3xl font-bold text-center text-brown mb-8">Book a Session</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-brown">Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bermuda" size={20} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border-2 border-bermuda rounded-lg bg-light focus:outline-none focus:border-green transition duration-300"
              placeholder="Enter your name"
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-brown">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bermuda" size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border-2 border-bermuda rounded-lg bg-light focus:outline-none focus:border-green transition duration-300"
              placeholder="Enter your email"
            />
          </div>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="useRegisteredEmail"
            checked={useRegisteredEmail}
            onChange={handleCheckboxChange} // Step 3: Add checkbox change handler
            className="mr-2"
          />
          <label htmlFor="useRegisteredEmail" className="text-sm text-brown">
            Use my registered email ({user?.email})
          </label>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-brown">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bermuda" size={20} />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border-2 border-bermuda rounded-lg bg-light focus:outline-none focus:border-green transition duration-300"
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-brown">Time Slot</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bermuda" size={20} />
            <select
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border-2 border-bermuda rounded-lg bg-light focus:outline-none focus:border-green transition duration-300 appearance-none"
            >
              <option value="">Select a time slot</option>
              {availableTimeSlots.map((slot, index) => (
                <option key={index} value={slot} disabled={bookedSlots.includes(slot)}>
                  {slot} {bookedSlots.includes(slot) && '(Already booked)'}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button 
          type="submit" 
          className="w-full bg-green text-black py-3 px-6 rounded-lg hover:bg-bermuda transition duration-300 flex items-center justify-center space-x-2"
        >
          <span>Submit Booking</span>
          <ChevronRight size={20} />
        </button>
      </form>
    </div>
  );
};

export default BookingForm;

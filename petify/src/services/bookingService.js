import axios from 'axios';

export const checkNewBookings = async (userId) => {
  try {
    const response = await axios.post('/api/check-new-bookings', { userId });
    return response.data.newBookings;
  } catch (error) {
    console.error('Error checking new bookings:', error);
    throw error;
  }
};

export const getUserBookings = async (userId) => {
  try {
    const response = await axios.get(`/api/user-bookings/${userId}`);
    return response.data.bookings;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};
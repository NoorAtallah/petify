import React, { useEffect, useState } from 'react';
import axios from './api/axios';
import { motion } from 'framer-motion';
import './profile.css'
import { AuthContext } from '../context/AuthContext'; // Import your AuthContext
import EditPetModal from './editPetsModal';
const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  });
  const [subscription, setSubscription] = useState(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [userPets, setUserPets] = useState([]);
  const [editingPet, setEditingPet] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        
        // Fetch profile data
        const response = await axios.get('/profile', config);
        setUser(response.data.user);
        setFormData({
          fullName: response.data.user.fullName,
          email: response.data.user.email,
        });
      
        const userId = response.data.user._id; 
        
        // Only fetch subscription and booking data if user is not a vet
        if (response.data.user.role !== 'vet') {
          const subscriptionResponse = await axios.get(`/pay/subscriptions/${userId}/status`, config);
          setSubscriptionStatus(subscriptionResponse.data);
          
          const bookingsResponse = await axios.get(`/book/my-bookings`, config);
          setBookings(bookingsResponse.data);
        }
        
        // Fetch user's pets
        const petsResponse = await axios.get('/adopt/user/pets', config);
        setUserPets(petsResponse.data);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchUserData();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditPet = (pet) => {
    setSelectedPet(pet);
    setIsEditModalOpen(true);
  };
  
  const handleUpdatePet = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`/adopt/user/pets/${selectedPet._id}`, updatedData, config);
      setUserPets(userPets.map(pet => 
        pet._id === selectedPet._id ? { ...pet, ...updatedData } : pet
      ));
      setIsEditModalOpen(false);
      setSelectedPet(null);
    } catch (error) {
      console.error('Error updating pet:', error);
    }
  };
  const handleDeletePet = async (petId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`/adopt/user/pets/${petId}`, config);
      setUserPets(userPets.filter(pet => pet._id !== petId));
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };


  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put('/profile', formData, config);
      setUser({ ...user, fullName: formData.fullName, email: formData.email });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className="w-16 h-16 border-4 border-[#967D6C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen  py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="cat-profile"
      >
        <div className="cat-ears">
          <div className="ear left-ear"></div>
          <div className="ear right-ear"></div>
        </div>
        <div className="cat-head">
          <div className="cat-face">
            <div className="eyes">
              <motion.div 
                className="eye left-eye"
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ repeat: Infinity, repeatDelay: 5 }}
              ></motion.div>
              <motion.div 
                className="eye right-eye"
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ repeat: Infinity, repeatDelay: 5 }}
              ></motion.div>
            </div>
            <div className="nose"></div>
            <div className="mouth"></div>
            <div className="whiskers">
              <div className="whisker-group left-whiskers">
                <div className="whisker"></div>
                <div className="whisker"></div>
                <div className="whisker"></div>
              </div>
              <div className="whisker-group right-whiskers">
                <div className="whisker"></div>
                <div className="whisker"></div>
                <div className="whisker"></div>
              </div>
            </div>
          </div>
          <div className="profile-content">
            <h1 className="text-3xl font-bold mb-6 text-center text-[#967D6C]">Meow Profile</h1>
            
            <div className="tab-buttons mb-6">
              <button 
                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`} 
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button 
                className={`tab-button ${activeTab === 'pets' ? 'active' : ''}`} 
                onClick={() => setActiveTab('pets')}
              >
                My Pets
              </button>
              {user.role !== 'vet' && (
              <button 
                className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`} 
                onClick={() => setActiveTab('bookings')}
              >
                Bookings
              </button>
            )}
            </div>

            {activeTab === 'profile' && (
              <div className="profile-tab">
                <div className="mb-6">
                  <label className="block text-[#967D6C] text-sm font-semibold mb-2">Full Name:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border-2 border-[#967D6C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#967D6C] focus:border-transparent transition duration-200"
                    />
                  ) : (
                    <p className="bg-[#F5F1ED] rounded-md p-3 text-[#967D6C] border-2 border-[#967D6C]">{user.fullName}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-[#967D6C] text-sm font-semibold mb-2">Email:</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border-2 border-[#967D6C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#967D6C] focus:border-transparent transition duration-200"
                    />
                  ) : (
                    <p className="bg-[#F5F1ED] rounded-md p-3 text-[#967D6C] border-2 border-[#967D6C]">{user.email}</p>
                  )}
                </div>
                {isEditing && (
                  <>
                    <div className="mb-6">
                      <label className="block text-[#967D6C] text-sm font-semibold mb-2">Current Password:</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border-2 border-[#967D6C] rounded-md focus:outline-none"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-[#967D6C] text-sm font-semibold mb-2">New Password:</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border-2 border-[#967D6C] rounded-md focus:outline-none"
                      />
                    </div>
                  </>
                )}
                <div className="flex justify-center space-x-4">
                  {isEditing ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#967D6C] text-white font-semibold py-2 px-6 rounded-full hover:bg-[#8E7B70] transition duration-200 shadow-md"
                        onClick={handleSave}
                      >
                        Save
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#E8E1DA] text-[#967D6C] font-semibold py-2 px-6 rounded-full hover:bg-[#D8D1CA] transition duration-200 shadow-md"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#967D6C] text-white font-semibold py-2 px-6 rounded-full hover:bg-[#8E7B70] transition duration-200 shadow-md"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </motion.button>
                  )}
                </div>
                {user.role !== 'vet' && (
                <div className="mb-6 mt-6">
                  <button
                    onClick={() => setShowSubscription(!showSubscription)}
                    className="w-full text-center bg-[#967D6C] text-white font-semibold py-2 px-6 rounded-full hover:bg-[#8E7B70] transition duration-200 shadow-md"
                  >
                    {showSubscription ? 'Hide Subscription Details' : 'Show Subscription Details'}
                  </button>
                  {showSubscription && subscriptionStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#F5F1ED] rounded-md p-3 mt-4 text-[#967D6C] border-2 border-[#967D6C]"
                    >
                      <p>Status: {subscriptionStatus.isSubscribed ? 'Active' : 'Inactive'}</p>
                      <p>End Date: {new Date(subscriptionStatus.endDate).toLocaleDateString()}</p>
                      {subscriptionStatus.isSubscribed && (
                        <p>Plan: {subscriptionStatus.plan}</p>
                        
                      )}
                    </motion.div>
                  )}
                  {showSubscription && !subscriptionStatus && (
                    <p className="text-[#967D6C] mt-4">Loading subscription status...</p>
                  )}
                </div>
              )}
            </div>
          )}

{activeTab === 'pets' && (
  <div className="pets-tab">
    <h2 className="text-2xl font-bold mb-4 text-center text-[#967D6C]">Your Posted Pets</h2>
    {userPets.map(pet => (
      <div key={pet._id} className="bg-[#F5F1ED] rounded-md p-4 mb-4 border-2 border-[#967D6C]">
        <h3 className="text-xl font-semibold">{pet.name}</h3>
        <p>{pet.description}</p>
        <div className="mt-2">
          <button 
            onClick={() => handleEditPet(pet)} 
            className="bg-[#967D6C] text-white px-4 py-2 rounded mr-2"
          >
            Edit
          </button>
          <button 
            onClick={() => handleDeletePet(pet._id)} 
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    ))}

    {/* Add the EditPetModal component here, outside of the mapping */}
    <EditPetModal 
      pet={selectedPet}
      isOpen={isEditModalOpen}
      onClose={() => {
        setIsEditModalOpen(false);
        setSelectedPet(null);
      }}
      onUpdate={handleUpdatePet}
    />
  </div>
)}
            {activeTab === 'bookings' && (
              <div className="bookings-tab">
                <h2 className="text-2xl font-bold mb-4 text-center text-[#967D6C]">Your Bookings</h2>
                {bookings.length > 0 ? (
                  bookings.map(booking => (
                    <div key={booking._id} className="bg-[#F5F1ED] rounded-md p-4 mb-4 border-2 border-[#967D6C]">
                      <h3 className="text-xl font-semibold">Booking</h3>
                      <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                      <p>Time: {booking.timeSlot}</p>
                      <p>Status: {booking.status === 'Completed' ? 'Completed' : 'Pending'}</p> {/* Display the booking status */}

                    </div>
                  ))
                ) : (
                  <p className="text-[#967D6C] mt-4">You have no bookings yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="cat-tail"></div>
      </motion.div>
    </div>
  );
};
export default Profile;
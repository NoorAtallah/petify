import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, MessageCircle, Calendar, User, Clock, PawPrint, Edit3 } from 'lucide-react';
import ChatTab from './vetChat';
import BookingTab from './bookingTab';
import Profile from './profile';
import ScheduleTab from './ScheduleTab';
import PostPet from './postpet';
import AnsweredQuestions from './vetsAnswers'; // Import the component
import { AuthContext } from '../context/AuthContext';

const VetDashboard = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-light">
      <div className="w-11/12 lg:w-4/5 mx-auto pt-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-brown">Vet Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back, Doctor</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 py-2 px-4 rounded-lg bg-customGray text-brown hover:bg-brown hover:text-white transition-all duration-300"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { id: 'chat', icon: <MessageCircle size={18} />, label: 'Chat' },
              { id: 'booking', icon: <Calendar size={18} />, label: 'Booking' },
              { id: 'profile', icon: <User size={18} />, label: 'Profile' },
              { id: 'schedule', icon: <Clock size={18} />, label: 'Schedule' },
              { id: 'postpet', icon: <PawPrint size={18} />, label: 'Post Pet' },
             
            ].map(({ id, icon, label }) => (
              <button
                key={id}
                className={`flex items-center gap-2 py-3 px-6 rounded-lg transition-all duration-300 ${
                  activeTab === id
                    ? 'bg-brown text-white shadow-lg transform scale-105'
                    : 'bg-customGray text-brown hover:bg-bermuda hover:text-white'
                }`}
                onClick={() => handleTabChange(id)}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6">
            {activeTab === 'chat' && <ChatTab />}
            {activeTab === 'booking' && <BookingTab />}
            {activeTab === 'profile' && <Profile />}
            {activeTab === 'schedule' && <ScheduleTab userId={userId} />}
            {activeTab === 'postpet' && <PostPet />}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default VetDashboard;

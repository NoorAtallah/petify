import React, { useEffect, useState } from 'react';
import axios from './api/axios';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, Mail, MessageCircle, Star } from 'lucide-react';

const VetList = () => {
  const [vets, setVets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const response = await axios.get('/vets/schedules/all');
        setVets(response.data.vets);
      } catch (error) {
        console.error('Error fetching vets:', error);
      }
    };
    
    fetchVets();
  }, []);

  const isVetAvailable = (schedule) => {
    if (!schedule || schedule.length === 0) return false;
    const currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    const convertTo24Hour = (time) => {
      const [timeStr, modifier] = time.split(' ');
      let [hours, minutes] = timeStr.split(':');
      if (modifier === 'PM' && hours !== '12') hours = String(parseInt(hours, 10) + 12);
      if (modifier === 'AM' && hours === '12') hours = '00';
      return `${hours.padStart(2, '0')}:${minutes}`;
    };
  
    const currentTime24 = convertTo24Hour(currentTime);
  
    return schedule.some(slot => {
      if (slot.day === currentDay) {
        const startTime24 = convertTo24Hour(slot.startTime);
        const endTime24 = convertTo24Hour(slot.endTime);
        return currentTime24 >= startTime24 && currentTime24 <= endTime24;
      }
      return false;
    });
  };

  const handleChatRedirect = (vet) => {
    if (isVetAvailable(vet.schedule)) {
      navigate(`/chat`);
    } else {
      alert('This vet is currently unavailable.');
    }
  };

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Heart className="w-12 h-12 text-green/20" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our Caring Veterinarians
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Dedicated professionals ready to provide the best care for your furry family members
          </p>
        </div>
        
        {vets.length ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {vets.map(vet => (
              <div 
                key={vet._id} 
                className="relative group"
              >
                <div className="absolute inset-0 bg-green/5 rounded-3xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white rounded-3xl p-8 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl border border-gray-100">
                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm mb-4 
                        ${isVetAvailable(vet.schedule) 
                          ? 'bg-green/10 text-green' 
                          : 'bg-orange-100 text-orange-600'}`}>
                        <Clock className="w-3.5 h-3.5 mr-2" />
                        {isVetAvailable(vet.schedule) ? 'Available Now' : 'Unavailable'}
                      </div>
                      
                      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                        Dr. {vet.fullname}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 hover:text-green transition-colors">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="text-sm">{vet.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center mb-6 text-gray-500 text-sm">
                      <Star className="w-4 h-4 mr-2 text-green/40" />
                      <span>Experienced pet care specialist</span>
                    </div>

                    <button
                      onClick={() => handleChatRedirect(vet)}
                      disabled={!isVetAvailable(vet.schedule)}
                      className={`mt-auto w-full px-6 py-4 rounded-xl text-white font-medium transition-all duration-200
                        ${isVetAvailable(vet.schedule)
                          ? 'bg-green hover:bg-green/90 shadow-sm hover:shadow-md' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                      <div className="flex items-center justify-center text-black">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        {isVetAvailable(vet.schedule) ? 'Start Consultation' : 'Currently Unavailable'}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-lg">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-green/40" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Vets Available</h3>
            <p className="text-gray-600">
              Our veterinary team is currently offline. Please check back soon to connect with our pet care experts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VetList;
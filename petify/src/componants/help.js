import React, { useContext } from 'react';
import './help.css';
import help from '../images/help/77.PNG';
import help_2 from '../images/help/2.png';
import { motion } from 'framer-motion'; 
import { AuthContext } from '../context/AuthContext'; 
import axios from './api/axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert

const Help = () => {
  const { isAuthenticated } = useContext(AuthContext); 
  const navigate = useNavigate();
  const handleScheduleCall = async () => {
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('token'); 
        // Perform necessary actions, such as sending a request to schedule a call or navigating to a schedule page
        navigate('/schedule'); // Navigate to schedule page if user is logged in
      } catch (error) {
        console.error('Error scheduling call:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an issue scheduling the call. Please try again.',
        });
      }
    } else {
      // SweetAlert for login prompt
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please login to schedule a video call.',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#8E7B70',
      }).then(() => {
        navigate('/login'); // Redirect to login page if user is not logged in
      });
    }
  };
  
  const handleChat = () => {
    const openingHour = 9;
    const closingHour = 17;
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (isAuthenticated) {
      if (currentHour >= openingHour && currentHour < closingHour) {
        // Show a success message that the chat is available
        Swal.fire({
          icon: 'success',
          title: 'Chat Available',
          text: 'You will be redirected to chat.',
        }).then(() => {
          navigate('/vets'); // Directly navigating without useNavigate
        });
      } else {
        // Alert that the chat is closed and recommend the symptom checker
        Swal.fire({
          icon: 'info',
          title: 'Chat is Closed',
          text: 'Our chat is available from 9 AM to 5 PM. Please visit the symptom checker for assistance.',
          confirmButtonText: 'Go to Symptom Checker',
          confirmButtonColor: '#8E7B70',
        }).then(() => {
          window.location.href = '/symptom-checker'; // Redirect to symptom checker
        });
      }
    } else {
      // SweetAlert for login prompt
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please login to start a chat.',
        confirmButtonText: 'Go to Login',
        
        confirmButtonColor: '#8E7B70',
      }).then(() => {
        navigate('/login'); // Directly navigating without useNavigate
      });
      
    }
  };

  const serviceVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section className="help">
      <div className="container_1">
        <div className="title_2">
          <h1>Expert vet Help at Your Fingertips</h1>
        </div>
        <div className="subtitle">
          <p>
            Get timely advice from our licensed veterinary team and leave with a personalized consult report.
            <br />
            Virtual consults are a supplement to clinic visits.
          </p>
        </div>
        <div className="services">
          <motion.div
            className="service"
            initial="hidden"
            whileInView="visible"
            // viewport={{ once: true, amount: 0.5 }}
            // transition={{ duration: 0.5 }}
            // variants={serviceVariants}
            
          >
            <img src={help} alt="Live Vet Chat" />
            <div className="service-content">
              <div className="service-title">Live chat for instant advice</div>
              <div className="service-description">
                Number of sessions. Exchange messages, pictures, and videos with an online vet or vet tech.
              </div>
              <button className="connect-button-chat" onClick={handleChat}>Chat Now</button>
            </div>
          </motion.div>

          <motion.div
            className="service"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            // transition={{ duration: 0.5, delay: 0.2 }}
            // variants={serviceVariants}
            // // whileHover={{ scale: 1.05 }}
          >
            <img src={help_2} alt="Video Call" />
            <div className="service-content">
              <div className="service-title">Video call for scheduled help</div>
              <div className="service-description">
                Have a face-to-face conversation with an online vet or vet tech for 1 hour.
              </div>
              
              <button className="connect-button "onClick={handleScheduleCall} >
                Schedule Call
              </button>
              
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Help;

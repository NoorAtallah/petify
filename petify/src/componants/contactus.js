import React, { useState } from 'react';
import backgroundImage from '../images/contactus/1.png';
import { motion } from 'framer-motion';
import axios from './api/axios';
import Swal from 'sweetalert2';
import { Dog, Mail, Phone, MapPin, MessageSquare, Send, User } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    city: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/submit-contact', formData);
      Swal.fire({
        title: 'Pawsome!',
        text: 'Your message has been sent successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#8E7B70',
      });
      setFormData({
        name: '',
        email: '',
        phoneNo: '',
        city: '',
        message: '',
      });
    } catch (error) {
      Swal.fire({
        title: 'Oops!',
        text: 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#8E7B70',
      });
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-100 py-12"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <motion.div
        className="contact-container p-8 bg-white bg-opacity-90 rounded-lg shadow-lg w-full max-w-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        // transition={{ duration: 0.5 }}
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center mb-6">
            <h1 className="font-bold text-3xl text-[#8E7B70] flex items-center">
              <Dog className="mr-2" /> Contact Us
            </h1>
          </div>
          <InputField
            icon={<User />}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
          />
          <InputField
            icon={<Mail />}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
          />
          <InputField
            icon={<Phone />}
            name="phoneNo"
            type="tel"
            value={formData.phoneNo}
            onChange={handleChange}
            placeholder="Your Phone Number"
          />
          <InputField
            icon={<MapPin />}
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Your City"
          />
          <div className="relative">
            <MessageSquare className="absolute top-3 left-3 text-[#8E7B70]" />
            <motion.textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="w-full p-3 pl-12 border-2 border-[#d9ccc5] focus:border-[#8E7B70] rounded-lg outline-none text-sm bg-white h-32 resize-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            />
          </div>
          <motion.button
            type="submit"
            className="w-full py-3 bg-[#d9ccc5] hover:bg-[#8E7B70] text-white rounded-full flex items-center justify-center transition-colors duration-300"
            // whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="mr-2" /> Send Message
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

const InputField = ({ icon, name, type = "text", value, onChange, placeholder }) => (
  <motion.div
    className="relative"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {React.cloneElement(icon, { className: "absolute top-3 left-3 text-[#8E7B70]" })}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 pl-12 border-2 border-[#d9ccc5] focus:border-[#8E7B70] rounded-lg outline-none text-sm bg-white"
    />
  </motion.div>
);

export default ContactUs;
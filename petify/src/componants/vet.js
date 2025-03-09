import React from 'react';
import './vet.css';
import vet from '../images/vet/vet.png';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Vet = () => {
  return (
    <div className="vet">
      <motion.div 
        className="text-container transition-transform duration-200 hover:scale-105"
        initial={{ opacity: 0, x: -100 }} 
        animate={{ opacity: 1, x: 0 }}
        // transition={{ duration: 1 }}
      >
        <h2>Are you a veterinarian?</h2>
        <p>Join the elite of Arab veterinarians and be part of an online medical community to share your experience with veterinarians and patients.</p>
        <Link to='/vet-login'>
          <motion.button 
            className="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Register as a vet now!
          </motion.button>
        </Link>
      </motion.div>
      <motion.div 
        className="image-container"
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }}
        // transition={{ duration: 1.5 }}
      >
        <img src={vet} alt="Veterinarian" />
      </motion.div>
    </div>
  );
};

export default Vet;

"use client";

import { Carousel } from "flowbite-react";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import hero from '../images/hero/Untitled design33.png';
import hero_2 from '../images/hero/Untitled design.png';
import hero_4 from '../images/hero/1.png';

export function Hero() {
  return (
    <div className="h-screen">
      <Carousel className="h-full mb-10">
        
        {/* First Slide */}
        <div className="relative flex h-full items-center justify-center dark:text-white">
          <img src={hero} alt="hero" />
          <div className="absolute text-black text-center">
            <motion.h1 
              className="text-4xl font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Best Friends for Your Paw Chums
            </motion.h1>
            <p 
              className="mt-2 text-center font-semibold"
              // initial={{ opacity: 0, y: 20 }}
              // animate={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.5, delay: 0.2 }}
            >
              Your Trusted Partner in Pet Care, Offering Online Tailored Services to Ensure the Health,
            </p>
            <motion.p 
              className="mt-2 text-center font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Happiness, and Well-Being of Your Beloved Furry Companions.
            </motion.p>
            <Link to='/login'>
              <motion.button 
                className="bg-brown mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-customGray hover:text-black"
                whileHover={{ scale: 1.05 }}
              >
                Connect Now
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Second Slide */}
        <div className="relative flex h-full items-center justify-center dark:text-white bg-white">
          <img src={hero_4} alt="hero" />
          <div className="absolute text-black text-center">
            <Link to='/login'>
              <motion.button 
                className="bg-brown mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-brown hover:text-black"
                whileHover={{ scale: 1.05 }}
                style={{ marginTop: '250px' }}
              >
                Subscribe Now
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Third Slide */}
        <div className="relative flex h-full items-center justify-center dark:text-white bg-white">
          <img src={hero_2} alt="hero" />
          <div className="absolute text-black text-center">
            <motion.h1 
              className="text-4xl font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Expert Vet Consultations Anytime, Anywhere
            </motion.h1>
            <motion.p 
              className="mt-2 text-center font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.5, delay: 0.2 }}
            >
              Get immediate advice from professional vets to ensure your pet’s health.
            </motion.p>
            <motion.p 
              className="mt-2 text-center font-bold text-3xl underline decoration-green"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.5, delay: 0.4 }}
            >
              Starting at 9.27 JD/month
            </motion.p>
            <Link to='/login'>
              <motion.button 
                className="bg-brown mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-customGray hover:text-black"
                whileHover={{ scale: 1.05 }}
              >
                Subscribe Now
              </motion.button>
            </Link>
          </div>
        </div>
      </Carousel>
    </div>
  );
}

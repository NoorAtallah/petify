import React, { useState } from 'react';
import './slider.css';
import cat from '../images/slider/cat.png';
import ham from '../images/slider/pngwing.com (16).png';
import horse from '../images/slider/horse.jpg';
import { motion } from 'framer-motion'; // Import Framer Motion

const Slider = () => {
  const slides = [
    { src: cat, alt: 'Cat', label: 'Big Pets' },
    { src: ham, alt: 'Hamster', label: 'Small Pets' },
    { src: horse, alt: 'Horse', label: 'Farm Animals' }
  ];

  const slideVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <section className="slider_main mt-10">
      <div className="slider-container">
        <h2>Shop in one Place</h2>
        <p>Who are you shopping for today?</p>
        <div className="slider" id="slider">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className="slide"
              initial="hidden"
              whileInView="visible"
              // viewport={{ once: true, amount: 0.5 }}
              // transition={{ duration: 0.5, delay: index * 0.2 }}
              // variants={slideVariants}
              // whileHover={{ scale: 1.05 }}
            >
              <img
                className='transition-transform duration-200 hover:scale-105'
                src={slide.src}
                alt={slide.alt}
              />
              <a href="#"><p>{slide.label}</p></a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Slider;

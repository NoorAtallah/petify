import React, { useEffect } from 'react';
import './FootprintsTrail.css'; 
import footprintImage from '../images/logo/3.png'; 


const FootprintsTrail = () => {
    useEffect(() => {
      const createFootprint = (x, y) => {
        const footprint = document.createElement('img');
        footprint.src = footprintImage;
        footprint.className = 'footprint';
        footprint.style.left = `${x}px`;
        footprint.style.top = `${y}px`;
  
        document.body.appendChild(footprint);
  
        console.log('Footprint created at:', x, y); 
  
        setTimeout(() => {
          footprint.remove();
        }, 1000); 
      };
  
      const handleMouseMove = (e) => {
        createFootprint(e.clientX, e.clientY);
      };
  
      const handleTouchMove = (e) => {
        const touch = e.touches[0];
        createFootprint(touch.clientX, touch.clientY);
      };
  
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
  
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
      };
    }, []);
  
    return null; 
  };
  
  export default FootprintsTrail;
import React from 'react';
import Slider from './slider1';  
import img from '../images/apppr/6.png';
import img1 from '../images/apppr/7.png';
import img3 from '../images/apppr/8.png';

const Approved = () => {
  const sliderImages = [img, img1, img3, img, img1, img3];
  return (
    <div className="approved-container">
      <h2 className="approved-title font-bold mb-10 mt-10 text-center">Approved By</h2>
      <Slider
        width={250}
        height={100}
        quantity={6}
        images={sliderImages}
        reverse={true}
      />
    </div>
  );
};

export default Approved;

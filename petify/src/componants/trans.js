import React, { useEffect } from 'react';
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos'; // Import AOS
import video from '../images/trans/Let’ Go.mp4';
import pawPrintImg from '../images/trans/1.png'; // Adjust the path to your image file

const deliveryDrivers = [
  { name: 'Mohammed Ahmed', phone: '078-123-7890' },
  { name: 'Zaid Ali', phone: '077-765-4321' },
  { name: 'Faisal Nabil', phone: '079-123-4567' },
  { name: 'Mohammed Ahmed', phone: '078-123-7890' },
  { name: 'Zaid Ali', phone: '077-765-4321' },
  { name: 'Faisal Nabil', phone: '079-123-4567' },
  { name: 'Mohammed Ahmed', phone: '078-123-7890' },
  { name: 'Zaid Ali', phone: '077-765-4321' },
  { name: 'Faisal Nabil', phone: '079-123-4567' },
  { name: 'Mohammed Ahmed', phone: '078-123-7890' },
  { name: 'Zaid Ali', phone: '077-765-4321' },
  { name: 'Faisal Nabil', phone: '079-123-4567' }
];

export default function Example() {
  useEffect(() => {
    AOS.init(); // Initialize AOS
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with Background Video */}
      <div className="relative w-full h-80 sm:h-96 lg:h-screen">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={video}
          type="video/mp4"
          autoPlay
          loop
          muted
          playsInline
        />
       
      </div>

      {/* Delivery Drivers Section */}
      <div className="container mx-auto p-4 mt-8">
      <h1 className="text-3xl font-bold text-center mb-16 mt-16 text-brown">Meet Our Delivery Drivers</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
          {deliveryDrivers.map((driver, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl relative "
              data-aos="fade-up" // Add AOS attribute for animation
              data-aos-delay={`${index * 100}`} // Add delay for staggered animation
            >
              <div className="relative w-full h-32 sm:h-48">
                <img
                  src={pawPrintImg}
                  alt="Paw Print"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900">{driver.name}</h3>
                <p className="text-gray-700 mt-2">Phone: {driver.phone}</p>
                <a href={`tel:${driver.phone}`} className="mt-4 inline-block bg-brown text-white py-2 px-4 rounded hover:bg-light hover:text-black transition duration-300">
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

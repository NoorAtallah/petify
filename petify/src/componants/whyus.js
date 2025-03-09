import './whyus.css'; 
import React, { useEffect } from 'react';
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos';
import { motion } from 'framer-motion'; // Import Framer Motion

const WhyUs = () => {
  useEffect(() => {
    AOS.init(); // Initialize AOS
  }, []);

  const shapeVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="why-us">
      <div className="title">
        <h1>Why Us?</h1>
        <div className="row">
          <motion.div
            className="col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            variants={shapeVariants}
          >
            <div className="shape down">
              <i className="fa fa-user-doctor bkg1"></i>
              <div className="inner-shape bkg1">
                <div className="content">
                  <h2>Certified <br /> veterinarian</h2>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            variants={shapeVariants}
          >
            <div className="shape up">
              <i className="fa fa-money-bill bkg2"></i>
              <div className="inner-shape bkg2">
                <div className="content">
                  <h2>Reasonable <br /> Cost</h2>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            variants={shapeVariants}
          >
            <div className="shape down">
              <i className="fa fa-shield-halved bkg3"></i>
              <div className="inner-shape bkg3">
                <div className="content">
                  <h2>Privacy and <br /> security</h2>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;

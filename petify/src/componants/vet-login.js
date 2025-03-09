import React, { useState } from 'react';
import './vet-login.css';
import axios from './api/axios';
import Swal from 'sweetalert2';

const VetSignup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    coverLetter: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/vets/apply', formData);
      Swal.fire({
        title: 'Success!',
        text: response.data.message,
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (err) {
      if (err.response && err.response.data.code === 11000) {
        Swal.fire({
          title: 'Error!',
          text: 'Application already exists with this email.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vet-container justify-center">
      <form className="vet-form" onSubmit={handleSubmit}>
        <h3 className='text-brown text-left'>Vet Job Form</h3>
        <div className="inputForm">
          <i className="fa-regular fa-user"></i>
          <input
            placeholder="Enter your Full Name"
            className="input"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="inputForm">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 32 32" height="20">
            <g data-name="Layer 3" id="Layer_3">
              <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
            </g>
          </svg>
          <input
            placeholder="Enter your Email"
            className="input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="inputForm">
          <textarea
            placeholder="Enter your Cover Letter"
            className="input"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="inputForm">
          <input
            placeholder="Enter your Phone Number"
            className="input"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <button className="button-submit" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        <p className="p note">Note: After submitting, there will be a hiring process.</p>
      </form>
    </div>
  );
}

export default VetSignup;

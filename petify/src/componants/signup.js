import React, { useState } from 'react';
import './login.css';
import cat_2 from '../images/login/pngwing.com .png';
import { Link } from 'react-router-dom';
import axios from './api/axios'; // Import the Axios instance
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import img from '../images/swal/2.gif'
import img2 from '../images/swal/3.gif'

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { fullName, email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!fullName || !email || !password) {
      Swal.fire({
        title: 'Incomplete Form',
        text: 'Please fill out all required fields.',
        icon: 'warning',
        confirmButtonText: 'OK',
        // background: '#E8E1DA',
        confirmButtonColor: '#8E7B70',
      });
      return; // Stop form submission
    }
  
    try {
      const response = await axios.post('/users/register', formData);
    
      Swal.fire({
        title: 'Welcome to Petify!',
        text: 'Your account has been created successfully.',
        imageUrl: img, // Custom icon representing Petify
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'Cat Icon',
        // background: '#E8E1DA', // Petify's background color
        confirmButtonColor: '#8E7B70', // Custom button color
        confirmButtonText: 'Login Now',
        customClass: {
          title: 'custom-title',
          popup: 'custom-popup',
          confirmButton: 'custom-button',
        },
      }).then(() => {
        window.location.href = '/login';
      });
    
    } catch (err) {
      if (err.response?.data?.msg === 'User already exists') {
        Swal.fire({
          title: 'User Already Exists!',
          text: 'It looks like you already have an account. Please log in instead.',
          imageUrl: img2, // Custom icon representing Petify
          imageWidth: 150,
          imageHeight: 150,
          imageAlt: 'Cat Icon',
          // background: '#E8E1DA',
          confirmButtonColor: '#8E7B70',
          confirmButtonText: 'Login Now',
          customClass: {
            title: 'custom-title',
            popup: 'custom-popup',
            confirmButton: 'custom-button',
          },
        }).then(() => {
          window.location.href = '/login';
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: err.response?.data?.msg || 'Registration failed',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };
  
  
  return (
    <div className="container">
      <a href="./">
        <h2>Petify</h2>
      </a>
      <form className="form" onSubmit={handleSubmit}>
        <h3>Signup With</h3>
        <div className="flex-column">
          <div className="inputForm">
            <i className="fa-regular fa-user"></i>
            <input
              placeholder="Enter your Full Name"
              className="input"
              type="text"
              name="fullName"
              value={fullName}
              onChange={handleChange}
            />
          </div>
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
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>

        <div className="inputForm">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="-64 0 512 512" height="20">
            <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
            <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
          </svg>
          <input
            placeholder="Enter your Password"
            className="input"
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>

        <div className="flex-row">
          <div></div>
          {/* <span className="span">Forgot password?</span> */}
        </div>

        {/* <p className="p line">Or With</p> */}
        <div className="flex-row">
         
        </div>
        <button className="button-submit">Sign Up</button>
        <p className="p">Have an account? <span className="span">  <Link to='/login'>Sign In</Link></span></p>
        {/* <p className="p">Are you a Veterinarian? <span className="span"><a href="vet_login.html">Register as a vet now</a></span></p> */}
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <div className="image-container">
        <img src={cat_2} alt="Image" className="image" />
      </div>
    </div>
  );
}

export default Signup;

import axios from 'axios';

// Create an Axios instance with the base URL of your backend
const instance = axios.create({
  baseURL: 'https://petifyback-2.onrender.com'  // Replace with your backend URL
});

export default instance;

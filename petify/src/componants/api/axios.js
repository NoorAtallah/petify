import axios from 'axios';

// Create an Axios instance with the base URL of your backend
const instance = axios.create({
  baseURL: 'http://localhost:5000/api'  // Replace with your backend URL
});

export default instance;

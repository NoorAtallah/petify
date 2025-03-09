
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBRbQXfO7bVbpB0K-OtWFTwa-XODxPKkeA",
  authDomain: "petify-da098.firebaseapp.com",
  projectId: "petify-da098",
  storageBucket: "petify-da098.appspot.com",
  messagingSenderId: "452476836144",
  appId: "1:452476836144:web:b76f54b15f357181c9d0f5",
  measurementId: "G-7VVJHDTF9K"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { app, storage  };
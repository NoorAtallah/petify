import React, { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { app, storage} from '../firebase/config'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import notificationSoundFile from '../images/notification/notification-sound-2-253324.mp3';

const socket = io('http://localhost:5000');

const Chat = () => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null); // State to store the selected file
  const [chat, setChat] = useState([]);
  const { user, isAuthenticated } = useContext(AuthContext);
  const notificationSound = useRef(null);
  const openingHour = 9;
  const closingHour = 23;
  useEffect(() => {
    notificationSound.current = new Audio(notificationSoundFile);
  }, []);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/chat/vetmessages');
        setChat(res.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    socket.on('receiveMessage', (messageData) => {
      setChat((prevChat) => [...prevChat, messageData]);
      playNotificationSound();
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);
  const playNotificationSound = () => {
    try {
      if (notificationSound.current) {
        // Reset the audio to the beginning
        notificationSound.current.currentTime = 0;
        // Play the sound with user interaction handling
        const playPromise = notificationSound.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error playing notification sound:', error);
          });
        }
      }
    } catch (error) {
      console.error('Error with notification sound:', error);
    }
  };
  const uploadFile = async () => {
    if (!file) return null;

    const storageRef = ref(storage, `chat_files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle progress here if needed
        },
        (error) => {
          console.error('Error uploading file:', error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const sendMessage = async () => {
    if (!isAuthenticated) {
      return alert('Please login to send a message');
    }

    // if (!subscription) {
    //   return alert('Please subscribe to access the chat');
    // }

    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour < openingHour || currentHour >= closingHour) {
      alert('Chat is closed. Redirecting to the symptom checker...');
      window.location.href = '/symptom-checker';
      return;
    }

    let imageUrl = null;

    // If a file is selected, upload it to Firebase and get the URL
    if (file) {
      imageUrl = await uploadFile();
      setFile(null); // Reset file state after uploading
    }

    const messageData = {
      userId: user.id,
      text: message,
      username: user.fullName,
      imageUrl, // Send the uploaded file URL as part of the message
      role: user.role,
    };

    try {
      await axios.post('http://localhost:5000/api/chat/postmessege', messageData);
      setMessage(''); // Reset message input
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans bg-[#E8E1DA] border-4 border-[#d9ccc5] rounded-lg shadow-lg mt-6 mb-6">
      <h1 className="text-3xl font-bold text-center text-[#8E7B70]">Paw Chat</h1>
      <div className="bg-white border-4 border-[#d9ccc5] rounded-lg p-4 h-96 overflow-y-auto mb-4 shadow-inner">
        {chat.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-4 ${msg.user === user?.id ? 'text-right' : 'text-left'}`}
          >
            <div 
              className={`inline-block p-3 rounded-2xl max-w-xs lg:max-w-md ${
                msg.user === user?.id ? 'bg-[#8E7B70] text-white' : 'bg-[#E8E1DA] text-[#795548]'
              }`}
            >
              <p className="font-bold">{msg.username || 'Unknown Pet'} 🐾</p>
              {msg.text && <p>{msg.text}</p>}
              {msg.imageUrl && <img src={msg.imageUrl} alt="User file" className="mt-2 max-w-xs" />}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-3 border-4 border-[#d9ccc5] rounded-l-full focus:outline-none focus:ring-2 focus:ring-[#d9ccc5]"
          placeholder="Type your message..."
        />
        <button 
          onClick={sendMessage}
          className="bg-[#8E7B70] text-white px-6 py-3 rounded-r-full hover:bg-[#d9ccc5] focus:outline-none focus:ring-2 focus:ring-[#FF9800] transition duration-300 ease-in-out"
        >
         Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

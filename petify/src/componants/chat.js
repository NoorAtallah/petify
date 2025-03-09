import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { storage } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { X } from 'lucide-react';

const socket = io('http://localhost:5000');

const Chat = () => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [chat, setChat] = useState([]);
  const [error, setError] = useState('');
  const { user, isAuthenticated, subscription } = useContext(AuthContext);

  const openingHour = 9;
  const closingHour = 17;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/chat/getmessege');
        setChat(res.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    socket.on('receiveMessage', (messageData) => {
      setChat((prevChat) => [...prevChat, messageData]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should not exceed 5MB');
        return;
      }
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
      setError('');
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const uploadFile = async () => {
    if (!file) return null;

    const storageRef = ref(storage, `chat_files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
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
      setError('Please login to send a message');
      return;
    }

    if (!subscription) {
      setError('Please subscribe to access the chat');
      return;
    }

    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour < openingHour || currentHour >= closingHour) {
      setError('Chat is closed. Redirecting to the symptom checker...');
      setTimeout(() => window.location.href = '/symptom-checker', 3000);
      return;
    }

    let imageUrl = null;

    if (file) {
      imageUrl = await uploadFile();
      setFile(null);
      setFilePreview(null);
    }

    const messageData = {
      userId: user.id,
      text: message,
      username: user.fullName,
      imageUrl,
      role: user.role,
    };

    try {
      await axios.post('http://localhost:5000/api/chat/postmessege', messageData);
      setMessage('');
      setError('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans bg-gradient-to-b from-[#E8E1DA] to-[#d9ccc5] rounded-xl shadow-2xl mt-6 mb-6">
      <h1 className="text-4xl font-bold text-center text-[#8E7B70] mb-6">Paw Chat</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="bg-white rounded-xl p-4 h-[70vh] overflow-y-auto mb-4 shadow-inner">
        {chat.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.user === user?.id ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div 
              className={`p-3 rounded-2xl max-w-[70%] ${
                msg.user === user?.id ? 'bg-[#8E7B70] text-white' : 'bg-[#E8E1DA] text-[#795548]'
              }`}
            >
              <p className="font-bold mb-1">{msg.username || 'Unknown Pet'} 🐾</p>
              {msg.text && <p className="break-words">{msg.text}</p>}
              {msg.imageUrl && <img src={msg.imageUrl} alt="User file" className="mt-2 max-w-full rounded-lg" />}
            </div>
          </div>
        ))}
      </div>

      {filePreview && (
        <div className="mb-4 relative">
          <div className="flex items-center bg-white p-3 rounded-lg shadow-md">
            <div className="relative group">
              <img 
                src={filePreview} 
                alt="Preview" 
                className="w-24 h-24 rounded-lg object-cover border-2 border-[#8E7B70] transition-transform transform hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-300"></div>
            </div>
            <div className="ml-4 flex-grow">
              <p className="text-sm text-gray-600 truncate max-w-xs">
                {file?.name || 'Selected Image'}
              </p>
              <p className="text-xs text-gray-500">
                {file && (file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button 
              onClick={removeFile}
              className="ml-2 p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors duration-300"
              aria-label="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="p-2 hover:bg-[#8E7B70] hover:bg-opacity-10 rounded-full transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8E7B70]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </div>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-3 border-2 border-[#d9ccc5] rounded-full focus:outline-none focus:ring-2 focus:ring-[#8E7B70] transition duration-300"
          placeholder="Type your message..."
        />
        <button 
          onClick={sendMessage}
          className="bg-[#8E7B70] text-white p-3 rounded-full hover:bg-[#795548] focus:outline-none focus:ring-2 focus:ring-[#FF9800] transition duration-300 ease-in-out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Chat;
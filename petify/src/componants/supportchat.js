import React, { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { app, storage} from '../firebase/config'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { MessageSquare, Send, Paperclip } from 'lucide-react';
// Import the sound file
import notificationSoundFile from '../images/notification/notification-sound-2-253324.mp3';

const socket = io('http://localhost:5000');

const ChatSuppert = () => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [chat, setChat] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, subscription } = useContext(AuthContext);
  const notificationSound = useRef(null);

  const openingHour = 9;
  const closingHour = 23;

  // Initialize the audio in useEffect to avoid SSR issues
  useEffect(() => {
    notificationSound.current = new Audio(notificationSoundFile);
  }, []);

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
      // Play sound only if the message is from someone else
      if (messageData.userId !== user?.id) {
        playNotificationSound();
      }
      setChat((prevChat) => [...prevChat, messageData]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [user?.id]);

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

    if (!subscription) {
      return alert('Please subscribe to access the chat');
    }

    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour < openingHour || currentHour >= closingHour) {
      alert('Chat is closed. Redirecting to the symptom checker...');
      window.location.href = '/symptom-checker';
      return;
    }

    let imageUrl = null;

    if (file) {
      imageUrl = await uploadFile();
      setFile(null);
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
      socket.emit('sendMessage', messageData); // Emit the message to socket
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleChat}
        className="bg-[#8E7B70] text-white rounded-full p-3 shadow-lg hover:bg-[#d9ccc5] transition-colors"
      >
        <MessageSquare size={24} />
      </button>
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-[#E8E1DA] rounded-lg shadow-xl overflow-hidden">
          <div className="p-4 bg-[#8E7B70] text-white">
            <h2 className="text-xl font-bold">Paw Chat</h2>
          </div>
          <div className="h-96 overflow-y-auto p-4 bg-white">
            {chat.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-4 ${msg.userId === user?.id ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block p-3 rounded-2xl max-w-xs lg:max-w-md ${
                    msg.userId === user?.id ? 'bg-[#8E7B70] text-white' : 'bg-[#E8E1DA] text-[#795548]'
                  }`}
                >
                  <p className="font-bold">{msg.username || 'Unknown Pet'} 🐾</p>
                  {msg.text && <p>{msg.text}</p>}
                  {msg.imageUrl && <img src={msg.imageUrl} alt="User file" className="mt-2 max-w-xs" />}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-[#E8E1DA] flex items-center">
            <label className="cursor-pointer mr-2">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                accept="image/*"
              />
              <Paperclip size={20} className="text-[#8E7B70]" />
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-grow p-2 rounded-l-full border-2 border-[#d9ccc5] focus:outline-none focus:ring-2 focus:ring-[#8E7B70]"
              placeholder="Type your message..."
            />
            <button 
              onClick={sendMessage}
              className="bg-[#8E7B70] text-white p-2 rounded-r-full hover:bg-[#d9ccc5] focus:outline-none focus:ring-2 focus:ring-[#8E7B70] transition duration-300 ease-in-out"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSuppert;
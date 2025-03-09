import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
import axios from './api/axios';
import { AlertCircle, CheckCircle, PawPrint } from 'lucide-react';
import Swal from 'sweetalert2';

const PostPet = () => {
  const [step, setStep] = useState(1);
  const [petData, setPetData] = useState({
    name: '', breed: '', age: '', gender: '', location: '', vaccinationStatus: '',
    healthInfo: '', size: '', temperament: '', spayedNeutered: false,
    goodWithKids: false, goodWithOtherPets: false, adoptionFee: '',
    contactInfo: '', type: '', description: '', image: null, imageUrl: ''
  });
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPetData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return; // Handle case when no file is selected

    const storageRef = ref(storage, `pets/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.error("Upload failed:", error);
        Swal.fire({
          title: 'Upload Error!',
          text: 'Failed to upload image. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setPetData(prev => ({ ...prev, imageUrl: downloadURL }));
          Swal.fire({
            icon: 'success',
            title: 'Image Uploaded!',
            text: 'Your pet image has been uploaded successfully.',
            timer: 2000,
            showConfirmButton: false
          });
        } catch (err) {
          console.error('Error getting download URL:', err);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to retrieve image URL.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!petData.imageUrl) {
      Swal.fire({
        title: 'Error!',
        text: 'Please upload an image before submitting.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      if (!token) {
        Swal.fire({
          title: 'Error!',
          text: 'You must be logged in to post a pet.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }

      const response = await axios.post('/adopt/postpets', petData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Pet posted successfully!',
        confirmButtonText: 'OK'
      }).then(() => {
        // Reset form and state
        setPetData({
          name: '', breed: '', age: '', gender: '', location: '', vaccinationStatus: '',
          healthInfo: '', size: '', temperament: '', spayedNeutered: false,
          goodWithKids: false, goodWithOtherPets: false, adoptionFee: '',
          contactInfo: '', type: '', description: '', image: null, imageUrl: ''
        });
        setStep(1);
      });
    } catch (error) {
      console.error('Error posting pet:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);

        if (error.response.status === 400) {
          Swal.fire({
            title: 'Error!',
            text: `Bad request: ${error.response.data.message}`,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else if (error.response.status === 401) {
          Swal.fire({
            title: 'Error!',
            text: 'You must be logged in to post a pet.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: `Error posting pet: ${error.response.data.message}`,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        Swal.fire({
          title: 'Error!',
          text: 'No response received from server',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } else {
        console.error('Error setting up request:', error.message);
        Swal.fire({
          title: 'Error!',
          text: 'Error setting up request',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const nextStep = () => setStep(prevStep => prevStep + 1);
  const prevStep = () => setStep(prevStep => prevStep - 1);

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#967D6C] mb-4">Let's start with the basics</h2>
            <input
              type="text"
              name="name"
              placeholder="What's your pet's name?"
              value={petData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-[#E8E1DA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#00D1BD] focus:border-transparent"
            />
            <select
              name="type"
              value={petData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-[#E8E1DA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#00D1BD] focus:border-transparent"
            >
              <option value="">What type of pet is it?</option>
              <option value="Dog">🐶 Dog</option>
              <option value="Cat">🐱 Cat</option>
              <option value="Other">🐰 Other</option>
            </select>
            <input
              type="text"
              name="breed"
              placeholder="What breed is your pet?"
              value={petData.breed}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-[#E8E1DA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#00D1BD] focus:border-transparent"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#967D6C] mb-4">Tell us more about your pet</h2>
            <input
              type="number"
              name="age"
              placeholder="How old is your pet?"
              value={petData.age}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-[#E8E1DA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#00D1BD] focus:border-transparent"
            />
            <select
              name="gender"
              value={petData.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-[#E8E1DA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#00D1BD] focus:border-transparent"
            >
              <option value="">What's your pet's gender?</option>
              <option value="Male">♂️ Male</option>
              <option value="Female">♀️ Female</option>
            </select>
            <select
              name="size"
              value={petData.size}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-[#E8E1DA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#00D1BD] focus:border-transparent"
            >
              <option value="">How big is your pet?</option>
              <option value="Small">🐾 Small</option>
              <option value="Medium">🐾🐾 Medium</option>
              <option value="Large">🐾🐾🐾 Large</option>
            </select>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#967D6C] mb-4">Health and Behavior</h2>
            <select
              name="vaccinationStatus"
              value={petData.vaccinationStatus}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-[#E8E1DA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#00D1BD] focus:border-transparent"
            >
              <option value="">Is your pet's vaccination up-to-date?</option>
              <option value="Up-to-date">💉 Yes, up-to-date</option>
              <option value="Not up-to-date">❌ No, not up-to-date</option>
            </select>
            <textarea
              name="healthInfo"
              placeholder="Any specific health information we should know?"
              value={petData.healthInfo}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-[#E8E1DA] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00D1BD] focus:border-transparent"
              rows="3"
            ></textarea>
            <select
              name="temperament"
              value={petData.temperament}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-[#E8E1DA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#00D1BD] focus:border-transparent"
            >
              <option value="">How would you describe your pet's temperament?</option>
              <option value="Calm">😌 Calm</option>
              <option value="Active">🏃 Active</option>
              <option value="Aggressive">😠 Aggressive</option>
              <option value="Friendly">😊 Friendly</option>
            </select>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#967D6C] mb-4">Pet's Social Behavior</h2>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center space-x-2 text-[#967D6C]">
                <input
                  type="checkbox"
                  name="spayedNeutered"
                  checked={petData.spayedNeutered}
                  onChange={handleChange}
                  className="form-checkbox text-[#00D1BD] h-5 w-5"
                />
                <span>Is your pet spayed/neutered? 🐾</span>
              </label>
              <label className="flex items-center space-x-2 text-[#967D6C]">
                <input
                  type="checkbox"
                  name="goodWithKids"
                  checked={petData.goodWithKids}
                  onChange={handleChange}
                  className="form-checkbox text-[#00D1BD] h-5 w-5"
                />
                <span>Is your pet good with kids? 👧👦</span>
              </label>
              <label className="flex items-center space-x-2 text-[#967D6C]">
                <input
                  type="checkbox"
                  name="goodWithOtherPets"
                  checked={petData.goodWithOtherPets}
                  onChange={handleChange}
                  className="form-checkbox text-[#00D1BD] h-5 w-5"
                />
                <span>Is your pet good with other pets? 🐱🐶</span>
              </label>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#967D6C] mb-4">Adoption Details</h2>
            <input
              type="text"
              name="location"
              placeholder="Where is your pet located? 📍"
              value={petData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-[#E8E1DA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#00D1BD] focus:border-transparent"
            />
            <input
              type="number"
              name="adoptionFee"
              placeholder="What's the adoption fee? 💰"
              value={petData.adoptionFee}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-[#E8E1DA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#00D1BD] focus:border-transparent"
            />
            <input
              type="text"
              name="contactInfo"
              placeholder="Your contact information 📞"
              value={petData.contactInfo}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-[#E8E1DA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#00D1BD] focus:border-transparent"
            />
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#967D6C] mb-4">Final Details</h2>
            <textarea
              name="description"
              placeholder="Tell us more about your pet. What makes them special? 💖"
              value={petData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-[#E8E1DA] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00D1BD] focus:border-transparent"
              rows="4"
            ></textarea>
            <div className="flex items-center justify-between">
              <input
                type="file"
                onChange={handleImageUpload}
                className="text-sm text-[#967D6C] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00D1BD] file:text-white hover:file:bg-[#00A89A]"
              />
              {petData.imageUrl && (
                <img src={petData.imageUrl} alt="Pet" className="w-20 h-20 object-cover rounded-full border-2 border-[#00D1BD]" />
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-[#F6F3F0] rounded-3xl shadow-lg">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#967D6C]" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
        Post Your Furry Friend <PawPrint className="mr-2 inline-block" />
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          {renderStep()}
        </div>
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="bg-[#967D6C] text-white py-3 px-6 rounded-md hover:bg-[#7D6A5A] transition duration-300 transform hover:scale-105"
            >
              🐾 Previous
            </button>
          )}
          {step < 6 && (
            <button
              type="button"
              onClick={nextStep}
              className="bg-[#00D1BD] text-white py-3 px-6 rounded-md hover:bg-[#00A89A] transition duration-300 transform hover:scale-105"
            >
              Next 🐾
            </button>
          )}
          {step === 6 && (
            <button
              type="submit"
              className="bg-[#00D1BD] text-white py-3 px-6 rounded-md hover:bg-[#00A89A] transition duration-300 transform hover:scale-105"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostPet;

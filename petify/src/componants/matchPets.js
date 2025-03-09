import React, { useState } from 'react';
import axios from './api/axios';
import { PawPrint, MapPin, Heart, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const PetAdoptionForm = () => {
  const [size, setSize] = useState('');
  const [temperament, setTemperament] = useState('');
  const [goodWithKids, setGoodWithKids] = useState(false);
  const [goodWithOtherPets, setGoodWithOtherPets] = useState(false);
  const [gender, setGender] = useState('');
  const [matchedPets, setMatchedPets] = useState([]);
  const [type, setType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/pets/match', {
        size,
        temperament,
        goodWithKids,
        goodWithOtherPets,
        gender,
        type,
      });
      setMatchedPets(response.data);
    } catch (error) {
      console.error('Error fetching matched pets:', error);
    }
  };

  const SelectField = ({ label, value, onChange, options }) => (
    <div className="mb-6">
      <label className="block text-brown text-lg font-semibold mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-light border-2 border-customGray rounded-lg px-4 py-3 focus:outline-none focus:border-bermuda transition-all duration-300 text-brown"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  const CheckboxField = ({ label, checked, onChange }) => (
    <label className="flex items-center mb-4 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onChange(!checked)}
          className="sr-only"
        />
        <div className="w-6 h-6 border-2 border-brown rounded-md bg-light group-hover:border-bermuda transition-all duration-300">
          {checked && (
            <svg
              className="w-4 h-4 text-brown absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className="ml-3 text-lg text-brown font-semibold group-hover:text-bermuda transition-all duration-300">
        {label}
      </span>
    </label>
  );

  const PetCard = ({ pet }) => (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-102 hover:shadow-2xl">
      <div className="relative">
        <img
          className="w-full h-72 object-cover"
          src={pet.image}
          alt={pet.name}
        />
        <div className="absolute top-4 right-4">
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
            pet.status === 'Adoptable' ? 'bg-green text-white' : 'bg-bermuda text-brown'
          }`}>
            {pet.status}
          </span>
        </div>
      </div>
      
      <div className="p-6 bg-customGray">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-brown mb-2">
              {pet.name}
            </h3>
            <div className="flex items-center text-brown/80 mb-2">
              <MapPin size={16} className="mr-2" />
              <span className="text-sm">{pet.location || 'Location available upon request'}</span>
            </div>
          </div>
         
        </div>

        <div className="space-y-4">
          <p className="text-brown/80">{pet.description}</p>
          
          <div className="flex flex-wrap gap-2 my-4">
            {pet.traits?.map((trait, index) => (
              <span key={index} className="px-3 py-1 bg-light rounded-full text-sm text-brown">
                {trait}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-brown/20">
            <div className="flex items-center text-brown/80">
              <Calendar size={16} className="mr-2" />
              <span className="text-sm">Available Now</span>
            </div>
            <Link to={`/adopt/pet/${pet._id}`}>
              <button className="bg-brown hover:bg-bermuda text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center">
                Meet {pet.name}
                <PawPrint size={16} className="ml-2" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12 ">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-brown flex items-center justify-center">
          <PawPrint className="mr-3 text-bermuda" />
          Find Your Perfect Match
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <SelectField
            label="Size"
            value={size}
            onChange={setSize}
            options={['Small', 'Medium', 'Large']}
          />

          <SelectField
            label="Temperament"
            value={temperament}
            onChange={setTemperament}
            options={['Calm', 'Active', 'Friendly', 'Aggressive']}
          />

          <SelectField
            label="Gender"
            value={gender}
            onChange={setGender}
            options={['Male', 'Female']}
          />

          <SelectField
            label="Pet Type"
            value={type}
            onChange={setType}
            options={['Dog', 'Cat', 'Other']}
          />

          <div className="space-y-2 mb-8">
            <CheckboxField
              label="Good with kids"
              checked={goodWithKids}
              onChange={setGoodWithKids}
            />
            <CheckboxField
              label="Good with other pets"
              checked={goodWithOtherPets}
              onChange={setGoodWithOtherPets}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brown hover:bg-bermuda text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Find Pets
          </button>
        </form>

        {matchedPets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matchedPets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetAdoptionForm;
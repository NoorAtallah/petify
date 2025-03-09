import React, { useState, useEffect } from 'react';
import axios from './api/axios';
import { Link } from 'react-router-dom';
import { PawPrint, Heart, Info } from 'lucide-react';

const PetsForAdoption = () => {
  const [pets, setPets] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredPet, setHoveredPet] = useState(null);
  const petsPerPage = 6;

  const fetchPets = (type = '', page = 1) => {
    const url = type
      ? `/adopt/getpetbytype?type=${type}&page=${page}&limit=${petsPerPage}`
      : `/adopt/getpets?page=${page}&limit=${petsPerPage}`;
    axios
      .get(url)
      .then((response) => {
        setPets(response.data.pets);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => console.error('Error fetching pets:', error));
  };

  useEffect(() => {
    fetchPets(selectedType, currentPage);
  }, [selectedType, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center" style={{ color: '#967D6C' }}>
          <PawPrint className="mr-2" />
          Furry Friends Seeking Forever Homes
        </h1>

        {/* Navigation Button to Adoption Form */}
        <div className="flex justify-center mb-4">
          <Link to="/match">
            <button className="bg-brown hover:bg-bermuda text-white font-bold py-2 px-4 rounded-md transition duration-300">
              Find My Perfect Pet
            </button>
          </Link>
        </div>

        <div className="flex justify-center mb-8">
          <select
            className="border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-bermuda transition-all duration-300"
            style={{ backgroundColor: '#E8E1DA', color: '#967D6C' }}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Pets</option>
            <option value="Dog">Dogs</option>
            <option value="Cat">Cats</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 relative"
              onMouseEnter={() => setHoveredPet(pet._id)}
              onMouseLeave={() => setHoveredPet(null)}
            >
              <img
                className="w-full h-64 object-cover"
                src={pet.image}
                alt={pet.name}
              />
              <div className="p-6" style={{ backgroundColor: '#E8E1DA' }}>
                <h3 className="text-2xl font-semibold mb-2" style={{ color: '#967D6C' }}>
                  {pet.name}
                </h3>
                <p className="text-gray-600 mb-4">{pet.description}</p>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      pet.status === 'Adoptable'
                        ? 'bg-green text-white'
                        : 'bg-bermuda text-brown'
                    }`}
                  >
                    {pet.status}
                  </span>
                  <Link to={`/adopt/pet/${pet._id}`}>
                    <button className="bg-brown hover:bg-bermuda text-white font-bold py-2 px-4 rounded-md transition duration-300">
                      Meet {pet.name}
                    </button>
                  </Link>
                </div>
              </div>
              {hoveredPet === pet._id && (
                <div className="absolute top-2 right-2 flex space-x-2">
                  {/* Additional icons or actions can go here */}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <button
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              currentPage === 1 ? 'bg-customGray text-brown' : 'bg-brown hover:bg-bermuda text-white'
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-brown bg-customGray rounded-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              currentPage === totalPages ? 'bg-customGray text-brown' : 'bg-brown hover:bg-bermuda text-white'
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetsForAdoption;

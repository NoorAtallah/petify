import React, { useState, useEffect } from 'react';

const EditPetModal = ({ pet, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    gender: '',
    description: '',
    status: '',
    image: '',
    location: '',
    vaccinationStatus: '',
    healthInfo: '',
    size: '',
    temperament: '',
    spayedNeutered: false,
    goodWithKids: false,
    goodWithOtherPets: false,
    adoptionFee: '',
    contactInfo: '',
    type: ''
  });

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '',
        breed: pet.breed || '',
        age: pet.age || '',
        gender: pet.gender || '',
        description: pet.description || '',
        status: pet.status || 'Adoptable',
        image: pet.image || '',
        location: pet.location || '',
        vaccinationStatus: pet.vaccinationStatus || '',
        healthInfo: pet.healthInfo || '',
        size: pet.size || '',
        temperament: pet.temperament || '',
        spayedNeutered: pet.spayedNeutered || false,
        goodWithKids: pet.goodWithKids || false,
        goodWithOtherPets: pet.goodWithOtherPets || false,
        adoptionFee: pet.adoptionFee || '',
        contactInfo: pet.contactInfo || '',
        type: pet.type || ''
      });
    }
  }, [pet]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 mt-16">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#967D6C]">Edit Pet Information</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Adoptable">Adoptable</option>
                  <option value="Pending">Pending</option>
                  <option value="Adopted">Adopted</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Breed</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Health Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vaccination Status</label>
                <select
                  name="vaccinationStatus"
                  value={formData.vaccinationStatus}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Up-to-date">Up-to-date</option>
                  <option value="Not up-to-date">Not up-to-date</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Health Information</label>
                <textarea
                  name="healthInfo"
                  value={formData.healthInfo}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Size</label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Select Size</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Temperament</label>
                <select
                  name="temperament"
                  value={formData.temperament}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="">Select Temperament</option>
                  <option value="Calm">Calm</option>
                  <option value="Active">Active</option>
                  <option value="Aggressive">Aggressive</option>
                  <option value="Friendly">Friendly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Adoption Fee</label>
              <input
                type="number"
                name="adoptionFee"
                value={formData.adoptionFee}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Information</label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="spayedNeutered"
                  checked={formData.spayedNeutered}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#967D6C] focus:ring-[#967D6C] border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Spayed/Neutered</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="goodWithKids"
                  checked={formData.goodWithKids}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#967D6C] focus:ring-[#967D6C] border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Good with Kids</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="goodWithOtherPets"
                  checked={formData.goodWithOtherPets}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#967D6C] focus:ring-[#967D6C] border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Good with Other Pets</label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#967D6C] rounded-md hover:bg-[#876c5c]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPetModal;
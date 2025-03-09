import React, { useState, useEffect } from 'react';
import axios from './api/axios';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Heart, ChevronDown, ChevronUp, Phone, X } from 'lucide-react';

const PetDetails = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    characteristics: true,
    compatibility: true,
    health: true,
    contact: true,
  });

  useEffect(() => {
    axios.get(`/adopt/getpet/${id}`)
      .then((response) => setPet(response.data))
      .catch((error) => console.error('Error fetching pet details:', error));
  }, [id]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const BooleanIcon = ({ value }) => 
    value ? <CheckCircle className="inline text-green-500 mr-2" /> : <XCircle className="inline text-red-500 mr-2" />;

  if (!pet) {
    return <div className="min-h-screen bg-light flex items-center justify-center">
      <div className="text-2xl text-brown">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen py-8">
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button 
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-brown mb-4">Contact Information</h2>
            <p className="text-gray-600">{pet.contactInfo}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/3 p-8">
              <img 
                className="w-full h-64 object-cover rounded-lg shadow-md" 
                src={pet.image} 
                alt={pet.name} 
              />
              <div className="mt-8">
                <div className="uppercase tracking-wide text-sm text-bermuda font-semibold">{pet.type}</div>
                <h1 className="mt-2 text-3xl font-bold text-brown">{pet.name}</h1>
                <p className="mt-2 text-gray-600">{pet.description}</p>
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={() => setShowContactModal(true)}
                    className="flex items-center justify-center bg-bermuda hover:bg-green text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Contact
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:w-2/3 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ExpandableSection
                  title="Basic Information"
                  isExpanded={expandedSections.basicInfo}
                  onToggle={() => toggleSection('basicInfo')}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="Breed" value={pet.breed} />
                    <InfoItem label="Age" value={pet.age ? `${pet.age} years` : 'Unknown'} />
                    <InfoItem label="Gender" value={pet.gender} />
                    <InfoItem label="Size" value={pet.size} />
                  </div>
                </ExpandableSection>

                <ExpandableSection
                  title="Characteristics"
                  isExpanded={expandedSections.characteristics}
                  onToggle={() => toggleSection('characteristics')}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="Status" value={pet.status} />
                    <InfoItem label="Location" value={pet.location} />
                    <InfoItem label="Vaccination" value={pet.vaccinationStatus} />
                    <InfoItem label="Temperament" value={pet.temperament} />
                  </div>
                </ExpandableSection>

                <ExpandableSection
                  title="Compatibility"
                  isExpanded={expandedSections.compatibility}
                  onToggle={() => toggleSection('compatibility')}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem 
                      label="Spayed/Neutered" 
                      value={<BooleanIcon value={pet.spayedNeutered} />} 
                    />
                    <InfoItem 
                      label="Good with Kids" 
                      value={<BooleanIcon value={pet.goodWithKids} />} 
                    />
                    <InfoItem 
                      label="Good with Pets" 
                      value={<BooleanIcon value={pet.goodWithOtherPets} />} 
                    />
                    <InfoItem 
                      label="Adoption Fee" 
                      value={pet.adoptionFee ? `$${pet.adoptionFee}` : 'Not specified'} 
                    />
                  </div>
                </ExpandableSection>

                <ExpandableSection
                  title="Health Information"
                  isExpanded={expandedSections.health}
                  onToggle={() => toggleSection('health')}
                >
                  <p className="text-gray-600">{pet.healthInfo || 'No specific health information available.'}</p>
                </ExpandableSection>

                <ExpandableSection
                  title="Contact Information"
                  isExpanded={expandedSections.contact}
                  onToggle={() => toggleSection('contact')}
                >
                  <p className="text-gray-600">{pet.contactInfo}</p>
                </ExpandableSection>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{value || 'Not specified'}</dd>
  </div>
);

const ExpandableSection = ({ title, children, isExpanded, onToggle }) => (
  <div className="border-t border-gray-200 pt-4">
    <button
      className="flex justify-between items-center w-full text-left"
      onClick={onToggle}
    >
      <h2 className="text-xl font-semibold text-brown">{title}</h2>
      {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
    </button>
    {isExpanded && <div className="mt-4">{children}</div>}
  </div>
);

export default PetDetails;
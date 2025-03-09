import React, { useState } from 'react';
import axios from './api/axios';

const ConsultationForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    petOwnerId: '',
    petName: '',
    symptoms: '',
    diagnosis: '',
    notes: '',
    followUpDate: '',
    prescriptions: [
      {
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        notes: ''
      }
    ]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/history/create', formData);
      setIsModalOpen(false);
      setFormData({
        petOwnerId: '',
        petName: '',
        symptoms: '',
        diagnosis: '',
        notes: '',
        followUpDate: '',
        prescriptions: [
          {
            medication: '',
            dosage: '',
            frequency: '',
            duration: '',
            notes: ''
          }
        ]
      });
    } catch (error) {
      console.error('Error creating consultation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrescriptionChange = (index, field, value) => {
    const newPrescriptions = [...formData.prescriptions];
    newPrescriptions[index][field] = value;
    setFormData({ ...formData, prescriptions: newPrescriptions });
  };

  const addPrescription = () => {
    setFormData({
      ...formData,
      prescriptions: [
        ...formData.prescriptions,
        {
          medication: '',
          dosage: '',
          frequency: '',
          duration: '',
          notes: ''
        }
      ]
    });
  };

  const removePrescription = (index) => {
    const newPrescriptions = formData.prescriptions.filter((_, i) => i !== index);
    setFormData({ ...formData, prescriptions: newPrescriptions });
  };

  return (
    <div>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
      >
        + New Consultation
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">New Medical Consultation</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pet Owner ID
                    </label>
                    <input
                      type="text"
                      value={formData.petOwnerId}
                      onChange={(e) => setFormData({ ...formData, petOwnerId: e.target.value })}
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pet Name
                    </label>
                    <input
                      type="text"
                      value={formData.petName}
                      onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symptoms
                  </label>
                  <textarea
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    className="w-full p-3 border rounded-lg h-24"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnosis
                  </label>
                  <textarea
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    className="w-full p-3 border rounded-lg h-24"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-lg font-medium text-gray-700">Prescriptions</label>
                    <button
                      type="button"
                      onClick={addPrescription}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      + Add Prescription
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.prescriptions.map((prescription, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-md font-medium text-gray-700">
                            Prescription {index + 1}
                          </h4>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removePrescription(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Medication
                            </label>
                            <input
                              type="text"
                              value={prescription.medication}
                              onChange={(e) => handlePrescriptionChange(index, 'medication', e.target.value)}
                              className="w-full p-2 border rounded-lg"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Dosage
                            </label>
                            <input
                              type="text"
                              value={prescription.dosage}
                              onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                              className="w-full p-2 border rounded-lg"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Frequency
                            </label>
                            <input
                              type="text"
                              value={prescription.frequency}
                              onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)}
                              className="w-full p-2 border rounded-lg"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Duration
                            </label>
                            <input
                              type="text"
                              value={prescription.duration}
                              onChange={(e) => handlePrescriptionChange(index, 'duration', e.target.value)}
                              className="w-full p-2 border rounded-lg"
                              required
                            />
                          </div>

                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Notes
                            </label>
                            <textarea
                              value={prescription.notes}
                              onChange={(e) => handlePrescriptionChange(index, 'notes', e.target.value)}
                              className="w-full p-2 border rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-3 border rounded-lg h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Consultation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationForm;
import React, { useState, useEffect } from 'react';
import { Dog, Cat, ChevronRight, AlertCircle } from 'lucide-react';
import axios from './api/axios';

const SymptomCheckerForm = () => {
  const [step, setStep] = useState(1);
  const [petType, setPetType] = useState('');
  const [petName, setPetName] = useState('');
  const [symptom, setSymptom] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [details, setDetails] = useState('');
  const [recommendedAction, setRecommendedAction] = useState('');
  const [potentialTests, setPotentialTests] = useState([]);
  const [availableSymptoms, setAvailableSymptoms] = useState([]);

  // New effect to fetch symptoms when pet type changes
  useEffect(() => {
    const fetchSymptoms = async () => {
      if (!petType) return;
      
      try {
        const response = await axios.get(`/sym/symptoms/${petType}`);
        setAvailableSymptoms(response.data.symptoms);
      } catch (error) {
        console.error('Error fetching symptoms:', error);
      }
    };

    fetchSymptoms();
  }, [petType]);

  const handleSymptomChange = async (e) => {
    setSymptom(e.target.value);
    try {
      const response = await axios.post('/sym/check-symptoms', {
        petType,
        symptoms: e.target.value,
      });
      setQuestions(response.data.questions);
      setDiagnosis(response.data.diagnosis || '');
      setDetails(response.data.details || '');
      setRecommendedAction(response.data.recommendedAction || '');
      setPotentialTests(response.data.potentialTests || []);
      setAdvice(response.data.advice || '');
      setCurrentQuestionIndex(0);
      setAnswers({});
      setStep(3);
    } catch (error) {
      console.error('Error fetching symptom details:', error);
    }
  };

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [currentQuestionIndex]: answer };
    setAnswers(newAnswers);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleDiagnosis(newAnswers);
    }
  };

  const handleDiagnosis = async (finalAnswers) => {
    try {
      const response = await axios.post('/sym/get-diagnosis', {
        petType,
        symptom,
        answers: finalAnswers,
      });
      setDiagnosis(response.data.diagnosis);
      setDetails(response.data.details);
      setRecommendedAction(response.data.recommendedAction);
      setPotentialTests(response.data.potentialTests);
      setAdvice(response.data.advice);
      setStep(4);
    } catch (error) {
      console.error('Error fetching diagnosis:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-brown">What type of pet do you have?</h2>
            <div className="flex space-x-4">
              <button
                className={`flex-1 p-6 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all ${
                  petType === 'dog' ? 'bg-light border-2 border-green' : 'bg-customGray hover:bg-light'
                }`}
                onClick={() => setPetType('dog')}
              >
                <Dog size={48} color={petType === 'dog' ? '#00D1BD' : '#967D6C'} />
                <span className={petType === 'dog' ? 'text-green' : 'text-brown'}>Dog</span>
              </button>
              <button
                className={`flex-1 p-6 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all ${
                  petType === 'cat' ? 'bg-light border-2 border-green' : 'bg-customGray hover:bg-light'
                }`}
                onClick={() => setPetType('cat')}
              >
                <Cat size={48} color={petType === 'cat' ? '#00D1BD' : '#967D6C'} />
                <span className={petType === 'cat' ? 'text-green' : 'text-brown'}>Cat</span>
              </button>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-brown">Pet's Name (optional)</label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full p-3 border-2 border-bermuda rounded-lg bg-light focus:outline-none focus:border-green transition duration-300"
                placeholder="Enter pet's name"
              />
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full bg-green text-black py-3 px-6 rounded-lg hover:bg-bermuda transition duration-300 flex items-center justify-center space-x-2"
              disabled={!petType}
            >
              <span>Continue</span>
              <ChevronRight size={20} />
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-brown">What symptoms is {petName || 'your pet'} experiencing?</h2>
            <div className="relative">
              <select 
                value={symptom} 
                onChange={handleSymptomChange}
                className="w-full p-3 border-2 border-bermuda rounded-lg bg-light focus:outline-none focus:border-green transition duration-300 appearance-none"
              >
                <option value="">Select a symptom</option>
                {availableSymptoms.map((s, index) => (
                  <option key={index} value={s}>{s}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronRight className="rotate-90" size={20} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full bg-brown text-white py-3 px-6 rounded-lg hover:bg-bermuda transition duration-300"
            >
              Back
            </button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-brown">Answer a few questions</h2>
            {currentQuestionIndex < questions.length && (
              <div className="bg-light p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-green mb-4">Question {currentQuestionIndex + 1} of {questions.length}</h3>
                <p className="text-brown mb-6">{questions[currentQuestionIndex]}</p>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className="flex-1 bg-green text-black py-3 px-6 rounded-lg hover:bg-bermuda transition duration-300"
                    onClick={() => handleAnswer('yes')}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-brown text-white py-3 px-6 rounded-lg hover:bg-bermuda transition duration-300"
                    onClick={() => handleAnswer('no')}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-brown">Results</h2>
            <div className="bg-light p-6 rounded-xl shadow-md space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-green mb-2">Possible Diagnosis:</h3>
                <p className="text-brown">{diagnosis}</p>
              </div>
              {details && (
                <div>
                  <h3 className="text-lg font-semibold text-green mb-2">Details:</h3>
                  <p className="text-brown">{details}</p>
                </div>
              )}
              {recommendedAction && (
                <div>
                  <h3 className="text-lg font-semibold text-green mb-2">Recommended Action:</h3>
                  <p className="text-brown">{recommendedAction}</p>
                </div>
              )}
              {potentialTests && potentialTests.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-green mb-2">Potential Tests:</h3>
                  <ul className="list-disc list-inside text-brown">
                    {potentialTests.map((test, index) => (
                      <li key={index}>{test}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-green mb-2">Advice:</h3>
                <p className="text-brown">{advice}</p>
              </div>
              <div className="flex items-center p-4 bg-customGray rounded-lg">
                <AlertCircle className="text-red mr-3" size={24} />
                <p className="text-sm text-brown">Always consult with a veterinarian for proper diagnosis and treatment.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setPetType('');
                setPetName('');
                setSymptom('');
                setQuestions([]);
                setCurrentQuestionIndex(0);
                setAnswers({});
                setDiagnosis('');
                setAdvice('');
                setDetails('');
                setRecommendedAction('');
                setPotentialTests([]);
              }}
              className="w-full bg-green text-black py-3 px-6 rounded-lg hover:bg-bermuda transition duration-300"
            >
              Start Over
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-light rounded-2xl shadow-lg mt-10 mb-10">
      <h1 className="text-3xl font-bold text-center text-brown mb-8">Pet Symptom Checker</h1>
      {renderStep()}
    </div>
  );
};

export default SymptomCheckerForm;
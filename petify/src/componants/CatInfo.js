import React, { useEffect, useState } from 'react';
import { fetchCatBreeds, fetchDogBreeds } from './catInfoService';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Cat, Dog } from 'lucide-react';

const PetBreedExplorerGame = () => {
  const [breeds, setBreeds] = useState([]);
  const [animalType, setAnimalType] = useState('cat');
  const [currentBreed, setCurrentBreed] = useState(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('start');
  const [timer, setTimer] = useState(60);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [encounteredBreeds, setEncounteredBreeds] = useState([]);

  useEffect(() => {
    const getBreeds = async () => {
      const fetchedBreeds = animalType === 'cat' ? await fetchCatBreeds() : await fetchDogBreeds();
      setBreeds(fetchedBreeds);
    };
    getBreeds();
  }, [animalType]);

  useEffect(() => {
    let interval;
    if (gameState === 'playing' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setGameState('end');
    }
    return () => clearInterval(interval);
  }, [gameState, timer]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimer(60);
    setEncounteredBreeds([]);
    nextBreed();
  };

  const nextBreed = () => {
    const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
    setCurrentBreed(randomBreed);
    setSelectedAnswer(null);
    setEncounteredBreeds(prevBreeds => [...prevBreeds, randomBreed]);
    const incorrectOptions = breeds
      .filter(b => b.id !== randomBreed.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(b => b.name);
    const allOptions = [randomBreed.name, ...incorrectOptions].sort(() => 0.5 - Math.random());
    setAnswers(allOptions);
  };

  const handleGuess = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentBreed.name) {
      setScore((prevScore) => prevScore + 1);
    }
    setTimeout(() => {
      if (timer > 0) {
        nextBreed();
      } else {
        setGameState('end');
      }
    }, 1500);
  };

  const renderBreedDetails = (breed) => (
    <div key={breed.id} className="bg-white rounded-lg p-6 mb-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <h3 className="text-2xl font-bold mb-3 text-brown-800">{breed.name}</h3>
      <img src={breed.image?.url || '/api/placeholder/200/150'} alt={breed.name} className="w-full h-64 object-contain rounded-lg mb-4 shadow-md" />
      <p className="text-brown-700 mb-2"><strong className="text-brown-900">Origin:</strong> {breed.origin || 'Unknown'}</p>
      <p className="text-brown-700 mb-2"><strong className="text-brown-900">Temperament:</strong> {breed.temperament || 'Not specified'}</p>
      <p className="text-brown-600 italic">{breed.description || 'No description available.'}</p>
    </div>
  );

  const getButtonStyles = (answer) => {
    if (selectedAnswer) {
      if (answer === currentBreed.name) {
        return "bg-green text-white";
      }
      if (answer === selectedAnswer) {
        return "bg-red-500 text-white";
      }
      return "bg-brown-50 text-brown-400";
    }
    return "bg-brown-100 text-brown-800 hover:bg-brown-200";
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-100 to-brown-200 p-8 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-8 text-[#967D6C] tracking-tight">Pet Breed Explorer Challenge</h1>

      {gameState === 'start' && (
        <motion.button
          className="px-8 py-4 bg-[#967D6C] text-white rounded-full text-2xl font-semibold hover:bg-brown-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
        >
          Start Game
        </motion.button>
      )}

      {gameState === 'playing' && currentBreed && (
        <div className="w-full max-w-3xl">
          <div className="mb-6 flex justify-between items-center bg-white rounded-lg p-4 shadow-md">
            <span className="text-3xl font-bold text-brown-800">Score: {score}</span>
            <span className="text-3xl font-bold text-brown-800">Time: {timer}s</span>
          </div>
          <motion.div
            className="bg-white rounded-lg p-8 mb-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img
              src={currentBreed.image?.url || '/api/placeholder/400/300'}
              alt="Mystery Breed"
              className="w-full h-96 object-contain rounded-lg mb-6 shadow-md"
            />
            <p className="text-2xl text-[#967D6C] mb-6 font-semibold">What breed is this {animalType}?</p>
            <div className="grid grid-cols-2 gap-6">
              {answers.map((answer, index) => (
                <motion.button
                  key={index}
                  className={`px-6 py-4 rounded-lg text-xl font-semibold transition-all duration-300 ${getButtonStyles(answer)} shadow-md hover:shadow-lg`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !selectedAnswer && handleGuess(answer)}
                  disabled={selectedAnswer !== null}
                >
                  {answer}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {gameState === 'end' && (
        <motion.div
          className="bg-white rounded-lg p-10 text-center w-full max-w-4xl shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2 className="text-4xl font-bold mb-6 text-brown-800">Game Over!</h2>
          <p className="text-3xl mb-8 text-brown-700">Your final score: <span className="font-bold text-brown-900">{score}</span></p>
          
          <h3 className="text-3xl font-bold mb-6 text-brown-800">Breeds Encountered:</h3>
          <div className="max-h-[60vh] overflow-y-auto px-4">
            {encounteredBreeds.map(renderBreedDetails)}
          </div>
          
          <motion.button
            className="px-8 py-4 bg-[#967D6C] text-white rounded-full text-2xl font-semibold hover:bg-brown-700 transition-all duration-300 mt-8 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
          >
            Play Again
          </motion.button>
        </motion.div>
      )}

      <div className="mt-10 bg-white rounded-full p-2 shadow-md">
        <label className="text-brown-800 mr-4 font-semibold">Choose animal type:</label>
        <select 
          value={animalType} 
          onChange={(e) => setAnimalType(e.target.value)}
          className="px-4 py-2 rounded-full bg-brown-100 text-brown-800 focus:outline-none focus:ring-2 focus:ring-brown-400 transition-all duration-300"
        >
          <option value="cat">Cats</option>
          <option value="dog">Dogs</option>
        </select>
      </div>

      {animalType === 'cat' ? (
        <Cat className="absolute top-6 right-6 text-brown-600" size={32} />
      ) : (
        <Dog className="absolute top-6 right-6 text-brown-600" size={32} />
      )}
      <Sparkles className="absolute bottom-6 left-6 text-brown-600" size={32} />
    </div>
  );
};

export default PetBreedExplorerGame;
import React, { useState, useEffect } from 'react';
import axios from './api/axios';

const AnsweredQuestions = () => {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/profile'); // Adjust this endpoint to match your API
        setUserData(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrorMessage('Error loading user data. Please login again.');
      }
    };

    fetchUserData();
  }, []);

  // Handle form submission
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    
    if (!userData?._id) {
      setErrorMessage('Please login to submit questions');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await axios.post('/vets/log', {
        userId: userData._id,
        question: currentQuestion,
        answer: currentAnswer,
      });
      
      setSuccessMessage('Question logged successfully!');
      setCurrentQuestion('');
      setCurrentAnswer('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error logging question:', error);
      if (error.response?.status === 401) {
        setErrorMessage('Session expired. Please login again.');
      } else {
        setErrorMessage(error.response?.data?.message || 'Error logging question');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#333',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#444',
    },
    textarea: {
      padding: '12px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '16px',
      minHeight: '120px',
      resize: 'vertical',
      fontFamily: 'inherit',
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#0066cc',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    buttonHover: {
      backgroundColor: '#0052a3',
    },
    successMessage: {
      padding: '12px',
      backgroundColor: '#e6ffe6',
      border: '1px solid #b3ffb3',
      borderRadius: '4px',
      color: '#008000',
      marginBottom: '20px',
    },
    errorMessage: {
      padding: '12px',
      backgroundColor: '#ffe6e6',
      border: '1px solid #ffb3b3',
      borderRadius: '4px',
      color: '#cc0000',
      marginBottom: '20px',
    }
  };

  // If user data is not loaded yet, show loading state
  if (!userData && !errorMessage) {
    return (
      <div style={styles.container}>
        <div>Loading user data...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Log Answered Questions</h2>
      
      {successMessage && (
        <div style={styles.successMessage}>{successMessage}</div>
      )}
      
      {errorMessage && (
        <div style={styles.errorMessage}>{errorMessage}</div>
      )}
      
      <form onSubmit={handleAddQuestion} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="question">
            Question:
          </label>
          <textarea
            id="question"
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            style={styles.textarea}
            placeholder="Enter the question here..."
            required
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="answer">
            Answer:
          </label>
          <textarea
            id="answer"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            style={styles.textarea}
            placeholder="Enter your answer here..."
            required
          />
        </div>
        
        <button
          type="submit"
          style={{
            ...styles.button,
            ...(isSubmitting || !currentQuestion.trim() || !currentAnswer.trim() 
              ? styles.buttonDisabled 
              : {})
          }}
          disabled={isSubmitting || !currentQuestion.trim() || !currentAnswer.trim()}
        >
          {isSubmitting ? 'Submitting...' : 'Add Answered Question'}
        </button>
      </form>
    </div>
  );
};

export default AnsweredQuestions;
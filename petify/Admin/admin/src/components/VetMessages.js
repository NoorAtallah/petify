import React, { useEffect, useState } from 'react';
import axios from './api/axios';

const ViewAnsweredQuestions = () => {
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  useEffect(() => {
    const fetchAnsweredQuestions = async () => {
      try {
        const response = await axios.get('/vets/all');
        setAnsweredQuestions(response.data);
      } catch (error) {
        console.error('Error fetching answered questions:', error);
      }
    };

    fetchAnsweredQuestions();
  }, []);

  return (
    <div>
      <h2>All Answered Questions</h2>
      <ul>
        {answeredQuestions.map((item) => (
          <li key={item._id}>
            <strong>Vet:</strong> {item.vetId.fullName || 'Unknown'} <br />
            <strong>Question:</strong> {item.question} <br />
            <strong>Answer:</strong> {item.answer} <br />
            <strong>Date:</strong> {new Date(item.dateAnswered).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewAnsweredQuestions;

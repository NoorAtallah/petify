import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from './api/axios';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [animalTypes, setAnimalTypes] = useState([]);
  const [selectedAnimalType, setSelectedAnimalType] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('/blog');
        setArticles(response.data);
        
        // Extract unique animal types
        const types = [...new Set(response.data.map(article => article.animalType))];
        setAnimalTypes(types);
        
        // Set the first animal type as default selected
        if (types.length > 0) {
          setSelectedAnimalType(types[0]);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(article => article.animalType === selectedAnimalType);

  // Group filtered articles by category
  const groupedArticles = filteredArticles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {});

  return (
    <div className=" min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-brown mb-8 border-b-2 border-bermuda pb-2">Petify Blog</h1>
        
        <div className="mb-8">
          <label htmlFor="animalType" className="block text-left text-sm font-medium text-brown mb-2">
            Select Animal Type:
          </label>
          <select
            id="animalType"
            value={selectedAnimalType}
            onChange={(e) => setSelectedAnimalType(e.target.value)}
            className="block  px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green focus:border-green"
          >
            {animalTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {Object.entries(groupedArticles).map(([category, categoryArticles]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-medium text-brown mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryArticles.map((article) => (
                <div key={article._id} className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300">
                  <img src={article.image} alt={article.title} className="w-full h-40 object-cover rounded-md mb-3" />
                  <h3 className="text-lg font-medium text-brown mb-2">{article.title}</h3>
                  <p className="text-sm text-brown mb-3 line-clamp-3">{article.summary}</p>
                  <div className="flex items-center justify-between text-xs">
                    <Link 
                      to={`/blog/${article._id}`} 
                      className="text-green hover:text-bermuda transition-colors duration-300 text-lg"
                    >
                      Read More →
                    </Link>
                    <span className="text-brown">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
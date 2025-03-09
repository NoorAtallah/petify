import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from './api/axios';

const BlogDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`/blog/${id}`);
        setArticle(response.data);
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    fetchArticle();
  }, [id]);

  if (!article) return <p className="text-center mt-4 text-brown text-xl">Fetching paw-some content...</p>;

  const formatContent = (content) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-6 text-brown leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="article-detail max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-brown">{article.title}</h1>
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-auto max-h-96 object-cover mb-8 rounded-lg"
      />
      <div className="article-content space-y-6 text-lg">
        {formatContent(article.content)}
      </div>
      <div className="flex justify-between items-center mt-12 pt-4 border-t border-bermuda">
        <span className="text-sm text-brown">Published on: {new Date(article.createdAt).toLocaleDateString()}</span>
        <Link
          to="/blog"
          className="text-green hover:text-bermuda transition duration-200 text-sm font-medium"
        >
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
};

export default BlogDetail;
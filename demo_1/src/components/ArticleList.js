// ArticleList.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './ArticleList.css';
import axios from 'axios'; // Make sure to install axios via npm
import videoBG from './video.mp4';



const ArticleList = ({ articles,setText }) => {
  // State to keep track of selected articles
  const [selectedLinks, setSelectedLinks] = useState([]);
  // Handle checkbox change
  const handleCheckboxChange = (link) => {
    setSelectedLinks(prev => {
      if (prev.includes(link)) {
        return prev.filter(l => l !== link);
      } else {
        return [...prev, link];
      }
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/fetch-article', { links: selectedLinks });
      console.log(response.data);
      // Additional actions upon successful submission
    } catch (error) {
      console.error('Error submitting articles:', error);
    }
  };

  // Group articles by source
  const groupedArticles = articles.titles.reduce((acc, title, index) => {
    const source = articles.source[index];
    const link = articles.links[index];
    acc[source] = acc[source] || [];
    acc[source].push({ title, link });
    return acc;
  }, {});
  return (
    <div className="article-list">
      <div className="video-container">
        <video autoPlay loop muted className="background-video">
          <source src={videoBG} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="news-cards">
        {Object.keys(groupedArticles).map((source, index) => (
          <div className="card" key={index}>
            <div className="card-header">{source}</div>
            <div className="card-body">
              {groupedArticles[source].map((article, i) => (
                <div key={i} className="article-link">
                  <input 
                    type="checkbox" 
                    onChange={() => handleCheckboxChange(article.link)} 
                    checked={selectedLinks.includes(article.link)}
                  />
                  <a href={article.link} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} className='button-style'>Submit Selected Articles</button>
      <Link to="/editable-text" className='button-style'>
         Go to Editable Text
      </Link>
    </div>
  );
};

export default ArticleList;
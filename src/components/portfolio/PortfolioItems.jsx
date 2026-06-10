import React from 'react';
import { getProjectImage } from './PortfolioData';

const PortfolioItems = ({ item }) => {
  return (
    <div className="portfolio-card">
      <div className="portfolio-img-container">
        <img src={getProjectImage(item.image)} alt={item.title} className="portfolio-img" />
        <span className="portfolio-tag">{item.category}</span>
      </div>
      <h3 className="portfolio-title">{item.title}</h3>
      <p className="portfolio-desc">{item.desc}</p>
      
      <div className="portfolio-links">
        {item.url && (
          <a href={item.url} className="portfolio-btn live-btn" target="_blank" rel="noreferrer">
            Demo <i className="bx bx-link-external portfolio-btn-icon"></i>
          </a>
        )}
        {item.code && (
          <a href={item.code} className="portfolio-btn code-btn" target="_blank" rel="noreferrer">
            Code <i className="bx bxl-github portfolio-btn-icon"></i>
          </a>
        )}
      </div>
    </div>
  );
};

export default PortfolioItems;

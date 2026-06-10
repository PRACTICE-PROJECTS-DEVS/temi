import React from 'react'
import './Footer.css'

const Footer = () => {
    return (
        <footer className="footer">
          <div className="footer-container container">
            <h1 className="footer-title">Temi.Dev</h1>
            <ul className="footer-list">
              <li>
                <a href="#/" onClick={(e) => { e.preventDefault(); const el = document.getElementById('about'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="footer-link">
                  About
                </a>
              </li>
              <li>
                <a href="#/" onClick={(e) => { e.preventDefault(); const el = document.getElementById('portfolio'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="footer-link">
                  Projects
                </a>
              </li>
            </ul>
            <div className="footer-social">
              <a
                href="https://github.com/Themydee"
                className="footer-social-link"
                target="_blank"
                rel="noreferrer"
              >
                <i class="bx bxl-github"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/akanbi-bello-temidayo-015b1a141/"
                className="footer-social-link"
                target="_blank"
                rel="noreferrer"
              >
                <i class="bx bxl-linkedin"></i>
              </a>
              <a
                href="https://www.twitter.com/themydee2001"
                className="footer-social-link"
                target="_blank"
                rel="noreferrer"
              >
                <i class="bx bxl-twitter"></i>
              </a>
            </div>
            <span className="footer-copy">
                 Temi.Dev . All rights reserved &#169; 2025
            </span>
          </div>
        </footer>
      );
}

export default Footer
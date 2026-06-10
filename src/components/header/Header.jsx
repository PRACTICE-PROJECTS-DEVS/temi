import React, { useState, useEffect } from 'react'
import './header.css'

const Header = () => {
    const [Toggle, showMenu] = useState(false);
    const [scrollHeader, setScrollHeader] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            // Scroll header class activation
            if (window.scrollY >= 80) {
                setScrollHeader(true);
            } else {
                setScrollHeader(false);
            }

            // Scroll section highlighting observer
            const sections = ['home', 'about', 'portfolio', 'contact'];
            const scrollPosition = window.scrollY + 200; // offset

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const top = element.offsetTop;
                    const height = element.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e, sectionId) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(sectionId);
        }
        showMenu(false);
    };

  return (
    <header className={scrollHeader ? "header scroll-header" : "header"}>
        <nav className="nav container">
            <a href="#/" onClick={(e) => handleNavClick(e, 'home')} className="nav__logo">Themydee</a>

            <div className={Toggle ? "nav__menu show-menu" : "nav__menu"}>
                <ul className="nav__list grid">
                    <li className="nav__item">
                        <a 
                            href="#/" 
                            onClick={(e) => handleNavClick(e, 'home')} 
                            className={`nav__link ${activeSection === 'home' ? 'active-link' : ''}`}
                        >
                            <i className="uil uil-estate nav__icon"></i> Home
                        </a>
                    </li>

                    <li className="nav__item">
                        <a 
                            href="#/" 
                            onClick={(e) => handleNavClick(e, 'about')} 
                            className={`nav__link ${activeSection === 'about' ? 'active-link' : ''}`}
                        >
                            <i className="uil uil-user nav__icon"></i> About
                        </a>
                    </li>

                    <li className="nav__item">
                        <a 
                            href="#/" 
                            onClick={(e) => handleNavClick(e, 'portfolio')} 
                            className={`nav__link ${activeSection === 'portfolio' ? 'active-link' : ''}`}
                        >
                            <i className="uil uil-scenery nav__icon"></i> Portfolio
                        </a>
                    </li>

                    <li className="nav__item">
                        <a 
                            href="#/" 
                            onClick={(e) => handleNavClick(e, 'contact')} 
                            className={`nav__link ${activeSection === 'contact' ? 'active-link' : ''}`}
                        >
                            <i className="uil uil-message nav__icon"></i> Contact
                        </a>
                    </li>
                </ul>

                <i className="uil uil-times nav__close" onClick={() => showMenu(!Toggle)}></i>
            </div>

            <div className="nav__toggle" onClick={() => showMenu(!Toggle)}>
                <i className="uil uil-apps "></i>
            </div>
        </nav>
    </header>
  )
}

export default Header
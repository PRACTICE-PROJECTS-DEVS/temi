import React from 'react'
import './about.css'
import S2 from '../../assets/ceo.jpg'
import Info from './Info'
const About = () => {
  return (
    <div className="about section" id="about">
        <h2 className="section__title">About Me</h2>
        <span className="section__subtitle">My Introduction</span>

        <div className="about__container container grid">
            <img src={S2} alt="" className='about__img' />

            <div className="about__data">
                <Info />

                <p className="about__description">
                    Fullstack Developer, with 3 years of experience building applications that suite the needs of the client.
                    I am a passionate developer with a strong background in web development.
                    I have a strong understanding of the software development life cycle and agile methodologies.
                    I am always looking for new challenges and opportunities to learn and grow.
                </p>
            </div>
        </div>
    </div>
  )
}

export default About
import React from 'react';
import footer from '../Images/logo.png';
import face_icon from '../Images/facebook.jpg';
import whats_icon from '../Images/whatsapp.jpg';
import LinkedIn_icon from '../Images/LinkedIn.png';

import './Footer.css';

const Footer = () => {
  return (
    <div className='footer'>
      <div className='footer-logo'>
        <img src={footer} alt="footer logo" />
      </div>
      <h1>SOM</h1>
        <hr />
      <div className='footer-content'>
        <ul className='footer-links'>
          <li><a href="#about">About Us</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#privacy">Privacy Policy</a></li>
          <li><a href="#terms">Terms of Service</a></li>
        </ul>
      </div>
      <div className="social_icons">
        <div className='icons'>
          <img src={face_icon} alt="Facebook" />
        </div>
        <div className='icons'>
          <img src={whats_icon} alt="WhatsApp" />
        </div>
        <div className='icons'>
          <img src={LinkedIn_icon} alt="LinkedIn" />
        </div>
      </div>
      <div className="copyright">
        <hr />
        <p>&copy; 2024 All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;

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
          <li><a href="/about">About Us</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Service</a></li>
        </ul>
      </div>
      <div className="social_icons">
        <div className='icons'>
        <a href="https://www.facebook.com/abdiwolih"><img src={face_icon} alt="Facebook" /></a>
        </div>
        <div className='icons'>
        <a href="https://wa.me/+97455675949"><img src={whats_icon} alt="WhatsApp" /></a>
        </div>
        <div className='icons'>
          <a href="https://www.linkedin.com/in/abdiwoli/"><img src={LinkedIn_icon} alt="LinkedIn" /></a>
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

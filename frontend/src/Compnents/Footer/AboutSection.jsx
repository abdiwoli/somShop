import React from 'react';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="container">
        <h2 className="about-title">About SOM</h2>
        <p className="about-description">
          Welcome to <strong>SOM</strong>, your one-stop destination for the latest in fashion and electronics.
          Founded by <strong>Abdiwoli Abdi</strong>, SOM is dedicated to bringing you a curated selection of 
          high-quality clothing, shoes, and electronic gadgets that cater to your lifestyle needs.
        </p>
        <p className="about-description">
          At SOM, we believe in the perfect blend of style and technology. Whether you're looking to update 
          your wardrobe with the newest trends or seeking cutting-edge electronics, we’ve got you covered. 
          Our collection is carefully chosen to ensure you receive only the best in quality and value.
        </p>
        <div className="about-highlights">
          <div className="highlight-item">
            <h3 className="highlight-title">Fashion Forward</h3>
            <p className="highlight-description">
              Stay ahead with our ever-evolving range of clothing and shoes that combine comfort, style, and affordability.
            </p>
          </div>
          <div className="highlight-item">
            <h3 className="highlight-title">Tech-Savvy</h3>
            <p className="highlight-description">
              Explore the latest electronic gadgets designed to make your life easier, more connected, and more fun.
            </p>
          </div>
          <div className="highlight-item">
            <h3 className="highlight-title">Customer-Centric</h3>
            <p className="highlight-description">
              We prioritize your shopping experience, offering easy returns, secure payments, and reliable customer support.
            </p>
          </div>
        </div>
        <p className="about-description">
          Founded on the principles of quality and customer satisfaction, SOM is more than just a store—it’s a community 
          of style enthusiasts and tech lovers. Join us as we continue to innovate and bring you the best products at competitive prices.
        </p>
        <p className="about-thankyou">
          Thank you for choosing SOM, where style meets technology.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;

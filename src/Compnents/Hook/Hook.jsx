import React, { useState, useEffect } from 'react';
import './Hook.css';
import cloths1 from '../Images/cloths1.png';
import mobile1 from '../Images/mobile1.png'
import som1 from '../Images/som1.png';
import discount_man from '../Images/discountMan.png';

const pics = [som1, discount_man, mobile1, cloths1];

const Hook = () => {
    const [currentPicIndex, setCurrentPicIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPicIndex((prevIndex) => (prevIndex + 1) % pics.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hook">
      <div className="left">
        <h2>Hot Sell</h2>
        <div>
          <div className="offer-icon">
            <p>Big Offer</p>
          </div>
          <p className="limited-time">Limited Time</p>
          <p className="deals">Deals</p>
        </div>
        <div className="offer-btn">
          <div>Shop Now</div>
        </div>
      </div>
      <div className="right">
        <img src={pics[currentPicIndex]} alt="Right Icon" />
      </div>
    </div>
  );
};

export default Hook;

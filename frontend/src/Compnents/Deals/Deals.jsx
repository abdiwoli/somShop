import React from 'react';
import './Deals.css';
import discount_img from"../Images/discountMan.png";
const Deals = () => {
  return (
    <div className="deal-of">
      <div className="left-deal">
        <h1>Special Deal</h1>
        <p>Don't miss out on this amazing offer!</p>
        <button>Shop Now</button>
      </div>
      <div className="right-deal">
        <img src={discount_img} alt="Deal" />
      </div>
    </div>
  );
};

export default Deals;

import React from 'react';
import './Css/Cart.css';
import BasketItems from '../BasketItems/BasketItems';
import Checkout from '../Checkout/Checkout';
import { Navigate } from 'react-router-dom';

const Cart = () => {
  const token = localStorage.getItem('userToken');

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className='Basket'>
      <BasketItems />
      <Checkout />
    </div>
  );
}

export default Cart;

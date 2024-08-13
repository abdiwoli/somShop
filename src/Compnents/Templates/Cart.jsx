import React from 'react';
import './Css/Cart.css';
import BasketItems from '../BasketItems/BasketItems';
import Checkout from '../Checkout/Checkout';


const Cart = () => {
  return (
    <div className='Basket'>
      <BasketItems />
      <Checkout />
    </div>
  )
}

export default Cart

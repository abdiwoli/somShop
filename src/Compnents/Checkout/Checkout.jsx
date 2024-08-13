import React, { useContext } from 'react';
import { CatProvider } from '../../Providers/CatProvider';
import './Checkout.css'; 
import { UserContext } from '../UserProvider/UserProvider';

const Checkout = () => {
  const { getCartProducts } = useContext(CatProvider);
  const { userToken } = useContext(UserContext);

  const orders = getCartProducts();
  const serializedOrders = JSON.stringify(orders);

  return (
    <div className="checkout-container">
      <form 
        className="checkout-form" 
        action="http://localhost:5000/pay" 
        method="post"
      >
        <input type="hidden" name="orders" value={serializedOrders} />
        <input type="hidden" name="userToken" value={userToken} />
        <button type="submit">
          <img 
            src="https://www.paypalobjects.com/en_US/i/btn/btn_paynowCC_LG.gif" 
            alt="PayPal" 
            className="paypal-icon"
          />
          Complete Payment with PayPal
        </button>
      </form>
    </div>
  );
};

export default Checkout;

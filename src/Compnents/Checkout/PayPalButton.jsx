import React from 'react';
import axios from 'axios';

const PayPalButton = () => {
  const handleCreateOrder = async () => {
    try {
      const response = await axios.post('/api/paypal/create-order');
      console.log('Order created:', response.data);
      // Redirect to PayPal approval page, or handle the order ID for further processing
    } catch (error) {
      console.error('Error creating PayPal order:', error);
    }
  };

  return (
    <button onClick={handleCreateOrder}>
      Pay with PayPal
    </button>
  );
};

export default PayPalButton;

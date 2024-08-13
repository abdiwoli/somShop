import React, { createContext, useState, useEffect } from 'react';
import { getProducts } from '../Compnents/Images/products';
import axios from 'axios';

export const CatProvider = createContext(null);

const products = await getProducts();

const defaultBasket = () => {
  let Basket = {};
  for (let product of products) {
    Basket[product.id] = {
      ...product,
      quantity: 0
    };
  }
  return Basket;
}

const CatContextProvider = (props) => {
  const [BasketElement, setBasketItems] = useState(() => {
    // Load initial state from localStorage, or use the defaultBasket function
    const savedBasket = localStorage.getItem('basket');
    return savedBasket ? JSON.parse(savedBasket) : defaultBasket();
  });

  const resetBasket = () => {
    setBasketItems(defaultBasket());
  };

  useEffect(() => {
    // Save BasketElement to localStorage whenever it changes
    localStorage.setItem('basket', JSON.stringify(BasketElement));
  }, [BasketElement]);

  const addItem = (id) => {
    setBasketItems((el) => {
      const updatedBasket = { ...el };
      updatedBasket[id] = updatedBasket[id]
        ? { ...updatedBasket[id], quantity: updatedBasket[id].quantity + 1 }
        : { ...products.find(product => product.id === id), quantity: 1 };
      return updatedBasket;
    });
  };
  

  const removeItem = (id) => {
    setBasketItems((el) => (
      {
        ...el,
        [id]: {
          ...el[id],
          quantity: Math.max(el[id].quantity - 1, 0)
        }
      }
    ));
  };



  const totalItems = () => {
    return Object.keys(BasketElement).reduce((total, el) => {
      const quantity = BasketElement[el].quantity;
      if (quantity > 0) {
        total += quantity;
      }
      return total;
    }, 0);
  };

  // utils/cartUtils.js
const getCartProducts = () => {
  return products.filter(product => {
      const quantity = BasketElement[product.id]?.quantity || 0;
      return quantity > 0;
  }).map(product => {
      const quantity = BasketElement[product.id]?.quantity || 0;
      return {
          ...product,
          quantity,
          totalPrice: (Number(product.price) * quantity).toFixed(2)
      };
  });
};

const deleteProduct = async (itemId, token) => {
  try {
      await axios.delete(`http://localhost:5000/delete-product/${itemId}`, {
          headers: {
              'X-Token': token
          }
      });
      console.log(itemId);
  } catch (error) {
      console.error('Error fetching owner:', error);
 
  }
};

  const contextValue = {getCartProducts, totalItems, products, BasketElement, addItem, removeItem, resetBasket, deleteProduct };

  return (
    <CatProvider.Provider value={contextValue}>
      {props.children}
    </CatProvider.Provider>
  );
};




export default CatContextProvider;

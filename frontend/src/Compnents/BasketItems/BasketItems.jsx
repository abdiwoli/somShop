import React, { useContext } from 'react';
import './BasketItems.css';
import { CatProvider } from '../../Providers/CatProvider';
import { getImage } from '../Utils/imageLoader';

const BasketItems = (props) => {
    const { getCartProducts, removeItem } = useContext(CatProvider);
   
    const cart = getCartProducts();
    console.log({cart});
    const totalPrice = cart.reduce((total, product) => {
        return total + Number(product.totalPrice);
    }, 0).toFixed(2);

    return (
        <div className='BasketItems'>
            <div className='basket-main'>
                <p>Items</p>
                <p>Title</p>
                <p>Quantity</p>
                <p>Price</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            {cart.map((product) => {
                const quantity = product.quantity; 

                if (quantity > 0) {
                    return (
                        <div key={product._id}>
                            <div className='basket-items-view'>
                                <img src={getImage(product.image)} alt={product.title} className='item-image' />
                                <p>{product.name}</p>
                                <button className='quantity-basket'>{quantity}</button>
                                <p>${Number(product.price).toFixed(2)}</p>
                                <p>${(Number(product.price) * quantity).toFixed(2)}</p>
                                <i className="fas fa-trash-alt" onClick={() => removeItem(product._id)} />
                            </div>
                            <hr />
                        </div>
                    );
                }
                return null;
            })}
            <div className='basket-summary'>
                <p className='total-label'>Total:</p>
                <p className='total-price'>${totalPrice}</p>
            </div>
        </div>
    );
};

export default BasketItems;

import React from 'react';
import './NewProduct.css';
import {getProducts} from '../Images/products';
import Element from '../Elements/Element';
import {getImage} from '../Utils/imageLoader'

const products = await getProducts();

const NewProducts = () => {
  return (
    <div className='products'>
        <h1>New Products</h1>
        <hr/>
        <div className='products-p'>
        {products.map((el, idx)=>{
                return <Element image={getImage(el.image)} new_price={el.price} key={idx} id={el.id} name={el.name} old_price={el.prevPrice}  />
            })}
        </div>
    </div>
  )
}

export default NewProducts
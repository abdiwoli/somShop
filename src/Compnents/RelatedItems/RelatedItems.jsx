import React from 'react';
import '../Templates/Css/RelatedItems.css';
import {getProducts} from '../Images/products';
import Element from '../Elements/Element';
import {getImage} from '../Utils/imageLoader'
const products = await await getProducts();

const RelatedItems = () => {
  return (
    <div className='relatedItems'>
        <h1> Items you may like</h1>
        <hr />
        <div className='p-items'>
            {products.map((el, idx) =>{
                return <Element image={getImage(el.image)} new_price={el.price} key={idx} id={el.id} name={el.name} oldPrice={el.prevPrice}  />
            })}
        </div>
    </div>
  )
}

export default RelatedItems
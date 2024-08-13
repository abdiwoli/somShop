import React from 'react'
import {getProducts} from '../Images/products';
import Element from '../Elements/Element';
import {getImage} from '../Utils/imageLoader'
import './Trend.css'
const products = await getProducts();

const Trend = (props) => {
  return (
    <div className='products'>
      
        <h1>Trending in Electronics</h1>
        <hr />
        <div className='products-p p'>
            {products.map((el, idx)=>{
                return <Element image={getImage(el.image)} new_price={el.price} key={idx} id={el.id} name={el.name} old_price={el.prevPrice}  />
            })}
        </div>
    </div>
  )
}

export default Trend
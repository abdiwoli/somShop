import React, { useEffect, useState } from 'react'
import Element from '../Elements/Element';
import {getImage} from '../Utils/imageLoader'
import './Trend.css'
import newProducts from '../NewProducts/newItems';

const Trend = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchItems = async () => {
      const result = await newProducts('trending')
      setProducts(result);
    }
    fetchItems();
  }, []);

  return (
    <div className='products'>
      
        <h1>Trending in Electronics</h1>
        <hr />
        <div className='products-p p'>
            {products.map((el, idx)=>{
                return <Element image={getImage(el.image)} new_price={el.price} key={idx} id={el._id} name={el.name} old_price={el.prevPrice}  />
            })}
        </div>
    </div>
  )
}

export default Trend

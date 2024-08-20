import React, { useEffect, useState } from 'react';
import './NewProduct.css';
import Element from '../Elements/Element';
import {getImage} from '../Utils/imageLoader'
import newProducts from './newItems';


const NewProducts = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchItems = async () => {
      const result = await newProducts('latest')
      setProducts(result);
    }
    fetchItems();
  }, []);
  return (
    <div className='products'>
        <h1>New Products</h1>
        <hr/>
        <div className='products-p'>
        {products.map((el, idx)=>{
                return <Element image={getImage(el.image)} new_price={el.price} key={idx} id={el._id} name={el.name} old_price={el.prevPrice}  />
            })}
        </div>
    </div>
  )
}

export default NewProducts

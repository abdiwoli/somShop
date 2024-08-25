import React, { useEffect, useState } from 'react'
import Element from '../Elements/Element';
import RelatedItems from '../RelatedItems/RelatedItems';
import {getImage} from '../Utils/imageLoader';
import './Trend.css'
import newProducts from '../NewProducts/newItems';

const DealsView = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchItems = async () => {
      const result = await newProducts('deals')
      setProducts(result);
    }
    fetchItems();
  }, []);

    console.log(products);

  return (
    <div className='products'>
      
        <div>
            <h1>Special Deals</h1>
            <hr />
            <div className='products-p p'>
                {products.map((el, idx)=>{
                    return <Element image={getImage(el.image)} new_price={el.price} key={idx} id={el._id} name={el.name} old_price={el.prevPrice}  />
                })}
            </div>
        </div>
      <RelatedItems />
      </div>
  )
}

export default DealsView

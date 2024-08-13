import React, {useContext} from 'react'
import './Css/Category.css';
import { CatProvider } from '../../Providers/CatProvider';
import {getImage} from '../Utils/imageLoader';
import Element from '../Elements/Element';
const Categories = (props) => {
  const {products} = useContext(CatProvider)
  return (
    <div className='product-items'>
      <img className='banner-mage' src={props.banner} alt="" />
      <div className='sort-idx'>
        <p>
          <span>showing all products</span>
        </p>
        <div className='sort'>
          Sort by <button>down</button>
        </div>
      </div>
      <div className='item-products'>
        {products.map((el, idx) => {
          if (props.kind===el.catagory){
            return <Element image={getImage(el.image)} new_price={el.price} key={idx} id={el.id} name={el.name} old_price={el.prevPrice}  />
          } else {
            return null;
          }
        })}
      </div>
      <div className='more'>
        See more products
      </div>
    </div>
  )
}

export default Categories
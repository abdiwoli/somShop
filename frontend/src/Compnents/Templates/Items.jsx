import React, { useContext } from 'react'
import { CatProvider } from '../../Providers/CatProvider'
import { useParams } from 'react-router-dom';
import Helper from '../Helper/Helper';
import { ViewItem } from '../ViewItem/ViewItem';
import RelatedItems from '../RelatedItems/RelatedItems';


const Items = () => {
  const {products} = useContext(CatProvider);
  const {itemId} = useParams();
  const item = products.find((e)=> e.id===itemId);
  if (!item){
    console.log(products);
    return <div>{products[0].name}</div>
  }
  return (
    <div>
      <Helper item={item}/>
      <ViewItem item={item}/>
      <RelatedItems />
    </div>
  )
}

export default Items
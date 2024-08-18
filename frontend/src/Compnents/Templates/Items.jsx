import React, { useContext, useEffect, useState } from 'react';
import { CatProvider } from '../../Providers/CatProvider';
import { useParams } from 'react-router-dom';
import Helper from '../Helper/Helper';
import { ViewItem } from '../ViewItem/ViewItem';
import RelatedItems from '../RelatedItems/RelatedItems';

const Items = () => {
  const { products } = useContext(CatProvider);
  const { itemId } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    // Check if products are available and find the item
    if (products) {
      const foundItem = products.find((e) => e.id === itemId);
      setItem(foundItem || null);
    }
  }, [products, itemId]);

  if (item === null) {
    // Show a loading message or placeholder if item is not found
    if (products.length === 0) {
      return <div>Loading...</div>;
    } else {
      return <div>Item not found</div>;
    }
  }

  return (
    <div>
      <Helper item={item} />
      <ViewItem item={item} />
      <RelatedItems />
    </div>
  );
};

export default Items;

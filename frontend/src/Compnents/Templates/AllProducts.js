import React, { useContext, useState, useRef } from 'react';
import './Css/Category.css';
import { CatProvider } from '../../Providers/CatProvider';
import { getImage } from '../Utils/imageLoader';
import Element from '../Elements/Element';
import { AiOutlineSortAscending, AiOutlineSortDescending } from 'react-icons/ai';

const AllProducts = (props) => {
  const { products, setProducts } = useContext(CatProvider); // Correct context usage
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const showMoreRef = useRef(null);

  const handleSort = (criteria) => {
    let sortedArray;
    if (criteria === 'price') {
      sortedArray = [...products].sort((a, b) => sortDirection === 'asc' ? a.price - b.price : b.price - a.price);
    } else if (criteria === 'newest') {
      sortedArray = [...products].sort((a, b) => sortDirection === 'asc' ? new Date(a.dateAdded) - new Date(b.dateAdded) : new Date(b.dateAdded) - new Date(a.dateAdded));
    } else if (criteria === 'category') {
      sortedArray = [...products].sort((a, b) => sortDirection === 'asc' ? a.catagory.localeCompare(b.catagory) : b.catagory.localeCompare(a.catagory));
    }
    setProducts(sortedArray); 
    setVisibleProducts(8); 
    setSortCriteria(criteria);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleShowMore = () => {
    setVisibleProducts(prevVisible => {
      const newVisible = prevVisible + 4;
      // Scroll to the "Show More" button after updating the number of visible products
      if (showMoreRef.current) {
        showMoreRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      return newVisible;
    });
  };

  return (
    <div className='product-items'>
      <div className='sort-idx'>
        <p>
          <span>Showing all products</span>
        </p>
        <div className='sort'>
          <span>Sort by</span>
          <div className='sort-options'>
            <div
              className='sort-option'
              onClick={() => handleSort('price')}
            >
              Price {sortCriteria === 'price' && (sortDirection === 'asc' ? <AiOutlineSortAscending /> : <AiOutlineSortDescending />)}
            </div>
            <div
              className='sort-option'
              onClick={() => handleSort('newest')}
            >
              Newest {sortCriteria === 'newest' && (sortDirection === 'asc' ? <AiOutlineSortAscending /> : <AiOutlineSortDescending />)}
            </div>
            <div
              className='sort-option'
              onClick={() => handleSort('category')}
            >
              Category {sortCriteria === 'category' && (sortDirection === 'asc' ? <AiOutlineSortAscending /> : <AiOutlineSortDescending />)}
            </div>
          </div>
        </div>
      </div>
      <div className='item-products'>
        {products.slice(0, visibleProducts).map((el, idx) => (
          <Element
            image={getImage(el.image)}
            new_price={el.price}
            key={idx}
            id={el.id}
            name={el.name}
            old_price={el.prevPrice}
          />
        ))}
      </div>
      {visibleProducts < products.length && (
        <div
          className='more'
          onClick={handleShowMore}
          ref={showMoreRef}
        >
          Show More
        </div>
      )}
    </div>
  );
};

export default AllProducts;

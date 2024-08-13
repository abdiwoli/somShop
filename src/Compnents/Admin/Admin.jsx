import React, { useState, useContext } from 'react';
import { CatProvider } from '../../Providers/CatProvider';
import { getImage } from '../Utils/imageLoader';
import './Admin.css'; // Import the CSS file
import UpdateProduct from '../UploadProduct/UpdateProduct';

const Admin = () => {
  const { products } = useContext(CatProvider);
  const [activeProduct, setActiveProduct] = useState(null);

  // Handle the click event to toggle the display of additional component
  const handleEditClick = (product) => {
    // Toggle between showing and hiding the additional component
    setActiveProduct(prevProduct => (prevProduct === product ? null : product));
  };

  return (
    <div className="admin-container">
      {products.map((product) => (
        <div className="product-item" key={product.id}>
          <div className="product-id">ID: {product.id}</div>
          <div className="product-name">Name: {product.name}</div>
          <div className="product-category">Category: {product.catagiry}</div>
          <div className="product-price">Price: ${product.price}</div>
          <div className="product-prev-price">Previous Price: ${product.prevPrice}</div>
          <div className="product-description">Description: {product.description}</div>
          <img className="product-image" src={getImage(product.image)} alt={product.name} />
          <button 
            className="edit-button" 
            onClick={() => handleEditClick(product)}
          >
            Edit
          </button>

          {/* Conditionally render the UpdateProduct component with the product object */}
          {activeProduct && activeProduct.id === product.id && (
            <div className="additional-component">
              <UpdateProduct product={product} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Admin;

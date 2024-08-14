import React, { useState, useContext } from 'react';
import { CatProvider } from '../../Providers/CatProvider';
import { getImage } from '../Utils/imageLoader';
import './Admin.css';
import axios from 'axios';
import UpdateProduct from '../UploadProduct/UpdateProduct';
import ImageUpload from '../ImageUpload/ImageUpload';

const Admin = () => {
  const { products } = useContext(CatProvider);
  const [activeProduct, setActiveProduct] = useState(null);
  const [err, setErr] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleDelete = (indx, id) => {
    const deletePic = async (indx, id) => {
      try {
        const response = await axios.delete(`http://localhost:5000/delete-image/${id}/${indx}`);
        if (response.error) {
          setErr(response.error);
        } else {
          window.location.href = '/all';
        }
      } catch (err) {
        setErr(err.message);
      }
    }
    deletePic(indx, id);
  }

  const handleEditClick = (product) => {
    setActiveProduct(prevProduct => (prevProduct === product ? null : product));
  };

  const handleAddImageClick = () => {
    setShowImageUpload(prevState => !prevState);
  };

  return (
    <div className="admin-container">
      {products.map((product) => (
        <div className="product-item" key={product.id}>
          <div className="product-id">ID: {product.id}</div>
          <div className="product-name">Name: {product.name}</div>
          <div className="product-category">Category: {product.catagory}</div>
          <div className="product-price">Price: ${product.price}</div>
          <div className="product-prev-price">Previous Price: ${product.prevPrice}</div>
          <div className="product-description">Description: {product.description}</div>
          <img className="product-image" src={getImage(product.image)} alt={product.name} />
          <div className="list-images">
            {product.images.map((image, index) => (
              <div key={index} className="thumbnail-container">
                <img 
                  src={getImage(image)} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="thumbnail"
                />
                <button className="remove-thumbnail" onClick={() => handleDelete(index, product.id)}>Delete</button>
              </div>
            ))}
            {showImageUpload && <ImageUpload productId={product.id} />}
            <button className="add-image-button" onClick={handleAddImageClick}>
              {showImageUpload ? 'Cancel Upload' : 'Add New Image'}
            </button>   
          </div>
          <p>{err}</p>
          <button 
            className="edit-button" 
            onClick={() => handleEditClick(product)}
          >
            Edit
          </button>
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

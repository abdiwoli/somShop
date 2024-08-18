import React, { useContext, useState, useEffect } from 'react';
import './UploadProduct.css';
import { UserContext } from '../UserProvider/UserProvider';
import { getImage } from '../Utils/imageLoader';

const UpdateProduct = ({ product }) => {
  const { userToken } = useContext(UserContext);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [prevPrice, setPrevPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [mimeType, setMimeType] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Initialize form fields with product data
    setName(product.name || '');
    setCategory(product.catagory || '');
    setPrice(product.price || '');
    setPrevPrice(product.prevPrice || '');
    setDescription(product.description || '');
    setImage(null);
    setImagePreview(product.image ? getImage(product.image) : '');
  }, [product]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setMimeType(file.type);
    setImagePreview(URL.createObjectURL(file));
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category || !price || !prevPrice || !description) {
      setError('Please fill all fields.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    let base64data = false;
    if (image) {
      // Convert new image to base64
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        base64data = reader.result.split(',')[1];
        await submitProduct(base64data);
      };
    } else {
      // Convert existing image to base64
      if (product.image) {
        try {
          base64data = false;
          await submitProduct(base64data);
        } catch (err) {
          setError('An error occurred while converting the existing image.');
          console.error(err);
          setLoading(false);
        }
      } else {
        setError('Please upload a new image or provide an existing one.');
        setLoading(false);
      }
    }
  };

  const submitProduct = async (base64data) => {
    const payload = {
      name,
      type: 'image',
      catagory: category,
      isPublic: true,
      data: base64data,
      parentId: '0',
      price,
      prevPrice,
      description,
      mimeType,
    };

    try {
      const response = await fetch(`http://localhost:5000/update-file/${product.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': userToken,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Product uploaded successfully:', data);
      
      setSuccess(true);
      setName('');
      setCategory('');
      setPrice('');
      setPrevPrice('');
      setDescription('');
      setImage(null);
      setMimeType('');
      setImagePreview('');
    } catch (err) {
      setError('An error occurred while uploading the product.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='upload-product'>
      <h2>Update Product</h2>
      {success && <p className='success'>Product uploaded successfully!</p>}
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='name'>Product Name</label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='category'>Category</label>
          <input
            type='text'
            id='category'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='price'>Price</label>
          <input
            type='number'
            id='price'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='prevPrice'>Previous Price</label>
          <input
            type='number'
            id='prevPrice'
            value={prevPrice}
            onChange={(e) => setPrevPrice(e.target.value)}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='description'>Description</label>
          <textarea
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='image'>Product Image</label>
          <input
            type='file'
            id='image'
            accept='image/*'
            onChange={handleImageChange}
          />
          {imagePreview || product.image ? (
            <img
              src={imagePreview || getImage(product.image)}
              alt=''
              className='image-preview'
            />
          ) : null}
        </div>

        <button type='submit' disabled={loading}>
          {loading ? 'Uploading...' : 'Update Product'}
        </button>
        {error && <p className='error'>{error}</p>}
      </form>
    </div>
  );
};

export default UpdateProduct;

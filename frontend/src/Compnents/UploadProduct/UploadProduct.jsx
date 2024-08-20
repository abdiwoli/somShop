import React, { useContext, useState } from 'react';
import './UploadProduct.css';
import { UserContext } from '../UserProvider/UserProvider';


const UploadProduct = () => {
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setMimeType(file.type);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category || !price || !prevPrice || !description || !image) {
      setError('Please fill all fields and upload an image.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    // Convert image to base64
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = async () => {
      const base64data = reader.result.split(',')[1];

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
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/files`, {
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
        setDescription(''); // Reset description
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
  };

  return (
    <div className='upload-product'>
      <h2>Upload Product</h2>
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
          {imagePreview && (
            <img
              src={imagePreview}
              alt=''
              className='image-preview'
            />
          )}
        </div>

        <button type='submit' disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Product'}
        </button>
        {error && <p className='error'>{error}</p>}
      </form>
    </div>
  );
};

export default UploadProduct;

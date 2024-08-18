import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserProvider/UserProvider';
import { getImage } from '../Utils/imageLoader';
import './UpdateUser.css'

const UpdateUser = ({ user }) => {
  const { userToken } = useContext(UserContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [admin, setAdmin] = useState(false);
  const [image, setImage] = useState(null);
  const [mimeType, setMimeType] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Initialize form fields with user data
    setName(user.name || '');
    setEmail(user.email || '');
    setPassword(user.password || '');
    setAdmin(user.admin || false);
    setImage(null);
    setImagePreview(user.image ? getImage(user.image) : '');
    setUserId(user.id || '');
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setMimeType(file.type);
    setImagePreview(URL.createObjectURL(file));
  };

  console.log({user:user});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || admin === null) {
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
        await submitUser(base64data);
      };
    } else {
      await submitUser(base64data);
    }
  };

  const submitUser = async (base64data) => {
    const payload = {
      userId,
      name,
      email,
      password,
      admin,
      mimeType,
      image: base64data,
    };

    try {
      const response = await fetch('http://localhost:5000/update-user', {
        method: 'post',
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
      console.log('User updated successfully:', data);
      
      setSuccess(true);
      setName('');
      setEmail('');
      setPassword('');
      setAdmin(false);
      setImage(null);
      setMimeType('');
      setImagePreview('');
    } catch (err) {
      setError('An error occurred while updating the user.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='update-user'>
      <h2>Update User</h2>
      {success && <p className='success'>User updated successfully!</p>}
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        { user.admin && 
        <div className='form-group'>
          <label htmlFor='admin'>Admin Privileges</label>
          <input
            type='checkbox'
            id='admin'
            checked={admin}
            onChange={(e) => setAdmin(e.target.checked)}
          />
        </div>
        }

        <div className='form-group'>
          <label htmlFor='image'>User Image</label>
          <input
            type='file'
            id='image'
            accept='image/*'
            onChange={handleImageChange}
          />
          {imagePreview ? (
            <img
              src={imagePreview}
              alt='User'
              className='image-preview'
            />
          ) : null}
        </div>

        <button type='submit' disabled={loading}>
          {loading ? 'Updating...' : 'Update User'}
        </button>
        {error && <p className='error'>{error}</p>}
      </form>
    </div>
  );
};

export default UpdateUser;

import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserProvider/UserProvider';
import { getImage } from '../Utils/imageLoader';
import './Account.css';
import UpdateUser from '../UploadProduct/UpdateUser';


const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUplaod, setShowUplaod] = useState(false);

  const { userToken } = useContext(UserContext);

  const handleImage = () => {
    setShowUplaod(prev => !prev);
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/users/me`, {
          method: 'GET',
          headers: {
            'X-Token': userToken,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('userToken');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        window.location.href = '/login';
        console.log({err});
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userToken]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className='account'>
      {showUplaod && <UpdateUser user={user}/>}
      <div className='profile-image'>
      { user && (user.image ? (
        <img src={getImage(user?.image)} alt='Profile' onClick={() => handleImage()}/> ) : (
        <button onClick={() => handleImage()}>Upload new image</button>))
        }
      </div>
      <div className='user-details'>
        {user ? (
          <div>
            <h1>{user.name || 'No Name Available'}</h1>
            <p>Email: {user.email || 'No Email Available'}</p>
            <p>ID: {user.id || 'No ID Available'}</p>
          </div>
        ) : (
          <p>No user details available.</p>
        )}
      </div>
      <div className='account-buttons'>
        {user && user.admin && (
          <div>
            <div className='account-buttons'>
            <button onClick={() => window.location.href = '/users'}>Manage Users</button>
          </div>
          <div className='account-buttons'>
            <button onClick={() => window.location.href = '/messages'}>Messages</button>
          </div>
        </div>
          
        )}
        <div className='account-buttons'>
            <button onClick={() => window.location.href = '/all'}>Manage Products</button>
          </div>
      </div>
      
    </div>
  );
};

export default Account;

import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserProvider/UserProvider';

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract userToken from context
  const { userToken } = useContext(UserContext);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/users/me', {
          method: 'GET',
          headers: {
            'X-Token': userToken,
          },
        });

        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
          if (response.status===401){
            localStorage.removeItem('userToken');
         
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();
        setUser(data);
      } catch (err) {
        window.location.href = '/login'
        setError('An error occurred while fetching user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userToken]);

 

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='account'>
      <div className='profile-image'>
        <img
          src='https://via.placeholder.com/150'
          alt='Profile Placeholder'
          style={{ borderRadius: '50%' }}
        />
      </div>
      <div className='user-details'>
        {user ? (
          <div>
            <h1>{user.name}</h1>
            <p>Email: {user.email}</p>
            <p>ID: {user.id}</p>
          </div>
        ) : (
          <p>No user details available.</p>
        )}
      </div>
    </div>
    
  );
};

export default Account;

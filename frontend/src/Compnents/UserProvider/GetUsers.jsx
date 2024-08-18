import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserProvider';
import CheckAdmin from './CheckAdmin';
import Users from './Users';
import UpdateUser from '../UploadProduct/UpdateUser';
import './GetUsers.css';
import { getImage } from '../Utils/imageLoader';
import axios from 'axios';

const GetUsers = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const { userToken } = useContext(UserContext);
  const [activeUser, setActiveUser] = useState(null);


  const  handleLimit = async (userId, flag) => {
    try{
      if (isAdmin) {
        await axios.post(`http://localhost:5000/limit-user-acces/${userId}/${flag}`, {
          headers:{'x-token': userToken}
        });
        window.location.href='/users';
      }
      return '';
    } catch (err) {
      console.log(err);
      return '';
    }
  }

  // Function to handle edit button click
  const handleEditClick = (user) => {
    setActiveUser(prevUser => (prevUser === user ? null : user));
  };

  useEffect(() => {
    CheckAdmin(setIsAdmin, userToken);
  }, [userToken]);

  // Fetch users if the user is an admin
  useEffect(() => {
    if (isAdmin) {
      Users(setUsers, userToken);
    }
  }, [isAdmin, userToken]);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <div><h1>You don't have the admin privileges to access this page</h1></div>;
  }

  return (
    <div className="users-container">
      {activeUser ? (
        <UpdateUser user={activeUser} />
      ) : (
        users.map((user, indx) => (
          <div className="user-card" key={'user.id'+indx}>
            <img src={getImage(user.image)} alt={user.image} className="user-image" />
            <ul className="user-details">
              <li><strong>ID:</strong> {user._id}</li>
              <li><strong>Name:</strong> {user.name}</li>
              <li><strong>Email:</strong> {user.email}</li>
              <li><strong>Admin:</strong> {user.admin ? 'Yes' : 'No'}</li>
              <li><strong>Password:</strong> ***********</li>
              <li><strong>Status:</strong> {user.block? 'inactive' : 'active'}</li>
            </ul>
            <div className='button-container'>
              <div><button className="edit-button" onClick={() => handleEditClick(user)}>Edit</button></div>
              <div><button className="edit-button" onClick={() => handleLimit(user._id, true)}>block</button></div>
              <div><button className="edit-button" onClick={() => handleLimit(user._id, false)}>activate</button></div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default GetUsers;

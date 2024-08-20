import React, { useState, useContext, useEffect } from 'react';
import './Css/Auth.css';
import { createUser, loginUser } from '../Utils/Utils';
import { UserContext } from '../UserProvider/UserProvider';

const Auth = () => {
  const { userToken, updateUserToken } = useContext(UserContext);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (userToken) {
      window.location.href = '/profile';
    }
  }, [userToken]);

  useEffect(() => {
    console.log('Error state changed:', error);
  }, [error]);

  useEffect(() => {
    console.log('isLogin state changed:', isLogin);
  }, [isLogin]);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async () => {
    console.log('Form submitted');
    if (isLogin) {
      console.log('Attempting to log in');
      const result = await loginUser(email, password);
      console.log('Login result:', result);
      if (result.error) {
        setError('Unauthorized');
      } else {
        updateUserToken(result.data.token);
        window.location.href = '/home';
      }
    } else {
      console.log('Attempting to create user');
      const result = await createUser(name, email, password);
      console.log('Create user result:', result);
      if (!result.error) {
        setIsLogin(true);
        setError("success");
      } else {
        setError(result.error);
      }
    }
  };

  return (
    <div className='authentication'>
      <div className='authentication-content'>
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        <div className="create-fields">
          {!isLogin && (
            <input
              type="text"
              placeholder='Enter your name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder='email@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleSubmit}>
          {isLogin ? 'Login' : 'Create'}
        </button>
        <p id="error">{error}</p>
        <p className='authentication-login'>
          {isLogin ? 'Don\'t have an account? ' : 'Already have an account? '}
          <span onClick={toggleAuthMode} className='link-like-text'>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;

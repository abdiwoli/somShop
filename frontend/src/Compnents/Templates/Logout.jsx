import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate(); 

  useEffect(() => {
    localStorage.setItem("userToken", null);
    navigate('/');
  }, [navigate]);

  return null;
};

export default Logout;

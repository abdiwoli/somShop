import React, { useState } from 'react'
import './Notice.css'
import axios from 'axios';
const Notice = () => {

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = async (email) => {
    try{
      await axios.post(`http://localhost:5000/subscribe/${email}`);
      setMessage('subsbcribed')
    }
    catch(err){console.log(err)};
  };
  return (
    <div className='notes'>
        <h1>Join the Exclusive Club</h1>
        <p>Subscribe now for exclusive deals and updates!</p>
        <div>
            <input type="email" placeholder='example@example.com' onChange={handleInputChange} value={email}/>
        </div>
        <div>
        <button onClick={()=>handleSubscribe(email)}>subscribe</button>
        </div>
        <p>{message}</p>
    </div>
  )
}

export default Notice
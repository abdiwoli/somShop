import React from 'react'
import './Notice.css'
const Notice = () => {
  return (
    <div className='notes'>
        <h1>Join the Exclusive Club</h1>
        <p>Subscribe now for exclusive deals and updates!</p>
        <div>
            <input type="email" placeholder='example@example.com'/>
            
        </div>
        <div>
        <button>subscribe</button>
        </div>
    </div>
  )
}

export default Notice
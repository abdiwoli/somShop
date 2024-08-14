import React from 'react';
import './Element.css';
import { Link } from 'react-router-dom';

const Element = (props) => {
  return (
    <div className='element-container'>
        <div className='element'>
            <Link to={`/items/${props.id}`}><img src={props.image} alt={props.name} onClick={window.scrollTo(1, 1)} /></Link>
            <p>{props.name}</p>
            <div className='price'>
                <div className="nprice">
                    ${props.new_price}
                </div>
                <div className="oprice">
                    ${props.old_price}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Element;

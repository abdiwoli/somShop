import React from 'react';
import './Helper.css';
const Helper = (props) => {
    const {item} = props;
  return (
    <div className='helper'>
        location:Home/SHOP/{item.catagory}/{item.name}
    </div>
  )
}

export default Helper
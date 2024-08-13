import React, { useContext, useState } from 'react';
import './Navbar.css';
import logo from '../Images/logo.png';
import cart from '../Images/cart.png';
import { Link } from 'react-router-dom';
import { CatProvider } from '../../Providers/CatProvider';
import { UserContext } from '../UserProvider/UserProvider';

export const Navbar = () => {
    const { totalItems } = useContext(CatProvider);
    const { userToken } = useContext(UserContext); 
    const [mn, setMn] = useState("elec");

    return (
        <div className='navigation'>
            <div className='logo-icon'>
                <img src={logo} alt=''/>
                <p>SOM</p>
            </div>
            <ul className='main-menu'>
                <li onClick={() => { setMn("main") }}>
                    <Link style={{ textDecoration: 'none' }} to='/'>Home</Link>
                    {mn === "main" ? <hr /> : null}
                </li>
                <li onClick={() => { setMn("electronics") }}>
                    <Link style={{ textDecoration: 'none' }} to='electronics'>Electronics</Link>
                    {mn === "electronics" ? <hr /> : null}
                </li>
                <li onClick={() => { setMn("cloths") }}>
                    <Link style={{ textDecoration: 'none' }} to='cloths'>Clothes</Link>
                    {mn === "cloths" ? <hr /> : null}
                </li>
                <li onClick={() => { setMn("shoes") }}>
                    <Link style={{ textDecoration: 'none' }} to='shoes'>Shoes</Link>
                    {mn === "shoes" ? <hr /> : null}
                </li>
            </ul>
            <div className="login">
                <Link style={{ textDecoration: 'none' }} to={userToken ? "/profile": '/login'}>
                    <button>{userToken ? 'Account' : 'Login'}</button>
                </Link>
                <Link style={{ textDecoration: 'none' }} to='/cart'>
                    <img src={cart} alt="cart" />
                </Link>
                <div className="cart-count">{totalItems()}</div>
            </div>
        </div>
    );
}

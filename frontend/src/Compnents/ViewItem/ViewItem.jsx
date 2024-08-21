import React, { useContext, useEffect, useState } from 'react';
import './ViewItem.css';
import { CatProvider } from '../../Providers/CatProvider';
import {getImage} from '../Utils/imageLoader'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import fetchOwner from './FetchOwner';


export const ViewItem = (props) => {
    const { item } = props;
    const { addItem, deleteProduct} = useContext(CatProvider);
    const [mainImage, setMainImage] = useState(item.images && item.images.length > 0 ? item.images[0] : '');
    const [selectedSize, setSelectedSize] = useState(item.sizes ? item.sizes[0] : '');
    const [quantity, setQuantity] = useState(1);
    const [owner, setOwner] = useState(false);
    const token = localStorage.getItem('userToken'); 
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchOwner = async () => {
            try{
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/owner/${item._id}`, {
                    headers: {
                        'X-Token': token
                    }
                });
                setOwner(response.data.owner);
            } catch {
                setOwner(false);
            }

        }
        fetchOwner();
    }, [item._id, token])

    useEffect(()=>{
        fetchOwner(setOwner, item._id, token);
    }, [item.id, token])

    console.log(item);


    const handleImageClick = (image) => {
        setMainImage(image);
    };

    const handleAddToCart = () => {
        addItem(item._id, item);
    };
    const handle_delete = () => {
        deleteProduct(item._id, token);
        navigate(`/${item.catagory}`);
    }
    if (!item || !Array.isArray(item.images)) {
        return <div>Item or images data is not available.</div>;
    }
    return (
        <div className='view'>
            <div className="view-left">
                <div className="list-images">
                    {item.images.map((image, index) => (
                        <img 
                            key={index}
                            src={getImage(image)} 
                            alt={`Thumbnail ${index + 1}`} 
                            className="thumbnail" 
                            onClick={() => handleImageClick(image)}
                        />
                    ))}
                </div>
                <div className="view-image">
                    <img className='main-img' src={getImage(item.image)} alt={item.name} />
                </div>
            </div>
            <div className="view-right">
                <h2>{item.name}</h2>
                <div className="rating">
                    {[...Array(5)].map((_, i) => (
                        <i 
                            key={i} 
                            className={`fas fa-star ${i < item.rating ? 'filled' : ''}`}></i>
                    ))}
                    <p>Rating: {item.rating}</p>
                </div>
                <div className="view-price">
                    <div className="prev-price">
                        ${item.prevPrice}
                    </div>
                    <div className="new-price">
                        ${item.price}
                    </div>
                </div>
                <p className="description">
                    {item.description || 'No description available.'}
                </p>
                <div className="size-selection">
                    <label htmlFor="size">Size:</label>
                    <select 
                        id="size" 
                        value={selectedSize} 
                        onChange={(e) => setSelectedSize(e.target.value)}
                    >
                        {item.sizes && item.sizes.map((size, index) => (
                            <option key={index} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="quantity-selection">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                        id="quantity"
                        type="number"
                        value={quantity}
                        min="1"
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                </div>
                <button className="add-to-cart" onClick={handleAddToCart}>
                    Add to Cart
                </button>
                {owner && <button className="delte-product" onClick={handle_delete}>
                    Delete Product
                </button>  }
            </div>
        </div>
    );
};

import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CatProvider } from '../../Providers/CatProvider';
import axios from 'axios';
import  '../Templates/Css/Orders.css'; 

const Orders = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const { resetBasket } = useContext(CatProvider);

    let status = searchParams.get('status') || 'uncomplete';

    if (status === 'complete') {
        resetBasket(); 
    } else {
        status = "not complete";
    }
    const token = localStorage.getItem('userToken'); 

    useEffect(() => { 
        const ordersFetch = async () => {
            try {
                const response = await axios.get('http://localhost:5000/orders', {
                    headers: {
                        'X-Token': token,
                    },
                });
                setOrders(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        ordersFetch();
    }, [token]);

    const handleCompletePayment = async (orderId) => {
        try {
            await axios.post(`http://localhost:5000/orders/${orderId}/complete`, {}, {
                headers: {
                    'X-Token': token,
                },
            });
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: 'complete' } : order
                )
            );
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            await axios.delete(`http://localhost:5000/orders/${orderId}`, {
                headers: {
                    'X-Token': token,
                },
            });
            setOrders((prevOrders) =>
                prevOrders.filter((order) => order._id !== orderId)
            );
        } catch (err) {
            console.log(err);
        }
    };

    if (loading) return <div className="loading">Loading data...</div>;
    if (error) return <div className="error">No orders found, please try later.</div>;

    return (
        <div className="orders-container">
            {orders.length > 0 ? (
                orders.map((order) => (
                    <div key={order._id} className="order">
                        <h3>Order ID: {order.orderId}</h3>
                        <h4>Payment Status: {order.status}</h4>
                        <h2>Order Amount: {order.totalPrice}</h2>
                        <div className="items-list">
                            {order.items.length > 0 ? (
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={'item' + index} className="item">
                                            <p>Name: {item.name}</p>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Description: {item.description}</p>
                                            <p>Unit Price: {item.unit_amount.value}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No items found</p>
                            )}
                        </div>
                        {order.status === 'uncomplete' && (
                            <button onClick={() => handleCompletePayment(order._id)} className="complete-btn">
                                Complete Payment
                            </button>
                        )}
                        <button onClick={() => handleDeleteOrder(order._id)} className="delete-btn">
                            Delete Order
                        </button>
                    </div>
                ))
            ) : (
                <p>No orders found</p>
            )}
        </div>
    );
};

export default Orders;

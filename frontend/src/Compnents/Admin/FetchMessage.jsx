import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const MessagesContext = createContext();

export const MessageProvider = ({ children }) => {
    const userToken = localStorage.getItem('userToken') || null;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get('http://localhost:5000/messages', {
                    headers: { 'x-token': userToken },
                });
                if (res.status === 200) {
                    setMessages(res.data);
                } else {
                    setMessages([]);
                }
            } catch (err) {
                console.log(err);
                setMessages([]);
            }
        };

        fetchMessages();
    }, [userToken]);

    return (
        <MessagesContext.Provider value={{ messages }}>
            {children}
        </MessagesContext.Provider>
    );
};

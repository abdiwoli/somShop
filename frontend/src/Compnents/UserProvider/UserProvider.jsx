import React, { createContext, useState } from 'react';

// Create UserContext
export const UserContext = createContext();

// Create UserProvider component
export const UserProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(() => localStorage.getItem('userToken') || null); // Initialize from localStorage

    // Function to set the user token
    const updateUserToken = (token) => {
        setUserToken(token);
        localStorage.setItem('userToken', token); // Update localStorage
    };

    return (
        <UserContext.Provider value={{ userToken, updateUserToken }}>
            {children}
        </UserContext.Provider>
    );
};

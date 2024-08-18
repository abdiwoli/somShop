import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CatContextProvider from './Providers/CatProvider';
import { UserProvider } from './Compnents/UserProvider/UserProvider';
import { MessageProvider } from './Compnents/Admin/FetchMessage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
    <CatContextProvider>
    <MessageProvider><App /></MessageProvider>
    </CatContextProvider>
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

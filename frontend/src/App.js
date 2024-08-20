import './App.css';
import { Navbar } from './Compnents/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './Compnents/Templates/MainPage';
import Items from './Compnents/Templates/Items';
import Cart from './Compnents/Templates/Cart';
import Categories from './Compnents/Templates/Categories';
import Auth from './Compnents/Templates/Auth';
import elec_banner from './Compnents/Images/electronics_banner.png';
import shoes_banner from './Compnents/Images/shoes_banner.png';
import cloths_banner from './Compnents/Images/cloths_banner.png';
import Footer from './Compnents/Footer/Footer';
import Account from './Compnents/Account/Account';
import Checkout from './Compnents/Checkout/Checkout';
import { UserContext } from './Compnents/UserProvider/UserProvider';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Orders from './Compnents/Templates/Orders';
import Admin from './Compnents/Admin/Admin';
import Logout from './Compnents/Templates/Logout';
import UploadProduct from './Compnents/UploadProduct/UploadProduct';
import GetUsers from './Compnents/UserProvider/GetUsers';
import AllProducts from './Compnents/Templates/AllProducts';
import AboutSection from './Compnents/Footer/AboutSection';
import ContactUs from './Compnents/Footer/ContactUs';
import TermsOfService from './Compnents/Footer/TermsOfService';
import PrivacyPolicy from './Compnents/Footer/PrivacyPolicy';
import Messages from './Compnents/Admin/Messages';

function App() {
  const { userToken } = useContext(UserContext);

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<MainPage kind='main' />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/messages' element={<Messages />} />
          <Route path='/contact' element={<ContactUs />} />
          <Route path='/terms' element={<TermsOfService />} />
          <Route path='/privacy' element={<PrivacyPolicy />} />
          <Route path='/about' element={<AboutSection />} />
          <Route path='/electronics' element={<Categories banner={elec_banner} kind='electronics' />} />
          <Route path='/shoes' element={<Categories banner={shoes_banner} kind='shoes' />} />
          <Route path='/cloths' element={<Categories banner={cloths_banner} kind='cloths' />} />
          <Route path='/login' element={<Auth />} />
          <Route path='/all' element={<Admin />} />
          <Route path='/profile' element={<Account />} />
          <Route path='/add-product' element={<UploadProduct />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/users' element={<GetUsers />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/items' element={<Items />} >
            <Route path=':itemId' element={<Items />} />
          </Route>
          <Route
            path='/cart'
            element={userToken ? <Cart /> : <Navigate to='/login' />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

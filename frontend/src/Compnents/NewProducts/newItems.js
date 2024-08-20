import axios from "axios";


const newProducts = async (route) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_API}/${route}`);
        return res.data;
    } catch {
        return [];
    }
};
  
  export default newProducts;

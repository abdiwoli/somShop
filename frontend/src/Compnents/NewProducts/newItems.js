import axios from "axios";

const newProducts = async (route) => {
    try {
        const res = await axios.get(`http://localhost:5000/${route}`);
        return res.data;
    } catch {
        return [];
    }
};
  
  export default newProducts;
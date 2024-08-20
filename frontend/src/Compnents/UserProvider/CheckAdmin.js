import axios from "axios";
const CheckAdmin = async (setIsAdmin, userToken, setUser=1) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_API}/users/me`, { headers: { 'X-Token': userToken } });
      setIsAdmin(res.data.admin);
      if (setUser !== 1){
        setUser(res.data);
      }
    } catch (err) {
      console.error(err);
      setIsAdmin(false);
    }
  };

  export default CheckAdmin;

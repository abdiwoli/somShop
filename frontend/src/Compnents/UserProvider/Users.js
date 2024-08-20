import axios from "axios";
const Users = async (setUsers, userToken) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_API}/users`, { headers: { 'X-Token': userToken } });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  export default Users;

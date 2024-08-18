import axios from "axios";
const Users = async (setUsers, userToken) => {
    try {
      const res = await axios.get(`http://localhost:5000/users`, { headers: { 'X-Token': userToken } });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  export default Users;
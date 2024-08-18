import axios from "axios";
const fetchOwner = async (setOwner, id, token) => {
    try{
        const response = await axios.get(`http://localhost:5000/owner/${id}`, {
            headers: {
                'x-token': token
            }
        });
        setOwner(response.data.owner);
    } catch {
        setOwner(false);
    }
}


export default fetchOwner;
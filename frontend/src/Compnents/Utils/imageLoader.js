// Define the base URL for the images
const BASE_URL = 'http://localhost:5000/images/';

// Function to return the full URL of the image based on the filename
export const getImage = (filename) => {
    return `${process.env.REACT_APP_BACKEND_API}/images/${filename}`;
};

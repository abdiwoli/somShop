import React, { useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../UserProvider/UserProvider';


const ImageUpload = ({ id }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const {userToken} = useContext(UserContext);
  const [success, setSuccess] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Convert the file to a base64 string
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }
    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log(userToken);
      const base64String = await convertToBase64(selectedFile);
      const mimeType = selectedFile.type;

      await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/additional-image/${id}`,
        {
          mimeType: mimeType,
          data: base64String.split(',')[1],
        }, {
        headers:{'x-token': userToken}
        }
      );

      setSuccess(true);
      window.location.href = '/all';
    } catch (err) {
      setError("Failed to upload the image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <h4>Upload New Image</h4>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Image uploaded successfully!</div>}
    </div>
  );
};

export default ImageUpload;

import React, { useEffect, useState } from 'react';

const ImageComponent = () => {
  // Hardcoded file ID and size
  const fileId = '66b5f12bba2f2f71bb0c851c';
  const size = 250;

  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`http://localhost:5000/files/${fileId}/data?size=${size}`, {
            method: 'GET',
          });
          

        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }

        // Convert the response to a blob (binary large object)
        const blob = await response.blob();

        // Create a URL for the blob
        const imageUrl = URL.createObjectURL(blob);

        // Set the image URL in state
        setImageSrc(imageUrl);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [fileId, size]);

  return (
    <div>
      {imageSrc ? (
        <img src={imageSrc} alt='Product' />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
};

export default ImageComponent;

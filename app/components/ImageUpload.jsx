"use client";

import React, { useState } from "react";

const ImageUpload = ({ handleImageChange }) => {
  const [previewImage, setPreviewImage] = useState(null);

  const handlePreviewImage = (e) => {
    const file = e.target.files[0];
    setPreviewImage(URL.createObjectURL(file));
    handleImageChange(file);
  };

  return (
    <div>
      <label htmlFor="profileImage">Profile Image:</label>
      <input
        type="file"
        id="profileImage"
        accept="image/*"
        onChange={handlePreviewImage}
      />
      {previewImage && (
        <div>
          <img src={previewImage} alt="Profile Preview" width="200" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

import React, { useState } from "react";

const ImageUploader = ({ onImageSelect }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      // onImageSelect(file);
    }
  };

  const triggerInput = () => {
    document.getElementById("hidden-image-input").click();
  };

  return (
    <div className=" h-56 bg-orange-50 border-2 border-dashed border-orange-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-orange-100 transition w-full md:w-auto">
      <input
        id="hidden-image-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="object-cover w-full h-full rounded-md"
          onClick={triggerInput}
        />
      ) : (
        <span className="text-gray-600" onClick={triggerInput}>
          Upload Image
        </span>
      )}
    </div>
  );
};

export default ImageUploader;

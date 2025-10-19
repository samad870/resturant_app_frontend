import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    type: "",
    available: true,
  });

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const [categorySuggestions, setCategorySuggestions] = useState(() => {
    const savedCategories = localStorage.getItem("productCategories");
    return savedCategories ? JSON.parse(savedCategories) : [];
  });

  const [token] = useState(() => {
    return localStorage.getItem("token") || "";
  });

  useEffect(() => {
    localStorage.setItem("productCategories", JSON.stringify(categorySuggestions));
  }, [categorySuggestions]);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ show: false, message: "", type: "" });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "category") {
      const capitalizedValue = value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      setFormData((prev) => ({
        ...prev,
        [name]: capitalizedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    setFileError("");
    setFile(null);

    if (!selectedFile) return;

    // ✅ 300KB file size limit
    const fileSizeInKB = selectedFile.size / 1024;
    if (fileSizeInKB > 300) {
      setFileError(`File size too large: ${fileSizeInKB.toFixed(2)} KB. Maximum allowed: 300KB`);
      e.target.value = "";
      return;
    }

    // ✅ All image types accepted (matches backend)
    const allowedTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/gif', 
      'image/webp',
      'image/avif'
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setFileError("Please select a valid image file (JPEG, JPG, PNG, GIF, WEBP, AVIF)");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      showNotification("Please select a product image", "error");
      return;
    }

    if (fileError) {
      showNotification(fileError, "error");
      return;
    }

    if (!token) {
      showNotification("Please login to add products", "error");
      return;
    }

    const newCategory = formData.category.trim();
    if (newCategory && !categorySuggestions.includes(newCategory)) {
      setCategorySuggestions((prev) => [...prev, newCategory]);
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("description", formData.description.trim());
      submitData.append("price", formData.price);
      submitData.append("category", formData.category.trim());
      submitData.append("type", formData.type);
      submitData.append("available", formData.available);
      submitData.append("file", file);

      const res = await fetch("/api/menu/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      const responseText = await res.text();

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        
        if (res.status === 413) {
          throw new Error("File too large for server");
        } else if (res.status >= 500) {
          throw new Error("Server error. Please try again later.");
        } else {
          throw new Error("Unexpected response from server");
        }
      }

      if (!res.ok) {
        throw new Error(result.message || `Error: ${res.status}`);
      }

      showNotification(result.message || "Product added successfully!", "success");

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        type: "",
        available: true,
      });
      setFile(null);
      setFileError("");
      
      const fileInput = document.getElementById('product-image');
      if (fileInput) fileInput.value = "";

    } catch (error) {
      console.error("Submission error:", error);
      
      let errorMessage = error.message;
      
      if (error.message.includes("File too large")) {
        errorMessage = "File is too large. Please select a smaller image (max 300KB).";
      } else if (error.message.includes("Network Error") || error.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message.includes("Server error")) {
        errorMessage = "Server is temporarily unavailable. Please try again later.";
      } else if (error.message.includes("Unexpected response")) {
        errorMessage = "Server returned an unexpected response. Please contact support.";
      }
      
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 relative">
      {/* Notification Modal */}
      <AnimatePresence>
        {notification.show && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={closeNotification}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  type: "spring", 
                  damping: 25, 
                  stiffness: 300,
                  duration: 0.3
                }}
                className={`relative rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-auto ${
                  notification.type === "success" 
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200" 
                    : "bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  {/* Icon */}
                  <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                    notification.type === "success" 
                      ? "bg-green-100 text-green-600 border-2 border-green-200" 
                      : "bg-red-100 text-red-600 border-2 border-red-200"
                  }`}>
                    {notification.type === "success" ? (
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className={`text-3xl font-bold mb-4 ${
                    notification.type === "success" ? "text-green-900" : "text-red-900"
                  }`}>
                    {notification.type === "success" ? "Success!" : "Oops!"}
                  </h3>

                  {/* Message */}
                  <p className={`text-xl mb-8 leading-relaxed ${
                    notification.type === "success" ? "text-green-700" : "text-red-700"
                  }`}>
                    {notification.message}
                  </p>

                  {/* Done Button */}
                  <motion.button
                    onClick={closeNotification}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    className={`w-full py-5 rounded-2xl text-xl font-bold shadow-lg transition-all ${
                      notification.type === "success" 
                        ? "bg-green-500 text-white hover:bg-green-600 shadow-green-200" 
                        : "bg-red-500 text-white hover:bg-red-600 shadow-red-200"
                    }`}
                  >
                    Done
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Add New Product
          </h1>
          <p className="text-gray-600 text-lg">
            Create a new menu item for your restaurant
          </p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
              <span className="text-white text-lg">🍕</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
              <p className="text-gray-600">Fill in the product information</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Row 1: Name + Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
                  placeholder="e.g. Momo, Pizza, Burger"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
                  placeholder="e.g. 121"
                />
              </div>
            </div>

            {/* Row 2: Category + Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <div className="relative">
                  <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    list="category-suggestions"
                    className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
                    placeholder="e.g. Appetizer, Main Course"
                  />
                  <datalist id="category-suggestions">
                    {categorySuggestions.map((category, index) => (
                      <option key={index} value={category} />
                    ))}
                  </datalist>
                </div>
                <p className="text-xs text-gray-500 mt-2">Choose from suggestions or type new</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Food Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
                >
                  <option value="">Select Food Type</option>
                  <option value="veg">🌱 Veg</option>
                  <option value="non-veg">🍗 Non-Veg</option>
                </select>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors cursor-pointer bg-gray-50">
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="product-image"
                  accept=".jpeg,.jpg,.png,.gif,.webp,.avif,image/*"
                />
                <label htmlFor="product-image" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">📁</span>
                    <div>
                      <p className="text-gray-700 font-medium">
                        {file ? file.name : "Click to upload product image"}
                      </p>
                      {/* ✅ Updated to show 300KB limit */}
                      <p className="text-sm text-gray-500">JPEG, JPG, PNG up to 300KB</p>
                    </div>
                  </div>
                </label>
              </div>
              
              {/* File selection success message */}
              {file && !fileError && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                  <span>✅</span> Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
              
              {/* File error message */}
              {fileError && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
                  <span>❌</span> {fileError}
                </p>
              )}
            </div>

            {/* Availability Checkbox */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="h-5 w-5 accent-orange-500 rounded"
              />
              <div>
                <label className="font-semibold text-gray-700">Available for Order</label>
                <p className="text-sm text-gray-500">Product will be visible to customers</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white resize-none"
                placeholder="Describe your product... (ingredients, taste, serving size, etc.)"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || fileError}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-orange-500 text-white py-4 rounded-xl text-lg font-semibold shadow-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Product...
                </>
              ) : (
                <>
                  <span>➕</span>
                  Add Product to Menu
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default ProductForm;
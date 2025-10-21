import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import config from "../../../config";

const RestaurantForm = () => {
  const [formData, setFormData] = useState({
    category: "",
    tableNumbers: "",
    phoneNumber: "",
    publicId: "",
  });

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const [categorySuggestions, setCategorySuggestions] = useState(() => {
    const saved = localStorage.getItem("restaurantCategories");
    return saved ? JSON.parse(saved) : [];
  });

  const [token] = useState(() => localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem(
      "restaurantCategories",
      JSON.stringify(categorySuggestions)
    );
  }, [categorySuggestions]);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ show: false, message: "", type: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "tableNumbers" || name === "phoneNumber") {
      const numericValue = value.replace(/\D/g, '');
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ✅ File handler with 300KB size limit
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

    // ✅ All image types accepted
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
      showNotification("Please upload a logo file", "error");
      return;
    }

    if (fileError) {
      showNotification(fileError, "error");
      return;
    }

    if (!token) {
      showNotification("No token found. Please login first", "error");
      return;
    }

    if (formData.tableNumbers.length > 10) {
      showNotification("Table numbers cannot exceed 10 digits", "error");
      return;
    }

    if (formData.phoneNumber.length !== 10) {
      showNotification("Phone number must be exactly 10 digits", "error");
      return;
    }

    const newCategory = formData.category.trim();
    if (newCategory && !categorySuggestions.includes(newCategory)) {
      setCategorySuggestions((prev) => [...prev, newCategory]);
    }

    try {
      setLoading(true);

      const payload = {
        categories: [formData.category],
        tableNumbers: Number(formData.tableNumbers),
        phoneNumber: Number(formData.phoneNumber),
        logo: {
          url: URL.createObjectURL(file),
          public_id: formData.publicId || "sample_logo_id",
        },
      };

      const res = await fetch(`${config.BASE_URL}/api/restaurant/details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to add restaurant");

      showNotification("Restaurant details saved successfully!", "success");

      setFormData({
        category: "",
        tableNumbers: "",
        phoneNumber: "",
        publicId: "",
      });
      setFile(null);
      setFileError("");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = (e) => {
    if (e.target.name === "tableNumbers" || e.target.name === "phoneNumber") {
      const pasteData = e.clipboardData.getData('text');
      if (!/^\d+$/.test(pasteData)) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 relative">
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

                  <h3 className={`text-3xl font-bold mb-4 ${
                    notification.type === "success" ? "text-green-900" : "text-red-900"
                  }`}>
                    {notification.type === "success" ? "Success!" : "Oops!"}
                  </h3>

                  <p className={`text-xl mb-8 leading-relaxed ${
                    notification.type === "success" ? "text-green-700" : "text-red-700"
                  }`}>
                    {notification.message}
                  </p>

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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Restaurant Profile Setup
          </h1>
          <p className="text-gray-600 text-lg">
            Complete your restaurant information to get started
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
              <span className="text-white text-lg">🏨</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Restaurant Details</h2>
              <p className="text-gray-600">Fill in your restaurant information</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Restaurant Category
                </label>
                <div className="relative">
                  <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    list="category-suggestions"
                    className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
                    placeholder="e.g. Indian, Chinese, Italian"
                  />
                  <datalist id="category-suggestions">
                    {categorySuggestions.map((cat, idx) => (
                      <option key={idx} value={cat} />
                    ))}
                  </datalist>
                </div>
                <p className="text-xs text-gray-500 mt-2">Choose from suggestions or type new</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Tables
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  name="tableNumbers"
                  value={formData.tableNumbers}
                  onChange={handleChange}
                  onPaste={handlePaste}
                  required
                  className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
                  placeholder="e.g. 25"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                onPaste={handlePaste}
                required
                maxLength={10}
                className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
                placeholder="e.g. 9876543210"
              />
              <p className="text-xs text-gray-500 mt-2">Must be exactly 10 digits</p>
            </div>

            {/* ✅ File Upload with 300KB limit */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Restaurant Logo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors cursor-pointer bg-gray-50">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="logo-upload"
                  accept=".jpeg,.jpg,.png,.gif,.webp,.avif,image/*"
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">📁</span>
                    <div>
                      <p className="text-gray-700 font-medium">
                        {file ? file.name : "Click to upload logo"}
                      </p>
                      {/* ✅ Updated to show 300KB limit */}
                      <p className="text-sm text-gray-500">JPEG, JPG, PNG up to 300KB</p>
                    </div>
                  </div>
                </label>
              </div>
              
              {file && !fileError && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                  <span>✅</span> Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
              
              {fileError && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
                  <span>❌</span> {fileError}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading || fileError}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-orange-500 text-white py-4 rounded-xl text-lg font-semibold shadow-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Save Restaurant Details
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default RestaurantForm;
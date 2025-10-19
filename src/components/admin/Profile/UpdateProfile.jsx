import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    category: "",
    tableNumbers: "",
    phoneNumber: "",
    publicId: "",
  });

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState("");
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [categorySuggestions, setCategorySuggestions] = useState(() => {
    const saved = localStorage.getItem("restaurantCategories");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error parsing categories from localStorage:", error);
      return [];
    }
  });

  const [token] = useState(() => localStorage.getItem("token") || "");

  // Fetch restaurant details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(
          "https://api.flamendough.com/api/restaurant/admin",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        console.log("Fetched restaurant details:", data);

        if (res.ok && data.restaurant) {
          const r = data.restaurant;
          setRestaurantId(r._id);
          setRestaurantInfo(r);
          setFormData({
            category: r.categories?.[0] || "",
            tableNumbers: r.tableNumbers || "",
            phoneNumber: r.phoneNumber || "",
            publicId: r.logo?.public_id || "",
          });
        }
      } catch (err) {
        console.error("Error fetching restaurant details:", err);
      }
    };

    if (token) fetchDetails();
  }, [token]);

  // Show notification function
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ show: false, message: "", type: "" });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const onlyDigits = value.replace(/\D/g, "");
      if (onlyDigits.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          [name]: onlyDigits,
        }));
      }
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

    // All image types accepted
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

    if (!token) {
      showNotification("No token found. Please login first", "error");
      return;
    }

    // Check if file exists and has no errors
    if (fileError) {
      showNotification(fileError, "error");
      return;
    }

    const newCategory = formData.category.trim();
    if (newCategory && !categorySuggestions.includes(newCategory)) {
      const updatedSuggestions = [...categorySuggestions, newCategory];
      setCategorySuggestions(updatedSuggestions);
      localStorage.setItem("restaurantCategories", JSON.stringify(updatedSuggestions));
    }

    try {
      setLoading(true);

      const formDataToUpload = new FormData();
      formDataToUpload.append("category", formData.category);
      formDataToUpload.append("tableNumbers", formData.tableNumbers);
      formDataToUpload.append("phoneNumber", formData.phoneNumber);

      if (file) {
        formDataToUpload.append("file", file);
      }

      console.log("Sending update request...", {
        category: formData.category,
        tableNumbers: formData.tableNumbers,
        phoneNumber: formData.phoneNumber,
        hasFile: !!file
      });

      // ✅ UPDATED: Using PUT with FormData for restaurant update
      const res = await fetch("/api/restaurant/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // No Content-Type header for FormData - browser sets it automatically
        },
        body: formDataToUpload,
      });

      const result = await res.json();
      console.log("Update response:", result);

      if (!res.ok) {
        throw new Error(result.message || `Failed to update restaurant: ${res.status} ${res.statusText}`);
      }

      showNotification("Restaurant updated successfully!", "success");
      setRestaurantInfo(result.restaurant);
      setFile(null);
      setFileError("");

    } catch (error) {
      console.error("Update error:", error);
      showNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Custom delete confirmation functions
  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const deleteRestaurant = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/restaurant/",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const results = await res.json();
      if (!res.ok)
        throw new Error(results.message || "Failed to delete restaurant");

      showNotification("Restaurant deleted successfully!", "success");
      setShowDeleteConfirm(false);
      
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 relative">
      {/* Big Modal Notification */}
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={cancelDelete}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  type: "spring", 
                  damping: 25, 
                  stiffness: 300 
                }}
                className="relative rounded-3xl shadow-2xl p-8 w-full max-w-md mx-auto bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  {/* Warning Icon */}
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-red-100 text-red-600 border-2 border-red-200">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl font-bold text-red-900 mb-4">
                    Confirm Deletion
                  </h3>

                  {/* Warning Message */}
                  <div className="bg-red-100 border-2 border-red-200 rounded-2xl p-4 mb-6">
                    <p className="text-red-800 font-semibold text-lg">
                      ⚠️ This action cannot be undone!
                    </p>
                    <p className="text-red-700 mt-2">
                      All your restaurant data, menu items, and settings will be permanently deleted.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <motion.button
                      onClick={cancelDelete}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex-1 py-4 bg-gray-500 text-white rounded-2xl font-bold shadow-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    
                    <motion.button
                      onClick={deleteRestaurant}
                      disabled={loading}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <span>🗑️</span>
                          Yes, Delete
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {restaurantInfo && (
        <motion.div 
          className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-orange-500">🏨</span>
            Restaurant Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {restaurantInfo.name && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1">Name</p>
                  <p className="text-lg font-semibold text-gray-900">{restaurantInfo.name}</p>
                </div>
              )}
              
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-medium text-gray-500">Category</p>
                </div>
                <p className="text-gray-900 font-medium text-lg">
                  {restaurantInfo.categories
                    ? Array.isArray(restaurantInfo.categories) 
                      ? restaurantInfo.categories.join(", ")
                      : restaurantInfo.categories
                    : "Not specified"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-1">Total Tables</p>
                <p className="text-lg font-semibold text-gray-900">{restaurantInfo.tableNumbers || "N/A"}</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-1">Contact Number</p>
                <p className="text-gray-900 font-medium">{restaurantInfo.phoneNumber || "N/A"}</p>
              </div>
            </div>
          </div>

          {restaurantInfo.logo?.url && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-500 mb-3">Current Logo</p>
              <div className="flex items-center gap-4">
                <img
                  src={restaurantInfo.logo.url}
                  alt="Restaurant Logo"
                  className="h-16 w-16 rounded-xl border border-gray-200 object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Logo Preview</p>
                  <p className="text-xs text-gray-500">Current restaurant logo</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center flex items-center justify-center gap-2">
          <span className="text-orange-500">⚙️</span>
          Update Restaurant Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              list="category-suggestions"
              className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              placeholder="e.g. Indian, Chinese"
            />
            <datalist id="category-suggestions">
              {categorySuggestions.map((cat, idx) => (
                <option key={idx} value={cat} />
              ))}
            </datalist>
            <p className="text-xs text-gray-500 mt-1">Select from suggestions or type new</p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Table Numbers</label>
            <input
              type="number"
              name="tableNumbers"
              value={formData.tableNumbers}
              onChange={handleChange}
              required
              min="1"
              className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              placeholder="e.g. 25"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            placeholder="e.g. 9876543210"
          />
        </div>

        {/* File Upload Section */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Restaurant Logo</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors bg-gray-50">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="logo-upload"
              accept=".jpeg,.jpg,.png,.gif,.webp,.avif,image/*"
            />
            <label htmlFor="logo-upload" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="text-2xl">📁</span>
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

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <motion.button
            type="submit"
            disabled={loading || fileError}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-orange-500 text-white py-4 rounded-xl text-lg font-semibold shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              <>
                <span>💾</span>
                Update Restaurant
              </>
            )}
          </motion.button>

          <motion.button
            type="button"
            onClick={confirmDelete}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <span>🗑️</span>
            Delete Restaurant
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default UpdateProfile;
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    category: "",
    tableNumbers: "",
    phoneNumber: "",
    publicId: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState("");
  const [restaurantInfo, setRestaurantInfo] = useState(null);

  const [categorySuggestions, setCategorySuggestions] = useState(() => {
    const saved = localStorage.getItem("restaurantCategories");
    return saved ? JSON.parse(saved) : [];
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

  // ✅ Updated handleChange with 10-digit phone restriction
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("⚠️ No token found. Please login first.");
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

      const res = await fetch(
        "https://api.flamendough.com/api/restaurant/",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToUpload,
        }
      );

      const result = await res.json();

      if (!res.ok)
        throw new Error(result.message || "Failed to update restaurant");

      alert("✅ Restaurant updated successfully.");
      setRestaurantInfo(result.restaurant);

    } catch (error) {
      alert("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteRestaurant = async () => {
    if (!window.confirm("Are you sure you want to delete this restaurant? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(
        "https://api.flamendough.com/api/restaurant/",
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

      alert("✅ Restaurant deleted successfully.");
    } catch (error) {
      alert("❌ " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      {restaurantInfo && (
        <motion.div 
          className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-orange-500">🏨</span>
            Restaurant Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {restaurantInfo.name && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg font-semibold text-gray-900">{restaurantInfo.name}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-gray-900 font-medium">
                  {restaurantInfo.categories?.join(", ") || "N/A"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Tables</p>
                <p className="text-gray-900 font-medium">{restaurantInfo.tableNumbers || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-gray-900 font-medium">{restaurantInfo.phoneNumber || "N/A"}</p>
              </div>
            </div>
          </div>

          {restaurantInfo.logo?.url && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-500 mb-2">Current Logo</p>
              <img
                src={restaurantInfo.logo.url}
                alt="Restaurant Logo"
                className="h-20 rounded-lg border border-gray-200"
              />
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

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Restaurant Logo</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors bg-gray-50">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="logo-upload"
              accept="image/*"
            />
            <label htmlFor="logo-upload" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="text-2xl">📁</span>
                <div>
                  <p className="text-gray-700 font-medium">
                    {file ? file.name : "Click to upload logo"}
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                </div>
              </div>
            </label>
          </div>
          {file && (
            <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
              <span>✅</span> Selected: {file.name}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <motion.button
            type="submit"
            disabled={loading}
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
            onClick={deleteRestaurant}
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

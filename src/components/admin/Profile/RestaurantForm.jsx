import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const RestaurantForm = () => {
  const [formData, setFormData] = useState({
    category: "",
    tableNumbers: "",
    phoneNumber: "",
    publicId: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Category suggestions saved in localStorage
  const [categorySuggestions, setCategorySuggestions] = useState(() => {
    const saved = localStorage.getItem("restaurantCategories");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Token from localStorage
  const [token] = useState(() => localStorage.getItem("token") || "");

  // Sync categories with localStorage
  useEffect(() => {
    localStorage.setItem(
      "restaurantCategories",
      JSON.stringify(categorySuggestions)
    );
  }, [categorySuggestions]);

  // Input handler - Prevent text in number fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For number fields, only allow numbers
    if (name === "tableNumbers" || name === "phoneNumber") {
      // Remove any non-digit characters
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

  // File handler
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload a logo file");
      return;
    }

    if (!token) {
      alert("⚠️ No token found. Please login first.");
      return;
    }

    // Validate table numbers (max 10 digits)
    if (formData.tableNumbers.length > 10) {
      alert("Table numbers cannot exceed 10 digits");
      return;
    }

    // Validate phone number (exactly 10 digits)
    if (formData.phoneNumber.length !== 10) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    // ✅ Save new category if unique
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
          url: URL.createObjectURL(file), // demo only
          public_id: formData.publicId || "sample_logo_id",
        },
      };

      const res = await fetch(
        "https://api.flamendough.com/api/restaurant/details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to add restaurant");

      alert("✅ Restaurant details saved successfully.");

      setFormData({
        category: "",
        tableNumbers: "",
        phoneNumber: "",
        publicId: "",
      });
      setFile(null);
    } catch (error) {
      alert("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Prevent paste of non-numeric values in number fields
  const handlePaste = (e) => {
    if (e.target.name === "tableNumbers" || e.target.name === "phoneNumber") {
      const pasteData = e.clipboardData.getData('text');
      if (!/^\d+$/.test(pasteData)) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
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
            {/* Row 1: Category + Table Numbers */}
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
                  // pattern="[0-9]*"
                  name="tableNumbers"
                  value={formData.tableNumbers}
                  onChange={handleChange}
                  onPaste={handlePaste}
                  required
                  // maxLength={10}
                  className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
                  placeholder="e.g. 25"
                />
                {/* <p className="text-xs text-gray-500 mt-2">Maximum 10 digits allowed</p> */}
              </div>
            </div>

            {/* Row 2: Phone */}
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

            {/* File Upload */}
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
                  accept="image/*"
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">📁</span>
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

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
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
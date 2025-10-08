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

  // ✅ Category suggestions saved in localStora
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

  // Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        "https://restaurant-app-backend-mihf.onrender.com/api/restaurant/details",
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 space-y-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          🏨 Restaurant Profile
        </h2>

        {/* Row 1: Category + Table Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category
            </label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              list="category-suggestions"
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none"
              placeholder="e.g. Indian, Chinese"
            />
            <datalist id="category-suggestions">
              {categorySuggestions.map((cat, idx) => (
                <option key={idx} value={cat} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Table Numbers
            </label>
            <input
              type="number"
              name="tableNumbers"
              value={formData.tableNumbers}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none"
              placeholder="e.g. 25"
            />
          </div>
        </div>

        {/* Row 2: Phone + Public ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none"
              placeholder="e.g. 9876543210"
            />
          </div>

          <div>
            {/* <label className="block text-gray-700 font-medium mb-1">
              Public ID
            </label>
            <input
              name="publicId"
              value={formData.publicId}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none"
              placeholder="Logo public_id"
            /> */}
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Logo</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border rounded-xl p-3 cursor-pointer"
          />
          {file && (
            <p className="text-sm text-gray-500 mt-2">Selected: {file.name}</p>
          )}
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-orange-500 text-white py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-orange-600 transition"
        >
          {loading ? "Saving..." : "Save Restaurant"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default RestaurantForm;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
  const [loading, setLoading] = useState(false);

  // ✅ Category suggestions saved in localStorage
  const [categorySuggestions, setCategorySuggestions] = useState(() => {
    const savedCategories = localStorage.getItem("productCategories");
    return savedCategories ? JSON.parse(savedCategories) : [];
  });

  // ✅ Token (get from localStorage or wherever you store it after login)
  const [token] = useState(() => {
    return localStorage.getItem("token") || "";
  });

  // Keep category suggestions in sync with localStorage
  useEffect(() => {
    localStorage.setItem(
      "productCategories",
      JSON.stringify(categorySuggestions)
    );
  }, [categorySuggestions]);

  // Input handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "category") {
      // Capitalize first letter of each word for category
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

  // File handler
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
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

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("type", formData.type);
      data.append("available", formData.available);
      data.append("file", file);

      const res = await fetch(
        "https://api.flamendough.com/api/menu/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token here
          },
          body: data,
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to add product");
      }

      alert("✅ Product added successfully.");

      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        type: "",
        available: true,
      });
      setFile(null);
    } catch (error) {
      alert("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
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
                  accept="image/*"
                />
                <label htmlFor="product-image" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">📁</span>
                    <div>
                      <p className="text-gray-700 font-medium">
                        {file ? file.name : "Click to upload product image"}
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
              disabled={loading}
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
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import config from "@/config";
import config from "../../config";


const ListItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Filters
  const [filterType, setFilterType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Notification state
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const API_URL = `${config.BASE_URL}/api/menu`;
  const token = localStorage.getItem("token");

  // Common food background image with orange theme
  const commonCategoryImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";

  // Show notification function
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ show: false, message: "", type: "" });
  };

  // ✅ Fetch Data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json();
      if (Array.isArray(data.menu)) {
        setItems(data.menu);
      } else {
        setError("Unexpected API response format");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete with confirmation
  const handleDelete = async (id, name) => {
    setDeleteConfirm({ id, name });
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/${deleteConfirm.id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      
      if (!res.ok) throw new Error("Failed to delete item");
      
      setItems(items.filter((item) => item._id !== deleteConfirm.id));
      showNotification("Item deleted successfully!", "success");
      setDeleteConfirm(null);
    } catch (err) {
      showNotification(err.message, "error");
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // ✅ Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let body;
      let headers = { Authorization: token ? `Bearer ${token}` : "" };

      if (editingItem.image instanceof File) {
        body = new FormData();
        body.append("name", editingItem.name);
        body.append("category", editingItem.category);
        body.append("type", editingItem.type);
        body.append("price", editingItem.price);
        body.append("description", editingItem.description);
        body.append("available", editingItem.available);
        body.append("file", editingItem.image);
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(editingItem);
      }

      const res = await fetch(`${API_URL}/${editingItem._id}`, {
        method: "PUT",
        headers,
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update item");

      const updatedItem = data.item || data;
      setItems((prev) =>
        prev.map((i) => (i._id === updatedItem._id ? updatedItem : i))
      );

      setEditingItem(null);
      showNotification("Item updated successfully!", "success");
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  // ✅ Get unique categories with counts
  const getCategoriesWithCounts = () => {
    const categoryCounts = {};
    items.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    const allCategories = [];

    Object.keys(categoryCounts).forEach(category => {
      allCategories.push({
        name: category,
        count: categoryCounts[category]
      });
    });

    return allCategories;
  };

  const categories = getCategoriesWithCounts();

  // ✅ Apply filters
  const filteredItems = items.filter((item) => {
    const typeMatch = filterType === "all" || item.type === filterType;
    const categoryMatch = selectedCategory === null || item.category === selectedCategory;
    return typeMatch && categoryMatch;
  });

  // ✅ Handle category click
  const handleCategoryClick = (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
    }
  };

  // ✅ Handle type filter click
  const handleTypeClick = (type) => {
    if (filterType === type) {
      setFilterType("all");
    } else {
      setFilterType(type);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategory(null);
    setFilterType("all");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 relative">
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
        {deleteConfirm && (
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
                      Are you sure you want to delete?
                    </p>
                    <p className="text-red-700 mt-2 font-medium">
                      "{deleteConfirm.name}"
                    </p>
                    <p className="text-red-600 text-sm mt-2">
                      This action cannot be undone.
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
                      onClick={confirmDelete}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>🗑️</span>
                      Yes, Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">🍔 Our Menu</h2>
          <p className="text-gray-500">
            {selectedCategory ? (
              <span>Showing items in <b>{selectedCategory}</b> category</span>
            ) : filterType !== "all" ? (
              <span>Showing <b>{filterType === "veg" ? "Vegetarian" : "Non-Vegetarian"}</b> items</span>
            ) : (
              <span>Select a category to view items</span>
            )}
          </p>
        </div>

        {/* Category Section - New Design with Common Background */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Categories
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category, idx) => (
              <motion.div
                key={idx}
                onClick={() => handleCategoryClick(category.name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`cursor-pointer rounded-2xl shadow-lg transition-all duration-300 overflow-hidden ${
                  selectedCategory === category.name 
                    ? "ring-4 ring-orange-500 shadow-2xl transform scale-105" 
                    : "hover:shadow-xl"
                }`}
              >
                <div 
                  className="h-28 flex flex-col items-center justify-center p-4 text-white relative"
                  style={{
                    backgroundImage: `url(${commonCategoryImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Orange overlay with blur effect */}
                  <div className="absolute inset-0 backdrop-blur-[9px]"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <div className="text-3xl mb-2 drop-shadow-lg">
                      {category.name.toLowerCase() === "pizza" && "🍽️"}
                      {category.name.toLowerCase() === "burger" && "🍽️"}
                      {category.name.toLowerCase() === "pasta" && "🍽️"}
                      {category.name.toLowerCase() === "desserts" && "🍽️"}
                      {category.name.toLowerCase() === "beverages" && "🍽️"}
                      {!["pizza", "burger", "pasta", "desserts", "beverages"].includes(category.name.toLowerCase()) && "🍽️"}
                    </div>
                    <h4 className="font-bold text-lg text-center drop-shadow-lg">{category.name}</h4>
                    <p className="text-white/90 text-sm mt-1 drop-shadow-md">{category.count} items</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Type Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setFilterType("all")}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              filterType === "all"
                ? "bg-orange-600 text-white shadow-lg"
                : "bg-white text-orange-600 border border-orange-600 hover:bg-orange-50"
            }`}
          >
            All
          </button>
          
          <button
            onClick={() => handleTypeClick("veg")}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              filterType === "veg"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white text-green-600 border border-green-600 hover:bg-green-50"
            }`}
          >
            🥗 Veg
          </button>
          
          <button
            onClick={() => handleTypeClick("non-veg")}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              filterType === "non-veg"
                ? "bg-red-600 text-white shadow-lg"
                : "bg-white text-red-600 border border-red-600 hover:bg-red-50"
            }`}
          >
            🍗 Non-Veg
          </button>
        </div>

        {/* Loader & Error */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex flex-col relative"
              >
                {/* Product Image */}
                <img
                  src={item.image?.url}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />

                {/* Type Badge */}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold text-white ${
                  item.type === "veg" ? "bg-green-600" : "bg-red-600"
                }`}>
                  {item.type === "veg" ? "🥗 Veg" : "🍗 Non-Veg"}
                </div>

                {/* Availability Badge - Moved to top right */}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold text-white ${
                  item.available ? "bg-green-600" : "bg-red-600"
                }`}>
                  {item.available ? "Available" : "Unavailable"}
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Category: {item.category}
                  </p>

                  {/* Description */}
                  <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                    {item.description}
                  </p>

                  {/* Price */}
                  <p className="mt-2 text-green-600 font-bold text-lg">
                    ₹{item.price}
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-auto flex gap-2 pt-3">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="flex-1 border border-gray-300 text-gray-800 py-2 rounded-lg 
                                 hover:bg-gray-100 transition shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.name)}
                      className="flex-1 border border-gray-300 text-red-600 py-2 rounded-lg 
                                 hover:bg-red-50 transition shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-[500px] max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Edit Item
              </h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                {/* Name + Category */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value,
                      })
                    }
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Category"
                  />
                </div>

                {/* Type + Price */}
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={editingItem.type}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, type: e.target.value })
                    }
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="veg">Veg</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>

                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        price: e.target.value,
                      })
                    }
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Price"
                  />
                </div>

                {/* Description */}
                <textarea
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Description"
                  rows="3"
                />

                {/* Available */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingItem.available}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        available: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-green-600"
                  />
                  <span className="text-sm text-gray-700">Available</span>
                </label>

                {/* Image */}
                <div>
                  <p className="text-sm text-gray-700 mb-1">Product Image</p>
                  <img
                    src={
                      editingItem.image instanceof File
                        ? URL.createObjectURL(editingItem.image)
                        : editingItem.image?.url
                    }
                    alt="preview"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        image: e.target.files[0],
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListItems;
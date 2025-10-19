import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ListItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, itemId: null, itemName: "" }); // ✅ Added delete confirmation state

  // Filters
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("category");

  const API_URL = "https://api.flamendough.com/api/menu";
  const token = localStorage.getItem("token");

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
      // console.log("API response:", data);

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

  // ✅ Delete Confirmation Functions
  const confirmDelete = (id, name) => {
    setDeleteConfirm({ show: true, itemId: id, itemName: name });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, itemId: null, itemName: "" });
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setItems(items.filter((item) => item._id !== id));
      setDeleteConfirm({ show: false, itemId: null, itemName: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ Update function fixed
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      let body;
      let headers = { Authorization: token ? `Bearer ${token}` : "" };

      // ✅ If image is a File — send FormData
      if (editingItem.image instanceof File) {
        body = new FormData();
        body.append("name", editingItem.name);
        body.append("category", editingItem.category);
        body.append("type", editingItem.type);
        body.append("price", editingItem.price);
        body.append("description", editingItem.description);
        body.append("available", editingItem.available);
        body.append("file", editingItem.image); // ✅ changed from "image" → "file"
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
      if (!res.ok) throw new Error(data.message || "Failed to update");

      // ✅ Fix: the backend returns { message, item: updatedItem }
      const updatedItem = data.item || data;

      // ✅ Update local list
      setItems((prev) =>
        prev.map((i) => (i._id === updatedItem._id ? updatedItem : i))
      );

      // ✅ Close modal and reset
      setEditingItem(null);
      alert("✅ Item updated successfully!");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  // ✅ Categories for filter
  const categories = ["category", ...new Set(items.map((i) => i.category))];

  // ✅ Apply filters
  const filteredItems = items.filter((item) => {
    const typeMatch = filterType === "all" || item.type === filterType;
    const categoryMatch =
      filterCategory === "category" || item.category === filterCategory;
    return typeMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* ✅ Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.show && (
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
                      Delete "{deleteConfirm.itemName}"?
                    </p>
                    <p className="text-red-700 mt-2">
                      This action cannot be undone. The menu item will be permanently removed.
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
                      onClick={() => handleDelete(deleteConfirm.itemId)}
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
            Showing <b>{filteredItems.length}</b> delicious items
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {/* Veg / Non-Veg */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-orange-500 text-gray-700 px-2 py-2 rounded-lg shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
          >
            <option value="all">Type</option>
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
          </select>

          {/* Category */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-orange-500 text-gray-700 px-2 py-2 rounded-lg shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
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
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex flex-col"
              >
                {/* Product Image */}
                <img
                  src={item.image?.url}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Category: {item.category}
                  </p>
                  <p className="text-sm text-gray-500">Type: {item.type}</p>

                  {/* Description */}
                  <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                    {item.description}
                  </p>

                  {/* Price */}
                  <p className="mt-2 text-green-600 font-bold text-lg">
                    ₹{item.price}
                  </p>

                  {/* Availability */}
                  <label className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={item.available}
                      readOnly
                      className="w-4 h-4 accent-green-600"
                    />
                    <span className="text-sm text-gray-600">Available</span>
                  </label>

                  {/* Action Buttons */}
                  <div className="mt-auto flex gap-2 pt-3">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="flex-1 border border-gray-300 text-gray-800 py-2 rounded-lg 
                                 hover:bg-gray-100 transition shadow-sm"
                    >
                      Edit
                    </button>
                    {/* ✅ Updated Delete Button - No more window.confirm */}
                    <button
                      onClick={() => confirmDelete(item._id, item.name)}
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
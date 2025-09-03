import React, { useEffect, useState } from "react";

const Listitems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Filters
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("category");

  const API_URL = "https://restaurant-app-backend-mihf.onrender.com/api/menu";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/${editingItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setItems(items.map((i) => (i._id === updated._id ? updated : i)));
      setEditingItem(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Extract unique categories for filter
  const categories = ["category", ...new Set(items.map((i) => i.category))];

  // Apply filters
  const filteredItems = items.filter((item) => {
    const typeMatch = filterType === "all" || item.type === filterType;
    const categoryMatch = filterCategory === "category" || item.category === filterCategory;
    return typeMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">🍕 Our Menu</h2>
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
            className="border border-orange-500 text-gray-700 px-2  py-2 rounded-lg shadow-sm 
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
            className="border border-orange-500 text-gray-700 px-2  py-2 rounded-lg shadow-sm 
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
                  {/* Name + Category */}
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">Category: {item.category}</p>
                  <p className="text-sm text-gray-500">Type: {item.type}</p>

                  {/* Description */}
                  <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                    {item.description}
                  </p>

                  {/* Price */}
                  <p className="mt-2 text-green-600 font-bold text-lg">₹{item.price}</p>

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
                    <button
                      onClick={() => handleDelete(item._id)}
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
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Edit Item</h3>
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
                      setEditingItem({ ...editingItem, category: e.target.value })
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
                      setEditingItem({ ...editingItem, price: e.target.value })
                    }
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Price"
                  />
                </div>

                {/* Description */}
                <textarea
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Description"
                  rows="3"
                />

                {/* Available (Checkbox) */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingItem.available}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, available: e.target.checked })
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

export default Listitems;

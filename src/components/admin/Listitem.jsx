import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Listitem = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const API_URL = "https://restaurant-app-backend-mihf.onrender.com/api/menu";

  // Fetch data
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

  // ✅ Delete item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  // ✅ Update item
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
      console.log(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Product List</h2>
            <p className="text-sm text-gray-500">
              Showing {items.length} products
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>SL.NO</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-6">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center text-red-500 py-6">
                    {error}
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">${item.price}</TableCell>
                    <TableCell className="flex gap-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-[400px]">
              <h3 className="text-lg font-semibold mb-4">Edit Item</h3>
              <form onSubmit={handleUpdate} className="space-y-3">
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={editingItem.category}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, category: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  placeholder="Category"
                />
                <input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, price: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  placeholder="Price"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-3 py-1 bg-gray-400 text-white rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-green-600 text-white rounded"
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

export default Listitem;

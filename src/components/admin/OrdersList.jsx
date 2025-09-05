import React, { useEffect, useState } from "react";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(null);

  const API_URL = "https://restaurant-app-backend-mihf.onrender.com/api/order";

  const recalcTotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const fetchOrders = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      // 👇 Latest order sabse top
      setOrders(data.reverse());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await fetch(
        "https://restaurant-app-backend-mihf.onrender.com/api/menu"
      );
      if (!res.ok) throw new Error("Failed to fetch menu items");
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateOrder = async (orderId, updatedData) => {
    try {
      const res = await fetch(`${API_URL}/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update order");
      fetchOrders();
      setEditingOrder(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const res = await fetch(`${API_URL}/${orderId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete order");
      fetchOrders();
      setShowConfirmDelete(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Orders Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">
            Showing {orders.length} Order{orders.length !== 1 && "s"}
          </p>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase tracking-wide text-xs">
                <tr>
                  <th className="px-6 py-4">SL.NO</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Table ID</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-6 text-gray-400 italic"
                    >
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {order.customerPhone}
                      </td>
                      <td className="px-6 py-4">{order.tableId || "N/A"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      {/* Items Button */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedItems(order)}
                          className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition font-medium"
                        >
                          View Items 
                          {/*  */}
                        </button>
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingOrder(order)}
                          className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition font-medium"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setShowConfirmDelete(order)}
                          className="px-3 py-1 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition font-medium"
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Items Modal */}
      {selectedItems && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              Items for {selectedItems.customerName}
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              {selectedItems.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} × {item.quantity} = ₹
                  {item.price * item.quantity}
                </li>
              ))}
            </ul>
            <p className="font-semibold text-gray-900">
              Total: ₹{selectedItems.totalAmount}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Created: {new Date(selectedItems.createdAt).toLocaleString()}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedItems(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal (unchanged) */}
      {/* Delete Confirmation (unchanged) */}
    </div>
  );
};

export default OrdersList;

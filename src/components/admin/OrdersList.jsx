import React, { useEffect, useState } from "react";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null); // for modal
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  const API_URL = "https://restaurant-app-backend-mihf.onrender.com/api/order";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 const updateOrder = async (orderId, updatedData) => {
  try {
    const res = await fetch(`${API_URL}/${orderId}`, {
      method: "PATCH",   // 👈 change from PUT to PATCH
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

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Order Dashboard
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Showing {orders.length} Order{orders.length !== 1 && "s"}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table (Desktop) */}
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
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-6 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="9" className="text-center py-6 text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
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
                      <td className="px-6 py-4">
                        <ul className="space-y-1">
                          {order.items.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-center text-gray-700"
                            >
                              <span className="mr-2 text-gray-500">•</span>
                              {item.menuItem?.name || "Unknown"} ×{" "}
                              {item.quantity} = ₹{item.price}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        ₹{order.totalAmount}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingOrder(order)}
                          className="px-3 py-1 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setShowConfirmDelete(order)}
                          className="px-3 py-1 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition font-medium"
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

          {/* Card Layout (Mobile) */}
          <div className="md:hidden space-y-4 p-4">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : orders.length === 0 ? (
              <p className="text-center text-gray-400 italic">No orders yet</p>
            ) : (
              orders.map((order, index) => (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow border border-gray-200 p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">
                      #{index + 1} — Table {order.tableId}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>Customer:</strong> {order.customerName} <br />
                    <strong>Phone:</strong> {order.customerPhone}
                  </p>
                  <div className="text-sm text-gray-700 mt-2 mb-2">
                    <strong>Items:</strong>
                    <ul className="list-disc list-inside text-gray-600 mt-1">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.menuItem?.name || "Unknown"} × {item.quantity} =
                          ₹{item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    Total: ₹{order.totalAmount}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Created: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingOrder(order)}
                      className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(order)}
                      className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition text-sm"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Order</h3>

            <label className="block text-sm font-medium mb-1">
              Customer Name
            </label>
            <input
              type="text"
              defaultValue={editingOrder.customerName}
              onChange={(e) =>
                setEditingOrder({ ...editingOrder, customerName: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />

            <label className="block text-sm font-medium mb-1">
              Customer Phone
            </label>
            <input
              type="text"
              defaultValue={editingOrder.customerPhone}
              onChange={(e) =>
                setEditingOrder({
                  ...editingOrder,
                  customerPhone: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />

            <label className="block text-sm font-medium mb-1">Table ID</label>
            <input
              type="text"
              defaultValue={editingOrder.tableId}
              onChange={(e) =>
                setEditingOrder({ ...editingOrder, tableId: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />

            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              defaultValue={editingOrder.status}
              onChange={(e) =>
                setEditingOrder({ ...editingOrder, status: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 mb-4"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <label className="block text-sm font-medium mb-1">
              Total Amount
            </label>
            <input
              type="number"
              defaultValue={editingOrder.totalAmount}
              onChange={(e) =>
                setEditingOrder({
                  ...editingOrder,
                  totalAmount: Number(e.target.value),
                })
              }
              className="w-full border rounded-lg px-3 py-2 mb-4"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditingOrder(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  updateOrder(editingOrder._id, {
                    customerName: editingOrder.customerName,
                    customerPhone: editingOrder.customerPhone,
                    tableId: editingOrder.tableId,
                    status: editingOrder.status,
                    totalAmount: editingOrder.totalAmount,
                  })
                }
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6 text-center">
            <h3 className="text-lg font-semibold mb-3">Delete Order?</h3>
            <p className="text-gray-500 mb-5">
              Are you sure you want to delete this order? This action cannot be
              undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowConfirmDelete(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteOrder(showConfirmDelete._id)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;

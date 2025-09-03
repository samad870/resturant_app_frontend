import React, { useEffect, useState } from "react";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  const API_URL = "https://restaurant-app-backend-mihf.onrender.com/api/order";

  const recalcTotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

        {/* Orders Table / Cards */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
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
                              {item.name} × {item.quantity} = ₹
                              {item.price * item.quantity}
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
                          className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition font-medium"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setShowConfirmDelete(order)}
                          className="px-3 py-1 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition font-medium"
                        >
                          🗑 Bin
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
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
                          {item.name} × {item.quantity} = ₹
                          {item.price * item.quantity}
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
                      className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(order)}
                      className="px-3 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition text-sm"
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

            {/* Table ID */}
            <label className="block text-sm font-medium mb-1">Table ID</label>
            <input
              type="text"
              value={editingOrder.tableId}
              onChange={(e) =>
                setEditingOrder({ ...editingOrder, tableId: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />

            {/* Items Section */}
            <label className="block text-sm font-medium mb-1">Items</label>
            <div className="space-y-3 mb-4">
              {editingOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                >
                  <span className="text-gray-800">
                    {item.name} (₹{item.price})
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...editingOrder.items];
                      newItems[idx].quantity = Number(e.target.value);
                      setEditingOrder({
                        ...editingOrder,
                        items: newItems,
                        totalAmount: recalcTotal(newItems),
                      });
                    }}
                    className="w-16 border rounded-lg px-2 py-1 mx-2"
                  />
                  <button
                    onClick={() => {
                      const newItems = editingOrder.items.filter(
                        (_, i) => i !== idx
                      );
                      setEditingOrder({
                        ...editingOrder,
                        items: newItems,
                        totalAmount: recalcTotal(newItems),
                      });
                    }}
                    className="px-2 py-1 rounded bg-red-100 text-red-600"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Item */}
            <select
              onChange={(e) => {
                const selected = menuItems.find(
                  (m) => m._id === e.target.value
                );
                if (selected) {
                  const newItems = [
                    ...editingOrder.items,
                    {
                      name: selected.name,
                      price: selected.price,
                      quantity: 1,
                    },
                  ];
                  setEditingOrder({
                    ...editingOrder,
                    items: newItems,
                    totalAmount: recalcTotal(newItems),
                  });
                }
                e.target.value = "";
              }}
              defaultValue=""
              className="w-full border rounded-lg px-3 py-2 mb-3"
            >
              <option value="">+ Add Item</option>
              {menuItems.map((menu) => (
                <option key={menu._id} value={menu._id}>
                  {menu.name} (₹{menu.price})
                </option>
              ))}
            </select>

            {/* Total Amount (auto) */}
            <p className="font-semibold text-gray-900 mb-4">
              Total: ₹{editingOrder.totalAmount}
            </p>

            {/* Actions */}
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
                    tableId: editingOrder.tableId,
                    items: editingOrder.items,
                    totalAmount: editingOrder.totalAmount,
                    status: editingOrder.status,
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

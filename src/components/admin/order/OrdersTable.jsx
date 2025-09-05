import React from "react";
import OrderRow from "./OrderRow";

const OrdersTable = ({
  orders,
  loading,
  error,
  setEditingOrder,
  setShowConfirmDelete,
  setSelectedItems,
  updateOrder,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* ✅ Desktop / Tablet View (Table) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase tracking-wide text-xs">
            <tr>
              <th className="px-6 py-4">SL.NO</th>
              <th className="px-6 py-4">Order No</th>
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
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-red-500">
                  {error}
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-400 italic"
                >
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <OrderRow
                  key={order._id}
                  order={order}
                  index={index}
                  orderNum={300 + orders.length - index - 1} // 👈 starts at 300, increments
                  setEditingOrder={setEditingOrder}
                  setShowConfirmDelete={setShowConfirmDelete}
                  setSelectedItems={setSelectedItems}
                  updateOrder={updateOrder}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile View (Cards) */}
      <div className="block md:hidden">
        {loading ? (
          <p className="text-center py-6 text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center py-6 text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-center py-6 text-gray-400 italic">No orders yet</p>
        ) : (
          <div className="space-y-4 p-4">
            {orders.map((order, index) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-4 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">
                    Order #{300 + orders.length - index - 1}
                  </h3>
                  <span className="text-sm text-gray-500">
                    SL: {index + 1}
                  </span>
                </div>

                <p className="text-gray-700">
                  <span className="font-medium">Customer:</span>{" "}
                  {order.customerName}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Phone:</span>{" "}
                  {order.customerPhone}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Table:</span>{" "}
                  {order.tableId || "N/A"}
                </p>

                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  {/* ✅ Reuse StatusDropdown */}
                  <div className="flex-1">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrder(order._id, {
                          tableId: order.tableId,
                          items: order.items,
                          totalAmount: order.totalAmount,
                          status: e.target.value,
                        })
                      }
                      className="px-3 py-1 rounded-full text-xs font-medium border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="completed">🏁 Completed</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => setSelectedItems(order)}
                    className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition font-medium"
                  >
                    View Items
                  </button>
                  <button
                    onClick={() => setEditingOrder(order)}
                    className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition font-medium"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(order)}
                    className="px-3 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition font-medium"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTable;

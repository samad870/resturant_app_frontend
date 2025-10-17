import React, { useCallback, useEffect, useState } from "react";
import OrdersTable from "./OrdersTable";
import EditOrderModal from "./EditOrderModal";
import DeleteModal from "./DeleteModal";
import ItemsModal from "./ItemsModal";

const CompletedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [selectedItems, setSelectedItems] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  // ✅ Token from localStorage (only use token, no setter needed)
  const [token] = useState(() => localStorage.getItem("token") || "");

  const API_URL = "http://31.97.231.105:4000/api/order";

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Include token
        },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      console.log(data)
      setOrders(data.reverse());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(
        "https://restaurant-app-backend-mihf.onrender.com/api/menu",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch menu items");
      const data = await res.json();
      console.log("✅ Menu API response:", data); // Debug
      setMenuItems(Array.isArray(data) ? data : data.menu || data.data || []);
    } catch (err) {
      console.error(err.message);
      setMenuItems([]); // Fallback to empty array
    }
  }, [token]);

  // Update order
  const updateOrder = async (orderId, updatedData) => {
    try {
      const res = await fetch(`${API_URL}/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Include token
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update order");
      fetchOrders();
      setEditingOrder(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    try {
      const res = await fetch(`${API_URL}/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Include token
        },
      });
      if (!res.ok) throw new Error("Failed to delete order");
      fetchOrders();
      setShowConfirmDelete(null);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (!token) {
      alert("⚠️ No token found. Please login first.");
      setLoading(false);
      return;
    }
    fetchOrders();
    fetchMenuItems();
  }, [token]);

  const completedOrders = orders.filter((o) => o.status === "completed");

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex justify-center">
          🏁 Completed Orders
        </h2>

        <OrdersTable
          orders={completedOrders}
          loading={loading}
          error={error}
          setEditingOrder={setEditingOrder}
          setShowConfirmDelete={setShowConfirmDelete}
          setSelectedItems={setSelectedItems}
          updateOrder={updateOrder}
        />
      </div>

      {selectedItems && (
        <ItemsModal
          order={selectedItems}
          onClose={() => setSelectedItems(null)}
        />
      )}

      {editingOrder && (
        <EditOrderModal
          editingOrder={editingOrder}
          setEditingOrder={setEditingOrder}
          updateOrder={updateOrder}
          menuItems={menuItems}
        />
      )}

      {showConfirmDelete && (
        <DeleteModal
          order={showConfirmDelete}
          onCancel={() => setShowConfirmDelete(null)}
          onDelete={() => deleteOrder(showConfirmDelete._id)}
        />
      )}
    </div>
  );
};

export default CompletedOrders;

// import React, { useEffect, useState } from "react";
// import OrdersTable from "./OrdersTable";
// import EditOrderModal from "./EditOrderModal";
// import DeleteModal from "./DeleteModal";
// import ItemsModal from "./ItemsModal";

// const CancelledOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingOrder, setEditingOrder] = useState(null);
//   const [showConfirmDelete, setShowConfirmDelete] = useState(null);
//   const [selectedItems, setSelectedItems] = useState(null);
//   const [menuItems, setMenuItems] = useState([]);

//   const API_URL = "https://restaurant-app-backend-mihf.onrender.com/api/order";

//   const fetchOrders = async () => {
//     try {
//       const res = await fetch(API_URL);
//       if (!res.ok) throw new Error("Failed to fetch orders");
//       const data = await res.json();
//       setOrders(data.reverse());
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchMenuItems = async () => {
//     try {
//       const res = await fetch("https://restaurant-app-backend-mihf.onrender.com/api/menu");
//       if (!res.ok) throw new Error("Failed to fetch menu items");
//       const data = await res.json();
//       setMenuItems(data);
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   const updateOrder = async (orderId, updatedData) => {
//     try {
//       const res = await fetch(`${API_URL}/${orderId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedData),
//       });
//       if (!res.ok) throw new Error("Failed to update order");
//       fetchOrders();
//       setEditingOrder(null);
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const deleteOrder = async (orderId) => {
//     try {
//       const res = await fetch(`${API_URL}/${orderId}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Failed to delete order");
//       fetchOrders();
//       setShowConfirmDelete(null);
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//     fetchMenuItems();
//   }, []);

//   const cancelledOrders = orders.filter((o) => o.status === "cancelled");

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-3xl font-bold text-gray-900 mb-6 flex justify-center">❌ Cancelled Orders</h2>
//         <OrdersTable
//           orders={cancelledOrders}
//           loading={loading}
//           error={error}
//           setEditingOrder={setEditingOrder}
//           setShowConfirmDelete={setShowConfirmDelete}
//           setSelectedItems={setSelectedItems}
//           updateOrder={updateOrder}
//         />
//       </div>

//       {selectedItems && (
//         <ItemsModal order={selectedItems} onClose={() => setSelectedItems(null)} />
//       )}
//       {editingOrder && (
//         <EditOrderModal
//           editingOrder={editingOrder}
//           setEditingOrder={setEditingOrder}
//           updateOrder={updateOrder}
//           menuItems={menuItems}
//         />
//       )}
//       {showConfirmDelete && (
//         <DeleteModal
//           order={showConfirmDelete}
//           onCancel={() => setShowConfirmDelete(null)}
//           onDelete={() => deleteOrder(showConfirmDelete._id)}
//         />
//       )}
//     </div>
//   );
// };

// export default CancelledOrders;



import React, { useCallback, useEffect, useState } from "react";
import OrdersTable from "./OrdersTable";
import EditOrderModal from "./EditOrderModal";
import DeleteModal from "./DeleteModal";
import ItemsModal from "./ItemsModal";

const CancelledOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [selectedItems, setSelectedItems] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  // ✅ Token from localStorage
  const [token] = useState(() => localStorage.getItem("token") || "");

  const API_URL = "https://restaurant-app-backend-mihf.onrender.com/api/order";

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token
        },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
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
    const res = await fetch("https://restaurant-app-backend-mihf.onrender.com/api/menu", {
      headers: { Authorization: `Bearer ${token}` },
    });
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
          Authorization: `Bearer ${token}`, // ✅ Send token
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
          Authorization: `Bearer ${token}`, // ✅ Send token
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

  const cancelledOrders = orders.filter((o) => o.status === "cancelled");

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex justify-center">
          ❌ Cancelled Orders
        </h2>

        <OrdersTable
          orders={cancelledOrders}
          loading={loading}
          error={error}
          setEditingOrder={setEditingOrder}
          setShowConfirmDelete={setShowConfirmDelete}
          setSelectedItems={setSelectedItems}
          updateOrder={updateOrder}
        />
      </div>

      {selectedItems && (
        <ItemsModal order={selectedItems} onClose={() => setSelectedItems(null)} />
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

export default CancelledOrders;

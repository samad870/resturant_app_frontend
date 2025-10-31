import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OrdersTable from "./OrdersTable";
import EditOrderModal from "./EditOrderModal";
import DeleteModal from "./DeleteModal";
import ItemsModal from "./ItemsModal";
import { SlRefresh } from "react-icons/sl";
import { 
  useGetOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetRestaurantProfileQuery 
} from "@/redux/adminRedux/adminAPI";
import { useGetMenuQuery } from "@/redux/clientRedux/clientAPI";

const Orders = () => {
  const [editingOrder, setEditingOrder] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [orderForBillModal, setOrderForBillModal] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Auto-refresh state
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(
    localStorage.getItem("autoRefresh") || "OFF"
  );
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(null);

  // RTK Queries and Mutations
  const { 
    data: ordersData, 
    isLoading: ordersLoading, 
    error: ordersError,
    refetch: refetchOrders 
  } = useGetOrdersQuery();

  const { 
    data: restaurantData, 
    isLoading: restaurantLoading,
    error: restaurantError 
  } = useGetRestaurantProfileQuery();

  const { 
    data: menuData, 
    isLoading: menuLoading,
    error: menuError 
  } = useGetMenuQuery();

  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  const closeNotification = () =>
    setNotification({ show: false, message: "", type: "" });

  // Handle update order with RTK
  const handleUpdateOrder = async (orderId, updatedData) => {
    try {
      await updateOrder({ orderId, updatedData }).unwrap();
      setEditingOrder(null);
      showNotification("Order updated successfully!", "success");
    } catch (err) {
      showNotification(err?.data?.message || "Failed to update order", "error");
    }
  };

  // Handle delete order with RTK
  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId).unwrap();
      setShowConfirmDelete(null);
      showNotification("Order deleted successfully!", "success");
    } catch (err) {
      showNotification(err?.data?.message || "Failed to delete order", "error");
    }
  };

  // Auto-refresh functions
  const handleManualRefresh = async () => {
    try {
      await refetchOrders();
      setLastUpdated(new Date());
      showNotification("Orders refreshed!", "success");
    } catch (err) {
      showNotification("Failed to refresh orders", "error");
    }
  };

  const startAutoRefresh = (minutes) => {
    if (autoRefreshInterval) clearInterval(autoRefreshInterval);
    const id = setInterval(() => {
      console.log("🔁 Auto-refresh triggered");
      refetchOrders();
      setLastUpdated(new Date());
    }, minutes * 60 * 1000);
    setAutoRefreshInterval(id);
    localStorage.setItem("autoRefresh", `${minutes} min`);
  };

  const stopAutoRefresh = () => {
    if (autoRefreshInterval) clearInterval(autoRefreshInterval);
    setAutoRefresh("OFF");
    setAutoRefreshInterval(null);
    localStorage.setItem("autoRefresh", "OFF");
  };

  // Sync orderForBillModal with latest orders data
  useEffect(() => {
    if (orderForBillModal) {
      const updatedOrder = ordersData?.find(
        (o) => o._id === orderForBillModal._id
      );
      if (updatedOrder) {
        setOrderForBillModal(updatedOrder);
      } else {
        setOrderForBillModal(null);
      }
    }
  }, [ordersData, orderForBillModal]);

  // Set last updated when orders load
  useEffect(() => {
    if (ordersData && !ordersLoading) {
      setLastUpdated(new Date());
    }
  }, [ordersData, ordersLoading]);

  // Auto-refresh persistence
  useEffect(() => {
    const saved = localStorage.getItem("autoRefresh");
    if (saved && saved !== "OFF") {
      const mins = parseInt(saved);
      if (!isNaN(mins)) {
        setAutoRefresh(saved);
        startAutoRefresh(mins);
      }
    }
    return () => {
      if (autoRefreshInterval) clearInterval(autoRefreshInterval);
    };
  }, []);

  // Process data from RTK queries
  const orders = ordersData || [];
  const menuItems = Array.isArray(menuData) ? menuData : menuData?.menu || menuData?.data || [];
  const restaurantDetails = restaurantData?.restaurant || null;

  const loading = ordersLoading || restaurantLoading || menuLoading;
  const error = ordersError || restaurantError || menuError;

  // Filter pending orders
  const pendingOrders = orders.filter((o) => o.status === "pending");

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8 relative">
      {/* Notification Modal */}
      <AnimatePresence>
        {notification.show && (
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
              transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.3 }}
              className={`relative rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-auto ${
                notification.type === "success"
                  ? "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
                  : "bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div
                  className={`w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                    notification.type === "success"
                      ? "bg-green-100 text-green-600 border-2 border-green-200"
                      : "bg-red-100 text-red-600 border-2 border-red-200"
                  }`}
                >
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
                <h3 className={`text-3xl font-bold mb-4 ${notification.type === "success" ? "text-green-900" : "text-red-900"}`}>
                  {notification.type === "success" ? "Success!" : "Oops!"}
                </h3>
                <p className={`text-xl mb-8 leading-relaxed ${notification.type === "success" ? "text-green-700" : "text-red-700"}`}>
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
        )}
      </AnimatePresence>
      
      {/* Header with Refresh Controls */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-row items-center justify-between mb-6 gap-3">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 whitespace-nowrap">⏳ Pending</h2>

          <div className="flex items-center gap-2">
            {/* Refresh Button */}
            <button
              onClick={handleManualRefresh}
              disabled={ordersLoading}
              className="p-2 sm:px-3 sm:py-2 bg-orange-500 text-white font-normal rounded-xl hover:bg-orange-600 transition flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SlRefresh className={`text-sm sm:text-base ${ordersLoading ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline text-xs sm:text-sm">
                {ordersLoading ? 'Refreshing...' : 'Refresh'}
              </span>
            </button>

            {/* Auto Refresh Dropdown */}
            <div className="flex items-center gap-1 sm:gap-2">
              <label htmlFor="autoRefresh" className="hidden sm:inline text-sm text-gray-600 font-medium whitespace-nowrap">
                Auto Refresh:
              </label>
              <select
                id="autoRefresh"
                value={autoRefresh}
                onChange={(e) => {
                  const value = e.target.value;
                  setAutoRefresh(value);
                  if (value === "OFF") stopAutoRefresh();
                  else {
                    const mins = parseInt(value);
                    if (!isNaN(mins)) startAutoRefresh(mins);
                  }
                }}
                className="px-2 py-1 sm:px-3 sm:py-2 border rounded-lg text-xs sm:text-sm font-medium bg-white hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-20 sm:min-w-32"
              >
                <option value="OFF">Off</option>
                <option value="1 min">1 min</option>
                <option value="2 min">2 min</option>
                <option value="5 min">5 min</option>
              </select>
            </div>
          </div>
        </div>

        {/* Last updated text */}
        {lastUpdated && (
          <p className="text-right text-xs text-gray-500 mb-2">
            Last updated: {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}

        <OrdersTable
          orders={pendingOrders}
          loading={loading}
          error={error?.data?.message || error?.message}
          setEditingOrder={setEditingOrder}
          setShowConfirmDelete={setShowConfirmDelete}
          setOrderForBillModal={setOrderForBillModal}
          updateOrder={handleUpdateOrder}
          tableType="pending"
        />
      </div>

      {/* Modals */}
      {orderForBillModal && ( 
        <ItemsModal
          order={orderForBillModal}
          restaurantDetails={restaurantDetails}
          onClose={() => setOrderForBillModal(null)}
        />
      )}
      {editingOrder && (
        <EditOrderModal
          editingOrder={editingOrder}
          setEditingOrder={setEditingOrder}
          updateOrder={handleUpdateOrder}
          menuItems={menuItems}
          isUpdating={isUpdating}
        />
      )}
      {showConfirmDelete && (
        <DeleteModal
          order={showConfirmDelete}
          onCancel={() => setShowConfirmDelete(null)}
          onDelete={() => handleDeleteOrder(showConfirmDelete._id)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default Orders;
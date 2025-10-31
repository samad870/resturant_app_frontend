import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OrdersTable from "./OrdersTable";
import EditOrderModal from "./EditOrderModal";
import DeleteModal from "./DeleteModal";
import ItemsModal from "./ItemsModal";
import { 
  useGetOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetRestaurantProfileQuery 
} from "@/redux/adminRedux/adminAPI";
import { useGetMenuQuery } from "@/redux/clientRedux/clientAPI";

const CompletedOrders = () => {
  const [editingOrder, setEditingOrder] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [selectedItems, setSelectedItems] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // RTK Queries and Mutations from admin API
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
      2000
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

  // Process data from RTK queries
  const orders = ordersData || [];
  const menuItems = Array.isArray(menuData) ? menuData : menuData?.menu || menuData?.data || [];
  const restaurantDetails = restaurantData?.restaurant || null;

  const loading = ordersLoading || restaurantLoading || menuLoading;
  const error = ordersError || restaurantError || menuError;

  // Filter completed orders
  const completedOrders = orders.filter((o) => o.status === "completed");

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
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.3,
              }}
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
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <h3
                  className={`text-3xl font-bold mb-4 ${
                    notification.type === "success"
                      ? "text-green-900"
                      : "text-red-900"
                  }`}
                >
                  {notification.type === "success" ? "Success!" : "Oops!"}
                </h3>
                <p
                  className={`text-xl mb-8 leading-relaxed ${
                    notification.type === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
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

      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex justify-center">
          🏁 Completed Orders
        </h2>

        <OrdersTable
          orders={completedOrders}
          loading={loading}
          error={error?.data?.message || error?.message}
          setEditingOrder={setEditingOrder}
          setShowConfirmDelete={setShowConfirmDelete}
          setOrderForBillModal={setSelectedItems}
          updateOrder={handleUpdateOrder}
          tableType="complete"
        />
      </div>

      {/* Modals */}
      {selectedItems && (
        <ItemsModal
          order={selectedItems}
          restaurantDetails={restaurantDetails}
          onClose={() => setSelectedItems(null)}
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

export default CompletedOrders;
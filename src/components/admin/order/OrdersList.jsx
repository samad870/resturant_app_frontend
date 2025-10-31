import React, { useState, useEffect } from "react";
import OrdersTable from "./OrdersTable";
import EditOrderModal from "./EditOrderModal";
import DeleteModal from "./DeleteModal";
import ItemsModal from "./ItemsModal";
import { SlRefresh } from "react-icons/sl";
import { 
  useGetOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation 
} from "@/redux/adminRedux/adminAPI";
import { useGetMenuQuery } from "@/redux/clientRedux/clientAPI";

const OrdersList = () => {
  const [editingOrder, setEditingOrder] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [selectedItems, setSelectedItems] = useState(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // RTK Queries and Mutations
  const { 
    data: ordersData, 
    isLoading: ordersLoading, 
    error: ordersError,
    refetch: refetchOrders 
  } = useGetOrdersQuery(undefined, {
    pollingInterval: autoRefreshEnabled ? 2000 : 0,
  });

  const { 
    data: menuData, 
    isLoading: menuLoading,
    error: menuError 
  } = useGetMenuQuery();

  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  // Handle manual refresh
  const handleManualRefresh = async () => {
    try {
      await refetchOrders();
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Failed to refresh orders:", err);
    }
  };

  // Handle update order with RTK
  const handleUpdateOrder = async (orderId, updatedData) => {
    try {
      await updateOrder({ orderId, updatedData }).unwrap();
      setEditingOrder(null);
    } catch (err) {
      alert(err?.data?.message || "Failed to update order");
    }
  };

  // Handle delete order with RTK
  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId).unwrap();
      setShowConfirmDelete(null);
    } catch (err) {
      alert(err?.data?.message || "Failed to delete order");
    }
  };

  // Process data from RTK queries
  const orders = ordersData ? [...ordersData].reverse() : [];
  const menuItems = Array.isArray(menuData) ? menuData : menuData?.menu || menuData?.data || [];

  const loading = ordersLoading || menuLoading;
  const error = ordersError || menuError;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold text-gray-900">Orders Dashboard</h2>
              <p className="text-gray-500 text-sm mt-1">
                Showing {orders.length} Order{orders.length !== 1 && "s"}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Auto Refresh Toggle */}
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRefreshEnabled}
                    onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                  />
                  Auto Refresh
                </label>
              </div>

              {/* Manual Refresh Button */}
              <button
                onClick={handleManualRefresh}
                disabled={ordersLoading}
                className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SlRefresh className={`w-4 h-4 ${ordersLoading ? 'animate-spin' : ''}`} />
                <span className="text-sm">
                  {ordersLoading ? 'Refreshing...' : 'Refresh'}
                </span>
              </button>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
            {autoRefreshEnabled && (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Auto-refresh enabled (2s)
              </span>
            )}
            {lastRefreshed && (
              <span>Last manual refresh: {lastRefreshed.toLocaleTimeString()}</span>
            )}
            {ordersLoading && (
              <span className="text-orange-500">🔄 Refreshing orders...</span>
            )}
          </div>
        </div>

        <OrdersTable
          orders={orders}
          loading={loading}
          error={error?.data?.message || error?.message}
          updateOrder={handleUpdateOrder}
          setEditingOrder={setEditingOrder}
          setShowConfirmDelete={setShowConfirmDelete}
          setSelectedItems={setSelectedItems}
        />
      </div>

      {/* Modals */}
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

export default OrdersList;
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import audio from "@/assets/orderRing.mp3";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

import { useGetOrdersQuery } from "@/redux/adminRedux/adminAPI";

const POLLING_INTERVAL = 15000; // 15 seconds

export default function NotificationBell() {
  // RTK Query hook
  const {
    data: ordersResponse,
    isLoading,
    isError,
  } = useGetOrdersQuery(undefined, {
    pollingInterval: POLLING_INTERVAL,
    skip: !localStorage.getItem("token"),
  });

  const [notificationCount, setNotificationCount] = useState(0);
  const [latestOrders, setLatestOrders] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const knownOrderIds = useRef(new Set());
  const notificationSound = useMemo(() => new Audio(audio), []);
  const isInitialMount = useRef(true);

  // Extract orders array safely
  const allOrders = useMemo(() => {
    if (!ordersResponse) return [];
    return Array.isArray(ordersResponse)
      ? ordersResponse
      : ordersResponse.orders || [];
  }, [ordersResponse]);

  // Initialize knownOrderIds on first load and detect new orders
  useEffect(() => {
    if (isLoading || isError || !allOrders.length) return;

    if (isInitialMount.current) {
      // First load - add all orders to known IDs without notifications
      allOrders.forEach((order) => knownOrderIds.current.add(order._id));
      isInitialMount.current = false;
      return;
    }

    // Subsequent loads - check for new pending orders
    const newPendingOrders = allOrders.filter(
      (order) =>
        order.status === "pending" && !knownOrderIds.current.has(order._id)
    );

    if (newPendingOrders.length > 0) {
      // console.log("New pending orders:", newPendingOrders);
      
      // Play notification sound
      notificationSound.play().catch((e) => console.error("Sound error:", e));

      // Update notification count and latest orders
      setNotificationCount((prev) => prev + newPendingOrders.length);
      setLatestOrders((prev) => [...newPendingOrders, ...prev].slice(0, 10));

      // Add new orders to known IDs
      newPendingOrders.forEach((order) => knownOrderIds.current.add(order._id));
    }
  }, [allOrders, isLoading, isError, notificationSound]);

  // Handlers
  const handleBellClick = () => {
    setIsDropdownOpen((prev) => {
      if (!prev) setNotificationCount(0); // Reset only on open
      return !prev;
    });
  };

  const handleLinkClick = () => setIsDropdownOpen(false);

  const clearList = () => {
    setLatestOrders([]);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      {/* Bell Icon + Badge */}
      <button
        onClick={handleBellClick}
        className="relative text-gray-600 focus:outline-none"
      >
        <Bell size={30} color="#ffc107" strokeWidth={2.25} />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white pointer-events-none">
            {notificationCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 rounded-lg bg-white shadow-xl border border-gray-200 z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-100">
              <h4 className="text-base font-semibold text-gray-800">
                New Orders
              </h4>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {latestOrders.length > 0 ? (
                latestOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border-b border-gray-100 p-3 hover:bg-gray-50 text-sm"
                  >
                    <p className="font-medium text-gray-700">
                      Order #{order._id.slice(-6).toUpperCase()}
                      <span className="text-xs text-gray-500 ml-1">
                        ({order.customerName || "Unknown"})
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      Total: ₹{order.totalAmount?.toFixed(2) ?? "N/A"}
                    </p>

                    <Link
                      to={`/admin/orders?orderId=${order._id}`}
                      onClick={handleLinkClick}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      View Order Bill
                    </Link>
                  </div>
                ))
              ) : (
                <p className="p-4 text-center text-sm text-gray-500">
                  No new orders.
                </p>
              )}
            </div>

            {latestOrders.length > 0 && (
              <div className="p-2 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={clearList}
                  className="w-full text-center text-xs text-gray-600 hover:text-black focus:outline-none"
                >
                  Clear List
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
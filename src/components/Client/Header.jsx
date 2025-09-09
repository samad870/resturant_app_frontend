import { useState, useEffect, useRef } from "react";
import { X, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  incrementQuantity,
  clearCart,
} from "../../features/cartSlice";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import OrderComplete from "@/components/Client/OrderComplete";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Copywright from "@/components/Client/Copywright";

export default function Header({ logo, siteName = "Default Name" }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // form inputs
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableId, setTableId] = useState("");

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const cartCount = Object.values(cartItems).reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const totalAmount = Object.values(cartItems).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Store multiple active orders
  const [activeOrders, setActiveOrders] = useState([]);
  const expiryTimersRef = useRef({});
  const ONE_HOUR_MS = 60 * 60 * 1000;

  const scheduleExpiry = (orderId, remainingMs) => {
    if (expiryTimersRef.current[orderId]) {
      clearTimeout(expiryTimersRef.current[orderId]);
    }
    expiryTimersRef.current[orderId] = setTimeout(() => {
      setActiveOrders((prev) => {
        const updated = prev.filter((o) => o.id !== orderId);
        sessionStorage.setItem("activeOrders", JSON.stringify(updated));
        return updated;
      });
      toast({
        title: "Order expired",
        description: `Order ${orderId} expired after 1 hour.`,
      });
    }, Math.max(0, remainingMs));
  };

  // Load orders from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("activeOrders");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const validOrders = [];
        parsed.forEach((order) => {
          const age = Date.now() - order.createdAt;
          if (age < ONE_HOUR_MS) {
            validOrders.push(order);
            scheduleExpiry(order.id, ONE_HOUR_MS - age);
          }
        });
        setActiveOrders(validOrders);
        sessionStorage.setItem("activeOrders", JSON.stringify(validOrders));
      } catch {
        sessionStorage.removeItem("activeOrders");
      }
    }
    return () => {
      Object.values(expiryTimersRef.current).forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle order API
  const handleOrderSubmit = async () => {
    try {
      setLoading(true);
      const restaurantId = "cafe";

      const orderItems = Object.values(cartItems).map((item) => ({
        menuItemId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const response = await fetch(
        `https://restaurant-app-backend-mihf.onrender.com/api/order/${restaurantId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName,
            customerPhone,
            tableId,
            items: orderItems,
            totalAmount,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to place order");

      const data = await response.json();
      const orderData = {
        id: data?.orderId || Date.now(),
        customerName,
        customerPhone,
        tableId,
        items: orderItems,
        totalAmount,
        createdAt: Date.now(),
      };

      // Add to sessionStorage + state
      setActiveOrders((prev) => {
        const updated = [...prev, orderData];
        sessionStorage.setItem("activeOrders", JSON.stringify(updated));
        return updated;
      });
      scheduleExpiry(orderData.id, ONE_HOUR_MS);

      toast({
        title: "Order Complete, thank you!",
        description: "Your order will be ready in about 10–15 minutes.",
      });

      setShowModal(false);
      setIsCartOpen(false);

      setTimeout(() => {
        dispatch(clearCart());
      }, 300);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("❌ Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />

      {/* Bottom Order Summary (cart only before placing order) */}
      {totalAmount > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white rounded-t-lg border-t shadow-2xl">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>View Your Order</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col justify-between gap-6 h-[calc(100%-4rem)]">
                  {cartCount === 0 ? (
                    <p className="text-gray-500">Your cart is empty.</p>
                  ) : (
                    <ul className="space-y-4 flex-1 overflow-y-auto">
                      {Object.entries(cartItems).map(([id, item]) => (
                        <li
                          key={id}
                          className="flex items-center justify-between border-b pb-2"
                        >
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <button
                                className="px-2 py-1 border rounded hover:bg-gray-100"
                                onClick={() => dispatch(removeFromCart(id))}
                              >
                                −
                              </button>

                              <span className="px-1">{item.quantity}</span>

                              <button
                                className="px-2 py-1 border rounded hover:bg-gray-100"
                                onClick={() => dispatch(incrementQuantity(id))}
                              >
                                +
                              </button>

                              <span className="ml-2">
                                × ₹{item.price.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <p className="font-semibold text-sm">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <OrderComplete
            amount={totalAmount.toFixed(2)}
            buttonText="Order Now"
            disabled={cartCount === 0}
            onClick={() => setShowModal(true)}
          />
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between p-3">
        <Link to="/" className="flex items-center space-x-2">
          {logo && <img src={logo} alt="Logo" className="h-12 w-auto" />}
          <span className="text-primary font-mostrate text-2xl">
            {siteName}
          </span>
        </Link>

        <button onClick={() => setIsCartOpen(true)} className="relative">
          <Utensils className="w-6 h-6 text-gray-700 hover:text-black" />
          {activeOrders.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {activeOrders.length}
            </span>
          )}
        </button>
      </header>

      {/* Sidebar overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}

      {/* Sidebar with multiple orders */}
      <div
        className={`fixed top-0 right-0 h-full w-[70%] bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Your Orders</h2>
          <button onClick={() => setIsCartOpen(false)}>
            <X className="w-6 h-6 text-gray-600 hover:text-black" />
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto">
          {activeOrders.length === 0 ? (
            <p className="text-gray-500">No active orders yet.</p>
          ) : (
            activeOrders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-3 shadow-sm bg-primary bg-opacity-10"
              >
                <div className="mb-2 text-sm">
                  <p className="font-medium">
                    {order.customerName} — Table {order.tableId}
                  </p>
                  <p className="text-gray-500">Phone: {order.customerPhone}</p>
                </div>

                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li
                      key={item.menuItemId}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.name} ({item.quantity} × ₹{item.price.toFixed(2)})
                      </span>
                      <span className="font-medium">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="border-t mt-2 pt-2 flex justify-between text-sm font-semibold">
                  <span>Total:</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <Copywright />
      </div>

      {/* Modal for Customer Details */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Enter Your Details</h2>

            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border rounded-lg p-2 mb-3"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full border rounded-lg p-2 mb-3"
            />

            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4"
            >
              <option value="">Select Table</option>
              <option value="T1">Table 1</option>
              <option value="T2">Table 2</option>
              <option value="T3">Table 3</option>
              <option value="T4">Table 4</option>
              <option value="T5">Table 5</option>
            </select>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="bg-primary text-white"
                onClick={handleOrderSubmit}
                disabled={
                  !customerName || !customerPhone || !tableId || loading
                }
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

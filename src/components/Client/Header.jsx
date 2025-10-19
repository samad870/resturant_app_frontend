import { useState, useEffect, useRef } from "react";
import { X, Utensils, ChevronDown } from "lucide-react";
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
import { useRestaurant } from "../../hooks/useRestaurant";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Header({ logo, siteName = "Default Name" }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { data: restaurantData } = useRestaurant();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableId, setTableId] = useState("");

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [orderType, setOrderType] = useState("");

  const cartCount = Object.values(cartItems).reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const totalAmount = Object.values(cartItems).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
  }, []);

  // Simple and small professional toast
  const showOrderSuccessToast = () => {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4';
    toastContainer.style.background = 'rgba(0, 0, 0, 0.4)';
    toastContainer.style.backdropFilter = 'blur(4px)';
    
    const toastContent = document.createElement('div');
    toastContent.className = 'bg-white rounded-xl shadow-lg p-5 max-w-xs w-full border border-gray-200';

    toastContent.innerHTML = `
      <div class="text-center">
        <div class="flex justify-center mb-3">
          <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </div>
        
        <h3 class="text-lg font-semibold text-gray-800 mb-1">Order Confirmed</h3>
        <p class="text-gray-600 text-sm mb-3">Thank you for your order</p>
        
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-2 mb-4">
          <div class="flex items-center justify-center gap-1 text-orange-700">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
            <span class="text-xs font-medium">Ready in 10-15 minutes</span>
          </div>
        </div>
        
        <button class="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
          OK
        </button>
      </div>
    `;

    toastContainer.appendChild(toastContent);
    document.body.appendChild(toastContainer);

    // Simple fade in animation
    toastContent.style.opacity = '0';
    toastContent.style.transform = 'scale(0.9)';
    toastContent.style.transition = 'all 0.2s ease-out';
    
    setTimeout(() => {
      toastContent.style.opacity = '1';
      toastContent.style.transform = 'scale(1)';
    }, 10);

    // Handle close
    const closeToast = () => {
      toastContent.style.opacity = '0';
      toastContent.style.transform = 'scale(0.9)';
      setTimeout(() => {
        if (document.body.contains(toastContainer)) {
          document.body.removeChild(toastContainer);
        }
      }, 200);
    };

    // Close on button click or backdrop click
    toastContent.querySelector('button').onclick = closeToast;
    toastContainer.onclick = (e) => {
      if (e.target === toastContainer) closeToast();
    };

    // Auto close after 4 seconds
    setTimeout(closeToast, 4000);
  };

  // Handle Order Submission
  const handleOrderSubmit = async () => {
    try {
      setLoading(true);

      const orderItems = Object.values(cartItems).map((item) => ({
        menuItemId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          tableId,
          items: orderItems,
          totalAmount,
          orderType,
        }),
      });

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

      setActiveOrders((prev) => {
        const updated = [...prev, orderData];
        sessionStorage.setItem("activeOrders", JSON.stringify(updated));
        return updated;
      });
      scheduleExpiry(orderData.id, ONE_HOUR_MS);

      // Show toast
      showOrderSuccessToast();

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

      {/* Bottom Order Summary */}
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
            <div className="flex items-center gap-1">
              {logo && (
                <img src={logo} alt="Logo" className="h-12 w-auto mb-3" />
              )}
              <h2 className="text-lg font-semibold mb-4">Enter Your Details</h2>
            </div>

            {/* Customer Name */}
            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) => {
                if (e.target.value.length <= 15)
                  setCustomerName(e.target.value);
              }}
              className="w-full border rounded-lg p-2 mb-3 border-none outline-none shadow-md"
            />
            <p className="text-xs text-gray-500 mb-2">
              Max 15 characters ({15 - customerName.length} left)
            </p>

            {/* Phone Number */}
            <input
              type="tel"
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) setCustomerPhone(value);
              }}
              className="w-full border rounded-lg p-2 mb-3 border-none outline-none shadow-md"
            />
            <p className="text-xs text-gray-500 mb-2">
              10-digit phone number required
            </p>

            {/* Table Selection - PROPER DROPDOWN */}
            {/* <div className="mb-4">
              <div className="relative">
                <select
                  value={tableId}
                  onChange={(e) => setTableId(e.target.value)}
                  className="w-full appearance-none border border-gray-300 rounded-lg p-3 pr-10 outline-none shadow-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                >
                  <option value="">Select Table</option>
                  {Array.from(
                    { length: restaurantData?.restaurant?.tableNumbers || 0 },
                    (_, index) => (
                      <option key={index + 1} value={`T${index + 1}`} >
                        Table {index + 1}
                      </option>
                    )
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div> */}
            <Select value={tableId} onValueChange={setTableId}>
  <SelectTrigger
    className="w-full border-2 border-orange-300 rounded-xl p-4 
    text-gray-800 font-medium bg-white 
    focus:ring-4 focus:ring-orange-200 focus:border-orange-500 
    hover:border-orange-400 transition-all duration-200 shadow-lg mb-4 "
  >
    <SelectValue placeholder="Select Table" className="text-gray-400" />
  </SelectTrigger>

  <SelectContent className="bg-white border-2 border-orange-300 shadow-xl rounded-xl max-h-60">
    <SelectGroup>
      {/* <SelectLabel className="text-orange-600 font-semibold px-4 py-3 border-b border-orange-100">
        🍽️ Available Tables
      </SelectLabel> */}

      {Array.from(
        { length: restaurantData?.restaurant?.tableNumbers || 0 }, 
        (_, i) => (
          <SelectItem
            key={i + 1}
            value={`T${i + 1}`}
            className="text-gray-700 font-medium hover:bg-orange-50 hover:text-orange-700 
            focus:bg-orange-100 focus:text-orange-700 cursor-pointer py-3 px-4 
            transition-colors duration-150 border-b border-orange-50 last:border-b-0"
          >
            <span className="flex items-center gap-2">
              {/* <span className="text-orange-500">🪑</span> */}
              Table {i + 1}
            </span>
          </SelectItem>
        )
      )}
    </SelectGroup>
  </SelectContent>
</Select>

            {/* Order Type Selection */}
            <div className="flex justify-start gap-4 mb-4">
              <button
                type="button"
                onClick={() => setOrderType("Take Away")}
                className={`px-4 py-1 rounded-full border text-sm font-medium transition shadow-md ${
                  orderType === "Take Away"
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                Take Away
              </button>
              <button
                type="button"
                onClick={() => setOrderType("Eat Here")}
                className={`px-4 py-1 rounded-full border text-sm font-medium transition shadow-md ${
                  orderType === "Eat Here"
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                Eat Here
              </button>
               <button
                type="button"
                onClick={() => setOrderType("Delivery")}
                className={`px-4 py-1 rounded-full border text-sm font-medium transition shadow-md ${
                  orderType === "Delivery"
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                Delivery
              </button>
            </div>

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
                  !customerName ||
                  !customerPhone ||
                  customerPhone.length !== 10 ||
                  !tableId ||
                  !orderType ||
                  loading
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
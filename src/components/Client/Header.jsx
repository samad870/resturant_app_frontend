import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { FiShoppingCart } from "react-icons/fi";
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
import config from "../../config";
import OrderFormModal from "./OrderFormModal";

export default function Header({ logo, siteName = "Default Name" }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { data: restaurantData } = useRestaurant();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableId, setTableId] = useState("");
  const [orderType, setOrderType] = useState("");
  const [address, setAddress] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

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

  const showSuccessMessage = (orderId) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm';
    
    messageDiv.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-gray-200" style="animation: scale-in 0.3s ease-out;">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          
          <h3 class="text-xl font-bold text-gray-800 mb-2">Order Confirmed!</h3>
          <p class="text-gray-600 mb-1">Thank you for your order</p>
          <p class="text-sm text-gray-500 mb-4">Order ID: ${orderId}</p>
          
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <div class="flex items-center justify-center gap-2 text-orange-700">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm font-medium">Ready in 10-15 minutes</span>
            </div>
          </div>
          
          <button class="w-full bg-orange-500 text-white py-3 rounded-xl text-base font-medium hover:bg-orange-600 transition-colors duration-200 shadow-md">
            Got It
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(messageDiv);

    // Add scale-in animation
    const content = messageDiv.querySelector('div > div');
    content.style.transform = 'scale(0.9)';
    content.style.opacity = '0';
    content.style.transition = 'all 0.3s ease-out';
    
    setTimeout(() => {
      content.style.transform = 'scale(1)';
      content.style.opacity = '1';
    }, 10);

    const closeMessage = () => {
      content.style.transform = 'scale(0.9)';
      content.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(messageDiv)) {
          document.body.removeChild(messageDiv);
        }
      }, 300);
    };

    messageDiv.querySelector('button').onclick = closeMessage;
    messageDiv.onclick = (e) => {
      if (e.target === messageDiv) closeMessage();
    };

    setTimeout(closeMessage, 5000);
  };

  const showErrorMessage = (message) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm';
    
    messageDiv.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-gray-200" style="animation: scale-in 0.3s ease-out;">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          
          <h3 class="text-xl font-bold text-gray-800 mb-2">Order Failed</h3>
          <p class="text-gray-600 mb-4">${message}</p>
          
          <button class="w-full bg-gray-500 text-white py-3 rounded-xl text-base font-medium hover:bg-gray-600 transition-colors duration-200 shadow-md">
            Try Again
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(messageDiv);

    // Add scale-in animation
    const content = messageDiv.querySelector('div > div');
    content.style.transform = 'scale(0.9)';
    content.style.opacity = '0';
    content.style.transition = 'all 0.3s ease-out';
    
    setTimeout(() => {
      content.style.transform = 'scale(1)';
      content.style.opacity = '1';
    }, 10);

    const closeMessage = () => {
      content.style.transform = 'scale(0.9)';
      content.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(messageDiv)) {
          document.body.removeChild(messageDiv);
        }
      }, 300);
    };

    messageDiv.querySelector('button').onclick = closeMessage;
    messageDiv.onclick = (e) => {
      if (e.target === messageDiv) closeMessage();
    };

    setTimeout(closeMessage, 5000);
  };

  const isFormValid = () => {
    // Basic validations for all order types
    if (!customerName || customerName.trim().length === 0) {
      return false;
    }
    if (!customerPhone || customerPhone.length !== 10) {
      return false;
    }

    // Order type specific validations
    switch (orderType) {
      case "Eat Here":
        return !!tableId;
      case "Take Away":
        return true; // No additional fields needed for Take Away
      case "Delivery":
        return !!address && address.trim().length > 0;
      default:
        return false;
    }
  };

  const handleOrderSubmit = async () => {
    try {
      // Final validation check
      if (!isFormValid()) {
        let errorMessage = "Please fill all required fields correctly.";
        if (!customerName) errorMessage = "Please enter your name.";
        else if (!customerPhone || customerPhone.length !== 10) errorMessage = "Please enter a valid 10-digit phone number.";
        else if (orderType === "Eat Here" && !tableId) errorMessage = "Please select a table.";
        else if (orderType === "Delivery" && !address) errorMessage = "Please enter delivery address.";
        
        showErrorMessage(errorMessage);
        return;
      }

      setLoading(true);

      const orderItems = Object.values(cartItems).map((item) => ({
        menuItemId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const orderData = {
        customerName: customerName.trim(),
        customerPhone,
        items: orderItems,
        totalAmount,
        orderType,
      };

      // Add conditional fields
      if (orderType === "Eat Here") {
        orderData.tableId = tableId;
      }
      if (orderType === "Delivery") {
        orderData.address = address.trim();
      }

      const response = await fetch(`${config.BASE_URL}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Failed to place order");

      const data = await response.json();
      const completeOrderData = {
        id: data?.orderId || `ORD${Date.now()}`,
        ...orderData,
        createdAt: Date.now(),
      };

      setActiveOrders((prev) => {
        const updated = [...prev, completeOrderData];
        sessionStorage.setItem("activeOrders", JSON.stringify(updated));
        return updated;
      });
      scheduleExpiry(completeOrderData.id, ONE_HOUR_MS);

      showSuccessMessage(completeOrderData.id);

      // Reset form
      setShowModal(false);
      setIsCartOpen(false);
      setOrderType("");
      setAddress("");
      setUseCurrentLocation(false);
      setCustomerName("");
      setCustomerPhone("");
      setTableId("");

      // Clear cart after delay
      setTimeout(() => {
        dispatch(clearCart());
      }, 300);
    } catch (error) {
      console.error("Error placing order:", error);
      showErrorMessage("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setOrderType("");
    setAddress("");
    setUseCurrentLocation(false);
    setCustomerName("");
    setCustomerPhone("");
    setTableId("");
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
          <FiShoppingCart className="w-6 h-6 text-gray-700 hover:text-black" />
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
                    {order.customerName} - {order.orderType}
                    {order.tableId && ` - Table ${order.tableId}`}
                  </p>
                  <p className="text-gray-500">Phone: {order.customerPhone}</p>
                  {order.address && (
                    <p className="text-gray-500">Address: {order.address}</p>
                  )}
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

      {/* Order Form Modal */}
      <OrderFormModal
        showModal={showModal}
        setShowModal={setShowModal}
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
        tableId={tableId}
        setTableId={setTableId}
        orderType={orderType}
        setOrderType={setOrderType}
        address={address}
        setAddress={setAddress}
        useCurrentLocation={useCurrentLocation}
        setUseCurrentLocation={setUseCurrentLocation}
        loading={loading}
        handleOrderSubmit={handleOrderSubmit}
        restaurantData={restaurantData}
        logo={logo}
        resetForm={resetForm}
      />
    </>
  );
}
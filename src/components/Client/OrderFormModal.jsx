import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Navigation, Utensils, Truck, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrderFormModal({
  showModal,
  setShowModal,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  tableId,
  setTableId,
  orderType,
  setOrderType,
  address,
  setAddress,
  useCurrentLocation,
  setUseCurrentLocation,
  loading,
  handleOrderSubmit,
  restaurantData,
  logo,
  resetForm
}) {
  const [selectedOrderType, setSelectedOrderType] = useState(orderType);

  const handleOrderTypeSelect = (type) => {
    setOrderType(type);
    setSelectedOrderType(type);
    // Reset location-related states when changing order type
    if (type !== "Delivery") {
      setAddress("");
      setUseCurrentLocation(false);
    }
  };

  const handleUseCurrentLocation = () => {
    setUseCurrentLocation(true);
    setAddress("Getting your location...");
    
    // Simulate geolocation API call
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you would reverse geocode these coordinates
          setTimeout(() => {
            setAddress(`Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }, 1000);
        },
        (error) => {
          console.error("Error getting location:", error);
          setAddress("Unable to get location. Please enter manually.");
        }
      );
    } else {
      setAddress("Geolocation not supported. Please enter address.");
    }
  };

  const isFormValid = () => {
    if (!customerName || !customerPhone || customerPhone.length !== 10) {
      return false;
    }

    switch (orderType) {
      case "Eat Here":
        return !!tableId;
      case "Take Away":
        return true;
      case "Delivery":
        return !!address;
      default:
        return false;
    }
  };

  const orderTypeOptions = [
    {
      value: "Eat Here",
      label: "Eat Here",
      description: "Dine in at our restaurant",
      icon: Utensils,
      color: "bg-green-500"
    },
    {
      value: "Take Away",
      label: "Take Away",
      description: "Pick up your order",
      icon: Home,
      color: "bg-blue-500"
    },
    {
      value: "Delivery",
      label: "Delivery",
      description: "Get it delivered to you",
      icon: Truck,
      color: "bg-orange-500"
    }
  ];

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex justify-between items-center gap-16">
                 {!orderType && (
              <Link 
                to="/"
                onClick={() => setShowModal(false)}
                className="flex items-center gap-2 text-primary font-medium hover:underline transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Home
              </Link>
            )}
              {logo && (
                <img src={logo} alt="Logo" className="h-10 w-10 rounded-lg" />
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-800">Place Your Order</h2>
                <p className="text-sm text-gray-600">Enter your details to continue</p>
              </div>
            </div>
            
            {/* Home Button - Only show when no order type is selected */}
           
          </div>
        </div>

        <div className="p-6">
          {/* Order Type Selection - Vertical Layout */}
          {!orderType ? (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Order Type</h3>
              {orderTypeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOrderTypeSelect(option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                    selectedOrderType === option.value
                      ? "border-primary bg-primary bg-opacity-5 shadow-lg"
                      : "border-gray-200 bg-white hover:border-gray-300 shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`${option.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                      <option.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-gray-800">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      selectedOrderType === option.value ? "bg-primary border-primary" : "border-gray-300"
                    }`} />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <>
              {/* Back Button */}
              <button
                onClick={() => {
                  setOrderType("");
                  setSelectedOrderType("");
                }}
                className="flex items-center gap-2 text-primary font-medium mb-6 hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Order Types
              </button>

              {/* Customer Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => {
                    if (e.target.value.length <= 15)
                      setCustomerName(e.target.value);
                  }}
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-white"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Max 15 characters ({15 - customerName.length} left)
                </p>
              </div>

              {/* Phone Number */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={customerPhone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) setCustomerPhone(value);
                  }}
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-white"
                />
                <p className="text-xs text-gray-500 mt-2">
                  10-digit phone number required
                </p>
              </div>

              {/* Conditional Fields Based on Order Type */}
              <div className="space-y-4">
                {/* Table Selection - Only for Eat Here */}
                {orderType === "Eat Here" && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Table *
                    </label>
                    <Select value={tableId} onValueChange={setTableId}>
                      <SelectTrigger
                        className="w-full border-2 border-primary rounded-xl p-4 
                        text-gray-800 font-medium bg-white 
                        focus:ring-4 focus:ring-primary focus:border-primary 
                        hover:border-primary transition-all duration-200 shadow-lg h-12"
                      >
                        <SelectValue placeholder="Choose your table" className="text-gray-400" />
                      </SelectTrigger>

                      <SelectContent className="bg-white border-2 border-primary shadow-xl rounded-xl max-h-60">
                        <SelectGroup>
                          {Array.from(
                            { length: restaurantData?.restaurant?.tableNumbers || 0 }, 
                            (_, i) => (
                              <SelectItem
                                key={i + 1}
                                value={`T${i + 1}`}
                                className="text-gray-700 font-medium hover:bg-primary hover:text-white 
                                focus:bg-primary focus:text-white cursor-pointer py-3 px-4 
                                transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                              >
                                <span className="flex items-center gap-2">
                                  Table {i + 1}
                                </span>
                              </SelectItem>
                            )
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Delivery Address - Only for Delivery */}
                {orderType === "Delivery" && (
                  <div className="animate-fade-in space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Delivery Address *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter your delivery address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-xl p-4 outline-none shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-white"
                      />
                    </div>
                    
                    {/* <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={useCurrentLocation}
                      className={`w-full flex items-center justify-center gap-3 p-4 border-2 rounded-xl transition-all duration-200 ${
                        useCurrentLocation
                          ? "bg-green-50 text-green-700 border-green-300"
                          : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 hover:scale-[1.02]"
                      }`}
                    >
                      {useCurrentLocation ? (
                        <>
                          <MapPin className="w-5 h-5" />
                          <span className="font-medium">Using Current Location</span>
                        </>
                      ) : (
                        <>
                          <Navigation className="w-5 h-5" />
                          <span className="font-medium">Use My Current Location</span>
                        </>
                      )}
                    </button> */}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  disabled={loading}
                  className="flex-1 py-3 text-base font-medium rounded-xl border-2"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary text-white py-3 text-base font-medium rounded-xl hover:bg-primary-dark transition-colors"
                  onClick={handleOrderSubmit}
                  disabled={!isFormValid() || loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
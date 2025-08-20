// src/api/orderService.js

const API_BASE_URL =
  "https://restaurant-app-backend-mihf.onrender.com/api/order";

/**
 * Place an order using Fetch API
 * @param {string} restaurant - restaurant identifier (path param)
 * @param {Object} orderData - order payload
 */
export const placeOrder = async (restaurant, orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${restaurant}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`Failed to place order: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error placing order:", error.message);
    throw error;
  }
};

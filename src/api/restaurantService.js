export const getRestaurant = async () => {
    console.log("🔍 API Base URL:", import.meta.env.VITE_API_BASE_URL);

  try {
    const response = await fetch(
      `/api/restaurant/public`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return [];
  }
};

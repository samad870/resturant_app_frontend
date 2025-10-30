import config from "../config";

export const getRestaurant = async () => {
   
  try {
    const response = await fetch(
      `${config.BASE_URL}/api/restaurant/public`,
      
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

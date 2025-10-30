import config from "../config";

export const getMenu = async () => {
 
  try {
    const response = await fetch(
      `${config.BASE_URL}/api/menu/public` // no param added
      
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching menu:", error);
    return [];
  }
};

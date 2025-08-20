export const getMenu = async (parm) => {
//   console.log(parm);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/menu/public/${parm}`
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

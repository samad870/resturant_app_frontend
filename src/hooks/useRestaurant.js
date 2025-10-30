import { useEffect, useState } from "react";
import { getRestaurant } from "../api/restaurantService";

export function useRestaurant() {
  const [data, setRestaurant] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const data = await getRestaurant();
        setRestaurant(data);
      } catch (err) {
        setError(err.message || "Error fetching restaurant");
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurant();
  }, []);

  return { data, loading, error };
}

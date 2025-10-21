import { useEffect } from "react";
import { useRestaurant } from "./src/hooks/useRestaurant"; // API hook

const AppTitle = () => {
  const { data: restaurantData, isLoading } = useRestaurant();

  useEffect(() => {
    if (!isLoading && restaurantData?.restaurant) {
      const { restaurantName, logo } = restaurantData.restaurant;

      // 1️⃣ Title set karo
      document.title = restaurantName || "Loading...";

      // 2️⃣ Favicon update karo
      const updateFavicon = (iconUrl) => {
        let link =
          document.querySelector("link[rel~='icon']") ||
          document.createElement("link");
        link.rel = "icon";
        link.type = "image/png";
        link.href = iconUrl || "/favicon.ico"; // default fallback
        document.getElementsByTagName("head")[0].appendChild(link);
      };

      updateFavicon(logo); // logo me base64 ya URL aa sakta hai
    } else {
      document.title = "Loading...";
      // Optional: default favicon
      let link =
        document.querySelector("link[rel~='icon']") ||
        document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      link.href = "/favicon.ico";
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  }, [restaurantData, isLoading]);

  return null;
};

export default AppTitle;

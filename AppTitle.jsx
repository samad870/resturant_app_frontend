import { useEffect } from "react";
import { useRestaurant } from "./src/hooks/useRestaurant"; 

const AppTitle = () => {
  const { data: restaurantData, isLoading } = useRestaurant();

  useEffect(() => {
    if (!isLoading && restaurantData?.restaurant) {
      const { restaurantName, logo } = restaurantData.restaurant;

      
      document.title = restaurantName || "Loading...";

      
      const updateFavicon = (iconUrl) => {
        let link =
          document.querySelector("link[rel~='icon']") ||
          document.createElement("link");
        link.rel = "icon";
        link.type = "image/png";
        link.href = iconUrl || "/favicon.ico"; 
        document.getElementsByTagName("head")[0].appendChild(link);
      };

      updateFavicon(logo); 
    } else {
      document.title = "Loading...";
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

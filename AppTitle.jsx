// src/components/AppTitle.jsx
import { useEffect } from "react";
import { useGetRestaurantQuery } from "./src/redux/clientRedux/clientAPI"; // ✅ Fixed import path

const AppTitle = () => {
  const { data: restaurantData, isLoading, error } = useGetRestaurantQuery();

  useEffect(() => {
    if (!isLoading && restaurantData?.restaurant) {
      const { restaurantName, logo } = restaurantData.restaurant;

      document.title = restaurantName || "Restaurant App";

      const updateFavicon = (iconUrl) => {
        const existingLinks = document.querySelectorAll("link[rel~='icon']");
        existingLinks.forEach(link => link.remove());

        const link = document.createElement("link");
        link.rel = "icon";
        link.type = "image/png";
        
        // ✅ Safe check for iconUrl - handle both string and object
        let finalIconUrl = "/favicon.ico"; // default
        
        if (iconUrl) {
          if (typeof iconUrl === 'string' && (iconUrl.startsWith('http') || iconUrl.startsWith('/'))) {
            finalIconUrl = iconUrl;
          } else if (typeof iconUrl === 'string') {
            finalIconUrl = `/${iconUrl}`;
          } else if (iconUrl.url && typeof iconUrl.url === 'string') {
            // ✅ Handle logo object with url property
            finalIconUrl = iconUrl.url;
          }
        }
        
        link.href = finalIconUrl;
        document.head.appendChild(link);
      };

      updateFavicon(logo);
    } else if (error || (!isLoading && !restaurantData)) {
      document.title = "Restaurant App";
      
      const existingLinks = document.querySelectorAll("link[rel~='icon']");
      existingLinks.forEach(link => link.remove());
      
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      link.href = "/favicon.ico";
      document.head.appendChild(link);
    }
  }, [restaurantData, isLoading, error]);

  return null;
};

export default AppTitle;
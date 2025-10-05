// import { useEffect, useState } from "react";
// import { getMenu } from "../api/menuService";

// export function useMenu() {
//   const [data, setMenu] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const name = "cafe";

//   useEffect(() => {
//     async function fetchMenu() {
//       try {
//         const data = await getMenu(name);
//         setMenu(data);
//         // console.log('qwertyu', data)
//       } catch (err) {
//         setError(err.message || "Error fetching menu");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchMenu();
//   }, []);

//   return { data, loading, error };
// }

import { useEffect, useState } from "react";
import { getMenu } from "../api/menuService";

export function useMenu() {
  const [data, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const data = await getMenu(); // no param
        setMenu(data);
        // console.log("items", data);
      } catch (err) {
        setError(err.message || "Error fetching menu");
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  return { data, loading, error };
}

import React from "react";
import { useMenu } from "../../hooks/useMenu";

const HelperData = () => {
  const { data, loading, error } = useMenu();

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Menu</h1>
      <ul>
        {data.menu.map((item) => (
          <li key={item._id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HelperData;
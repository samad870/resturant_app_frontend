import React from "react";
import { useGetMenuQuery } from "../../redux/clientRedux/clientAPI";

const HelperData = () => {
  const { data, isLoading, error } = useGetMenuQuery();

  if (isLoading) return <p>Loading menu...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Menu</h1>
      <ul>
        {data?.menu?.map((item) => (
          <li key={item._id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HelperData;
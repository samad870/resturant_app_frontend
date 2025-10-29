import React from "react";
import BillPage from "../BillPage"; 

// ✅ 1. Accept 'restaurantDetails' as a prop
const ItemsModal = ({ order, restaurantDetails, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
        {/* ✅ 2. Pass 'restaurantDetails' down to BillPage */}
        <BillPage 
          order={order} 
          restaurantDetails={restaurantDetails} 
          onClose={onClose} 
        />
      </div>
  );
};

export default ItemsModal;
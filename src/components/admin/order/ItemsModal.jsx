import React from "react";
import BillPage from "../BillPage";

const ItemsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
        <BillPage order={order} onClose={onClose} />
      </div>
  );
};

export default ItemsModal;

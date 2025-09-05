import React from "react";
import { getStatusBadge } from "./utils";

const StatusDropdown = ({ order, updateOrder }) => {
  return (
    <select
      value={order.status}
      onChange={(e) =>
        updateOrder(order._id, {
          tableId: order.tableId,
          items: order.items,
          totalAmount: order.totalAmount,
          status: e.target.value,
        })
      }
      className={`px-3 py-1 rounded-full text-xs font-medium border-none 
        focus:outline-none focus:ring-2 focus:ring-offset-1 
        cursor-pointer transition-colors duration-200 
        ${getStatusBadge(order.status)}`}
    >
      <option value="pending">⏳ Pending</option>
      <option value="completed">🏁 Completed</option>
      <option value="cancelled">❌ Cancelled</option>
    </select>
  );
};

export default StatusDropdown;

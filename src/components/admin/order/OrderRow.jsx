import React from "react";
import StatusDropdown from "./StatusDropdown";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";


const OrderRow = ({
  order,
  index,
  setEditingOrder,
  setShowConfirmDelete,
  setSelectedItems,
  updateOrder,
  orderNum
}) => {
  return (
    <tr key={order._id} className="hover:bg-gray-50 transition">
      <td className="px-6 py-4">{index + 1}</td>
      <td className="px-6 py-4">{orderNum}</td>
      <td className="px-6 py-4 font-medium text-gray-800">
        {order.customerName}
      </td>
      <td className="px-6 py-4 text-gray-700">{order.customerPhone}</td>
      <td className="px-6 py-4">{order.tableId || "N/A"}</td>
      <td className="px-6 py-4">{order.orderType}</td>

      <td className="px-6 py-4">
        <StatusDropdown order={order} updateOrder={updateOrder} />
      </td>

      <td className="px-6 py-4 ">
        <button
          onClick={() => setSelectedItems(order)}
          className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition font-medium "
        >
          View Items
        </button>
      </td>

      <td className="px-6 py-4 text-right space-x-2 flex">
        <button
          onClick={() => setEditingOrder(order)}
          className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition font-medium"
        >
          <MdModeEdit size={20}/>
        </button>
        <button
          onClick={() => setShowConfirmDelete(order)}
          className="px-3 py-1 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition font-medium"
        >
        <MdDelete size={20}/>
        </button>
      </td>
    </tr>
  );
};

export default OrderRow;

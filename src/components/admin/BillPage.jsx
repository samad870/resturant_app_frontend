import React, { useRef } from "react";

const BillPage = ({ order, onClose }) => {
  const billRef = useRef();

  const handlePrint = () => {
    const printContents = billRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div
        ref={billRef}
        className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 print:max-w-full print:rounded-none print:shadow-none"
      >
        {/* ✅ Restaurant Header */}
        <div className="text-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold">🍴 My Restaurant</h2>
          <p className="text-gray-600 text-sm">123 Main Street, New Delhi</p>
          <p className="text-gray-600 text-sm">Phone: +91 9876543210</p>
          <p className="text-gray-600 text-sm">GSTIN: 07ABCDE1234F1Z5</p>
        </div>

        {/* ✅ Customer & Order Info */}
        <div className="mb-4 text-sm">
          <p>
            <span className="font-semibold">Customer:</span>{" "}
            {order.customerName}
          </p>
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            {order.customerPhone}
          </p>
          <p>
            <span className="font-semibold">Table:</span>{" "}
            {order.tableId || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Date:</span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {order.status}
          </p>
        </div>

        {/* ✅ Items Table */}
        <table className="w-full text-sm border-t border-b mb-4">
          <thead>
            <tr className="text-left">
              <th className="py-2">Item</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-1">{item.name}</td>
                <td className="py-1 text-center">{item.quantity}</td>
                <td className="py-1 text-right">₹{item.price}</td>
                <td className="py-1 text-right">
                  ₹{item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Totals */}
        <div className="text-sm space-y-1 mb-6">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (5%)</span>
            <span>₹{(order.totalAmount * 0.05).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Grand Total</span>
            <span>₹{(order.totalAmount * 1.05).toFixed(2)}</span>
          </div>
        </div>

        {/* ✅ Footer */}
        <p className="text-center text-gray-600 text-xs border-t pt-3">
          ⭐ Thank you for dining with us! Visit again. ⭐
        </p>
      </div>

      {/* Buttons */}
      <div className="absolute bottom-8 flex gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          Close
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          🖨 Print Bill
        </button>
      </div>
    </div>
  );
};

export default BillPage;

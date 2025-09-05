import React from "react";

const DeleteModal = ({ order, onCancel, onDelete }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6 text-center">
        <h3 className="text-lg font-semibold mb-3">Delete Order?</h3>
        <p className="text-gray-500 mb-5">
          Are you sure you want to delete this order? This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import config from "../../../config";
import MenuFilter from "../Filter/MenuFilter";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  // Icon for the "Add" button in the new modal
  PlusIcon as PlusIconSolid,
} from "@heroicons/react/24/solid";
// Icon for the image upload area
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react"; // Icon for the "Add New Item" button

// Motion Variants (re-used for all modals)
const modalOverlayVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};
const modalContentVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};
// Variant for the AddItem modal (slight variation)
const addItemModalVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
};

const Menu = () => {
  // --- Main Menu State ---
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    type: "all",
    available: "all",
  });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // --- State for Categories (Merged from AddItems) ---
  const [restaurantCategories, setRestaurantCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  // --- NEW: State for Add Item Modal (Merged from AddItems) ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    type: "",
    available: true,
  });
  const [addFile, setAddFile] = useState(null);
  const [addFileError, setAddFileError] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false); // Form submission loading state

  const API_URL = `${config.BASE_URL}/api/menu`;
  const token = localStorage.getItem("token");



  // --- Notification Handlers (from Menu.js) ---
  const showNotification = useCallback((message, type = "success") => {
    setNotification({ show: true, message, type });
    // Auto-close after 3 seconds
    setTimeout(() => {
      setNotification((n) => (n.show ? { ...n, show: false } : n));
    }, 3000);
  }, []);

  const closeNotification = useCallback(() => {
    setNotification({ show: false, message: "", type: "" });
  }, []);

  // --- Fetch Main Menu Data (from Menu.js) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(
            errData.message || `Failed to fetch menu (Status: ${res.status})`
          );
        }
        const data = await res.json();
        const menuData = data.menu || data;
        if (Array.isArray(menuData)) {
          setItems(menuData);
        } else {
          setError("Unexpected API response format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL, token]);

  // --- Fetch Restaurant Categories (IMPROVED: Merged from AddItems) ---
  useEffect(() => {
    const fetchRestaurantCategories = async () => {
      if (!token) {
        setErrorCategories("Not logged in.");
        setLoadingCategories(false);
        return;
      }
      try {
        setLoadingCategories(true);
        setErrorCategories(null);
        const res = await fetch(`${config.BASE_URL}/api/restaurant/admin`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch restaurant categories");
        }
        const data = await res.json();
        if (data.restaurant && Array.isArray(data.restaurant.categories)) {
          setRestaurantCategories(data.restaurant.categories.sort());
        } else {
          setRestaurantCategories([]);
          console.warn("No categories found in restaurant data.");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setErrorCategories(`Could not load categories: ${err.message}`);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchRestaurantCategories();
  }, [token]);

  // --- CRUD Handlers (from Menu.js) ---
  const handleDelete = (id, name) => {
    setDeleteConfirm({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const res = await fetch(`${API_URL}/${deleteConfirm.id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) throw new Error("Failed to delete item");
      setItems(items.filter((item) => item._id !== deleteConfirm.id));
      showNotification("Item deleted successfully!", "success");
      setDeleteConfirm(null);
    } catch (err) {
      showNotification(err.message, "error");
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editingItem.category) {
      showNotification("Please select a category for the item.", "error");
      return;
    }
    try {
      let body;
      let headers = { Authorization: token ? `Bearer ${token}` : "" };
      if (editingItem.image instanceof File) {
        body = new FormData();
        body.append("name", editingItem.name);
        body.append("category", editingItem.category);
        body.append("type", editingItem.type);
        body.append("price", editingItem.price);
        body.append("description", editingItem.description);
        body.append("available", editingItem.available);
        body.append("file", editingItem.image);
      } else {
        headers["Content-Type"] = "application/json";
        const { image, ...itemData } = editingItem;
        body = JSON.stringify(itemData);
      }
      const res = await fetch(`${API_URL}/${editingItem._id}`, {
        method: "PUT",
        headers,
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update item");
      const updatedItem = data.item || data;
      setItems((prev) =>
        prev.map((i) => (i._id === updatedItem._id ? updatedItem : i))
      );
      setEditingItem(null);
      showNotification("Item updated successfully!", "success");
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // --- NEW: Add Item Modal Handlers (from AddItems.js) ---
  const handleAddFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddFormFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setAddFileError("");
    setAddFile(null);
    if (!selectedFile) return;
    const fileSizeInKB = selectedFile.size / 1024;
    if (fileSizeInKB > 300) {
      setAddFileError(
        `File size too large: ${fileSizeInKB.toFixed(2)} KB. Max: 300KB`
      );
      e.target.value = "";
      return;
    }
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/avif",
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      setAddFileError(
        "Invalid image file type (JPEG, PNG, GIF, WEBP, AVIF allowed)"
      );
      e.target.value = "";
      return;
    }
    setAddFile(selectedFile);
  };

  const handleAddItemSubmit = async (e) => {
    e.preventDefault();
    // Basic validation checks
    if (!addFormData.category) {
      showNotification("Please select a category", "error");
      return;
    }
    if (!addFormData.type) {
      showNotification("Please select a food type", "error");
      return;
    }
    if (!addFile) {
      showNotification("Please select a product image", "error");
      return;
    }
    if (addFileError) {
      showNotification(addFileError, "error");
      return;
    }
    if (!token) {
      showNotification("Please login to add products", "error");
      return;
    }

    try {
      setIsAddingItem(true);
      const submitData = new FormData();
      submitData.append("name", addFormData.name.trim());
      submitData.append("description", addFormData.description.trim());
      submitData.append("price", addFormData.price);
      submitData.append("category", addFormData.category);
      submitData.append("type", addFormData.type);
      submitData.append("available", addFormData.available);
      submitData.append("file", addFile);

      const res = await fetch(`${config.BASE_URL}/api/menu/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: submitData,
      });

      // Robust response handling from AddItems
      let result;
      const responseText = await res.text();
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        if (!res.ok) {
          throw new Error(
            `Server Error (${res.status}): ${res.statusText}. Response was not valid JSON.`
          );
        }
        result = { message: "Product added successfully!" }; // Fallback
      }

      if (!res.ok) {
        throw new Error(result?.message || `API Error (${res.status})`);
      }

      // --- CRITICAL: Update Menu state ---
      const newItem = result.item || result; // Use same logic as handleUpdate

      // 1. Add new item to the main 'items' state (prepend it)
      setItems((prev) => [newItem, ...prev]);

      // 2. Show success notification (using Menu.js's function)
      showNotification(
        result.message || "Product added successfully!",
        "success"
      );

      // 3. Close the modal
      setIsAddModalOpen(false);

      // 4. Reset form state
      setAddFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        type: "",
        available: true,
      });
      setAddFile(null);
      setAddFileError("");
      const fileInput = document.getElementById("add-product-image-modal");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Submission error:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check connection.";
      } else if (
        error.message.includes("API Error") ||
        error.message.includes("Server Error")
      ) {
        errorMessage = error.message;
      }
      // Use Menu.js's notification system
      showNotification(errorMessage, "error");
    } finally {
      setIsAddingItem(false);
    }
  };
  // --- END: Add Item Modal Handlers ---

  // --- Filtering Logic (from Menu.js) ---
  const filteredItems = items.filter((item) => {
    const searchLower = filters.search.toLowerCase();
    const matchesSearch =
      searchLower === ""
        ? true
        : item.name.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower);
    const matchesCategory =
      filters.category === "all" || item.category === filters.category;
    const matchesType = filters.type === "all" || item.type === filters.type;
    const matchesAvailability =
      filters.available === "all" ||
      item.available.toString() === filters.available.toString();
    return (
      matchesSearch && matchesCategory && matchesType && matchesAvailability
    );
  });

  // --- JSX ---
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 relative">
      {/* Big Modal Notification (Used by all functions) */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            variants={modalOverlayVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeNotification}
          >
            <motion.div
              variants={modalContentVariant}
              className={`relative rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-auto ${
                notification.type === "success"
                  ? "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
                  : "bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                {notification.type === "success" ? (
                  <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                ) : (
                  <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                )}
                <p className="text-lg font-medium text-gray-800">
                  {notification.message}
                </p>
                <button
                  onClick={closeNotification}
                  className={`mt-6 w-full text-white py-3 px-8 rounded-xl text-lg font-semibold shadow-sm transition-colors ${
                    notification.type === "success"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            variants={modalOverlayVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={cancelDelete}
          >
            <motion.div
              variants={modalContentVariant}
              className="relative rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-auto bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">
                  Are you sure?
                </h3>
                <p className="text-gray-600 mt-2">
                  Do you really want to delete "
                  <strong>{deleteConfirm.name}</strong>"? This action cannot be
                  undone.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  onClick={cancelDelete}
                  className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-xl text-lg font-semibold shadow-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="w-full bg-red-600 text-white py-3 px-6 rounded-xl text-lg font-semibold shadow-sm hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NEW: Add Item Modal (from AddItems.js) --- */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            variants={modalOverlayVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 mt-10 backdrop-blur-sm flex items-center justify-center z-40 p-4"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              variants={addItemModalVariant}
              className="bg-gradient-to-br from-gray-50 to-gray-100 p-1 rounded-2xl shadow-lg w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-h-[90vh] overflow-y-auto rounded-[14px] bg-white">
                {/* We use the form from AddItems.js directly */}
                <motion.form
                  onSubmit={handleAddItemSubmit}
                  className="p-6 sm:p-8"
                >
                  <div className="flex items-center gap-3 mb-6 border-b pb-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl">🍕</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Add New Product
                      </h2>
                      <p className="text-sm text-gray-500">
                        Create a new menu item.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="ml-auto text-gray-400 hover:text-gray-600"
                      aria-label="Close modal"
                    >
                      <XCircleIcon className="w-7 h-7" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Row 1: Name + Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Product Name
                        </label>
                        <input
                          name="name"
                          value={addFormData.name}
                          onChange={handleAddFormChange}
                          required
                          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white text-sm"
                          placeholder="e.g. Margherita Pizza"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={addFormData.price}
                          onChange={handleAddFormChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white text-sm"
                          placeholder="e.g. 299"
                        />
                      </div>
                    </div>

                    {/* Row 2: Category (Dropdown) + Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Category
                        </label>
                        {/* --- Category Dropdown Logic (Now uses Menu.js state) --- */}
                        {loadingCategories && (
                          <div className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-sm text-gray-500">
                            Loading categories...
                          </div>
                        )}
                        {errorCategories && (
                          <div className="w-full border border-red-300 rounded-lg p-3 bg-red-50 text-sm text-red-600">
                            {errorCategories}
                          </div>
                        )}
                        {!loadingCategories && !errorCategories && (
                          <select
                            name="category"
                            value={addFormData.category}
                            onChange={handleAddFormChange}
                            required
                            className={`w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white text-sm ${
                              !addFormData.category
                                ? "text-gray-400"
                                : "text-gray-900"
                            }`}
                          >
                            <option value="" disabled>
                              Select a Category
                            </option>
                            {restaurantCategories.length === 0 ? (
                              <option disabled>No categories found</option>
                            ) : (
                              restaurantCategories.map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))
                            )}
                          </select>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Food Type
                        </label>
                        <select
                          name="type"
                          value={addFormData.type}
                          onChange={handleAddFormChange}
                          className={`w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white text-sm ${
                            !addFormData.type
                              ? "text-gray-400"
                              : "text-gray-900"
                          }`}
                        >
                          <option value="" disabled>
                            Select Food Type
                          </option>
                          <option value="veg">🌱 Veg</option>
                          <option value="non-veg">🍗 Non-Veg</option>
                        </select>
                      </div>
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Product Image
                      </label>
                      <label
                        htmlFor="add-product-image-modal"
                        className="cursor-pointer"
                      >
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors bg-gray-50">
                          <input
                            type="file"
                            name="file"
                            onChange={handleAddFormFileChange}
                            className="hidden"
                            id="add-product-image-modal"
                            accept=".jpeg,.jpg,.png,.gif,.webp,.avif,image/*"
                          />
                          <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
                            {/* <PhotoIcon className="w-10 h-10 mb-2 text-gray-400" /> */}
                            <p className="font-medium text-sm">
                              {addFile ? addFile.name : "Click to upload image"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Max 300KB (JPG, PNG, WEBP, etc.)
                            </p>
                          </div>
                        </div>
                      </label>
                      {addFile && !addFileError && (
                        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                          <CheckCircleIcon className="w-3.5 h-3.5" /> Selected:{" "}
                          {addFile.name} ({(addFile.size / 1024).toFixed(1)} KB)
                        </p>
                      )}
                      {addFileError && (
                        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                          <ExclamationTriangleIcon className="w-3.5 h-3.5" />{" "}
                          {addFileError}
                        </p>
                      )}
                    </div>

                    {/* Availability Checkbox */}
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <input
                        type="checkbox"
                        id="available-checkbox"
                        name="available"
                        checked={addFormData.available}
                        onChange={handleAddFormChange}
                        className="h-4 w-4 accent-orange-600 rounded border-gray-300 focus:ring-orange-500"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor="available-checkbox"
                          className="font-medium text-sm text-gray-800 cursor-pointer"
                        >
                          Available for Order
                        </label>
                        <p className="text-xs text-gray-500">
                          Uncheck this if the product is temporarily
                          unavailable.
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Product Description (Optional)
                      </label>
                      <textarea
                        name="description"
                        value={addFormData.description}
                        onChange={handleAddFormChange}
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white resize-vertical text-sm"
                        placeholder="e.g., Fresh basil pesto, cherry tomatoes, mozzarella..."
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={
                        isAddingItem ||
                        !!addFileError ||
                        loadingCategories ||
                        !addFormData.category ||
                        !addFormData.type
                      }
                      whileTap={{ scale: 0.97 }}
                      className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg text-base font-semibold shadow-md hover:bg-orange-600 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isAddingItem ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Adding Product...
                        </>
                      ) : (
                        <>
                          <PlusIconSolid className="w-5 h-5" />
                          Add Product to Menu
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- END: Add Item Modal --- */}

      <div>
        {/* Header */}
        <div className="mb-6">
          {/* <div className="flex justify-between items-center p-2 shadow-md"> */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">🍔 Manage Menu</h2>
            {/* </div> */}
          </div>
        </div>
        <div className="fixed bottom-10 right-6 z-20">
          {/* --- MODIFIED: This button now opens the Add Item Modal --- */}
          <Button
            variant="outline"
            className="bg-green-600 rounded-full text-white hover:bg-green-800 h-16 w-16"
            onClick={() => setIsAddModalOpen(true)}
          >
            <CirclePlus size={20} />
          </Button>
        </div>
        {/* --- Filter Component --- */}
        <div className="my-6">
          <MenuFilter
            onFilterChange={handleFilterChange}
            // Pass the categories fetched by Menu.js
            categories={restaurantCategories}
          />
        </div>

        {/* Loader & Error */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex flex-col relative overflow-hidden"
                >
                  <img
                    src={
                      item.image?.url ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div
                    className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold text-white ${
                      item.type === "veg" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {item.type === "veg" ? "🥗 Veg" : "🍗 Non-Veg"}
                  </div>
                  <div
                    className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold text-white ${
                      item.available ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {item.category}
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-2 flex-grow">
                      {item.description}
                    </p>
                    <p className="mt-2 text-green-600 font-bold text-lg">
                      ₹{item.price}
                    </p>
                    <div className="mt-auto flex gap-2 pt-3">
                      <button
                        onClick={() => setEditingItem({ ...item })}
                        className="flex-1 border border-gray-300 text-gray-800 py-2 rounded-lg 
                                  hover:bg-gray-100 transition shadow-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id, item.name)}
                        className="flex-1 border border-red-300 text-red-600 py-2 rounded-lg 
                                  hover:bg-red-50 transition shadow-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* No items found message */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-700">
              No Items Found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your filters to find what you're looking for.
            </p>
          </div>
        )}

        {/* Edit Modal (Original from Menu.js) */}
        <AnimatePresence>
          {editingItem && (
            <motion.div
              variants={modalOverlayVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setEditingItem(null)}
            >
              <motion.div
                variants={modalContentVariant}
                className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Edit Item
                </h3>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, name: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="Name"
                    />
                    <select
                      value={editingItem.category}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          category: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none appearance-none"
                    >
                      <option value="">Select a Category</option>
                      {/* Use the same master category list */}
                      {restaurantCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      value={editingItem.type}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, type: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none appearance-none"
                    >
                      <option value="veg">Veg</option>
                      <option value="non-veg">Non-Veg</option>
                    </select>
                    <input
                      type="number"
                      value={editingItem.price}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          price: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="Price"
                    />
                  </div>
                  <textarea
                    value={editingItem.description}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Description"
                    rows="3"
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.available}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          available: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-orange-500"
                    />
                    <span className="text-sm text-gray-700">Available</span>
                  </label>
                  <div>
                    <p className="text-sm text-gray-700 mb-1">Product Image</p>
                    <img
                      src={
                        editingItem.image instanceof File
                          ? URL.createObjectURL(editingItem.image)
                          : editingItem.image?.url ||
                            "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt="preview"
                      className="w-full h-36 object-cover rounded-lg mb-2"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          image: e.target.files[0],
                        })
                      }
                      className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition font-semibold"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Menu;

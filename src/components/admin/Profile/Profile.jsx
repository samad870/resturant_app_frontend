"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  UserCircleIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  PhotoIcon,
  TagIcon,
  QrCodeIcon,
  CheckCircleIcon, // Added import
  XCircleIcon, // Added import
  ExclamationTriangleIcon, // Added import
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion"; // Added import

// --- Reusable UI Components (from UpdateProfile) ---

// Form Card
const FormCard = ({ title, icon, children, customIndex }) => (
  <motion.div
    className="bg-white rounded-2xl shadow-lg border border-gray-200"
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
      }),
    }}
    initial="hidden"
    animate="visible"
    custom={customIndex}
  >
    <div className="p-6 md:p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-orange-500">{icon}</span>
        {title}
      </h3>
      <div className="space-y-6">{children}</div>
    </div>
  </motion.div>
);

// Read-only field
const DisabledFormField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    <div className="flex items-center w-full bg-gray-100 border border-gray-200 rounded-xl p-3 cursor-not-allowed">
      <span className="text-gray-800 font-medium truncate">
        {value || "N/A"}
      </span>
    </div>
  </div>
);

// Standard editable form field
const FormField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      min={min}
      className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" // CHANGED: p-3 to p-2.5
      placeholder={placeholder}
    />
  </div>
);

// --- Motion Variants ---
const chipVariant = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
};

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

// --- Reusable Sub-Components (from Profile) ---

const ProfileField = ({ label, value, icon }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
    <div className="flex items-center gap-3 mb-3">
      <span className="text-lg">{icon}</span>
      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
        {label}
      </label>
    </div>
    <div className="flex items-center justify-between">
      <p className="text-lg font-semibold text-gray-900 break-all">
        {value || "Not Available"}
      </p>
    </div>
  </div>
);

const CategoryChips = ({ categories }) => (
  <div className="flex flex-wrap gap-2">
    {categories.length > 0 ? (
      categories.map((category) => (
        <span
          key={category}
          className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1.5 rounded-full"
        >
          {category}
        </span>
      ))
    ) : (
      <p className="text-gray-500">No categories listed.</p>
    )}
  </div>
);

// --- Loading and Error Components ---
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600">Loading profile...</p>
    </div>
  </div>
);

const ErrorMessage = ({ error }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-3">
        Error Loading Profile
      </h2>
      <p className="text-gray-700">{error || "An unknown error occurred."}</p>
    </div>
  </div>
);

// --- Update Profile Modal Component ---
const UpdateProfile = ({ initialData, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    tableNumbers: initialData.tableNumbers || "",
    phoneNumber: initialData.phoneNumber || "",
    address: initialData.address || "",
    gstNumber: initialData.gstNumber || "",
    gstEnabled: initialData.gstEnabled || false,
    gstRate: initialData.gstRate || 0,
    publicId: initialData.logo?.public_id || "",
  });

  const [categories, setCategories] = useState(initialData.categories || []);
  const [currentCategoryInput, setCurrentCategoryInput] = useState("");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [categorySuggestions, setCategorySuggestions] = useState(() => {
    try {
      const saved = localStorage.getItem("restaurantCategories");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error parsing categories from localStorage:", e);
      return [];
    }
  });

  const [token] = useState(() => localStorage.getItem("token") || "");

  // --- Core Handlers ---

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
  };

  const closeNotification = () => {
    const notificationType = notification.type; // Store type before clearing
    setNotification({ show: false, message: "", type: "" });
    if (notificationType === "success") {
      onUpdateSuccess(); // This calls the parent's success handler
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "phoneNumber") {
      processedValue = value.replace(/\D/g, "");
      if (processedValue.length > 10) {
        processedValue = processedValue.slice(0, 10);
      }
    } else if (name === "gstRate") {
      processedValue = value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*?)\..*/g, "$1");
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleGstToggle = (e) => {
    const isEnabled = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      gstEnabled: isEnabled,
      gstNumber: isEnabled ? prev.gstNumber : "",
      gstRate: isEnabled ? prev.gstRate : 0,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError("");
    setFile(null);
    if (!selectedFile) return;

    const fileSizeInKB = selectedFile.size / 1024;
    if (fileSizeInKB > 300) {
      setFileError(
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
      setFileError("Please select a valid image file (JPEG, PNG, etc.)");
      e.target.value = "";
      return;
    }
    setFile(selectedFile);
  };

  // --- Category Handlers ---

  const handleCategoryKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const value = currentCategoryInput.trim();
      if (!value) return;

      const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);

      if (!categories.includes(capitalizedValue)) {
        setCategories((prev) => [...prev, capitalizedValue]);

        if (!categorySuggestions.includes(capitalizedValue)) {
          const updatedSuggestions = [...categorySuggestions, capitalizedValue];
          setCategorySuggestions(updatedSuggestions);
          localStorage.setItem(
            "restaurantCategories",
            JSON.stringify(updatedSuggestions)
          );
        }
      }
      setCurrentCategoryInput("");
    }
  };

  const handleRemoveCategory = useCallback((categoryToRemove) => {
    setCategories((prev) => prev.filter((cat) => cat !== categoryToRemove));
  }, []);

  // --- Form Submission ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      showNotification("No token found. Please login first", "error");
      return;
    }
    if (fileError) {
      showNotification(fileError, "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const formDataToUpload = new FormData();

      // Append all form data fields
      Object.keys(formData).forEach((key) => {
        formDataToUpload.append(key, formData[key]);
      });

      if (file) {
        formDataToUpload.append("file", file);
      }

      // Append categories array
      categories.forEach((category) => {
        formDataToUpload.append("categories", category);
      });
      if (categories.length === 0) {
        formDataToUpload.append("categories", ""); // To clear array on backend
      }

      // Using relative path, assuming your API is on the same domain
      const res = await fetch(`/api/restaurant/`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToUpload,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update");

      showNotification("Restaurant updated successfully!", "success");
      // Don't close immediately, let the user click "Done"
      // onUpdateSuccess() will be called from closeNotification
    } catch (err) {
      console.error("Update error:", err);
      showNotification(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={modalOverlayVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4"
      onClick={onClose} // Close modal on background click
    >
      {/* Notifications Modal (Fixed position ensures it's centered on viewport) */}
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

      {/* Main Form Modal */}
      <motion.div
        variants={modalContentVariant}
        className="relative  border-2 border-red-50 mt-10   rounded-3xl shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing on content click
      >
        {/* Main Form Content */}
        <div>
          <div className="w-full max-w-3xl mx-auto space-y-6">
            <motion.form onSubmit={handleSubmit} className="space-y-6 p-2">
              {/* <FormCard
                title="Business Details (Uneditable)"
                icon="🔒"
                customIndex={0}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DisabledFormField
                    label="Owner Name"
                    value={initialData.name}
                  />
                  <DisabledFormField
                    label="Restaurant Name"
                    value={initialData.restaurantName}
                  />
                  <DisabledFormField
                    label="Client Domain"
                    value={initialData.domain}
                  />
                </div>
              </FormCard> */}

              <FormCard title="Core Profile" icon="✏️" customIndex={1}>
                <FormField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 123 Main St, New Delhi"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Phone Number"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                  />
                  <FormField
                    label="Total Tables"
                    name="tableNumbers"
                    type="number"
                    min="1"
                    value={formData.tableNumbers}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                  />
                </div>

                {/* Category Input Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Categories
                  </label>
                  <div className="flex flex-wrap items-center gap-2 w-full border border-gray-300 rounded-xl p-2 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all">
                    {" "}
                    <AnimatePresence>
                      {categories.map((category) => (
                        <motion.span
                          key={category}
                          {...chipVariant}
                          className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1.5 rounded-full"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(category)}
                            className="text-orange-600 hover:text-orange-800"
                            aria-label={`Remove ${category}`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                    <input
                      type="text"
                      value={currentCategoryInput}
                      onChange={(e) => setCurrentCategoryInput(e.target.value)}
                      onKeyDown={handleCategoryKeyDown}
                      list="category-suggestions"
                      className="flex-1 min-w-[150px] border-none outline-none ring-0 focus:ring-0 p-1.5 bg-transparent"
                      placeholder="Type a category and press Space..."
                    />
                  </div>
                  <datalist id="category-suggestions">
                    {categorySuggestions.map((cat, idx) => (
                      <option key={idx} value={cat} />
                    ))}
                  </datalist>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Press Space or Enter to add a new category.
                  </p>
                </div>
              </FormCard>

              <FormCard title="Financials" icon="💳" customIndex={2}>
                <div className="space-y-4 rounded-xl border border-gray-200 p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="gst-toggle"
                      className="text-gray-700 font-semibold"
                    >
                      Enable GST
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="gst-toggle"
                        className="sr-only peer"
                        checked={formData.gstEnabled}
                        onChange={handleGstToggle}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-orange-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>

                  <AnimatePresence>
                    {formData.gstEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          marginTop: "1rem",
                        }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            label="GST Number"
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleChange}
                            placeholder="e.g. 22AAAAA0000A1Z5"
                          />
                          <FormField
                            label="GST Rate (%)"
                            name="gstRate"
                            type="text" // Keep as text to allow decimal
                            value={formData.gstRate}
                            onChange={handleChange}
                            placeholder="e.g. 5"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FormCard>

              <FormCard title="Branding"  icon="🖼️" customIndex={3}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Restaurant Logo
                  </label>
                  <div className="border-2  border-dashed  rounded-xl p-6 text-center hover:border-orange-400 transition-colors bg-gray-50">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="logo-upload"
                      accept=".jpeg,.jpg,.png,.gif,.webp,.avif,image/*"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="text-3xl">📁</span>
                        <div>
                          <p className="text-gray-700 font-medium">
                            {file ? file.name : "Click to upload logo"}
                          </p>
                          <p className="text-sm text-gray-500">
                            JPEG, JPG, PNG up to 300KB
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                  {file && !fileError && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                      <span>✅</span> Selected: {file.name} (
                      {(file.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                  {fileError && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
                      <span>❌</span> {fileError}
                    </p>
                  )}
                </div>
              </FormCard>

              {/* Form Actions */}
              <motion.div
                className="flex justify-end gap-4"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: (i) => ({
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: i * 0.05,
                      duration: 0.4,
                      ease: "easeOut",
                    },
                  }),
                }}
                initial="hidden"
                animate="visible"
                custom={4}
              >
                <Button
                  type="button"
                  className="py-2.5 px-6 h-full rounded-xl text-base font-semibold" // CHANGED: Smaller padding/text
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !!fileError}
                  whileTap={{ scale: 0.95 }}
                  className="bg-orange-500 text-white py-2.5 px-6 rounded-xl text-base font-semibold shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[180px]" // CHANGED: Smaller padding/text/min-width
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      Update Restaurant
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main Profile Component ---
const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    restaurantName: "",
    qrCode: "",
    logoUrl: "",
    domain: "",
    address: "",
    phoneNumber: "",
    tableNumbers: "",
    categories: [],
    gstNumber: "",
    gstRate: 0,
    gstEnabled: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token] = useState(() => localStorage.getItem("token") || "");

  // State to control the update modal
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  // State to trigger a refetch after successful update
  const [triggerRefetch, setTriggerRefetch] = useState(0);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      setLoading(true); // Set loading to true at the start of fetch
      const localName = localStorage.getItem("userName") || "Admin User";
      const localEmail =
        localStorage.getItem("userEmail") || "admin@example.com";

      if (!token) {
        setError("No token found. Please log in.");
        setProfileData((prev) => ({
          ...prev,
          name: localName,
          email: localEmail,
          restaurantName: "Login required",
        }));
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/restaurant/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        if (!res.ok) {
          throw new Error(
            `Failed to fetch restaurant details (Status: ${res.status})`
          );
        }

        const data = await res.json();
        // console.log("Fetched restaurant data:", data);

        if (data.restaurant) {
          const r = data.restaurant;
          setProfileData({
            name: localName,
            email: localEmail,
            restaurantName: r.restaurantName || r.name || "My Restaurant",
            qrCode: r.qrCode || "",
            logoUrl: r.logo?.url || "",
            logo: r.logo, // Pass the whole logo object for public_id
            domain: r.domain || "N/A",
            address: r.address || "N/A",
            phoneNumber: r.phoneNumber || "N/A",
            tableNumbers: r.tableNumbers || "N/A",
            categories: r.categories || [],
            gstNumber: r.gstNumber || "N/A",
            gstRate: r.gstRate || 0,
            gstEnabled: r.gstEnabled || false,
          });
          setError(null); // Clear any previous error
        } else {
          throw new Error("Restaurant data not found in response");
        }
      } catch (err) {
        console.error("Error fetching admin details:", err);
        setError(err.message);
        setProfileData((prev) => ({
          ...prev,
          name: localName,
          email: localEmail,
          restaurantName: "Error Loading Data",
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDetails();
  }, [token, triggerRefetch]); // Re-fetch when token or triggerRefetch changes

  const downloadQRCode = () => {
    if (profileData.qrCode) {
      const link = document.createElement("a");
      link.href = profileData.qrCode;
      link.download = `${profileData.restaurantName}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // This function will be called by the modal on successful update
  const handleUpdateSuccess = () => {
    setIsUpdateModalOpen(false); // Close the modal
    setTriggerRefetch((prev) => prev + 1); // Increment to trigger the useEffect
  };

  if (loading && triggerRefetch === 0) {
    // Only show full-page spinner on initial load
    return <LoadingSpinner />;
  }

  if (error && !profileData.restaurantName) {
    // Only show full-page error if no data is loaded
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <div className=" bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className=" mx-auto">
          {/* Page Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profileData.restaurantName}
              </h1>
              {/* Show a mini-loader during refetch */}
              {loading && triggerRefetch > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">Updating...</span>
                </div>
              )}
              {/* Show error inline if data is already present */}
              {error && triggerRefetch > 0 && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </div>
            <div>
              <Button onClick={() => setIsUpdateModalOpen(true)}>
                Update Profile
              </Button>
            </div>
          </div>

          {/* Main Content: Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- LEFT COLUMN (2/3 width) --- */}
            <div className="lg:col-span-2 space-y-8">
              {/* Card 1: Admin Account */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <UserCircleIcon className="w-6 h-6 text-orange-500" />
                    Admin Account
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    label="Full Name"
                    value={profileData.name}
                    icon="👤"
                  />
                  <ProfileField
                    label="Email Address"
                    value={profileData.email}
                    icon="📧"
                  />
                </div>
              </div>

              {/* Card 2: Restaurant Details */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <BuildingOfficeIcon className="w-6 h-6 text-orange-500" />
                    Restaurant Details
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <ProfileField
                      className="w-64"
                      label="Full Address"
                      value={profileData.address}
                      icon="📍"
                    />
                  </div>
                  <ProfileField
                    label="Contact Phone"
                    value={profileData.phoneNumber}
                    icon="📞"
                  />
                  <ProfileField
                    label="Total Tables"
                    value={profileData.tableNumbers}
                    icon="🪑"
                  />
                  <div className="md:col-span-2">
                    <ProfileField
                      label="Client Domain"
                      value={profileData.domain}
                      icon="🌐"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Financial Settings */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <CreditCardIcon className="w-6 h-6 text-orange-500" />
                    Financial Settings
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    label="GST Status"
                    value={profileData.gstEnabled ? "Enabled" : "Disabled"}
                    icon="🧾"
                  />
                  <ProfileField
                    label="GST Rate"
                    value={`${profileData.gstRate}%`}
                    icon="%"
                  />
                  <div className="md:col-span-2">
                    <ProfileField
                      label="GST Number"
                      value={profileData.gstNumber}
                      icon="🔢"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* --- RIGHT COLUMN (1/3 width) --- */}
            <div className="lg:col-span-1 space-y-8">
              {/* Card 1: Logo */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <PhotoIcon className="w-6 h-6 text-orange-500" />
                    Restaurant Logo
                  </h3>
                </div>
                <div className="p-6 flex justify-center items-center">
                  {profileData.logoUrl ? (
                    <img
                      src={profileData.logoUrl}
                      alt="Restaurant Logo"
                      className="w-48 h-48 object-cover rounded-xl border p-1 bg-gray-50"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-gray-100 rounded-xl border border-dashed flex items-center justify-center">
                      <p className="text-gray-500">No logo uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Categories */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <TagIcon className="w-6 h-6 text-orange-500" />
                    Categories
                  </h3>
                </div>
                <div className="p-6">
                  <CategoryChips categories={profileData.categories} />
                </div>
              </div>

              {/* Card 3: QR Code */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <QrCodeIcon className="w-6 h-6 text-orange-500" />
                    Tap N' Order QR
                  </h3>
                </div>
                <div className="p-6">
                  {profileData.qrCode ? (
                    <div className="text-center">
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 inline-block">
                        <img
                          src={profileData.qrCode}
                          alt="QR Code"
                          className="w-48 h-48 object-contain"
                        />
                      </div>
                      <button
                        onClick={downloadQRCode}
                        className="w-full mt-4 bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <span>📥</span>
                        Download QR
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center">
                      QR Code not generated.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* This is where the modal is rendered. 
        It's outside the main layout, controlled by `isUpdateModalOpen`.
      */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <UpdateProfile
            initialData={profileData}
            onClose={() => setIsUpdateModalOpen(false)}
            onUpdateSuccess={handleUpdateSuccess}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Profile;
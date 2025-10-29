// import React, { useState, useEffect, useCallback } from "react";
// // eslint-disable-next-line no-unused-vars
// import { motion, AnimatePresence } from "framer-motion";
// import config from "../../../config";
// import {
//   CheckCircleIcon,
//   ExclamationTriangleIcon,
//   XCircleIcon,
// } from "@heroicons/react/24/solid";

// // --- Reusable Components ---

// // Wrapper for each form section card
// const FormCard = ({ title, icon, children, customIndex }) => (
//   <motion.div
//     className="bg-white rounded-2xl shadow-lg border border-gray-200"
//     variants={{
//       hidden: { opacity: 0, y: 20 },
//       visible: (i) => ({
//         opacity: 1,
//         y: 0,
//         transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
//       }),
//     }}
//     initial="hidden"
//     animate="visible"
//     custom={customIndex}
//   >
//     <div className="p-6 md:p-8">
//       <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//         <span className="text-orange-500">{icon}</span>
//         {title}
//       </h3>
//       <div className="space-y-6">{children}</div>
//     </div>
//   </motion.div>
// );

// // Read-only field
// const DisabledFormField = ({ label, value }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1.5">
//       {label}
//     </label>
//     <div className="flex items-center w-full bg-gray-100 border border-gray-200 rounded-xl p-4 cursor-not-allowed">
//       <span className="text-gray-800 font-medium truncate">{value || "N/A"}</span>
//     </div>
//   </div>
// );

// // Standard editable form field
// const FormField = ({
//   label,
//   name,
//   value,
//   onChange,
//   placeholder,
//   type = "text",
//   min,
// }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1.5">
//       {label}
//     </label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       min={min}
//       className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
//       placeholder={placeholder}
//     />
//   </div>
// );

// // --- Motion Variants ---
// const chipVariant = {
//   hidden: { opacity: 0, scale: 0.5 },
//   visible: { opacity: 1, scale: 1 },
//   exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
// };

// const modalOverlayVariant = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1 },
//   exit: { opacity: 0 },
// };

// const modalContentVariant = {
//   hidden: { opacity: 0, scale: 0.8 },
//   visible: { opacity: 1, scale: 1 },
//   exit: { opacity: 0, scale: 0.8 },
// };

// // --- Main Component ---
// const UpdateProfile = () => {
//   const [formData, setFormData] = useState({
//     tableNumbers: "",
//     phoneNumber: "",
//     address: "",
//     gstNumber: "",
//     gstEnabled: false,
//     gstRate: 0,
//     publicId: "",
//   });

//   const [categories, setCategories] = useState([]);
//   const [currentCategoryInput, setCurrentCategoryInput] = useState("");
//   const [file, setFile] = useState(null);
//   const [fileError, setFileError] = useState("");
  
//   const [isLoading, setIsLoading] = useState(true); // For initial page load
//   const [isSubmitting, setIsSubmitting] = useState(false); // For form submission
//   const [error, setError] = useState(null); // For initial page load error

//   const [restaurantInfo, setRestaurantInfo] = useState(null);
//   const [notification, setNotification] = useState({ show: false, message: "", type: "" });

//   const [categorySuggestions, setCategorySuggestions] = useState(() => {
//     try {
//       const saved = localStorage.getItem("restaurantCategories");
//       return saved ? JSON.parse(saved) : [];
//     } catch (e) {
//       console.error("Error parsing categories from localStorage:", e);
//       return [];
//     }
//   });

//   const [token] = useState(() => localStorage.getItem("token") || "");

//   // Fetch restaurant details
//   useEffect(() => {
//     const fetchDetails = async () => {
//       if (!token) {
//         setError("No authentication token found. Please log in.");
//         setIsLoading(false);
//         return;
//       }
//       try {
//         setIsLoading(true);
//         setError(null);
//         const res = await fetch(`${config.BASE_URL}/api/restaurant/admin`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Cache-Control": "no-cache",
//             Pragma: "no-cache",
//           },
//         });
// console.log(res)
//         if (!res.ok) {
//            const errData = await res.json();
//            throw new Error(errData.message || `Failed to fetch data (Status: ${res.status})`);
//         }
        
//         const data = await res.json();
        
//         if (data.restaurant) {
//           const r = data.restaurant;
//           setRestaurantInfo(r);
//           setFormData({
//             tableNumbers: r.tableNumbers || "",
//             phoneNumber: r.phoneNumber || "",
//             address: r.address || "",
//             gstEnabled: r.gstEnabled || false,
//             gstNumber: r.gstNumber || "",
//             gstRate: r.gstRate || 0,
//             publicId: r.logo?.public_id || "",
//           });
//           setCategories(r.categories || []);
//         } else {
//             throw new Error("Restaurant data not found in response.");
//         }
//       } catch (err) {
//         console.error("Error fetching restaurant details:", err);
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchDetails();
//   }, [token]);

//   // --- Core Handlers ---

//   const showNotification = (message, type = "success") => {
//     setNotification({ show: true, message, type });
//   };

//   const closeNotification = () => {
//     setNotification({ show: false, message: "", type: "" });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let processedValue = value;

//     if (name === "phoneNumber") {
//       processedValue = value.replace(/\D/g, "");
//       if (processedValue.length > 10) {
//         processedValue = processedValue.slice(0, 10);
//       }
//     } else if (name === "gstRate") {
//       processedValue = value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");
//     }

//     setFormData((prev) => ({ ...prev, [name]: processedValue }));
//   };

//   const handleGstToggle = (e) => {
//     const isEnabled = e.target.checked;
//     setFormData((prev) => ({
//       ...prev,
//       gstEnabled: isEnabled,
//       gstNumber: isEnabled ? prev.gstNumber : "",
//       gstRate: isEnabled ? prev.gstRate : 0,
//     }));
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFileError("");
//     setFile(null);
//     if (!selectedFile) return;

//     const fileSizeInKB = selectedFile.size / 1024;
//     if (fileSizeInKB > 300) {
//       setFileError(`File size too large: ${fileSizeInKB.toFixed(2)} KB. Max: 300KB`);
//       e.target.value = "";
//       return;
//     }
//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
//     if (!allowedTypes.includes(selectedFile.type)) {
//       setFileError("Please select a valid image file (JPEG, PNG, etc.)");
//       e.target.value = "";
//       return;
//     }
//     setFile(selectedFile);
//   };

//   // --- Category Handlers ---

//   const handleCategoryKeyDown = (e) => {
//     if (e.key === "Enter" || e.key === " ") {
//       e.preventDefault();
//       const value = currentCategoryInput.trim();
//       if (!value) return;

//       const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);

//       if (!categories.includes(capitalizedValue)) {
//         setCategories((prev) => [...prev, capitalizedValue]);
        
//         if (!categorySuggestions.includes(capitalizedValue)) {
//           const updatedSuggestions = [...categorySuggestions, capitalizedValue];
//           setCategorySuggestions(updatedSuggestions);
//           localStorage.setItem("restaurantCategories", JSON.stringify(updatedSuggestions));
//         }
//       }
//       setCurrentCategoryInput("");
//     }
//   };

//   const handleRemoveCategory = useCallback((categoryToRemove) => {
//     setCategories((prev) => prev.filter((cat) => cat !== categoryToRemove));
//   }, []);

//   // --- Form Submission ---

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!token) {
//       showNotification("No token found. Please login first", "error");
//       return;
//     }
//     if (fileError) {
//       showNotification(fileError, "error");
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       const formDataToUpload = new FormData();

//       // Append all form data fields
//       Object.keys(formData).forEach(key => {
//          formDataToUpload.append(key, formData[key]);
//       });

//       if (file) {
//         formDataToUpload.append("file", file);
//       }

//       // Append categories array
//       categories.forEach((category) => {
//         formDataToUpload.append("categories", category);
//       });
//       if (categories.length === 0) {
//         formDataToUpload.append("categories", ""); // To clear array on backend
//       }

//       const res = await fetch(`${config.BASE_URL}/api/restaurant/`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formDataToUpload,
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message || "Failed to update");

//       showNotification("Restaurant updated successfully!", "success");
//       setRestaurantInfo(result.restaurant);
//       setCategories(result.restaurant.categories || []);
//       setFile(null);
//       setFileError("");
//       const fileInput = document.getElementById("logo-upload");
//       if (fileInput) fileInput.value = "";
//     } catch (err) {
//       console.error("Update error:", err);
//       showNotification(err.message, "error");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // --- Render Logic ---

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-gray-600">Loading settings...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//      return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//           <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200 text-center">
//              <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
//              <h2 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Settings</h2>
//              <p className="text-gray-700">{error}</p>
//           </div>
//         </div>
//      );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 md:py-12">
//       {/* Notifications Modal */}
//       <AnimatePresence>
//         {notification.show && (
//           <motion.div
//             variants={modalOverlayVariant}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//             className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={closeNotification}
//           >
//             <motion.div
//               variants={modalContentVariant}
//               className={`relative rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-auto ${
//                 notification.type === "success"
//                   ? "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
//                   : "bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200"
//               }`}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="text-center">
//                 {notification.type === "success" ? (
//                   <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
//                 ) : (
//                   <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
//                 )}
//                 <p className="text-lg font-medium text-gray-800">
//                   {notification.message}
//                 </p>
//                 <button
//                   onClick={closeNotification}
//                   className={`mt-6 w-full text-white py-3 px-8 rounded-xl text-lg font-semibold shadow-sm transition-colors ${
//                      notification.type === "success" 
//                      ? "bg-green-500 hover:bg-green-600"
//                      : "bg-red-500 hover:bg-red-600"
//                   }`}
//                 >
//                   Done
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Main Content */}
//       <div className="w-full max-w-4xl mx-auto space-y-6">
//         {/* Page Header */}
//         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
//             Restaurant Settings
//           </h1>
//           <p className="text-lg text-gray-600 text-center mt-2">
//             Update your restaurant's profile and settings.
//           </p>
//         </motion.div>

//         {/* Form sections */}
//         <motion.form onSubmit={handleSubmit} className="space-y-6">
//           <FormCard
//             title="Business Details (Uneditable)"
//             icon="🔒"
//             customIndex={0}
//           >
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <DisabledFormField label="Owner Name" value={restaurantInfo?.name} />
//               <DisabledFormField
//                 label="Restaurant Name"
//                 value={restaurantInfo?.restaurantName}
//               />
//               <DisabledFormField
//                 label="Client Domain"
//                 value={restaurantInfo?.domain}
//               />
//             </div>
//           </FormCard>

//           <FormCard title="Core Profile" icon="✏️" customIndex={1}>
//             <FormField
//               label="Address"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               placeholder="e.g. 123 Main St, New Delhi"
//             />
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <FormField
//                 label="Phone Number"
//                 name="phoneNumber"
//                 type="tel"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 placeholder="e.g. 9876543210"
//               />
//               <FormField
//                 label="Total Tables"
//                 name="tableNumbers"
//                 type="number"
//                 min="1"
//                 value={formData.tableNumbers}
//                 onChange={handleChange}
//                 placeholder="e.g. 25"
//               />
//             </div>

//             {/* Category Input Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Categories
//               </label>
//               <div className="flex flex-wrap items-center gap-2 w-full border border-gray-300 rounded-xl p-2.5 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all">
//                 <AnimatePresence>
//                   {categories.map((category) => (
//                     <motion.span
//                       key={category}
//                       {...chipVariant}
//                       className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1.5 rounded-full"
//                     >
//                       {category}
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveCategory(category)}
//                         className="text-orange-600 hover:text-orange-800"
//                         aria-label={`Remove ${category}`}
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                       </button>
//                     </motion.span>
//                   ))}
//                 </AnimatePresence>
//                 <input
//                   type="text"
//                   value={currentCategoryInput}
//                   onChange={(e) => setCurrentCategoryInput(e.target.value)}
//                   onKeyDown={handleCategoryKeyDown}
//                   list="category-suggestions"
//                   className="flex-1 min-w-[150px] border-none outline-none ring-0 focus:ring-0 p-1.5 bg-transparent"
//                   placeholder="Type a category and press Space..."
//                 />
//               </div>
//               <datalist id="category-suggestions">
//                 {categorySuggestions.map((cat, idx) => (
//                   <option key={idx} value={cat} />
//                 ))}
//               </datalist>
//               <p className="text-xs text-gray-500 mt-1.5">
//                 Press Space or Enter to add a new category.
//               </p>
//             </div>
//           </FormCard>

//           <FormCard title="Financials" icon="💳" customIndex={2}>
//             <div className="space-y-4 rounded-xl border border-gray-200 p-4 bg-gray-50">
//               <div className="flex items-center justify-between">
//                 <label
//                   htmlFor="gst-toggle"
//                   className="text-gray-700 font-semibold"
//                 >
//                   Enable GST
//                 </label>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     id="gst-toggle"
//                     className="sr-only peer"
//                     checked={formData.gstEnabled}
//                     onChange={handleGstToggle}
//                   />
//                   <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-orange-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
//                 </label>
//               </div>

//               <AnimatePresence>
//                 {formData.gstEnabled && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0, marginTop: 0 }}
//                     animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
//                     exit={{ opacity: 0, height: 0, marginTop: 0 }}
//                     transition={{ duration: 0.3 }}
//                     className="space-y-4 overflow-hidden"
//                   >
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <FormField
//                         label="GST Number"
//                         name="gstNumber"
//                         value={formData.gstNumber}
//                         onChange={handleChange}
//                         placeholder="e.g. 22AAAAA0000A1Z5"
//                       />
//                       <FormField
//                         label="GST Rate (%)"
//                         name="gstRate"
//                         type="text" // Keep as text to allow decimal
//                         value={formData.gstRate}
//                         onChange={handleChange}
//                         placeholder="e.g. 5"
//                       />
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </FormCard>

//           <FormCard title="Branding" icon="🖼️" customIndex={3}>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Restaurant Logo
//               </label>
//               <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors bg-gray-50">
//                 <input
//                   type="file"
//                   onChange={handleFileChange}
//                   className="hidden"
//                   id="logo-upload"
//                   accept=".jpeg,.jpg,.png,.gif,.webp,.avif,image/*"
//                 />
//                 <label
//                   htmlFor="logo-upload"
//                   className="cursor-pointer"
//                 >
//                   <div className="flex flex-col items-center justify-center gap-2">
//                     <span className="text-3xl">📁</span>
//                     <div>
//                       <p className="text-gray-700 font-medium">
//                         {file ? file.name : "Click to upload logo"}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         JPEG, JPG, PNG up to 300KB
//                       </p>
//                     </div>
//                   </div>
//                 </label>
//               </div>
//               {file && !fileError && (
//                 <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
//                   <span>✅</span> Selected: {file.name} (
//                   {(file.size / 1024).toFixed(2)} KB)
//                 </p>
//               )}
//               {fileError && (
//                 <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
//                   <span>❌</span> {fileError}
//                 </p>
//               )}
//             </div>
//           </FormCard>

//           {/* Form Actions */}
//           <motion.div
//             className="flex justify-end gap-4"
//             variants={{
//               hidden: { opacity: 0, y: 20 },
//               visible: (i) => ({
//                 opacity: 1,
//                 y: 0,
//                 transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
//               }),
//             }}
//             initial="hidden"
//             animate="visible"
//             custom={4}
//           >
//             <motion.button
//               type="submit"
//               disabled={isSubmitting || !!fileError}
//               whileTap={{ scale: 0.95 }}
//               className="bg-orange-500 text-white py-3 px-8 rounded-xl text-lg font-semibold shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[200px]"
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   <span>💾</span>
//                   Update Restaurant
//                 </>
//               )}
//             </motion.button>
//           </motion.div>
//         </motion.form>
//       </div>
//     </div>
//   );
// };

// export default UpdateProfile;
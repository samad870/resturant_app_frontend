// import React, { useState } from "react";

// const ProductForm = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     image: "",
//     category: "",
//     available: false,
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const res = await fetch("https://restaurant-app-backend-mihf.onrender.com/api/menu/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) throw new Error("Failed to add product");

//       const data = await res.json();
//       alert("Product added successfully!");
//       console.log("Saved:", data);

//       setFormData({
//         name: "",
//         description: "",
//         price: "",
//         image: "",
//         category: "",
//         available: false,
//       });
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 space-y-5"
//       >
//         <h2 className="text-2xl font-semibold text-gray-800 text-center">
//           Add New Product
//         </h2>

//         {/* Name */}
//         <div>
//           <label className="block font-medium mb-1">Name</label>
//           <input
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="w-full border rounded-md p-2"
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block font-medium mb-1">Description</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             rows="3"
//             className="w-full border rounded-md p-2"
//           />
//         </div>

//         {/* Price + Category */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block font-medium mb-1">Price</label>
//             <input
//               type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               required
//               className="w-full border rounded-md p-2"
//             />
//           </div>
//           <div>
//             <label className="block font-medium mb-1">Category</label>
//             <input
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               required
//               className="w-full border rounded-md p-2"
//             />
//           </div>
//         </div>

//         {/* Image URL */}
//         <div>
//           <label className="block font-medium mb-1">Image URL</label>
//           <input
//             name="image"
//             value={formData.image}
//             onChange={handleChange}
//             placeholder="Enter image link"
//             className="w-full border rounded-md p-2"
//           />
//         </div>

//         {/* Available */}
//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             name="available"
//             checked={formData.available}
//             onChange={handleChange}
//           />
//           <label className="font-medium">Available</label>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
//         >
//           {loading ? "Saving..." : "Submit"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ProductForm;



import React, { useState } from "react";
import { motion } from "framer-motion";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    type: "",
    available: true,
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // text / checkbox handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // file handler
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("type", formData.type);
      data.append("available", formData.available);
      data.append("file", file);

      const res = await fetch(
        "https://restaurant-app-backend-mihf.onrender.com/api/menu/",
        {
          method: "POST",
          body: data,
        }
      );

      if (!res.ok) throw new Error("Failed to add product");

      alert("✅ Product added successfull.");

      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        type: "",
        available: true,
      });
      setFile(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 space-y-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          🍕 Add New Product
        </h2>

        {/* Row 1: Name + Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none"
              placeholder="e.g. Momo"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none"
              placeholder="e.g. 121"
            />
          </div>
        </div>

        {/* Row 2: Category + Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none"
              placeholder="e.g. Veg"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none"
            >
              <option value="">Select Type</option>
              <option value="veg">Veg 🌱</option>
              <option value="non-veg">Non-Veg 🍗</option>
            </select>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">File</label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="w-full border rounded-xl p-3 cursor-pointer"
          />
          {file && (
            <p className="text-sm text-gray-500 mt-2">
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* Available */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
            className="h-5 w-5 accent-orange-500"
          />
          <label className="font-medium text-gray-700">Available</label>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none"
            placeholder="Short description..."
          />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-orange-500 text-white py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-orange-600 transition"
        >
          {loading ? "Saving..." : "Save Product"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default ProductForm;
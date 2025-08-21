import React, { useState } from "react";
import ImageUpload from "./ImageUploader"; // adjust path if needed

const ProductForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        image: "",  // will store base64 string of image
        category: "",
        type: "",
        available: false,
    });

    const [loading, setLoading] = useState(false);

    // Handler for form inputs except image
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handler to update image base64 string
    const handleImageFileChange = (file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({
                ...prev,
                image: reader.result, // base64 string here
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Example sends all form data including base64 image string
            const res = await fetch(
                "https://restaurant-app-backend-mihf.onrender.com/api/menu/",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            if (!res.ok) throw new Error("Failed to add product");

            const data = await res.json();
            alert("Product added successfully!");
            console.log("Saved:", data);

            setFormData({
                name: "",
                description: "",
                price: "",
                image: "",
                category: "",
                type: "",

                available: false,
            });
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-scren flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 space-y-5"
            >
                <h2 className="text-2xl font-semibold text-gray-800 text-center">
                    Add New Product
                </h2>

                {/* Name */}
                <div>
                    <label className="block font-medium mb-1">Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-md p-2"
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Image Upload - left side */}
                    <div className="w-full md:w-1/2">
                        <ImageUpload
                            imageFile={formData.image}
                            setImageFile={(file) => handleImageFileChange(file)}
                        />
                    </div>

                    {/* Price + Category - right side */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <div>
                            <label className="block font-medium mb-1">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Category</label>
                            <input
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-md p-2"
                            >
                                <option value="">Select Type</option>
                                <option value="veg">Veg</option>
                                <option value="non-veg">Non-Veg</option>
                            </select>
                        </div>

                    </div>


                </div>



                {/* Description */}
                <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full border rounded-md p-2"
                    />
                </div>

                {/* Available */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="available"
                        checked={formData.available}
                        onChange={handleChange}
                    />
                    <label className="font-medium">Available</label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition"
                >
                    {loading ? "Saving..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;

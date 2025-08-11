import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ImageUploader from "@/components/admin/ImageUploader";
import Category from "../Client/Category";

const MenuItemForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    Primecategory: "",
    Category:"",
    image: null,
    isAvailable: false,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setCategories(["Veg", "Non Veg" ]);
    }, 300);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (file) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl mx-auto p-6 space-y-6 bg-white rounded-md shadow-md"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
 
   {/* Image + Category/Price */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image uploader */}
          <div className="flex-1 space-y-2">
            <Label>Upload Image</Label>
            <ImageUploader onImageSelect={handleImageSelect} />
          </div>

          {/* Price + Category */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Prime Category</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, Primecategory: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Category</Label>
              <Input
                id="Category"
                name="Category"
                type="text"
                value={formData.Category}
                onChange={handleChange}
                required
              />
            </div>

          </div>
        </div>

       

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center space-x-4">
          <Switch
            id="isAvailable"
            checked={formData.isAvailable}
            onCheckedChange={(value) =>
              setFormData((prev) => ({ ...prev, isAvailable: value }))
            }
          />
          <Label htmlFor="isAvailable">Available</Label>
        </div>

        <Button type="submit" className="w-full md:w-auto">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default MenuItemForm;

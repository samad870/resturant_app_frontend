// AdminProfileView.jsx
import React, { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const AdminProfileView = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    password: "********",
    domain: "",
    restaurantName: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Fetch data from localStorage or API
    const fetchData = () => {
      setProfileData({
        name: localStorage.getItem("userName") || "Admin User",
        email: localStorage.getItem("userEmail") || "admin@restaurant.com",
        password: "********",
        domain: localStorage.getItem("userDomain") || "Food & Beverage",
        restaurantName: localStorage.getItem("userRestaurant") || "Fine Dine Restaurant",
      });
    };
    fetchData();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getPasswordDisplay = () => {
    return showPassword ? "yourpassword123" : "********";
  };

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Profile</h1>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
          {/* Top Gradient Section */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-8 flex items-center space-x-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <span className="text-3xl font-bold text-orange-600">
                {profileData.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{profileData.name}</h2>
              <p className="text-orange-100 text-sm">{profileData.email}</p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                  {profileData.domain}
                </span>
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                  Administrator
                </span>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8 space-y-6">
            {Object.keys(profileData).map((key, idx) => (
              <div
                key={idx}
                className={`flex flex-col p-5 rounded-xl border bg-gray-50 border-gray-200`}
              >
                <label className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                  {formatLabel(key)}
                </label>

                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-gray-800">
                    {key === "password" ? getPasswordDisplay() : profileData[key]}
                  </p>

                  {/* Eye icon for password */}
                  {key === "password" && (
                    <button
                      onClick={togglePasswordVisibility}
                      className="ml-3 p-1 text-gray-500 hover:text-orange-600 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const formatLabel = (key) => {
  const labels = {
    name: "Full Name",
    email: "Email Address",
    password: "Password",
    domain: "Business Domain",
    restaurantName: "Restaurant Name",
  };
  return labels[key] || key;
};

export default AdminProfileView;

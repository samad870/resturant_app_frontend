"use client";
import React, { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const AdminProfileView = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    password: "********",
    restaurantName: "",
    qrCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // ✅ Get data from localStorage (LoginPage me set hua)
    setProfileData({
      name: localStorage.getItem("userName") || "Admin",
      email: localStorage.getItem("userEmail") || "Not Available",
      password: localStorage.getItem("userPassword") || "********",
      restaurantName: localStorage.getItem("restaurantName") || "No Restaurant Name",
      qrCode: localStorage.getItem("qrCode") || "",
    });
  }, []);

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Admin Profile
        </h1>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
          {/* Top Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-8 flex items-center space-x-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <span className="text-3xl font-bold text-orange-600">
                {profileData.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">
                {profileData.name}
              </h2>
              <p className="text-orange-100 text-sm">{profileData.email}</p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                  {profileData.restaurantName}
                </span>
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                  Administrator
                </span>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8 space-y-6">
            <ProfileField label="Full Name" value={profileData.name} />
            <ProfileField label="Email Address" value={profileData.email} />
            <ProfileField
              label="Password"
              value={showPassword ? profileData.password : "********"}
              isPassword
              togglePassword={togglePassword}
              showPassword={showPassword}
            />
            <ProfileField
              label="Restaurant Name"
              value={profileData.restaurantName}
            />

            {profileData.qrCode && (
              <div className="flex flex-col p-5 rounded-xl border bg-gray-50 border-gray-200 items-center">
                <label className="text-sm font-medium text-gray-600 mb-2">
                  QR Code
                </label>
                <img
                  src={profileData.qrCode}
                  alt="QR Code"
                  className="w-40 h-40 object-contain border border-orange-200 rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({
  label,
  value,
  isPassword,
  togglePassword,
  showPassword,
}) => (
  <div className="flex flex-col p-5 rounded-xl border bg-gray-50 border-gray-200">
    <label className="text-sm font-medium text-gray-600 mb-2">{label}</label>
    <div className="flex items-center justify-between break-all">
      <p className="text-lg font-semibold text-gray-800">{value || "N/A"}</p>
      {isPassword && (
        <button
          onClick={togglePassword}
          className="ml-3 p-1 text-gray-500 hover:text-orange-600 transition-colors duration-200"
        >
          {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
        </button>
      )}
    </div>
  </div>
);

export default AdminProfileView;

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProfileData({
        name: localStorage.getItem("userName") || "Admin User",
        email: localStorage.getItem("userEmail") || "admin@example.com",
        password: localStorage.getItem("userPassword") || "********",
        restaurantName: localStorage.getItem("restaurantName") || "My Restaurant",
        qrCode: localStorage.getItem("qrCode") || "",
      });
      setLoading(false);
    }, 500);
  }, []);

  const togglePassword = () => setShowPassword(!showPassword);

  const downloadQRCode = () => {
    if (profileData.qrCode) {
      const link = document.createElement('a');
      link.href = profileData.qrCode;
      link.download = 'restaurant-qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header - Removed description */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Admin Profile
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {/* Profile Header with Gradient */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-white">
                  <span className="text-4xl font-bold text-orange-600">
                    {profileData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                {/* Online status removed */}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {profileData.name}
                </h2>
                <p className="text-orange-100 text-lg mb-4">{profileData.email}</p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="bg-white/20 text-white text-sm px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm">
                    🏨 {profileData.restaurantName}
                  </span>
                  {/* <span className="bg-white/20 text-white text-sm px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm">
                    👑 Administrator
                  </span> */}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <span className="text-orange-500">👤</span>
                  Personal Information
                </h3>
                
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
                
                <ProfileField
                  label="Password"
                  value={showPassword ? profileData.password : "••••••••"}
                  isPassword
                  togglePassword={togglePassword}
                  showPassword={showPassword}
                  icon="🔒"
                />
              </div>

              {/* Restaurant Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <span className="text-orange-500">🏨</span>
                  Restaurant Information
                </h3>
                
                <ProfileField
                  label="Restaurant Name"
                  value={profileData.restaurantName}
                  icon="🏨"
                />

                {/* QR Code Section */}
                {profileData.qrCode && (
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        {/* <span className="text-orange-500 text-xl">📱</span> */}
                        <h4 className="text-lg font-bold text-gray-900">Tap N Order</h4>
                      </div>
                      
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 inline-block">
                        <img
                          src={profileData.qrCode}
                          alt="QR Code"
                          className="w-48 h-48 object-contain"
                        />
                      </div>
                      
                      {/* <p className="text-gray-600 text-sm mt-4">
                        Tap n Order
                      </p> */}
                      
                      <div className="flex gap-3 justify-center mt-4">
                        <button 
                          onClick={downloadQRCode}
                          className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
                        >
                          <span>📥</span>
                          Download QR
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
  icon
}) => (
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
      
      {isPassword && (
        <button
          onClick={togglePassword}
          className="ml-3 p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors duration-200"
        >
          {showPassword ? 
            <EyeSlashIcon className="w-5 h-5" /> : 
            <EyeIcon className="w-5 h-5" />
          }
        </button>
      )}
    </div>
  </div>
);

export default AdminProfileView;
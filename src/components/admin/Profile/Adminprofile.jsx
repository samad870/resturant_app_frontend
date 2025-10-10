import React from "react";

const Adminprofile = () => {
  // Static Data (temporary)
  const profileData = {
    name: "samad",
    email: "samad@gmail.com",
    password: "********",
    domain: "Food Delivery Management",
    restaurantName: "Tasty Bites Restaurant",
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        {/* <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Admin Profile</h1>
          <p className="text-gray-500 mt-2">
            Manage your account and business information
          </p>
        </div> */}

        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200">
          {/* Top Section */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-6 py-8 flex items-center space-x-5">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner">
              <span className="text-3xl font-bold text-gray-700">
                {profileData.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {profileData.name}
              </h2>
              <p className="text-gray-300 text-sm">{profileData.email}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 space-y-5">
            {[
              {
                label: "Full Name",
                value: profileData.name,
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                ),
              },
              {
                label: "Email Address",
                value: profileData.email,
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                ),
              },
              {
                label: "Password",
                value: profileData.password,
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                ),
              },
              {
                label: "Business Domain",
                value: profileData.domain,
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                  />
                ),
              },
              {
                label: "Restaurant Name",
                value: profileData.restaurantName,
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                ),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {item.icon}
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      {item.label}
                    </p>
                    <p className="text-base font-semibold text-gray-800">
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adminprofile;

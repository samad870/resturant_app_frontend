import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationModal } from "../common/notificationModal";
import { useLoginSuperAdminMutation } from "@/redux/superAdminRedux/superAdminAPI";
import { useDispatch } from "react-redux";
import { setSuperAdminData } from "@/redux/superAdminRedux/superAdminSlice";

const SuperLoginPage = () => {
  const [loginSuperAdmin, { data, error, isLoading, isSuccess }] =
    useLoginSuperAdminMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginSuperAdmin(formData).unwrap();
      dispatch(setSuperAdminData(res));
    } catch (err) {
      setNotification({ show: true, message: err.message, type: "error" });
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      setNotification({ show: true, message: "Login successful!", type: "success" });
      setTimeout(() => navigate("/super-admin"), 1000);
    }
    if (error) {
      setNotification({ show: true, message: error?.data?.message || "Login failed", type: "error" });
    }
  }, [isSuccess, error]);

  return (
    <>
      <NotificationModal notification={notification} onClose={() => setNotification({ show: false })} />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side */}
            <div className="lg:w-1/2 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center p-8 lg:p-12">
              <div className="text-center text-white">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">Super Admin</h1>
                <p className="text-lg lg:text-xl opacity-90">Restaurant Management System</p>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">Super Admin Login</h2>
                  <p className="text-gray-600 mt-2">Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange} // ✅ Added
                        className="pl-10 h-12 text-lg border-gray-300 focus:border-orange-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange} // ✅ Added
                        className="pl-10 h-12 text-lg border-gray-300 focus:border-orange-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="text-center mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Only users with <strong>superadmin</strong> role can access this panel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperLoginPage;

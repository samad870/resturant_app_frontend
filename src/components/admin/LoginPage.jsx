import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "@/redux/adminRedux/adminAPI";
import { setCredentials, setError, clearError } from "@/redux/adminRedux/adminSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Use RTK Query mutation
  const [login, { isLoading }] = useLoginMutation();
  
  // Get error from Redux store
  const { error } = useSelector((state) => state.admin);

  useEffect(() => {
    // Clear any existing errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    try {
      // Use RTK Query mutation for login
      const result = await login({ email, password }).unwrap();
      
      if (result.token) {
        // Dispatch to Redux store
        dispatch(setCredentials({
          token: result.token,
          name: result.name || "Admin",
          email: result.email || email,
          restaurantName: result.restaurantName || "",
          qrCode: result.qrCode || ""
        }));

        // Also store in localStorage for persistence
        localStorage.setItem("token", result.token);
        localStorage.setItem("userName", result.name || "Admin");
        localStorage.setItem("userEmail", result.email || email);
        localStorage.setItem("restaurantName", result.restaurantName || "");
        localStorage.setItem("qrCode", result.qrCode || "");
        localStorage.setItem("userPassword", password);

        navigate("/admin", { replace: true });
      }
    } catch (err) {
      // Handle error from RTK Query
      const errorMessage = err?.data?.message || "Login failed, please try again.";
      dispatch(setError(errorMessage));
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src="https://is3-ssl.mzstatic.com/image/thumb/Purple69/v4/6d/48/d6/6d48d6c3-25ee-b839-056c-0b4ebb271d8c/source/512x512bb.jpg"
          alt="Login Background"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center p-6 bg-white relative">
        <div className="absolute inset-0 md:hidden">
          <img
            src="https://is3-ssl.mzstatic.com/image/thumb/Purple69/v4/6d/48/d6/6d48d6c3-25ee-b839-056c-0b4ebb271d8c/source/512x512bb.jpg"
            alt="Login Background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <Card className="relative z-10 w-full max-w-md shadow-2xl bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-gray-800">
              Welcome Back
            </CardTitle>
            <p className="text-center text-gray-500 text-sm">
              Please login to continue
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-md"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
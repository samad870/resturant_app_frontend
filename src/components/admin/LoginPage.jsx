/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { VITE_API_BASE_URL } from "../../../env.config";
// import baseURL from "../../config";
import config from "../../config";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ Use local proxy
      // const baseURL = ; // proxy
      // `${config.BASE_URL}/api/products`
      const response = await fetch(`${config.BASE_URL}/api/auth/login`,
         {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name || "Admin");
        localStorage.setItem("userEmail", data.email || email);
        localStorage.setItem("restaurantName", data.restaurantName || "");
        localStorage.setItem("qrCode", data.qrCode || "");
        localStorage.setItem("userPassword", password);

        navigate("/admin", { replace: true });
      } else {
        setError(data.message || "Login failed, please try again.");
      }
    } catch (err) {
      setError("Something went wrong, please try again later.");
    } finally {
      setLoading(false);
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
                disabled={loading}
                className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-md"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "https://restaurant-app-backend-mihf.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // 👇 backend kya expect karta hai check karo
          body: JSON.stringify({
            email: email.trim(),
            password: password.trim(),
          }),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok && data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user?.name || "Admin");
        localStorage.setItem("userEmail", data.user?.email || email);
        localStorage.setItem("userAvatar", data.user?.avatar || "");

        setSuccess("Login successful!");
        setTimeout(() => navigate("/admin", { replace: true }), 1000);
      } else {
        setError(data?.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src="https://is3-ssl.mzstatic.com/image/thumb/Purple69/v4/6d/48/d6/6d48d6c3-25ee-b839-056c-0b4ebb271d8c/source/512x512bb.jpg"
          alt="Login Background"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6 bg-gray-50 relative">
        <Card className="relative z-10 w-full max-w-md shadow-xl bg-white">
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
                  className="focus:ring-2 focus:ring-gray-500"
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
                  className="focus:ring-2 focus:ring-gray-500"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

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

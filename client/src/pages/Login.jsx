import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username); 

      toast.success("Login successful!");
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-200 via-white to-blue-100 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse top-0 left-0"></div>
      <div className="absolute w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse bottom-0 right-0"></div>

      <div className="z-10 bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <h3 className="text-md ">Email Address<span className="text-red-500">*</span></h3>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <h3 className="text-md">Password<span className="text-red-500">*</span></h3>
          <input
            type="password"
            name="password"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-all font-medium flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="text-sm text-center mt-4">
          <Link to="/forgot-password" className="text-indigo-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
// This code defines a Login component that allows users to log in with their email and password.
// It uses React hooks for state management and handles form submission to authenticate the user.
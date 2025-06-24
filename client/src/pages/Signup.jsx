import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../apiConfig";


export default function Signup() {
  const navigate = useNavigate();
  const [step, seStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    otp: "",
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "username") {
      if (value.trim().length < 3) {
        setIsUsernameAvailable(null);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/check-username/${value}`);
        const data = await res.json();
        setIsUsernameAvailable(data.available);
      } catch (err) {
        console.error("Error checking username availability", err);
        setIsUsernameAvailable(null);
      }
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to send OTP");
        return;
      }
      toast.success("OTP sent to your email!");
      seStep("otp");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      toast.success("Registration successful! Redirecting to dashboard...");
      navigate("/dashboard");
    } catch (error) {
      console.log("Registration error:", error);
      toast.error("Registration failed. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-200 via-white to-cyan-100 relative overflow-hidden px-4">
      <div className="absolute -z-10 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse top-[-100px] left-[-100px]"></div>
      <div className="absolute -z-10 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse bottom-[-100px] right-[-100px]"></div>

      <div className="relative z-10 bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Sign up</h2>

        <form onSubmit={step === "form" ? handleSendOtp : handleVerifyAndRegister}>
          <div className="space-y-4">
            {step === "form" && (
              <>
                <h3 className="text-md">Name<span className="text-red-500">*</span></h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />

                <h3 className="text-md">Email Address<span className="text-red-500">*</span></h3>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />

                <h3 className="text-md">Enter Username<span className="text-red-500">*</span></h3>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your Username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isUsernameAvailable === false ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-500'}`}
                  required
                />
                {isUsernameAvailable === false && (
                  <p className="text-sm text-red-500">Username already taken</p>
                )}
                {isUsernameAvailable === true && (
                  <p className="text-sm text-green-600">Username is available</p>
                )}

                <h3 className="text-md">Password<span className="text-red-500">*</span></h3>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </>
            )}

            {step === "otp" && (
              <div>
                <h3 className="text-md">OTP<span className="text-red-500">*</span></h3>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all font-medium flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              ) : (
                step === "form" ? "Send OTP" : "Verify and Register"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { state } = useLocation(); // contains email from previous screen
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state?.email, otp, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset");

      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4 text-center">Reset Password</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <h3 className="text-md">OTP<span className="text-red-500">*</span></h3>
        <input
          type="text"
          required
          placeholder="Enter the OTP"
          className="w-full border p-2 rounded"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <h3 className="text-md">New Password<span className="text-red-500">*</span></h3>
        <input
          type="password"
          required
          placeholder="Enter new password"
          className="w-full border p-2 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (<div className="loader"></div>) : ("Reset Password")}
        </button>
      </form>
    </div>
  );
}

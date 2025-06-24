import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Something went wrong");

      toast.success("OTP sent to your email");
      navigate("/reset-password", {state: {email}}); // Pass email to reset password page
    } catch (err) {
      toast.error("Server error");
    }
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="loader"></div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <div className="max-w-md w-full bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold text-center text-indigo-600 mb-4">
            Reset Password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-md">Email Address<span className="text-red-500">*</span></h3>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              disabled={loading}
            >
              Send OTP
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

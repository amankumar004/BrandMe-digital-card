import { useNavigate } from "react-router-dom";
import Button from "../components/ui/button";
import { useEffect, useState } from "react";
import HeroSectionImg from "../assets/your digital card.png";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleCreateCardClick = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-white via-slate-200 to-indigo-100">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-20 gap-10">
        {/* Left Text Content */}
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-700 leading-tight mb-6">
            Create Your Digital Identity with <span className="text-neutral-800">BrandMe</span>
          </h2>
          <p className="text-gray-700 text-lg mb-8">
            Design and share your professional digital card in seconds. Perfect for networking, freelancing, and showcasing your online presence.
          </p>

          <Button
            onClick={handleCreateCardClick}
            className="px-6 py-3 text-lg border border-indigo-500 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Create My Card
          </Button>
        </div>

        {/* Right Image */}
        <div className="w-full max-w-md">
          <img
            src={HeroSectionImg}
            alt="Digital Card Preview"
            className="w-full drop-shadow-2xl rounded-xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="text-center px-6 py-16 bg-stone-100">
        <h3 className="text-3xl font-bold text-indigo-700 mb-6">Why BrandMe?</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-indigo-100 p-6 rounded-xl shadow-sm">
            <h4 className="text-xl font-semibold mb-2">No Code Setup</h4>
            <p className="text-gray-600">Create your card without any technical hassle. Just fill your details and you’re done!</p>
          </div>
          <div className="bg-indigo-100 p-6 rounded-xl shadow-sm">
            <h4 className="text-xl font-semibold mb-2">Professional Look</h4>
            <p className="text-gray-600">Impress your clients and recruiters with a sleek, modern digital card design.</p>
          </div>
          <div className="bg-indigo-100 p-6 rounded-xl shadow-sm">
            <h4 className="text-xl font-semibold mb-2">Share Anywhere</h4>
            <p className="text-gray-600">Your public profile is easily shareable via link or QR code.</p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="text-center px-6 py-16 bg-indigo-50">
        <h3 className="text-3xl font-bold text-indigo-700 mb-6">Get Started in 3 Simple Steps</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-4xl font-bold text-indigo-600 mb-2">1</div>
            <h4 className="text-xl font-semibold mb-2">Sign Up</h4>
            <p className="text-gray-600">Create your BrandMe account in seconds with just your name, email, and password.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-4xl font-bold text-indigo-600 mb-2">2</div>
            <h4 className="text-xl font-semibold mb-2">Edit Your Profile</h4>
            <p className="text-gray-600">Fill out your title, bio, contact info, and social links to personalize your card.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-4xl font-bold text-indigo-600 mb-2">3</div>
            <h4 className="text-xl font-semibold mb-2">Preview & Share</h4>
            <p className="text-gray-600">View your digital card and share it via public link or QR code instantly.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 py-6">
        © {new Date().getFullYear()} BrandMe. All rights reserved.
        <div>Made with ❤️ by Aman Kumar</div>
      </footer>
    </div>
  );
}

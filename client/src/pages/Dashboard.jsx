import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { QRCodeCanvas } from "qrcode.react";
import API_BASE_URL from "../apiConfig";

import {
  FaGlobe,
  FaLinkedin,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";
import { FaSquarePhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const bgImages = [
    "/images/bg1.png",
    "/images/bg2.png",
    "/images/bg3.png",
    "/images/bg4.png",
    "/images/bg5.png",
  ];
  const [bgImage] = useState(bgImages[Math.floor(Math.random() * bgImages.length)]);


  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser(data);
    } catch (err) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const qrRef = useRef();

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl animate-pulse">Loading profile...</p>
      </div>
    );
  }

  const publicUrl = `https://brandme-digital-card.vercel.app/card/${user.username}`; // during dev

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gray-100">
      <div className="w-full max-w-4xl bg-white text-black rounded-3xl shadow-2xl gap-2 overflow-hidden flex flex-col md:flex-row">
        {/* Avatar */}
        <div className="md:w-1/3 flex items-center justify-center p-6 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}>
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-36 h-36 rounded-full border-4 border-white shadow-md"
          />
        </div>

        {/* Info Section */}
        <div className="md:w-2/3 p-6 space-y-2">
          <h2 className="text-2xl font-bold text-indigo-800">{user.name}</h2>
          {/* <p className="text-sm text-gray-500">@{user.username}</p> */}
          {user.title && (
            <p className="text-lg font-medium text-indigo-600">{user.title}</p>
          )}
          {user.bio && <p className="text-sm text-gray-600">{user.bio}</p>}

          <p className="text-md text-gray-700">
            <MdEmail className="inline mr-1 text-indigo-500 text-2xl" />
            {user.contact?.email || user.email}
          </p>

          {/* Contact Info */}
          <div className="mt-4 space-y-2">
            {user.contact?.phone && (
              <p className="flex items-center text-sm text-gray-700">
                <FaSquarePhone className="mr-2 text-indigo-500 text-2xl" />
                {user.contact.phone}
              </p>
            )}
            {user.contact?.website && (
              <p className="flex items-center text-md text-gray-700">
                <FaGlobe className="mr-2 text-indigo-500 text-2xl" />
                <a
                  href={user.contact.website}
                  target="_blank"
                  rel="noreferrer"
                  className=" text-black hover:text-indigo-600 transition"
                >
                  {user.contact.website}
                </a>
              </p>
            )}
          </div>

          {/* Socials - moved into its own block with extra margin */}
          <div className="mt-8">
            <h3 className="text-md font-semibold text-gray-600 mb-2">Find me on</h3>
            <div className="flex flex-wrap gap-4">
              {user.socials?.linkedin && (
                <a href={user.socials.linkedin} target="_blank" rel="noreferrer">
                  <FaLinkedin className="text-2xl text-blue-700 hover:scale-110 transition" />
                </a>
              )}
              {user.socials?.twitter && (
                <a href={user.socials.twitter} target="_blank" rel="noreferrer">
                  <FaTwitter className="text-2xl text-sky-400 hover:scale-110 transition" />
                </a>
              )}
              {user.socials?.github && (
                <a href={user.socials.github} target="_blank" rel="noreferrer">
                  <FaGithub className="text-2xl hover:scale-110 transition" />
                </a>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Edit Button */}
      <button
        onClick={() => navigate("/edit-profile")}
        className="mt-8 px-6 py-2 bg-white text-indigo-700 font-semibold rounded-full shadow hover:bg-indigo-100 transition"
      >
        Edit Profile
      </button>
      {/* Share Section */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="text-gray-600 font-medium">Share your digital card:</p>

        <div className="flex gap-3 flex-wrap justify-center">
          {/* Copy Link */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(publicUrl);
              toast.success("Link copied to clipboard!");
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
          >
            Copy Link
          </button>

          {/* WhatsApp Share */}
          <a
            href={`https://wa.me/?text=Check out my digital card: ${publicUrl}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
          >
            Share on WhatsApp
          </a>

          {/* Email Share */}
          <a
            href={`mailto:?subject=My Digital Business Card&body=Check out my card: ${publicUrl}`}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          >
            Share via Email
          </a>
        </div>
        {/* QR Code */}
        <div className="mt-6 flex flex-col items-center" ref={qrRef}>
          <p className="text-gray-600 font-medium mb-2">Scan QR to view your card</p>
          <QRCodeCanvas
            value={publicUrl}
            size={160}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin={true}
          />
        </div>

      </div>

    </div>
  );
}

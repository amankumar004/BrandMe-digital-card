import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaGlobe,
  FaLinkedin,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";
import { FaSquarePhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { MdQrCode2 } from "react-icons/md";
import { QRCodeCanvas } from "qrcode.react";
import API_BASE_URL from "../apiConfig";

export default function PublicCard() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const qrRef = useRef();

  const bgImages = [
    "/images/bg1.png",
    "/images/bg2.png",
    "/images/bg3.png",
    "/images/bg4.png",
    "/images/bg5.png",
  ];
  const [bgImage] = useState(bgImages[Math.floor(Math.random() * bgImages.length)]);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`${API_BASE_URL}/api/profile/public/${username}`);
      const data = await res.json();
      if (res.ok) setUser(data);
    }
    fetchUser();
  }, [username]);

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${username}-qr.png`;
    link.click();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl animate-pulse">Loading public card...</p>
      </div>
    );
  }

  const publicUrl = `http://localhost:3000/card/${username}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gray-100">
      <div className="w-full max-w-4xl bg-white text-black rounded-3xl shadow-2xl gap-2 overflow-hidden flex flex-col md:flex-row">
        {/* Avatar Section */}
        <div
          className="md:w-1/3 flex items-center justify-center p-6 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-36 h-36 rounded-full border-4 border-white shadow-md"
          />
        </div>

        {/* Info Section */}
        <div className="md:w-2/3 p-6 space-y-2">
          <h2 className="text-2xl font-bold text-indigo-800">{user.name}</h2>
          {user.title && <p className="text-lg font-medium text-indigo-600">{user.title}</p>}
          {user.bio && <p className="text-sm text-gray-600">{user.bio}</p>}

          <p className="text-md text-gray-700">
            <MdEmail className="inline mr-1 text-indigo-500 text-2xl" />
            {user.email}
          </p>

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
                  className="text-black hover:text-indigo-600 transition"
                >
                  {user.contact.website}
                </a>
              </p>
            )}
          </div>

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

      {/* QR Code Card */}
      <div
        ref={qrRef}
        className="mt-8 bg-white rounded-xl shadow-md px-6 py-4 flex flex-col items-center text-center"
      >
        <div className="flex items-center gap-2 mb-2 text-gray-700 font-medium">
          <MdQrCode2 className="text-xl text-indigo-500" />
          <span>Scan QR to view this card</span>
        </div>
        <QRCodeCanvas value={publicUrl} size={160} />
        <button
          onClick={handleDownloadQR}
          className="mt-3 px-4 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full hover:bg-indigo-200 transition"
        >
          Download QR
        </button>
      </div>
    </div>
  );
}

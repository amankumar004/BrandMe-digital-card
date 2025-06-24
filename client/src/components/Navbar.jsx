import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../components/ui/button";
import toast from "react-hot-toast";
import Logo from "../assets/bm-removebg-preview.png";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username) {
      setUser({ username });
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 shadow bg-stone-100 sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center h-10">
        <img
          src={Logo}
          alt="BrandMe Logo"
          className="h-full object-contain max-h-16"
          style={{ maxWidth: "150px" }} // You can tweak this value
        />
      </Link>


      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-600 font-medium">Hi, {user.username}</span>
            <Link to="/dashboard">
              <Button className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2">Go to Dashboard</Button>
            </Link>
            <Button onClick={handleLogout} className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2">Logout</Button>
          </>
        ) : (
          <>
            {location.pathname !== "/login" && (
              <Link to="/login">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5">Login</Button>
              </Link>
            )}
            {location.pathname !== "/signup" && (
              <Link to="/signup">
                <Button className="border border-indigo-500 text-indigo-500 px-4 py-2 hover:bg-indigo-50">Sign Up</Button>
              </Link>
            )}
          </>
        )}
      </nav>

      {/* Hamburger for Mobile */}
      <div className="md:hidden relative">
        <button
          onClick={toggleMenu}
          className="focus:outline-none text-indigo-600 text-2xl"
        >
          ☰
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg w-40 flex flex-col p-4 z-50 space-y-2">
            {user ? (
              <>
                <span className="text-gray-600 font-medium">{user.username}</span>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2">Dashboard</Button>
                </Link>
                <Button onClick={handleLogout} className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2">Logout</Button>
              </>
            ) : (
              <>
                {location.pathname !== "/login" && (
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5">Login</Button>
                  </Link>
                )}
                {location.pathname !== "/signup" && (
                  <Link to="/signup" onClick={() => setMenuOpen(false)}>
                    <Button className="w-full border border-indigo-500 text-indigo-500 px-4 py-2 hover:bg-indigo-50">Sign Up</Button>
                  </Link>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

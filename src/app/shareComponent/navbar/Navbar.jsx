"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaBook,
  FaTachometerAlt,
  FaPhoneAlt,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus,
  FaTimes,
  FaSignOutAlt,
  FaUserCircle,
  FaCog,
  FaGraduationCap,
  FaBell,
  FaSearch, // Though not used, keeping it as it was imported
} from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";
import brandLogo from '../../../app/assets/logobrand.png';
import Image from "next/image";

// Define the custom active color
const ACTIVE_COLOR = "#FFC400";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const dropdownRef = useRef(null);

  // --- Data and Constants ---
  const baseNavLinks = [
    { name: "Home", href: "/", icon: <FaHome /> },
    { name: "Courses", href: "/courses", icon: <FaBook /> },
    { name: "Instructors", href: "/teachers", icon: <GiTeacher /> },
    { name: "Dashboard", href: "/dashboard", icon: <FaTachometerAlt />, authRequired: true }, // Added authRequired flag
    { name: "Contact", href: "/contact", icon: <FaPhoneAlt /> },
    { name: "Community", href: "/community", icon: <FaInfoCircle /> }, // Capitalized for better appearance
  ];

  // Conditional filtering of navLinks
  const navLinks = user
    ? baseNavLinks
    : baseNavLinks.filter((link) => !link.authRequired); // Filter out dashboard if no user

  const firstName = user?.displayName ? user.displayName.split(" ")[0] : "User";

  // --- Handlers ---
  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully ✨");
      setIsDropdownOpen(false);
    } catch (error) {
      toast.error("Logout failed!");
      console.error(error);
    }
  };

  // --- Effects ---
  // 1. Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // 3. Prevent scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  // 4. Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // --- Helper Components for Cleanliness (Inline for simplicity) ---

  const DesktopNavLink = ({ link }) => (
    <li>
      <Link
        href={link.href}
        className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-medium transition-all duration-300 group ${
          pathname === link.href
            ? "text-white shadow-lg shadow-amber-500/30"
            : "text-gray-600 hover:bg-gray-100/50 hover:text-amber-600"
        }`}
        style={pathname === link.href ? { backgroundColor: ACTIVE_COLOR, color: 'white' } : {}} // Apply active color
      >
        <span className={`transition-transform duration-300 ${
          pathname === link.href ? "scale-110" : "group-hover:scale-110"
        }`}>
          {link.icon}
        </span>
        {link.name}
      </Link>
    </li>
  );

  const MobileNavLink = ({ link }) => (
    <li>
      <Link
        href={link.href}
        className={`flex items-center gap-4 p-4 rounded-2xl font-medium transition-all duration-300 ${
          pathname === link.href
            ? "text-white shadow-lg shadow-amber-500/30"
            : "text-gray-600 hover:bg-gray-100/50 hover:text-amber-600"
        }`}
        style={pathname === link.href ? { backgroundColor: ACTIVE_COLOR, color: 'white' } : {}} // Apply active color
        onClick={() => setIsOpen(false)}
      >
        <span className={`text-lg ${pathname === link.href ? "text-white" : "text-gray-400"}`}>
          {link.icon}
        </span>
        <span>{link.name}</span>
      </Link>
    </li>
  );
  
  // --- Main Render ---
  return (
    <>
      <nav className={`navbar sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-100/50"
          : "bg-white/90 backdrop-blur-lg shadow-lg"
      } p-4 max-w-[1400px] mx-auto`}> {/* Added max-width and margin auto for better layout */}

        {/* ======================= Navbar Start (Mobile Button & Logo) ======================= */}
        <div className="navbar-start">
          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-ghost lg:hidden text-gray-700 hover:bg-gray-100/50 rounded-2xl"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          <Link
            href="/"
            className="btn btn-ghost text-xl font-bold hover:scale-105 transition-transform"
          >
            <Image src={brandLogo} alt="Brand Logo" className="w-20 h-auto object-contain" priority />
          </Link>
        </div>

        {/* ======================= Navbar Center (Desktop Navigation) ======================= */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            {navLinks.map((link) => (
              <DesktopNavLink key={link.name} link={link} />
            ))}
          </ul>
        </div>

        {/* ======================= Navbar End (Desktop/Mobile Actions) ======================= */}
        <div className="navbar-end gap-3 flex items-center">
          
          {user && (
            // Search Button for All
            <button className="btn btn-ghost btn-circle text-gray-600 hover:text-blue-600 hover:bg-gray-100/50 rounded-2xl">
              <FaSearch className="text-lg" />
            </button>
          )}

          {/* User Actions (Desktop) */}
          {user ? (
            <>
              {/* Desktop Notifications (Hidden on mobile) */}
              <button className="btn btn-ghost btn-circle relative text-gray-600 hover:text-blue-600 hover:bg-gray-100/50 rounded-2xl hidden lg:block">
                <FaBell className="text-lg" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Desktop User Avatar & Dropdown */}
              <div className="relative hidden lg:block" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-100/50 transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={
                        user.photoURL ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
                      }
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full border-2 border-white shadow-lg group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-sm font-semibold text-gray-800">{firstName}</p>
                    {/* <p className="text-xs text-gray-500">Premium</p> */}
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden animate-fadeIn">
                    {/* User Info */}
                    <div className="p-6 border-b border-gray-100/50" style={{ backgroundColor: `${ACTIVE_COLOR}15` }}>
                      <div className="flex items-center gap-4">
                        <img
                          src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=48&h=48&fit=crop&crop=face"}
                          alt="User Avatar"
                          className="w-14 h-14 rounded-full border-2 border-white shadow-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 text-lg truncate">
                            {user.displayName || "Welcome Back!"}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span 
                              className="px-2 py-1 text-white text-xs rounded-full font-medium"
                              style={{ backgroundColor: ACTIVE_COLOR, boxShadow: `0 2px 4px ${ACTIVE_COLOR}40` }}
                            >
                              {user?.premium ? "PRO" : "FREE"}
                            </span>
                            {/* <span className="text-xs text-gray-500">{user?.role}</span> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="p-4 border-b border-gray-100/50">
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/dashboard"
                          className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-all group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaTachometerAlt className="text-lg mb-1 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-medium">Dashboard</span>
                        </Link>
                        <Link
                          href="/profile"
                          className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-purple-50 hover:text-purple-600 transition-all group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaUserCircle className="text-lg mb-1 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-medium">Profile</span>
                        </Link>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaCog className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                        <span className="font-medium">Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full text-left transition-all group mt-1"
                      >
                        <FaSignOutAlt className="group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile User Avatar & Dropdown (Using DaisyUI dropdown on mobile) */}
              <div className="dropdown dropdown-end lg:hidden">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full border-2 border-white shadow-lg">
                    <img
                      alt="User avatar"
                      src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-white/95 backdrop-blur-xl rounded-2xl w-64 border border-gray-100/50"
                >
                  {/* Mobile Dropdown User Info */}
                  <li className="p-4 border-b border-gray-100/50" style={{ backgroundColor: `${ACTIVE_COLOR}15` }}>
                    <div className="flex items-center gap-3">
                      <img
                        src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"}
                        className="w-10 h-10 rounded-full"
                        alt="User"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{firstName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </li>
                  <li><Link href="/dashboard"><FaTachometerAlt />Dashboard</Link></li>
                  <li><Link href="/profile"><FaUserCircle />Profile</Link></li>
                  <li><Link href="/settings"><FaCog />Settings</Link></li>
                  <li><button onClick={handleLogout} className="text-red-600"><FaSignOutAlt />Logout</button></li>
                </ul>
              </div>
            </>
          ) : (
            // Auth Buttons for non-logged in users (Desktop)
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/login"
                className="btn btn-ghost text-gray-600 hover:text-amber-600 hover:bg-gray-100/50 rounded-2xl font-medium transition-all"
              >
                <FaSignInAlt className="mr-2" />
                Login
              </Link>
              <Link
                href="/signUp"
                className="btn text-white hover:opacity-90 rounded-2xl font-medium shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
                style={{ backgroundColor: ACTIVE_COLOR }}
              >
                <FaUserPlus className="mr-2" />
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Login Icon (Replaces mobile avatar for non-user) */}
          {!user && (
            <Link href="/login" className="btn btn-ghost btn-circle text-gray-600 lg:hidden">
              <FaSignInAlt className="text-lg" />
            </Link>
          )}

        </div>
      </nav>

      {/* ======================= Mobile Drawer ======================= */}

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Mobile Drawer Content */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-500 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100/50">
          <Link
            href="/"
            className="text-2xl font-bold bg-clip-text text-transparent"
            onClick={() => setIsOpen(false)}
            style={{ backgroundImage: `linear-gradient(to right, ${ACTIVE_COLOR}, #FF8C00)` }}
          >
            <FaGraduationCap className="inline mr-2" style={{ color: ACTIVE_COLOR }} />
            EduLMS
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="btn btn-ghost btn-circle text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 rounded-2xl"
            aria-label="Close menu"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Drawer Content Body */}
        <div className="p-6 h-[calc(100vh-80px)] overflow-y-auto">
          
          {/* User Profile Section (Mobile Drawer) */}
          {user && (
            <div className="mb-8 p-4 rounded-2xl border border-gray-100/50" style={{ backgroundColor: `${ACTIVE_COLOR}15` }}>
              <div className="flex items-center gap-4">
                <img
                  src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=48&h=48&fit=crop&crop=face"}
                  className="w-14 h-14 rounded-full border-2 border-white shadow-lg"
                  alt="User"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-lg">{firstName}</h3>
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span 
                      className="px-2 py-1 text-white text-xs rounded-full font-medium"
                      style={{ backgroundColor: ACTIVE_COLOR }}
                    >
                      {/* {user?.premium ? "PRO" : "FREE"} */}
                    </span>
                    {/* <span className="text-xs text-gray-500">Student</span> */}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <ul className="space-y-2 mb-8">
            {navLinks.map((link) => (
              <MobileNavLink key={link.name} link={link} />
            ))}
          </ul>

          {/* Auth Section */}
          {user ? (
            <div className="space-y-3">
              <Link
                href="/profile"
                className="btn w-full bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-2xl font-medium transition-all"
                onClick={() => setIsOpen(false)}
              >
                <FaUserCircle className="mr-2" />
                View Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="btn w-full bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 rounded-2xl font-medium shadow-lg shadow-red-500/25"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                href="/login"
                className="btn w-full bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-2xl font-medium transition-all"
                onClick={() => setIsOpen(false)}
              >
                <FaSignInAlt className="mr-2" />
                Login
              </Link>
              <Link
                href="/signUp"
                className="btn w-full text-white hover:opacity-90 rounded-2xl font-medium shadow-lg shadow-amber-500/25"
                style={{ backgroundColor: ACTIVE_COLOR }}
                onClick={() => setIsOpen(false)}
              >
                <FaUserPlus className="mr-2" />
                Get Started
              </Link>
            </div>
          )}

          {/* Footer Section */}
          <div className="mt-8 p-4 rounded-2xl border border-gray-100/50" style={{ backgroundColor: `${ACTIVE_COLOR}15` }}>
            <p className="text-sm text-gray-700 text-center font-medium">
              🚀 Start your learning journey today!
            </p>
            <p className="text-xs text-gray-500 text-center mt-1">
              Access 1000+ courses anytime
            </p>
          </div>
        </div>
      </div>

      {/* Custom Animations (Kept from original) */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
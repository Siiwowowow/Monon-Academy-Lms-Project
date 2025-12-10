"use client";
import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
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
<<<<<<< HEAD
  FaSearch,
  FaUserShield,
  FaUserTie,
  FaUserGraduate,
  FaCrown,
=======
 
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b
} from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { MdVerified, MdAdminPanelSettings } from "react-icons/md";
import { AuthContext } from "@/context/AuthContext";
<<<<<<< HEAD
import useRole from "@/hooks/useRole";
import brandLogo from '../../../app/assets/logobrand.png';

// ========== CONSTANTS ==========
const ACTIVE_COLOR = "#FFC400";
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face";
=======
import toast from "react-hot-toast";
// Define the custom active color
const ACTIVE_COLOR = "#35556e";
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b

// Navigation Links
const NAV_LINKS = [
  { name: "Home", href: "/", icon: <FaHome /> },
  { name: "Courses", href: "/courses", icon: <FaBook /> },
  { name: "Instructors", href: "/teachers", icon: <GiTeacher /> },
  { name: "Dashboard", href: "/dashboard", icon: <FaTachometerAlt />, authRequired: true },
  { name: "Contact", href: "/contact", icon: <FaPhoneAlt /> },
  { name: "Community", href: "/community", icon: <FaInfoCircle /> },
];

// Role Configuration
const ROLE_CONFIG = {
  admin: { text: "Admin", icon: FaUserShield, color: "bg-red-100 text-red-800", badgeColor: "bg-red-500" },
  administrator: { text: "Admin", icon: FaUserShield, color: "bg-red-100 text-red-800", badgeColor: "bg-red-500" },
  instructor: { text: "Instructor", icon: FaUserTie, color: "bg-blue-100 text-blue-800", badgeColor: "bg-blue-500" },
  teacher: { text: "Teacher", icon: FaUserTie, color: "bg-blue-100 text-blue-800", badgeColor: "bg-blue-500" },
  student: { text: "Student", icon: FaUserGraduate, color: "bg-green-100 text-green-800", badgeColor: "bg-green-500" },
  premium: { text: "Premium", icon: FaCrown, color: "bg-yellow-100 text-yellow-800", badgeColor: "bg-yellow-500" },
  moderator: { text: "Moderator", icon: FaUserShield, color: "bg-orange-100 text-orange-800", badgeColor: "bg-orange-500" },
  default: { text: "User", icon: FaUserGraduate, color: "bg-gray-100 text-gray-800", badgeColor: "bg-gray-500" }
};

// ========== HELPER FUNCTIONS ==========
const getFilteredNavLinks = (user) => {
  return user ? NAV_LINKS : NAV_LINKS.filter(link => !link.authRequired);
};

const getAvatar = (user) => {
  if (!user) return DEFAULT_AVATAR;
  const photo = user.photoURL || user.image || user.avatar || user.picture;
  return photo?.startsWith('blob:') ? DEFAULT_AVATAR : (photo || DEFAULT_AVATAR);
};

const getUserName = (user) => {
  if (!user) return "Guest";
  return user.name || user.displayName || user.username || user.email?.split('@')[0] || "User";
};

const getRoleInfo = (role, loading) => {
  if (loading) return { ...ROLE_CONFIG.default, text: "Loading...", badgeColor: "bg-gray-400", loading: true };
  if (!role || role === "user") return ROLE_CONFIG.default;
  
  const roleLower = role.toLowerCase();
  const config = ROLE_CONFIG[roleLower] || {
    text: role.charAt(0).toUpperCase() + role.slice(1),
    icon: FaUserGraduate,
    color: "bg-gray-100 text-gray-800",
    badgeColor: "bg-gray-500"
  };
  
  return { ...config, icon: React.createElement(config.icon) };
};

// ========== NAVBAR COMPONENT ==========
export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Refs
  const dropdownRef = useRef(null);
  
  // Context
  const { user, logOut } = useContext(AuthContext);
  const { role, loading } = useRole();

<<<<<<< HEAD
  // Derived Values
  const navLinks = getFilteredNavLinks(user);
  const userAvatar = getAvatar(user);
  const userName = getUserName(user);
  const firstName = userName.split(" ")[0];
  const roleInfo = getRoleInfo(role, loading);
  const isLoading = loading && user;
=======
  // --- Data and Constants ---
  const baseNavLinks = [
    { name: "Home", href: "/", icon: <FaHome /> },
    { name: "Courses", href: "/courses", icon: <FaBook /> },
    { name: "Instructors", href: "/teachers", icon: <GiTeacher /> },
    { name: "Dashboard", href: "/dashboard", icon: <FaTachometerAlt />, authRequired: true }, // Added authRequired flag
    { name: "Contact", href: "/contact", icon: <FaPhoneAlt /> },
    { name: "Community", href: "/community", icon: <FaInfoCircle /> }, // 
    
  ];
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b

  // Debug logging
  useEffect(() => {
    if (user) {
      console.log("🔍 Navbar User Info:", { email: user.email, role, loading });
    }
  }, [user, role, loading]);

  // ========== LOGOUT HANDLER ==========
  const handleLogout = useCallback(async () => {
    try {
      await logOut();
      toast.success("Logged out successfully ✨");
      setIsDropdownOpen(false);
      setIsOpen(false);
      
      // Redirect to login page after logout
      setTimeout(() => {
        router.push('/login');
      }, 300);
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  }, [logOut, router]);

<<<<<<< HEAD
  // ========== SCROLL EFFECT ==========
=======
  // 1. Scroll effect for navbar
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ========== MOBILE MENU HANDLING ==========
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  // ========== CLICK OUTSIDE DROPDOWN ==========
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

<<<<<<< HEAD
  // ========== COMPONENT RENDERING ==========
=======

  // --- Helper Components for Cleanliness (Inline for simplicity) ---

  const DesktopNavLink = ({ link }) => (
    <li>
      <Link
        href={link.href}
        className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-medium transition-all duration-300 group ${
          pathname === link.href
            ? "text-white"
            : "text-gray-600 hover:bg-gray-100/50 hover:text-[#35556e]"
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
            ? "text-white "
            : "text-gray-600 hover:bg-gray-100/50 hover:text-[#35556e]"
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
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b
  return (
    <>
      {/* Main Navbar */}
      <nav className={`navbar sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-100/50" 
                  : "bg-white/90 backdrop-blur-lg shadow-lg"
      } p-4 max-w-[1400px] mx-auto`}>

        {/* Left: Mobile Menu & Logo */}
        <div className="navbar-start">
<<<<<<< HEAD
          <MobileMenuButton setIsOpen={setIsOpen} />
          <Logo />
=======
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
            className="btn btn-ghost text-xl font-bold hover:scale-105 transition-transform text-[#35556e]"
          >
            <h1>Course Master</h1>
          </Link>
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b
        </div>

        {/* Center: Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <DesktopNavLinks navLinks={navLinks} pathname={pathname} />
        </div>

        {/* Right: User Actions */}
        <div className="navbar-end gap-3 flex items-center">
<<<<<<< HEAD
          {user ? (
            <AuthenticatedUserSection 
              user={user}
              userAvatar={userAvatar}
              firstName={firstName}
              roleInfo={roleInfo}
              isLoading={isLoading}
              role={role}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              dropdownRef={dropdownRef}
              handleLogout={handleLogout}
              router={router}
            />
          ) : (
            <UnauthenticatedUserSection />
=======
          {/* User Actions (Desktop) */}
          {user ? (
            <>
              {/* Desktop Notifications (Hidden on mobile) */}
              <button className="btn  border relative text-gray-600 hover:text-blue-600 hover:bg-gray-100/50 rounded-2xl hidden lg:block">
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
                className="btn btn-ghost text-[#35556e]   hover:bg-gray-100/50 rounded-2xl font-medium transition-all"
              >
                <FaSignInAlt className="mr-2" />
                Login
              </Link>
              <Link
                href="/signUp"
                className="btn text-white  rounded-2xl font-medium  transition-all"
                style={{ backgroundColor: ACTIVE_COLOR }}
              >
                <FaUserPlus className="mr-2" />
                Get Started
              </Link>
            </div>
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b
          )}
        </div>
      </nav>

      {/* Mobile Drawer */}
      <MobileDrawer 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        user={user}
        userName={userName}
        firstName={firstName}
        userAvatar={userAvatar}
        userEmail={user?.email}
        roleInfo={roleInfo}
        isLoading={isLoading}
        role={role}
        navLinks={navLinks}
        pathname={pathname}
        handleLogout={handleLogout}
      />
    </>
  );
}

// ========== SUB-COMPONENTS ==========

// Mobile Menu Button
const MobileMenuButton = ({ setIsOpen }) => (
  <button
    onClick={() => setIsOpen(true)}
    className="btn btn-ghost lg:hidden text-gray-700 hover:bg-gray-100/50 rounded-2xl"
    aria-label="Open menu"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
  </button>
);

// Logo
const Logo = () => (
  <Link href="/" className="btn btn-ghost text-xl font-bold hover:scale-105 transition-transform">
    <Image src={brandLogo} alt="Brand Logo" className="w-20 h-auto object-contain" priority />
  </Link>
);

// Desktop Navigation Links
const DesktopNavLinks = ({ navLinks, pathname }) => (
  <ul className="menu menu-horizontal px-1 gap-1">
    {navLinks.map((link) => (
      <li key={link.name}>
        <Link
          href={link.href}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-medium transition-all duration-300 group ${
            pathname === link.href
              ? "text-white shadow-lg shadow-amber-500/30"
              : "text-gray-600 hover:bg-gray-100/50 hover:text-amber-600"
          }`}
          style={pathname === link.href ? { backgroundColor: ACTIVE_COLOR, color: 'white' } : {}}
        >
          <span className={`transition-transform duration-300 ${
            pathname === link.href ? "scale-110" : "group-hover:scale-110"
          }`}>
            {link.icon}
          </span>
          {link.name}
        </Link>
      </li>
    ))}
  </ul>
);

// Authenticated User Section
const AuthenticatedUserSection = ({ 
  user, userAvatar, firstName, roleInfo, isLoading, role, 
  isDropdownOpen, setIsDropdownOpen, dropdownRef, handleLogout, router 
}) => (
  <>
    {/* Search Button */}
    <button 
      className="btn btn-ghost btn-circle text-gray-600 hover:text-blue-600 hover:bg-gray-100/50 rounded-2xl"
      onClick={() => router.push('/search')}
    >
      <FaSearch className="text-lg" />
    </button>

    {/* Notifications */}
    <button className="btn btn-ghost btn-circle relative text-gray-600 hover:text-blue-600 hover:bg-gray-100/50 rounded-2xl hidden lg:block">
      <FaBell className="text-lg" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
    </button>

    {/* Desktop User Dropdown */}
    <div className="relative hidden lg:block" ref={dropdownRef}>
      <UserDropdownToggle 
        userAvatar={userAvatar}
        firstName={firstName}
        roleInfo={roleInfo}
        isLoading={isLoading}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />
      
      {isDropdownOpen && (
        <UserDropdownMenu 
          user={user}
          userAvatar={userAvatar}
          userName={getUserName(user)}
          roleInfo={roleInfo}
          role={role}
          isLoading={isLoading}
          setIsDropdownOpen={setIsDropdownOpen}
          handleLogout={handleLogout}
        />
      )}
    </div>

    {/* Mobile User Menu */}
    <MobileUserMenu 
      user={user}
      userAvatar={userAvatar}
      firstName={firstName}
      roleInfo={roleInfo}
      role={role}
      isLoading={isLoading}
      handleLogout={handleLogout}
    />
  </>
);

// Unauthenticated User Section
const UnauthenticatedUserSection = () => (
  <>
    {/* Desktop Buttons */}
    <div className="hidden lg:flex items-center gap-2">
      <Link
        href="/login"
        className="btn btn-ghost text-gray-600 hover:text-amber-600 hover:bg-gray-100/50 rounded-2xl font-medium transition-all"
      >
<<<<<<< HEAD
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

    {/* Mobile Login Icon */}
    <Link href="/login" className="btn btn-ghost btn-circle text-gray-600 lg:hidden">
      <FaSignInAlt className="text-lg" />
    </Link>
  </>
);

// User Dropdown Toggle
const UserDropdownToggle = ({ userAvatar, firstName, roleInfo, isLoading, isDropdownOpen, setIsDropdownOpen }) => (
  <button
    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-100/50 transition-all duration-300 group"
    disabled={isLoading}
    aria-label="User menu"
  >
    <div className="relative">
      <img
        src={userAvatar}
        alt="User Avatar"
        className="w-10 h-10 rounded-full border-2 border-white shadow-lg group-hover:scale-105 transition-transform object-cover"
        onError={(e) => e.target.src = DEFAULT_AVATAR}
      />
      {!isLoading && <AvatarBadge roleInfo={roleInfo} />}
    </div>
    
    <div className="text-left hidden xl:block">
      <p className="text-sm font-semibold text-gray-800">{firstName}</p>
      <RoleBadge roleInfo={roleInfo} isLoading={isLoading} />
    </div>
    
    <DropdownArrow isOpen={isDropdownOpen} />
  </button>
);

// User Dropdown Menu
const UserDropdownMenu = ({ user, userAvatar, userName, roleInfo, role, isLoading, setIsDropdownOpen, handleLogout }) => (
  <div className="absolute right-0 top-full mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden animate-fadeIn">
    {/* User Info */}
    <div className="p-6 border-b border-gray-100/50" style={{ backgroundColor: `${ACTIVE_COLOR}15` }}>
      <UserInfo user={user} userAvatar={userAvatar} userName={userName} roleInfo={roleInfo} />
    </div>

    {/* Quick Actions */}
    <div className="p-4 border-b border-gray-100/50">
      <div className="grid grid-cols-2 gap-2">
        <QuickActionLink href="/dashboard" icon={FaTachometerAlt} label="Dashboard" setIsDropdownOpen={setIsDropdownOpen} />
        <QuickActionLink href="/profile" icon={FaUserCircle} label="Profile" setIsDropdownOpen={setIsDropdownOpen} />
      </div>
    </div>

    {/* Menu Items */}
    <div className="p-2">
      {!isLoading && role && (role.toLowerCase() === 'admin' || role.toLowerCase() === 'administrator') && (
        <DropdownLink href="/admin" icon={MdAdminPanelSettings} label="Admin Panel" setIsDropdownOpen={setIsDropdownOpen} />
      )}
      <DropdownLink href="/settings" icon={FaCog} label="Settings" setIsDropdownOpen={setIsDropdownOpen} />
      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full text-left transition-all group mt-1">
        <FaSignOutAlt className="group-hover:scale-110 transition-transform" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  </div>
);

// Mobile User Menu
const MobileUserMenu = ({ user, userAvatar, firstName, roleInfo, role, isLoading, handleLogout }) => (
  <div className="dropdown dropdown-end lg:hidden">
    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
      <div className="w-10 rounded-full border-2 border-white shadow-lg relative">
        <img
          alt="User avatar"
          src={userAvatar}
          className="object-cover"
          onError={(e) => e.target.src = DEFAULT_AVATAR}
        />
        <AvatarBadge roleInfo={roleInfo} mobile />
      </div>
    </div>
    <MobileDropdownMenu 
      user={user}
      userAvatar={userAvatar}
      firstName={firstName}
      roleInfo={roleInfo}
      role={role}
      isLoading={isLoading}
      handleLogout={handleLogout}
    />
  </div>
);

// ========== SMALLER COMPONENTS ==========

// Role Badge
const RoleBadge = ({ roleInfo, isLoading }) => {
  if (isLoading) {
    return <div className="animate-pulse w-16 h-5 bg-gray-200 rounded-full"></div>;
  }
  
  const Icon = roleInfo.icon.type || roleInfo.icon;
  return (
    <div className="flex items-center gap-1 mt-0.5">
      <span className={`text-xs px-2 py-0.5 rounded-full ${roleInfo.color} flex items-center gap-1`}>
        {React.isValidElement(roleInfo.icon) ? roleInfo.icon : <Icon className="text-xs" />}
        {roleInfo.text}
      </span>
    </div>
  );
};

// Avatar Badge
const AvatarBadge = ({ roleInfo, mobile = false }) => {
  if (roleInfo.loading) return null;
  
  const size = mobile ? "w-3 h-3" : "w-4 h-4";
  const Icon = roleInfo.icon.type || roleInfo.icon;
  
  return (
    <div 
      className={`absolute -bottom-1 -right-1 ${size} rounded-full border-2 border-white flex items-center justify-center`}
      style={{ backgroundColor: roleInfo.badgeColor }}
    >
      {React.isValidElement(roleInfo.icon) ? 
        React.cloneElement(roleInfo.icon, { className: mobile ? "text-[8px]" : "text-xs" }) : 
        <Icon className={mobile ? "text-[8px]" : "text-xs"} />
      }
    </div>
  );
};

// Dropdown Arrow
const DropdownArrow = ({ isOpen }) => (
  <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
    fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

// User Info
const UserInfo = ({ user, userAvatar, userName, roleInfo }) => (
  <div className="flex items-center gap-4">
    <div className="relative">
      <img src={userAvatar} alt="User Avatar" className="w-14 h-14 rounded-full border-2 border-white shadow-lg object-cover"
        onError={(e) => e.target.src = DEFAULT_AVATAR} />
      <AvatarBadge roleInfo={roleInfo} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-gray-800 text-lg truncate">{userName}</h3>
        {user?.isVerified && <MdVerified className="text-blue-500" title="Verified Account" />}
      </div>
      <p className="text-sm text-gray-600 truncate">{user.email}</p>
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <RoleBadge roleInfo={roleInfo} />
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">● Active</span>
      </div>
    </div>
  </div>
);

// Quick Action Link
const QuickActionLink = ({ href, icon: Icon, label, setIsDropdownOpen }) => (
  <Link href={href} className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-all group"
    onClick={() => setIsDropdownOpen(false)}>
    <Icon className="text-lg mb-1 group-hover:scale-110 transition-transform" />
    <span className="text-xs font-medium">{label}</span>
  </Link>
);

// Dropdown Link
const DropdownLink = ({ href, icon: Icon, label, setIsDropdownOpen }) => (
  <Link href={href} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all group"
    onClick={() => setIsDropdownOpen(false)}>
    <Icon className="text-gray-400 group-hover:text-blue-600 transition-colors" />
    <span className="font-medium">{label}</span>
  </Link>
);

// Mobile Dropdown Menu
const MobileDropdownMenu = ({ user, userAvatar, firstName, roleInfo, role, isLoading, handleLogout }) => (
  <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-white/95 backdrop-blur-xl rounded-2xl w-72 border border-gray-100/50">
    <li className="p-4 border-b border-gray-100/50" style={{ backgroundColor: `${ACTIVE_COLOR}15` }}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={userAvatar} className="w-12 h-12 rounded-full object-cover border-2 border-white"
            alt="User" onError={(e) => e.target.src = DEFAULT_AVATAR} />
          <AvatarBadge roleInfo={roleInfo} mobile />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <p className="font-semibold text-gray-800 truncate">{firstName}</p>
            {user?.isVerified && <MdVerified className="text-blue-500 text-xs" />}
          </div>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
          <div className="flex flex-wrap items-center gap-1 mt-1">
            <RoleBadge roleInfo={roleInfo} isLoading={isLoading} />
=======
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100/50">
          <Link
            href="/"
            className="text-xl font-bold bg-clip-text text-transparent"
            onClick={() => setIsOpen(false)}
            style={{ backgroundImage: `linear-gradient(to right, ${ACTIVE_COLOR}` }}
          >
            <FaGraduationCap className="inline mr-2" style={{ color: ACTIVE_COLOR }} />
            Course Master
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
                className="btn w-full text-white rounded-2xl font-medium"
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
>>>>>>> 1f8092dc2fb7b1b2fa1c001e680496553551d87b
          </div>
        </div>
      </div>
    </li>
    <li><Link href="/dashboard"><FaTachometerAlt />Dashboard</Link></li>
    {!isLoading && role && (role.toLowerCase() === 'admin' || role.toLowerCase() === 'administrator') && (
      <li><Link href="/admin"><MdAdminPanelSettings />Admin Panel</Link></li>
    )}
    <li><Link href="/profile"><FaUserCircle />Profile</Link></li>
    <li><Link href="/settings"><FaCog />Settings</Link></li>
    <li><button onClick={handleLogout} className="text-red-600"><FaSignOutAlt />Logout</button></li>
  </ul>
);

// ========== MOBILE DRAWER ==========
const MobileDrawer = ({ isOpen, setIsOpen, user, userName, firstName, userAvatar, userEmail, roleInfo, isLoading, role, navLinks, pathname, handleLogout }) => (
  <>
    {isOpen && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
        onClick={() => setIsOpen(false)} />
    )}

    <div className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-500 ease-out lg:hidden ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    }`}>
      <DrawerHeader setIsOpen={setIsOpen} />
      
      <div className="p-6 h-[calc(100vh-80px)] overflow-y-auto">
        {user && <UserProfileSection user={user} firstName={firstName} userAvatar={userAvatar} userEmail={userEmail} roleInfo={roleInfo} />}
        
        <NavigationLinks navLinks={navLinks} pathname={pathname} setIsOpen={setIsOpen} />
        
        <AuthSection 
          user={user}
          role={role}
          isLoading={isLoading}
          setIsOpen={setIsOpen}
          handleLogout={handleLogout}
        />
        
        <FooterSection />
      </div>
    </div>
  </>
);

// Drawer Header
const DrawerHeader = ({ setIsOpen }) => (
  <div className="flex items-center justify-between p-6 border-b border-gray-100/50">
    <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent"
      onClick={() => setIsOpen(false)} style={{ backgroundImage: `linear-gradient(to right, ${ACTIVE_COLOR}, #FF8C00)` }}>
      <FaGraduationCap className="inline mr-2" style={{ color: ACTIVE_COLOR }} />
      EduLMS
    </Link>
    <button onClick={() => setIsOpen(false)} className="btn btn-ghost btn-circle text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 rounded-2xl"
      aria-label="Close menu">
      <FaTimes className="text-xl" />
    </button>
  </div>
);

// User Profile Section
const UserProfileSection = ({ user, firstName, userAvatar, userEmail, roleInfo }) => (
  <div className="mb-8 p-4 rounded-2xl border border-gray-100/50" style={{ backgroundColor: `${ACTIVE_COLOR}15` }}>
    <div className="flex items-center gap-4">
      <div className="relative">
        <img src={userAvatar} className="w-14 h-14 rounded-full border-2 border-white shadow-lg object-cover"
          alt="User" onError={(e) => e.target.src = DEFAULT_AVATAR} />
        <AvatarBadge roleInfo={roleInfo} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-800 text-lg">{firstName}</h3>
          {user?.isVerified && <MdVerified className="text-blue-500" title="Verified" />}
        </div>
        <p className="text-sm text-gray-600 truncate">{userEmail}</p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <RoleBadge roleInfo={roleInfo} />
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">● Active</span>
        </div>
      </div>
    </div>
  </div>
);

// Navigation Links
const NavigationLinks = ({ navLinks, pathname, setIsOpen }) => (
  <ul className="space-y-2 mb-8">
    {navLinks.map((link) => (
      <li key={link.name}>
        <Link
          href={link.href}
          className={`flex items-center gap-4 p-4 rounded-2xl font-medium transition-all duration-300 ${
            pathname === link.href
              ? "text-white shadow-lg shadow-amber-500/30"
              : "text-gray-600 hover:bg-gray-100/50 hover:text-amber-600"
          }`}
          style={pathname === link.href ? { backgroundColor: ACTIVE_COLOR, color: 'white' } : {}}
          onClick={() => setIsOpen(false)}
        >
          <span className={`text-lg ${pathname === link.href ? "text-white" : "text-gray-400"}`}>
            {link.icon}
          </span>
          <span>{link.name}</span>
        </Link>
      </li>
    ))}
  </ul>
);

// Auth Section
const AuthSection = ({ user, role, isLoading, setIsOpen, handleLogout }) => (
  <div className="space-y-3">
    {user ? (
      <>
        <Link href="/profile" className="btn w-full bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-2xl font-medium transition-all"
          onClick={() => setIsOpen(false)}>
          <FaUserCircle className="mr-2" /> View Profile
        </Link>
        {!isLoading && role && (role.toLowerCase() === 'admin' || role.toLowerCase() === 'administrator') && (
          <Link href="/admin" className="btn w-full bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl font-medium transition-all"
            onClick={() => setIsOpen(false)}>
            <MdAdminPanelSettings className="mr-2" /> Admin Panel
          </Link>
        )}
        <button onClick={handleLogout} className="btn w-full bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 rounded-2xl font-medium shadow-lg shadow-red-500/25">
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </>
    ) : (
      <>
        <Link href="/login" className="btn w-full bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-2xl font-medium transition-all"
          onClick={() => setIsOpen(false)}>
          <FaSignInAlt className="mr-2" /> Login
        </Link>
        <Link href="/signUp" className="btn w-full text-white hover:opacity-90 rounded-2xl font-medium shadow-lg shadow-amber-500/25"
          style={{ backgroundColor: ACTIVE_COLOR }} onClick={() => setIsOpen(false)}>
          <FaUserPlus className="mr-2" /> Get Started
        </Link>
      </>
    )}
  </div>
);

// Footer Section
const FooterSection = () => (
  <div className="mt-8 p-4 rounded-2xl border border-gray-100/50" style={{ backgroundColor: `${ACTIVE_COLOR}15` }}>
    <p className="text-sm text-gray-700 text-center font-medium">🚀 Start your learning journey today!</p>
    <p className="text-xs text-gray-500 text-center mt-1">Access 1000+ courses anytime</p>
  </div>
);

// Custom Animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
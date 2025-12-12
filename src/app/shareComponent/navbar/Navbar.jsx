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
  FaSearch,
  FaUserShield,
  FaUserTie,
  FaUserGraduate,
  FaCrown,
} from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { MdVerified, MdAdminPanelSettings } from "react-icons/md";
import { AuthContext } from "@/context/AuthContext";
import useRole from "@/hooks/useRole";
import brandLogo from '../../../app/assets/logobrand.png';

// ========== CONSTANTS & CONFIG ==========
const ACTIVE_COLOR = "#FFC400";
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face";

// Role Configuration
const ROLE_CONFIG = {
  admin: { 
    text: "Admin", 
    icon: FaUserShield, 
    color: "bg-red-100 text-red-800", 
    badgeColor: "bg-red-500",
    showDashboard: true 
  },
  administrator: { 
    text: "Admin", 
    icon: FaUserShield, 
    color: "bg-red-100 text-red-800", 
    badgeColor: "bg-red-500",
    showDashboard: true 
  },
  instructor: { 
    text: "Instructor", 
    icon: FaUserTie, 
    color: "bg-blue-100 text-blue-800", 
    badgeColor: "bg-blue-500",
    showDashboard: true 
  },
  teacher: { 
    text: "Teacher", 
    icon: FaUserTie, 
    color: "bg-blue-100 text-blue-800", 
    badgeColor: "bg-blue-500",
    showDashboard: true 
  },
  student: { 
    text: "Student", 
    icon: FaUserGraduate, 
    color: "bg-green-100 text-green-800", 
    badgeColor: "bg-green-500",
    showDashboard: true 
  },
  premium: { 
    text: "Premium", 
    icon: FaCrown, 
    color: "bg-yellow-100 text-yellow-800", 
    badgeColor: "bg-yellow-500",
    showDashboard: true 
  },
  moderator: { 
    text: "Moderator", 
    icon: FaUserShield, 
    color: "bg-orange-100 text-orange-800", 
    badgeColor: "bg-orange-500",
    showDashboard: true 
  },
  user: { 
    text: "User", 
    icon: FaUserGraduate, 
    color: "bg-gray-100 text-gray-800", 
    badgeColor: "bg-gray-500",
    showDashboard: false // User role doesn't get dashboard
  },
  default: { 
    text: "Loading...", 
    icon: FaUserGraduate, 
    color: "bg-gray-100 text-gray-800", 
    badgeColor: "bg-gray-400",
    showDashboard: false 
  }
};

// Base Navigation Links (without dashboard)
const BASE_NAV_LINKS = [
  { name: "Home", href: "/", icon: <FaHome /> },
  { name: "Courses", href: "/courses", icon: <FaBook /> },
  { name: "Instructors", href: "/teachers", icon: <GiTeacher /> },
  { name: "Contact", href: "/contact", icon: <FaPhoneAlt /> },
  { name: "Community", href: "/community", icon: <FaInfoCircle /> },
];

// Dashboard Link
const DASHBOARD_LINK = { 
  name: "Dashboard", 
  href: "/dashboard", 
  icon: <FaTachometerAlt />, 
  authRequired: true 
};

// ========== HELPER FUNCTIONS ==========
const getFilteredNavLinks = (user, role) => {
  // Get base links
  const links = user ? [...BASE_NAV_LINKS] : BASE_NAV_LINKS;
  
  // Add dashboard if user has appropriate role
  if (user && role) {
    const roleLower = role.toLowerCase();
    const roleConfig = ROLE_CONFIG[roleLower] || ROLE_CONFIG.default;
    
    if (roleConfig.showDashboard) {
      links.push(DASHBOARD_LINK);
    }
  }
  
  return links;
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
  if (loading) return ROLE_CONFIG.default;
  
  const roleLower = (role || "user").toLowerCase();
  const config = ROLE_CONFIG[roleLower] || ROLE_CONFIG.user;
  
  return { 
    ...config, 
    icon: React.createElement(config.icon) 
  };
};

// ========== MAIN NAVBAR COMPONENT ==========
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

  // Derived Values
  const navLinks = getFilteredNavLinks(user, role);
  const userAvatar = getAvatar(user);
  const userName = getUserName(user);
  const firstName = userName.split(" ")[0];
  const roleInfo = getRoleInfo(role, loading);
  const isLoading = loading && user;

  // Debug logging
  useEffect(() => {
    if (user) {
      console.log("🔍 Navbar User Info:", { email: user.email, role, loading, navLinks });
    }
  }, [user, role, loading, navLinks]);

  // ========== LOGOUT HANDLER ==========
  const handleLogout = useCallback(async () => {
    try {
      await logOut();
      toast.success("Logged out successfully ✨");
      setIsDropdownOpen(false);
      setIsOpen(false);
      
      setTimeout(() => {
        router.push('/login');
      }, 300);
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  }, [logOut, router]);

  // ========== SCROLL EFFECT ==========
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

  // ========== COMPONENT RENDERING ==========
  return (
    <>
      {/* Main Navbar */}
      <nav className={`navbar sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-100/50" 
                  : "bg-white/90 backdrop-blur-lg shadow-lg"
      } p-4 max-w-[1400px] mx-auto`}>

        {/* Left: Mobile Menu & Logo */}
        <div className="navbar-start">
          <MobileMenuButton setIsOpen={setIsOpen} />
          <Logo />
        </div>

        {/* Center: Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <DesktopNavLinks navLinks={navLinks} pathname={pathname} />
        </div>

        {/* Right: User Actions */}
        <div className="navbar-end gap-3 flex items-center">
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
              navLinks={navLinks}
            />
          ) : (
            <UnauthenticatedUserSection />
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

// 1. MOBILE MENU BUTTON
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

// 2. LOGO
const Logo = () => (
  <Link href="/" className="btn btn-ghost text-xl font-bold hover:scale-105 transition-transform">
    <Image src={brandLogo} alt="Brand Logo" className="w-20 h-auto object-contain" priority />
  </Link>
);

// 3. DESKTOP NAVIGATION LINKS
const DesktopNavLinks = ({ navLinks, pathname }) => (
  <ul className="menu menu-horizontal px-1 gap-1">
    {navLinks.map((link) => (
      <li key={link.name}>
        <NavLinkItem link={link} pathname={pathname} />
      </li>
    ))}
  </ul>
);

const NavLinkItem = ({ link, pathname }) => (
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
);

// 4. AUTHENTICATED USER SECTION
const AuthenticatedUserSection = ({ 
  user, userAvatar, firstName, roleInfo, isLoading, role, 
  isDropdownOpen, setIsDropdownOpen, dropdownRef, handleLogout, router, navLinks 
}) => {
  const shouldShowDashboard = navLinks.some(link => link.name === "Dashboard");
  
  return (
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
            shouldShowDashboard={shouldShowDashboard}
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
        shouldShowDashboard={shouldShowDashboard}
      />
    </>
  );
};

// 5. UNAUTHENTICATED USER SECTION
const UnauthenticatedUserSection = () => (
  <>
    {/* Desktop Buttons */}
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

    {/* Mobile Login Icon */}
    <Link href="/login" className="btn btn-ghost btn-circle text-gray-600 lg:hidden">
      <FaSignInAlt className="text-lg" />
    </Link>
  </>
);

// 6. USER DROPDOWN TOGGLE
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

// 7. USER DROPDOWN MENU
const UserDropdownMenu = ({ 
  user, userAvatar, userName, roleInfo, role, isLoading, 
  setIsDropdownOpen, handleLogout, shouldShowDashboard 
}) => (
  <div className="absolute right-0 top-full mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden animate-fadeIn">
    {/* User Info */}
    <div className="p-6 border-b border-gray-100/50" style={{ backgroundColor: `${ACTIVE_COLOR}15` }}>
      <UserInfo user={user} userAvatar={userAvatar} userName={userName} roleInfo={roleInfo} />
    </div>

    {/* Quick Actions */}
    <div className="p-4 border-b border-gray-100/50">
      <div className="grid grid-cols-2 gap-2">
        {shouldShowDashboard && (
          <QuickActionLink href="/dashboard" icon={FaTachometerAlt} label="Dashboard" setIsDropdownOpen={setIsDropdownOpen} />
        )}
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

// 8. MOBILE USER MENU
const MobileUserMenu = ({ user, userAvatar, firstName, roleInfo, role, isLoading, handleLogout, shouldShowDashboard }) => (
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
      shouldShowDashboard={shouldShowDashboard}
    />
  </div>
);

// ========== UTILITY COMPONENTS ==========

// 9. ROLE BADGE
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

// 10. AVATAR BADGE
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

// 11. DROPDOWN ARROW
const DropdownArrow = ({ isOpen }) => (
  <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
    fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

// 12. USER INFO
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

// 13. QUICK ACTION LINK
const QuickActionLink = ({ href, icon: Icon, label, setIsDropdownOpen }) => (
  <Link href={href} className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-all group"
    onClick={() => setIsDropdownOpen(false)}>
    <Icon className="text-lg mb-1 group-hover:scale-110 transition-transform" />
    <span className="text-xs font-medium">{label}</span>
  </Link>
);

// 14. DROPDOWN LINK
const DropdownLink = ({ href, icon: Icon, label, setIsDropdownOpen }) => (
  <Link href={href} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all group"
    onClick={() => setIsDropdownOpen(false)}>
    <Icon className="text-gray-400 group-hover:text-blue-600 transition-colors" />
    <span className="font-medium">{label}</span>
  </Link>
);

// 15. MOBILE DROPDOWN MENU
const MobileDropdownMenu = ({ user, userAvatar, firstName, roleInfo, role, isLoading, handleLogout, shouldShowDashboard }) => (
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
          </div>
        </div>
      </div>
    </li>
    {shouldShowDashboard && <li><Link href="/dashboard"><FaTachometerAlt />Dashboard</Link></li>}
    {!isLoading && role && (role.toLowerCase() === 'admin' || role.toLowerCase() === 'administrator') && (
      <li><Link href="/admin"><MdAdminPanelSettings />Admin Panel</Link></li>
    )}
    <li><Link href="/profile"><FaUserCircle />Profile</Link></li>
    <li><Link href="/settings"><FaCog />Settings</Link></li>
    <li><button onClick={handleLogout} className="text-red-600"><FaSignOutAlt />Logout</button></li>
  </ul>
);

// ========== MOBILE DRAWER COMPONENT ==========
const MobileDrawer = ({ 
  isOpen, setIsOpen, user, userName, firstName, userAvatar, userEmail, 
  roleInfo, isLoading, role, navLinks, pathname, handleLogout 
}) => (
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
          shouldShowDashboard={navLinks.some(link => link.name === "Dashboard")}
        />
        
        <FooterSection />
      </div>
    </div>
  </>
);

// 16. DRAWER HEADER
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

// 17. USER PROFILE SECTION
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

// 18. NAVIGATION LINKS
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

// 19. AUTH SECTION
const AuthSection = ({ user, role, isLoading, setIsOpen, handleLogout, shouldShowDashboard }) => (
  <div className="space-y-3">
    {user ? (
      <>
        <Link href="/profile" className="btn w-full bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-2xl font-medium transition-all"
          onClick={() => setIsOpen(false)}>
          <FaUserCircle className="mr-2" /> View Profile
        </Link>
        {shouldShowDashboard && (
          <Link href="/dashboard" className="btn w-full bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-2xl font-medium transition-all"
            onClick={() => setIsOpen(false)}>
            <FaTachometerAlt className="mr-2" /> Dashboard
          </Link>
        )}
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

// 20. FOOTER SECTION
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
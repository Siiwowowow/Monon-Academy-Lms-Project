"use client";

import Link from "next/link";
import {
  FaBars,
  FaHome,
  FaUsers,
  FaBook,
  FaUser,
  FaChalkboardTeacher,
  FaRegClipboard,
  FaSignOutAlt,
  FaRegCalendarCheck,
  FaCog,
  FaGraduationCap,
  FaChartLine,
  FaTasks,
  FaFileAlt,
  FaCalendarAlt,
  FaCogs,
  FaUserShield,
  FaUserGraduate,
  FaUserTie,
  FaMoon,
  FaSun,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import { useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useRole from "@/hooks/useRole";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const { user, logOut, loading: authLoading } = useContext(AuthContext);
  const { role, loading: roleLoading } = useRole();

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully ✨");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed!");
      console.error(error);
    }
  };

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You can implement dark mode logic here
  };

  // Modern color palette
  const colors = {
    light: {
      bg: "bg-gradient-to-b from-blue-50/80 to-purple-50/60 backdrop-blur-sm",
      sidebar: "bg-white/95 backdrop-blur-md",
      text: "text-gray-800",
      textLight: "text-gray-600",
      border: "border-blue-100",
      hover: "hover:bg-blue-50/80",
      active: "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg",
      shadow: "shadow-xl"
    },
    dark: {
      bg: "bg-gradient-to-b from-gray-900 to-blue-900/20",
      sidebar: "bg-gray-800/95 backdrop-blur-md",
      text: "text-gray-100",
      textLight: "text-gray-300",
      border: "border-gray-700",
      hover: "hover:bg-gray-700/80",
      active: "bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg",
      shadow: "shadow-2xl"
    }
  };

  const currentTheme = darkMode ? colors.dark : colors.light;

  // Dynamic role-based configuration with modern colors
  const roleConfig = {
    admin: {
      title: "Admin Portal",
      icon: <FaUserShield className="text-blue-600" />,
      gradient: "from-blue-500 to-purple-600",
      links: [
        { href: "/", label: "Home", icon: <FaHome /> },
        { href: "/dashboard/admin/overview", label: "Analytics", icon: <FaChartLine /> },
        { href: "/dashboard/admin/users", label: "User Management", icon: <FaUsers /> },
        { href: "/dashboard/admin/teachers", label: "Faculty", icon: <FaUserTie /> },
        { href: "/dashboard/admin/students", label: "Students", icon: <FaUserGraduate /> },
        { href: "/dashboard/admin/courses", label: "Courses", icon: <FaBook /> },
        { href: "/dashboard/admin/attendance", label: "Attendance", icon: <FaRegCalendarCheck /> },
        { href: "/dashboard/admin/reports", label: "Reports", icon: <FaFileAlt /> },
        { href: "/dashboard/admin/settings", label: "Settings", icon: <FaCogs /> },
      ],
    },
    teacher: {
      title: "Teacher Portal",
      icon: <FaUserTie className="text-green-600" />,
      gradient: "from-green-500 to-teal-600",
      links: [
        { href: "/", label: "Home", icon: <FaHome /> },
        { href: "/dashboard/teacher/overview", label: "Dashboard", icon: <FaChartLine /> },
        { href: "/dashboard/teacher/my-courses", label: "My Courses", icon: <FaBook /> },
        { href: "/dashboard/teacher/classes", label: "Classes", icon: <FaChalkboardTeacher /> },
        { href: "/dashboard/teacher/attendance", label: "Attendance", icon: <FaRegCalendarCheck /> },
        { href: "/dashboard/teacher/assignments", label: "Assignments", icon: <FaTasks /> },
        { href: "/dashboard/teacher/grades", label: "Grades", icon: <FaFileAlt /> },
        { href: "/dashboard/teacher/schedule", label: "Schedule", icon: <FaCalendarAlt /> },
        { href: "/dashboard/teacher/profile", label: "Profile", icon: <FaUser /> },
      ],
    },
    student: {
      title: "Student Portal",
      icon: <FaUserGraduate className="text-purple-600" />,
      gradient: "from-purple-500 to-pink-600",
      links: [
        { href: "/", label: "Home", icon: <FaHome /> },
        { href: "/dashboard/student/overview", label: "Dashboard", icon: <FaChartLine /> },
        { href: "/dashboard/student/my-courses", label: "My Courses", icon: <FaBook /> },
        { href: "/dashboard/student/classes", label: "Classes", icon: <FaGraduationCap /> },
        { href: "/dashboard/student/attendance", label: "Attendance", icon: <FaRegCalendarCheck /> },
        { href: "/dashboard/student/assignments", label: "Assignments", icon: <FaTasks /> },
        { href: "/dashboard/student/grades", label: "Grades", icon: <FaFileAlt /> },
        { href: "/dashboard/student/schedule", label: "Schedule", icon: <FaCalendarAlt /> },
        { href: "/dashboard/student/profile", label: "Profile", icon: <FaUser /> },
      ],
    },
    user: {
      title: "Dashboard",
      icon: <FaUser className="text-gray-600" />,
      gradient: "from-gray-500 to-blue-600",
      links: [
        { href: "/", label: "Home", icon: <FaHome /> },
        { href: "/dashboard/user/overview", label: "Overview", icon: <FaChartLine /> },
        { href: "/dashboard/user/profile", label: "Profile", icon: <FaUser /> },
        { href: "/dashboard/user/enroll", label: "Enroll", icon: <FaBook /> },
        { href: "/dashboard/user/progress", label: "Progress", icon: <FaRegClipboard /> },
        { href: "/dashboard/user/settings", label: "Settings", icon: <FaCog /> },
      ],
    },
  };

  const currentConfig = roleConfig[role] || roleConfig.user;
  const userLinks = currentConfig.links;

  // Loading state
  if (authLoading || roleLoading) {
    return (
      <div className={`
        ${currentTheme.bg} h-screen transition-all duration-500 
        ${open ? "w-80" : "w-20"} p-6 flex flex-col items-center justify-center
        border-r ${currentTheme.border}
        ${currentTheme.shadow}
      `}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600 text-sm font-medium">Loading...</p>
      </div>
    );
  }

  // If no user
  if (!user) {
    return (
      <div className={`
        ${currentTheme.bg} h-screen transition-all duration-500 
        ${open ? "w-80" : "w-20"} p-6 flex flex-col
        border-r ${currentTheme.border}
        ${currentTheme.shadow}
      `}>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-sm text-center font-medium">
            Please sign in to continue
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative
        ${currentTheme.sidebar} h-screen flex flex-col transition-all duration-500 z-50
        ${open ? "w-80" : "w-24"}
        ${isMobile && !open ? "-translate-x-full" : "translate-x-0"}
        border-r ${currentTheme.border}
        ${currentTheme.shadow}
      `}>

        {/* Header Section */}
        <div className="p-6 border-b border-blue-100/50 dark:border-gray-700/50">
          <div className={`flex items-center ${open ? "justify-between" : "justify-center"} transition-all duration-300`}>
            {open ? (
              <>
                {/* Expanded Logo and Title */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#B6AE9F] flex items-center justify-center shadow-lg">
                    {currentConfig.icon}
                  </div>

                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {currentConfig.title}
                    </h1>
                    <p className="text-xs text-gray-500 font-medium">Welcome back!</p>
                  </div>
                </div>

                {/* Desktop Toggle Button */}
                <button
                  onClick={toggleSidebar}
                  className="p-3 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-2xl transition-all duration-300 group"
                >
                  <FaChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                </button>
              </>
            ) : (
              <>
                {/* Collapsed Logo */}
                <div
                  className={`w-12 h-12 rounded-2xl bg-[#80A1BA] flex items-center justify-center shadow-lg cursor-pointer`}
                  onClick={toggleSidebar}
                >
                  {currentConfig.icon}
                </div>

                {/* Desktop Toggle Button when collapsed */}
                <button
                  onClick={toggleSidebar}
                  className="absolute -right-3 top-8 p-2 bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-600 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
                >
                  <FaChevronRight className="w-3 h-3 text-blue-600" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {userLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden
                  ${isActive
                    ? `${currentTheme.active} transform scale-[1.02] shadow-lg`
                    : `${currentTheme.text} ${currentTheme.hover} hover:scale-[1.02]`
                  }
                  ${!open ? "justify-center" : ""}
                `}
                onClick={() => isMobile && setOpen(false)}
              >
                {/* Animated background effect */}
                {isActive && (
                  <div className="absolute inset-0 bg-white/10 rounded-2xl"></div>
                )}

                <span className={`text-lg flex-shrink-0 transition-transform duration-300 ${isActive ? "text-white transform scale-110" : "text-gray-500 group-hover:text-blue-600"
                  }`}>
                  {link.icon}
                </span>

                {open && (
                  <span className="font-medium text-sm flex-1">
                    {link.label}
                  </span>
                )}

                {/* Active indicator */}
                {isActive && open && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-blue-100/50 dark:border-gray-700/50 space-y-3">
  {/* User Info */}
  <div
    className={`flex items-center transition-all duration-300 ${
      open ? "gap-2 justify-start" : "justify-center"
    }`}
  >
    <div className="relative flex-shrink-0">
      <img
        src={user.photoURL || "/default-avatar.png"}
        alt="User Avatar"
        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 shadow-md object-cover transition-transform duration-300 hover:scale-105"
      />
      {/* Online indicator */}
      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
    </div>

    {open && (
      <div className="flex-1 min-w-0 mb-3">
        <p className="font-semibold text-gray-800 dark:text-white text-sm truncate leading-tight">
          {user.displayName || "User"}
        </p>
        <p className="text-xs text-gray-800 dark:text-gray-800 font-medium capitalize leading-tight">
          {role}
        </p>
        <p className="text-xs text-gray-800 dark:text-gray-500 truncate leading-tight mt-0.5">
          {user.email}
        </p>
      </div>
    )}
  </div>

  {/* Action Buttons */}
  <div
    className={`flex ${open ? "flex-row gap-2" : "flex-col items-center gap-2"}`}
  >
    {/* Dark Mode Toggle */}
    {/* <button
      onClick={toggleDarkMode}
      className={`flex items-center justify-center p-2.5 rounded-xl transition-all duration-300
        ${open ? "flex-1" : "w-12 h-12"}
        ${
          darkMode
            ? "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"
            : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
        }
      `}
    >
      {darkMode ? (
        <FaSun className="w-4 h-4" />
      ) : (
        <FaMoon className="w-4 h-4" />
      )}
      {open && (
        <span className="ml-2 text-sm font-medium">
          {darkMode ? "Light" : "Dark"}
        </span>
      )}
    </button> */}

    {/* Logout Button */}
    <button
      onClick={handleLogout}
      className={`flex items-center justify-center p-2.5 rounded-xl transition-all duration-300
        ${open ? "flex-1" : "w-12 h-12"}
        bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700
      `}
    >
      <FaSignOutAlt className="w-4 h-4" />
      {open && (
        <span className="ml-2 text-sm font-medium">Logout</span>
      )}
    </button>
  </div>
</div>

      </div>

      {/* Mobile Toggle Button - Floating */}
      {isMobile && !open && (
        <button
          onClick={toggleSidebar}
          className="fixed top-2 left-2 z-50 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl group"
        >
          <FaBars className="w-4 h-4 transition-transform group-hover:rotate-90" />
        </button>
      )}
    </>
  );
}
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
  FaChevronRight,
  FaPlusCircle,
  FaClipboardList,
  FaPen,
} from "react-icons/fa";
import { useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useRole from "@/hooks/useRole";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function DashboardSidebar({ open, setOpen }) {
  const pathname = usePathname();
  const router = useRouter();
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
  }, [setOpen]);

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
      shadow: "shadow-xl",
    },
    dark: {
      bg: "bg-gradient-to-b from-gray-900 to-blue-900/20",
      sidebar: "bg-gray-800/95 backdrop-blur-md",
      text: "text-gray-100",
      textLight: "text-gray-300",
      border: "border-gray-700",
      hover: "hover:bg-gray-700/80",
      active: "bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg",
      shadow: "shadow-2xl",
    },
  };

  const currentTheme = darkMode ? colors.dark : colors.light;

  // Role-based config
  const roleConfig = {
    admin: {
      title: "Admin Portal",
      icon: <FaUserShield className="text-blue-600 text-sm" />,
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
      icon: <FaUserTie className="text-green-600 text-sm" />,
      links: [
        { href: "/", label: "Home", icon: <FaHome /> },
        { href: "/dashboard/teacher/overview", label: "Dashboard", icon: <FaChartLine /> },
        { href: "/dashboard/teacher/create-course", label: "Create Course", icon: <FaPlusCircle /> },
        { href: "/dashboard/teacher/my-courses", label: "My Courses", icon: <FaBook /> },
        { href: "/dashboard/teacher/create-exam", label: "Create Exam", icon: <FaPen /> },
        { href: "/dashboard/teacher/exams", label: "Exams", icon: <FaClipboardList /> },
        { href: "/dashboard/teacher/classes", label: "Classes", icon: <FaChalkboardTeacher /> },
        { href: "/dashboard/teacher/schedule", label: "Schedule", icon: <FaCalendarAlt /> },
        { href: "/dashboard/teacher/profile", label: "Profile", icon: <FaUser /> },
      ],
    },
    student: {
      title: "Student Portal",
      icon: <FaUserGraduate className="text-purple-600 text-sm" />,
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
      icon: <FaUser className="text-gray-600 text-sm" />,
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
      <div
        className={`${currentTheme.bg} h-screen transition-all duration-500 ${
          open ? "w-64" : "w-16"
        } flex flex-col items-center justify-center border-r ${currentTheme.border} ${currentTheme.shadow}`}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-3 text-gray-600 text-xs font-medium">Loading...</p>
      </div>
    );
  }

  // No user
  if (!user) {
    return (
      <div
        className={`${currentTheme.bg} h-screen transition-all duration-500 ${
          open ? "w-64" : "w-16"
        } flex flex-col border-r ${currentTheme.border} ${currentTheme.shadow}`}
      >
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-xs text-center font-medium">
            Please sign in
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 ${currentTheme.sidebar} h-screen flex flex-col transition-all duration-500 z-50 ${
          open ? "w-64" : "w-16"
        } ${isMobile && !open ? "-translate-x-full" : "translate-x-0"} border-r ${
          currentTheme.border
        } ${currentTheme.shadow}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-blue-100/50 dark:border-gray-700/50">
          <div
            className={`flex items-center ${
              open ? "justify-between" : "justify-center"
            } transition-all duration-300`}
          >
            {open ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#B6AE9F] flex items-center justify-center shadow-md">
                    {currentConfig.icon}
                  </div>
                  <div>
                    <h1 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                      {currentConfig.title}
                    </h1>
                    <p className="text-[10px] text-gray-500 font-medium leading-tight">
                      Welcome!
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 group"
                >
                  <FaChevronLeft className="w-3 h-3 text-gray-500 group-hover:text-blue-600 transition-colors" />
                </button>
              </>
            ) : (
              <>
                <div
                  className="w-8 h-8 rounded-xl bg-[#80A1BA] flex items-center justify-center shadow-md cursor-pointer"
                  onClick={toggleSidebar}
                >
                  {currentConfig.icon}
                </div>

                <button
                  onClick={toggleSidebar}
                  className="absolute -right-2 top-6 p-1 bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-600 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
                >
                  <FaChevronRight className="w-2 h-2 text-blue-600" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-3 overflow-y-auto">
          {userLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? `${currentTheme.active} transform scale-[1.02] shadow-md`
                    : `${currentTheme.text} ${currentTheme.hover} hover:scale-[1.02]`
                } ${!open ? "justify-center" : ""}`}
                onClick={() => isMobile && setOpen(false)}
              >
                <span
                  className={`text-base flex-shrink-0 transition-transform duration-300 ${
                    isActive
                      ? "text-white transform scale-105"
                      : "text-gray-500 group-hover:text-blue-600"
                  }`}
                >
                  {link.icon}
                </span>

                {open && <span className="font-medium text-xs flex-1">{link.label}</span>}

                {isActive && open && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-blue-100/50 dark:border-gray-700/50 space-y-2">
          <div
            className={`flex items-center transition-all duration-300 ${
              open ? "gap-2 justify-start" : "justify-center"
            }`}
          >
            <div className="relative flex-shrink-0">
              <img
                src={user.photoURL || "/default-avatar.png"}
                alt="User Avatar"
                className="w-6 h-6 rounded-full border border-white dark:border-gray-700 shadow-sm object-cover"
              />
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full border border-white dark:border-gray-800"></div>
            </div>

            {open && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 dark:text-white text-xs truncate leading-tight">
                  {user.displayName || "User"}
                </p>
                <p className="text-[10px] text-gray-600 dark:text-gray-400 capitalize leading-tight">
                  {role}
                </p>
              </div>
            )}
          </div>

          {/* Logout */}
          <div
            className={`flex ${open ? "flex-row gap-1" : "flex-col items-center gap-1"}`}
          >
            <button
              onClick={handleLogout}
              className={`flex items-center justify-center p-1.5 rounded-lg transition-all duration-300 ${
                open ? "flex-1" : "w-8 h-8"
              } bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700`}
            >
              <FaSignOutAlt className="w-3 h-3" />
              {open && <span className="ml-1 text-xs font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Toggle */}
      {isMobile && !open && (
        <button
          onClick={toggleSidebar}
          className="fixed top-3 left-3 z-50 p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl group"
        >
          <FaBars className="w-3 h-3 transition-transform group-hover:rotate-90" />
        </button>
      )}
    </>
  );
}

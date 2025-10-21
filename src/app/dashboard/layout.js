"use client";

import { useState } from "react";
import DashboardSidebar from "./dashBoardSlider/DashboardSidebar";

export default function DashboardLayoutClient({ children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-base-100 transition-all duration-300">
      {/* Sidebar */}
      <DashboardSidebar open={open} setOpen={setOpen} />

      {/* Main Content (adjusts with sidebar) */}
      <main
        className={`flex-1 transition-all duration-300 ${
          open ? "lg:ml-64" : "lg:ml-16"
        }`}
      >
        <div className="p-4 lg:p-6 min-h-screen">{children}</div>
      </main>
    </div>
  );
}

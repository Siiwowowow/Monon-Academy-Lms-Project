

import DashboardSidebar from "./dashBoardSlider/DashboardSidebar";

export const metadata = {
  title: "Dashboard",
  description: "User dashboard for the product store.",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-base-100">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-0 overflow-x-hidden">
        <div className="p-4 lg:p-6 min-h-screen">
            
          {children}
        </div>
      </main>
    </div>
  );
}
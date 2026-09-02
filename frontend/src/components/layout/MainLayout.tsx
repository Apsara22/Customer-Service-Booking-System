import React from "react";
import { useSidebar } from "./Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isSidebarOpen } = useSidebar();

  return (
    <div
      className={`relative z-10 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "md:ml-64" : "md:ml-0"}
        min-h-[calc(100vh-4rem)]`}
    >
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
import EmployeeHeader from "../../../components/header/EmployeeHeader";
import EmployeeSidebar from "../../../components/sidebar/EmployeeSidebar";
import { useTheme } from "../../../hooks/theme/useTheme";
import { useState, useEffect } from "react";

const EmployeeLayout = ({ children, setActiveTab }) => {
  const { theme } = useTheme();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - IMPORTANT: Added relative and overflow-visible */}
      <div className="flex-shrink-0 relative overflow-visible">
        <EmployeeSidebar setActiveTab={setActiveTab} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col w-full">
        <EmployeeHeader />
        <div
          style={{ backgroundColor: theme?.backgroundColor }}
          className="flex-1 overflow-y-auto px-4 py-4"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLayout;
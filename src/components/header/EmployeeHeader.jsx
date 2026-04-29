import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import useDashboard from "../../hooks/unisol/hrDashboard/useDashborad";
import Profile from "../../assets/images/profile-image.png";
import { useSetRecoilState } from "recoil";
import { userAuthState } from "../../state/isAuthenticatedAtom";

const EmployeeHeader = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3); // Example count
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const open = Boolean(anchorEl);
  const empId = sessionStorage.getItem("empId");
  const empName = sessionStorage.getItem("name");
  const photo = sessionStorage.getItem("profile");
  const empRole = sessionStorage.getItem("role") || "Employee"; // Assuming role is stored
  const grade = sessionStorage.getItem("payrollGrade");
  const setUserInfo = useSetRecoilState(userAuthState);

  const handleNotificationClick = (event) => {
    navigate(`/emp/allNotification/${empId}`);
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuToggle = (e) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setUserInfo({ isAuthenticated: false });
    navigate("/");
  };

  const { fetchUserAllNotification, allNotification } = useDashboard();

  useEffect(() => {
    if (empId) {
      fetchUserAllNotification(empId);
    }
  }, [empId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.employee-profile-menu')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <div className="bg-gradient-to-r from-white to-blue-50 h-[60px] px-6 flex justify-end items-center sticky top-0 z-50 shadow-lg border-b border-gray-100">
      {/* Right Side: Icons and Profile */}
      <div className="flex items-center space-x-6">
        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            onClick={handleNotificationClick}
            className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md border border-gray-100 transition-all duration-200 group"
            aria-label="Notifications"
          >
            <FaBell className="text-gray-600 text-lg group-hover:text-blue-600 transition-colors duration-200" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 animate-pulse">
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* Divider with gradient */}
        <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

        {/* Profile Section */}
        <div className="relative employee-profile-menu">
          <button
            onClick={handleProfileMenuToggle}
            className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-gray-50 transition-all duration-200 group"
          >
            <div className="relative">
              <img
                src={photo || Profile}
                className="w-10 h-10 object-cover rounded-full border-2 border-white group-hover:border-blue-200 transition-all duration-300 shadow-sm"
                alt="Employee Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = Profile;
                }}
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {empName || "Employee"}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {empRole.toLowerCase()} - {grade ? `Grade ${grade}` : "Grade N/A"}
              </span>
            </div>

            <MdOutlineKeyboardArrowDown
              className={`text-gray-400 text-xl transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-fadeIn">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{empName || "Employee"}</p>
                <p className="text-xs text-gray-500 truncate capitalize">
                  {empRole.toLowerCase()}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
              >
                <IoLogOut className="text-lg" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeHeader;
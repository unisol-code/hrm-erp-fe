import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaChevronDown, FaArrowLeft } from "react-icons/fa";
import { useSignIn } from "../../hooks/auth/useSignIn";
import { useSetRecoilState } from "recoil";
import { userAuthState } from "../../state/isAuthenticatedAtom";
import { useTheme } from "../../hooks/theme/useTheme";
import { LayoutDashboard } from "lucide-react";
import { IoPeopleCircleOutline } from "react-icons/io5";
import { HandCoins, Trophy } from "lucide-react";
import { MdModelTraining } from "react-icons/md";
import { CalendarCheck } from 'lucide-react';
import { FaMoneyBills } from "react-icons/fa6";
import { SiProcessingfoundation } from "react-icons/si";
import UnisolLogoImage from "../../assets/images/unisolLogoImg.png";
import { Info } from 'lucide-react';
import contactUs from "../../assets/images/contactUs.png";
import { useLocation } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import SubMenuItem from "./SubMenuItem";
import { IoChevronBackCircleSharp } from "react-icons/io5";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
  const [expandedItems, setExpandedItems] = useState([]);
  const [logoutClicked, setLogoutClicked] = useState(false);
  const setUserInfo = useSetRecoilState(userAuthState);
  const { resetSuperAdmin, hrDetails, resetHRLogin } = useSignIn();
  const { pathname } = useLocation();
  const isSuperAdmin = sessionStorage.getItem("isSuperAdminLogin") === 'true';
  const isHR = sessionStorage.getItem("isHrLogin") === 'true';
  const navigate = useNavigate();

  const SidebarItems = [
    { id: 1, icon: <LayoutDashboard className="w-6 h-6" />, name: "Dashboard", path: "/hrDashboard" },
    { id: 2, icon: <IoPeopleCircleOutline className="w-6 h-6" />, name: "Core HR", path: "/coreHR" },
    { id: 3, icon: <Trophy className="w-6 h-6" />, name: "Employee Achievement", path: "/hr/employeeAchievement" },
    {
      id: 4,
      icon: <HandCoins className="w-6 h-6" />,
      name: 'Payroll Management',
      hasSubMenu: true,
      subItems: [
        { id: 41, name: 'Employee List - Pay slip', path: '/emplist' },
        { id: 42, name: 'Loan Request', path: '/emp_loan_RequestList' }
      ],
    },
    {
      id: 5,
      icon: <CalendarCheck className="w-6 h-6" />,
      name: 'Attendance Management',
      hasSubMenu: true,
      subItems: [
        { id: 51, name: 'Attendance Dashboard', path: '/attendenceDashboard' },
        { id: 52, name: 'Employee Attendance', path: '/employeeAttendence' },
        { id: 53, name: 'Leave Management', path: '/leaveManagement' }
      ],
    },
    {
      id: 6,
      icon: <SiProcessingfoundation className="w=6 h-6" />,
      name: 'Onboarding Management',
      hasSubMenu: true,
      subItems: [
        { id: 61, name: 'Add new employee', path: '/createEmployee' },
        { id: 62, name: 'Doumentation uploads', path: '/onboarding_employee' },
        { id: 63, name: 'Candidate Profile', path: '/candidateProfile' },
        { id: 64, name: 'Employee Onboarding Status', path: '/onBoardingTaskVerification' },
        { id: 65, name: 'Onboarding Manager', path: '/onboardingmanager' },
        { id: 66, name: 'Welcome Kit', path: '/onboardingmanegment/welcomeKit' },
      ],
    },
    {
      id: 7,
      icon: <FaMoneyBills className="w-6 h-6" />,
      name: 'Expense Management',
      hasSubMenu: true,
      subItems: [
        { id: 71, name: 'Expense Approval', path: '/expenseApproval' },
        { id: 72, name: 'Overall Expenses', path: '/expensesheet' },
      ],
    },
    {
      id: 8,
      icon: <MdModelTraining className="w-6 h-6" />,
      name: 'Training Management',
      hasSubMenu: true,
      subItems: [
        { id: 81, name: 'Policies', path: '/policiesCategory' },
        { id: 82, name: 'Training Module', path: '/moduleCategory' },
        { id: 83, name: 'Question & Answer', path: '/questionAnswer' },
        { id: 84, name: 'Result', path: '/result' }
      ],
    },
    {
      id: 9,
      icon: <SiProcessingfoundation className="w=6 h-6" />,
      name: "Analytics",
      path: "/analytics"
    },
    {
      id: 10,
      name: "Offboarding Management",
      icon: <SiProcessingfoundation className="w=6 h-6" />,
      hasSubMenu: true,
      subItems: [
        { id: 101, name: 'Resignation', path: '/offboardingManagement/resignation' },
        { id: 102, name: 'Termination', path: '/offboardingManagement/termination' },
        //  { id: 102, name: 'Termination', path: '/offboardingManagement/termination' },
        { id: 103, name: 'Employee Database', path: '/offboardingManagement/employeeDatabase' }
      ]
    }
  ];

  const getAllowedModules = () => {
    if (isSuperAdmin) {
      return SidebarItems;
    }

    if (!hrDetails?.modules) return [];

    return SidebarItems.map(item => {
      if (item.hasSubMenu) {
        const allowedSubItems = item.subItems.filter(subItem => {
          const subModulePermission = hrDetails.modules.find(m =>
            m.moduleName === subItem.name && m.accessTypes?.length > 0
          );
          return !!subModulePermission;
        });

        return allowedSubItems.length > 0
          ? { ...item, subItems: allowedSubItems }
          : null;
      }
      const modulePermission = hrDetails.modules.find(m =>
        m.moduleName === item.name && m.accessTypes?.length > 0
      );
      return modulePermission ? item : null;
    }).filter(Boolean);
  };

  const [filteredSidebarItems, setFilteredSidebarItems] = useState(getAllowedModules());

  useEffect(() => {
    setFilteredSidebarItems(getAllowedModules());
  }, [hrDetails, isSuperAdmin]);

  const handleToggle = (id, subItems = [], parentPath = []) => {
    setExpandedItems((prev) => {
      const isAlreadyOpen = prev.includes(id);
      const newPath = [...parentPath, id];
      if (isAlreadyOpen) {
        const index = prev.indexOf(id);
        return prev.slice(0, index);
      } else {
        if (subItems.length > 0) {
          navigate(subItems[0].path);
        }
        return newPath;
      }
    });
  };

  const renderSubItems = (subItems) => (
    <ul className="transition-all duration-300 ease-in-out">
      {subItems.map((sub, index) => (
        <SubMenuItem
          key={sub.id}
          sub={sub}
          index={index}
          subItems={subItems}
          subExpanded={expandedItems.includes(sub.id)}
          collapsed={collapsed}
          handleToggle={handleToggle}
          item={sub}
          pathname={pathname}
        />
      ))}
    </ul>
  );

  useEffect(() => {
    const handleResize = () => setCollapsed(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    setLogoutClicked(true);
    setTimeout(() => {
      sessionStorage.clear();
      localStorage.clear();
      setUserInfo({ isAuthenticated: false });
      resetSuperAdmin();
      resetHRLogin();
      navigate("/");
    }, 200);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--highlight-color', theme.highlightColor);
  }, [theme]);

  return (
    <div className="relative h-full">
      <div
        className="absolute top-8 -right-1 z-[100] cursor-pointer"
        style={{
          transform: 'translateX(50%)'
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <IoChevronBackCircleSharp
          className={`transition-transform duration-300 ${collapsed ? "rotate-180" : "rotate-0"
            }`}
          style={{
            fill: theme.primaryColor,
            color: "#ffffff",
            width: '28px',
            height: '28px'
          }}
        />
      </div>


      <div
        className={`${collapsed ? "w-[88px]" : "w-[300px]"} h-full overflow-y-auto scrollbar-hide flex justify-between flex-col gap-8 pt-4 shadow-xl`}
        style={{ backgroundColor: theme?.bgSidebar }}
      >
        <div className="flex flex-col px-3">
          <div className="w-full flex justify-center items-center pb-2">
            <img
              className="h-full w-full"
              src={theme?.logoImage || UnisolLogoImage}
              alt="logo"
            />
          </div>
          <div className="w-full p-2 flex flex-col gap-4">
            {filteredSidebarItems?.map((item) => {
              const isExpanded = expandedItems.includes(item.id);
              const checkActive = (subs) => subs?.some(sub => sub.path === pathname || pathname.startsWith(`${sub.path}/`) || checkActive(sub.subItems));
              const isMainActive = checkActive(item.subItems);

              return (
                <SidebarItem
                  key={item.id}
                  item={item}
                  collapsed={collapsed}
                  isExpanded={isExpanded}
                  isMainActive={isMainActive}
                  handleToggle={handleToggle}
                  renderSubItems={renderSubItems}
                  theme={theme}
                  pathname={pathname}
                  setExpandedItems={setExpandedItems}
                />
              );
            })}
          </div>
        </div>

        <div className={`flex flex-col w-full gap-4 py-8 px-4 ${collapsed ? "items-center" : "items-start"} mt-5`}>
          <p className="cursor-pointer font-medium flex text-[#7C8DB5] gap-2 items-start">
            <Info className="w-6 h-6" />
            {!collapsed && "Help Center"}
          </p>
          <p className="cursor-pointer font-medium flex text-[#7C8DB5] gap-2 items-start">
            <img src={contactUs} alt="Contact Us" className="w-6 h-6" />
            {!collapsed && "Contact Us"}
          </p>
        </div>

        <div
          onClick={handleLogout}
          className="sticky bottom-0 flex items-center pt-2 pb-2 w-full h-full border-t-2"
          style={{ backgroundColor: "white", borderColor: theme.highlightColor }}
        >
          <div
            className={`flex items-center gap-3 p-2 mx-4 rounded-lg w-full shadow-sm transition-all duration-300
           ${logoutClicked ? "bg-white text-black shadow-xl" : "bg-[var(--primary-color)] text-white hover:bg-[var(--highlight-color)] hover:text-black"}
           ${collapsed ? "justify-center" : "justify-start"}
         `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-box-arrow-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
              />
              <path
                fillRule="evenodd"
                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
              />
            </svg>
            {!collapsed && (
              <p className="cursor-pointer font-medium flex gap-2 items-start">
                Log out
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
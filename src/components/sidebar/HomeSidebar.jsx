import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { useSignIn } from "../../hooks/auth/useSignIn";
import { useSetRecoilState } from "recoil";
import { userAuthState } from "../../state/isAuthenticatedAtom";
import { useTheme } from "../../hooks/theme/useTheme";
import contactUs from "../../assets/images/contactUs.png";
import { MdGroups } from "react-icons/md";
import { LayoutDashboard } from "lucide-react";
import { IoChevronBackCircleSharp } from "react-icons/io5";

const HomeSidebar = ({ setActiveTab }) => {
  const { resetSuperAdmin } = useSignIn();
  const setUserInfo = useSetRecoilState(userAuthState);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [logoutClicked, setLogoutClicked] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setUserInfo({ isAuthenticated: false });
    resetSuperAdmin();
    navigate("/");
  };
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--highlight-color', theme.highlightColor);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };

    handleResize(); // Call once to set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const SidebarItems = [
    { id: 1, icon: <LayoutDashboard className="w-6 h-6" />, name: "Dashboard", path: "/homeDashboard" },
    { id: 2, icon: <MdGroups className="w-6 h-6" />, name: "Hr Privilege", path: "/home/hrPrivilege" },
    { id: 3, icon: <MdGroups className="w-6 h-6" />, name: "Employee Logins", path: "/employeeLogins" }
  ]

  return (



    <div className="relative h-full">
      <div 
        className="absolute top-8 -right-1 z-[100]  cursor-pointer"
        style={{ 
          transform: 'translateX(50%)'
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <IoChevronBackCircleSharp
          className={`transition-transform duration-300 ${
            collapsed ? "rotate-180" : "rotate-0"
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
      className={`${collapsed ? "w-[88px] " : "w-[300px]"
        } h-full overflow-y-auto scrollbar-hide flex justify-between flex-col gap-8 pt-4 shadow-xl`}
      style={{ backgroundColor: theme?.bgSidebar }}
    >
      <div className="flex flex-col px-2">
        

        <div className="w-full flex justify-center items-center pb-2">
          <img
            className={"h-full w-full"
            }
            src={theme?.logoImage || UnisolLogoImage}
            alt="logo"
          />
        </div>

        <div className="w-full p-2 flex flex-col gap-4 mt-10"

        >
          {SidebarItems?.map((item) => {
            return (
              <div key={item.id}>
                {
                  <NavLink to={item.path} >
                    {({ isActive }) => (
                      <div
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer
                           ${collapsed ? "justify-center" : "justify-start px-4"}
                           ${isActive
                            ? "bg-white text-black shadow-xl"
                            : "bg-[#4FA8E5] text-white"
                          }
                           hover:bg-[var(--highlight-color)] hover:text-black
                           shadow-sm hover:shadow-xl transition-all duration-300`}
                      //  style={{ backgroundColor: theme?.primaryColor }}
                      >
                        <span className="w-6 h-6 text-inherit">
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <p className="text-base font-medium w-full">
                            {item.name}
                          </p>
                        )}
                      </div>
                    )}
                  </NavLink>
                }
              </div>
            );

          })}

        </div>
      </div>

      <div
        className={`flex flex-col w-full gap-4 py-8 px-4 ${collapsed ? "items-center" : "items-start"
          } mt-auto `}
      >
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
        className="sticky bottom-0 flex items-center pt-2 pb-2 w-full h-25 border-t-4"
        style={{ backgroundColor: "white", borderColor: theme.highlightColor }}
      >
        <div
          className={`flex items-center gap-3 p-2 mx-4 rounded-lg w-full shadow-sm transition-all duration-300
       ${logoutClicked
              ? "bg-white text-black shadow-xl"
              : "bg-[var(--primary-color)] text-white hover:bg-[var(--highlight-color)] hover:text-black"
            }
       ${collapsed ? "justify-center" : "justify-start"}
     `}
          style={{ backgroundColor: theme?.primaryColor }}
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
};

export default HomeSidebar;
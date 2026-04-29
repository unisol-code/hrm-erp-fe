import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaChevronDown, FaArrowLeft } from "react-icons/fa";
import { useSetRecoilState } from "recoil";
import { userAuthState } from "../../state/isAuthenticatedAtom";
import UnisolLogoImage from "../../assets/images/unisolLogoImg.png";
import { HandCoins, LayoutDashboard } from "lucide-react";
import educational from "../../assets/images/educational.png";
import requirdDoc from "../../assets/images/requirdDoc.png";
import training from "../../assets/images/training.png";
import contactUs from "../../assets/images/contactUs.png";
import AppraisalIcon from "../../assets/images/appraisalicon.png";
import PrivacyIcon from "../../assets/images/privacy.png";
import SelfEvaluationIcon from "../../assets/images/selfAssesment.png";
import { useSignIn } from "../../hooks/auth/useSignIn";
import { useTheme } from "../../hooks/theme/useTheme";
import useInactivity from "../../hooks/useInactivity";
import { Info } from "lucide-react";
import { LiaCertificateSolid } from "react-icons/lia";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { MdModelTraining } from "react-icons/md";
import { GoStar } from "react-icons/go";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { PiExam } from "react-icons/pi";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { UserMinus } from "lucide-react";

const EmployeeSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
  const [expandedItems, setExpandedItems] = useState([]);
  const [logoutClicked, setLogoutClicked] = useState(false);
  const { resetSuperAdmin } = useSignIn();
  const setUserInfo = useSetRecoilState(userAuthState);
  const navigate = useNavigate();

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

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };

    handleResize(); // Call once to set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    console.log("logout ho gaya");
    sessionStorage.clear();
    localStorage.clear();
    setUserInfo({ isAuthenticated: false });
    navigate("/");
  };

  useInactivity(handleLogout);

  const SidebarItems = [
    {
      id: 1,
      icon: <LayoutDashboard className="w-6 h-6" />,
      name: "Dashboard",
      path: "/EmployeeDashboard",
    },
    {
      id: 2,
      icon: <LiaCertificateSolid className="w-6 h-6" />,
      name: "Employee Overview",
      hasSubMenu: true,
      subItems: [
        { id: 103, name: 'Employee Achievement', path: '/emp/educationalOverview' },
        { id: 104, name: 'Welcome Kit', path: '/emp/employeeOverview/employeeKit' },
      ],
    },
    {
      id: 3,
      icon: <HiOutlineDocumentAdd className="w-6 h-6" />,
      name: "Required Document",
      path: "/emp/uploadedRequiredDocuments",
    },
    {
      id: 4,
      icon: <MdModelTraining className="w-6 h-6" />,
      name: "Project",
      path: "/emp/training",
    },
    {
      id: 5,
      icon: <GoStar className="w-6 h-6" />,
      name: "Reward Program",
      path: "/emp/rewardprogram",
    },
    {
      id: 6,
      icon: <HandCoins className="w-6 h-6" />,
      name: "Appraisal",
      path: "/emp/appraisal",
    },
    {
      id: 9,
      name: "Loan request",
      icon: <HandCoins className="w-6 h-6" />,
      path: "/emp/loanrequest",
    },
    {
      id: 7,
      icon: <MdOutlinePrivacyTip className="w-6 h-6" />,
      name: "Policies",
      path: "/emp/privacypolicy",
    },
    {
      id: 8,
      icon: <PiExam className="w-6 h-6" />,
      name: "Self Evaluation",
      hasSubMenu: true,
      subItems: [
        { id: 71, name: "For Policy", path: "/emp/selfevaluation/policy" },
        { id: 73, name: "For Training", path: "/emp/selfevaluation/training" },
        { id: 72, name: "Test Result", path: "/emp/selfevaluation/testresult" },
      ],
    },
    {
      id: 10,
      icon:  <UserMinus  className="w-6 h-6"  />,
      name: "Resignation",
      path: "/emp/resignation",
    },
  ];

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary-color",
      theme.primaryColor
    );
    document.documentElement.style.setProperty(
      "--highlight-color",
      theme.highlightColor
    );
    document.documentElement.style.setProperty(
      "--secondary-color",
      theme.secondaryColor
    );
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
        className={`${collapsed ? "w-[88px]" : "w-[300px]"
          } h-full overflow-y-auto scrollbar-hide flex justify-between flex-col gap-8 pt-4 shadow-xl`}
        style={{ backgroundColor: theme?.bgSidebar }}
      >
        <div className="flex flex-col px-3 pt-2">
          <div className="w-full flex justify-center items-center pb-2">
            <img
              className="h-full w-full"
              src={theme?.logoImage || UnisolLogoImage}
              alt="logo"
            />
          </div>

          <div className="w-full p-2 flex flex-col gap-4">
            {SidebarItems.map((item) => {
              const hasSubMenu = item.hasSubMenu;
              const isExpanded = expandedItems.includes(item.id);
              const checkActive = (subs) =>
                subs?.some(
                  (sub) =>
                    sub.path === window.location.pathname ||
                    checkActive(sub.subItems)
                );
              const isMainActive = checkActive(item.subItems);

              const renderSubItems = (subItems) => (
                <ul className="transition-all duration-300 ease-in-out">
                  {subItems.map((sub, index) => {
                    const subExpanded = expandedItems.includes(sub.id);
                    const isLast = index === subItems.length - 1;
                    const hasNoSubSubItems =
                      !sub.subItems || sub.subItems.length === 0;

                    return (
                      <li key={sub.id} className="list-none font-medium">
                        {sub.hasSubMenu ? (
                          <>
                            <div
                              onClick={() =>
                                handleToggle(sub.id, sub.subItems, [item.id])
                              }
                              className={`flex items-center justify-between gap-2 p-2 text-sm cursor-pointer
             ${collapsed ? "justify-center" : "justify-between"}
             ${subExpanded ? "bg-white text-black" : "text-black"}
             ${hasNoSubSubItems && !isLast ? "border-b border-white" : ""}
             shadow-sm hover:shadow-md transition-all duration-200`}
                            >
                              {!collapsed && (
                                <p className="text-sm font-medium w-full text-center">
                                  {sub.name}
                                </p>
                              )}
                              {!collapsed && (
                                <FaChevronDown
                                  className={`transition-transform duration-300 ${subExpanded ? "rotate-180" : "rotate-0"
                                    } text-black`}
                                />
                              )}
                            </div>

                            {subExpanded && !collapsed && sub.subItems && (
                              <ul className="mb-1 mt-2 ml-4 pb-2 pr-1">
                                {sub.subItems.map((child, childIndex) => (
                                  <li key={child.id}>
                                    <NavLink to={child.path}>
                                      {({ isActive }) => (
                                        <div
                                          className={`text-sm p-2 cursor-pointer text-center rounded-md mb-2
                       ${isActive
                                              ? "bg-white text-black shadow"
                                              : "text-black shadow-sm"
                                            }
                       hover:shadow-md transition-all duration-200`}
                                        >
                                          <p className="text-sm text-center font-medium">
                                            {child.name}
                                          </p>
                                        </div>
                                      )}
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        ) : (
                          <NavLink to={sub.path}>
                            {({ isActive }) => (
                              <div
                                className={`text-sm p-2 cursor-pointer
               ${isLast ? "rounded-b-lg" : "border-b border-white"}
               ${isActive ? "bg-white text-black shadow" : "text-black shadow-sm"}
               hover:shadow-md transition-all duration-200`}
                              >
                                <p className="text-sm font-medium text-center">
                                  {sub.name}
                                </p>
                              </div>
                            )}
                          </NavLink>
                        )}
                      </li>
                    );
                  })}
                </ul>
              );

              return (
                <div key={item.id}>
                  {hasSubMenu ? (
                    <>
                      <div
                        onClick={() => handleToggle(item.id, item.subItems, [])}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer
                           ${collapsed ? "justify-center" : "justify-start px-4"}
                           ${isMainActive
                            ? "bg-white text-black shadow-xl"
                            : "bg-[var(--primary-color)] text-white hover:text-black hover:bg-[var(--highlight-color)]"
                          } hover:scale-[1.02] active:scale-95
                           ${isMainActive && isExpanded
                            ? "border-b-2 border-black"
                            : ""
                          }
                           ${isExpanded ? "rounded-b-none" : ""}
                           shadow-xl hover:shadow-xl transition-all duration-300`}
                      >
                        <span className="w-6 h-6 text-inherit">{item.icon}</span>
                        {!collapsed && (
                          <p className="text-sm font-medium w-full">
                            {item.name}
                          </p>
                        )}
                        {!collapsed && (
                          <FaChevronDown
                            className={`transition-transform duration-500 ${isExpanded ? "rotate-180" : "rotate-0"
                              }`}
                          />
                        )}
                      </div>

                      {isExpanded && !collapsed && (
                        <div className="bg-[var(--highlight-color)] rounded-b-lg mb-2">
                          {renderSubItems(item.subItems)}
                        </div>
                      )}
                    </>
                  ) : (
                    <NavLink to={item.path} onClick={() => setExpandedItems([])}>
                      {({ isActive }) => (
                        <div
                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer
                           ${collapsed ? "justify-center" : "justify-start px-4"}
                           ${isActive
                              ? "bg-white text-black shadow-xl"
                              : "bg-[var(--primary-color)] text-white"
                            }
                           hover:bg-[var(--highlight-color)] hover:text-black
                           shadow-sm hover:shadow-xl transition-all duration-300`}
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
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`flex flex-col w-full gap-4 py-8 px-4 ${collapsed ? "items-center" : "items-start"
            } mt-5`}
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
          className="sticky bottom-0 flex items-center pt-2 pb-2 w-full h-full border-t-4"
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

export default EmployeeSidebar;
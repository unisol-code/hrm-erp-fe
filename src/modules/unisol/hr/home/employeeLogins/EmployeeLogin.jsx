import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useEmployeeLogin from "../../../../../hooks/unisol/homeDashboard/useEmployeeLogin";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";

const EmployeeLogin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { theme } = useTheme();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    title: "",
    description: "",
    severity: "success",
  });
  const navigate = useNavigate();
  const {
    fetchUnisolEmployeeLogin,
    loading,
    errors,
    unisolEmployeeLogin,
    surgisolEmployeeLogin,
    igniteSphereEmployeeLogin,
    enviroSolutionEmployeeLogin,
    fetchSurgisolEmployeeLogin,
    fetchIgniteSphereEmployeeLogin,
    fetchEnviroSolutionEmployeeLogin,
    fetchPerCompanyEmployeeLogin,
  } = useEmployeeLogin();

  useEffect(() => {
    fetchUnisolEmployeeLogin();
    fetchSurgisolEmployeeLogin();
    fetchIgniteSphereEmployeeLogin();
    fetchEnviroSolutionEmployeeLogin();
  }, []);

  const handleNavigate = () => {
    navigate("/employeeLogins/unisolEdit");
  };

  const showToast = (title, description, severity = "success") => {
    setToast({ open: true, title, description, severity });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const companies = [
    {
      id: "unisol",
      name: "Unisol",
      employees: unisolEmployeeLogin?.employees,
      color: "#4FA8E5, #4FA8E5",
      tableColor: "bg-[#4FA8E533]",
      seeColor: "bg-[#89CFF077]",
      seeAll: unisolEmployeeLogin?.company,
    },
    {
      id: "surgisol",
      name: "Surgisol",
      employees: surgisolEmployeeLogin?.employees,
      tableColor: "bg-[#C6693C33]",
      color: "#C6693C, #C6693C",
      seeColor: "bg-[#C6693C22]",
      seeAll: surgisolEmployeeLogin?.company,
    },
    {
      id: "EnviroSolution",
      name: "EnviroSolution",
      employees: enviroSolutionEmployeeLogin?.employees,
      tableColor: "bg-[#4A7E4C33]",
      color: "#4A7E4C, #4A7E4C",
      seeColor: "bg-[#E8F5E8]",
      seeAll: enviroSolutionEmployeeLogin?.company,
    },
    {
      id: "IgniteSphere",
      name: "IgniteSphere",
      employees: igniteSphereEmployeeLogin?.employees,
      tableColor: "bg-[#9683EC33]",
      color: "#9683EC, #9683EC",
      seeColor: "bg-[#D6D8FB]",
      seeAll: igniteSphereEmployeeLogin?.company,
    },
  ];

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.employees || []).some(
        (emp) =>
          emp?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp?.username?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleAddEmployee = () => {
    showToast("Employee Added", "New employee has been successfully added.");
    setIsAddModalOpen(false);
  };

  return (
    <>
      <BreadCrumb linkText={[{ text: "Employee Login", href: "/employeeLogins" }]} />
      <div className="min-h-screen">
        {/* Page header */}
        <div
          className="flex flex-col rounded-2xl px-4 sm:px-6 py-3 sm:py-4 mb-4"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <div>
            <p className="text-xl sm:text-2xl font-semibold">Employee Logins</p>
            <p className="text-xs sm:text-sm font-light">
              Multi-Company Employee Login Management
            </p>
          </div>
        </div>

        {/* Companies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company, index) => (
              <div
                key={company.id + index}
                className="bg-white rounded-2xl shadow-md flex flex-col overflow-hidden"
              >
                {/* Card Header */}
                <div
                  className="flex flex-wrap justify-between items-center text-white px-3 sm:px-4 py-3 rounded-t-2xl gap-2"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${company.color})`,
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <BusinessIcon className="shrink-0" />
                    <h2 className="text-base sm:text-lg font-semibold truncate">
                      {company.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-1 text-xs sm:text-sm shrink-0">
                    <PeopleIcon fontSize="small" />
                    {company?.employees?.length || 0} employees
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow">
                  {/* Scrollable table area — header + rows move together */}
                  <div className="overflow-x-auto">
                    <div className="min-w-[520px]">
                      {/* Header Row */}
                      <div className="px-1 sm:px-2 py-2 bg-gray-100 text-xs sm:text-sm font-semibold grid grid-cols-4 text-center">
                        <div className="break-words whitespace-normal text-left px-2 sm:px-4">
                          Employee ID
                        </div>
                        <div className="break-words whitespace-normal text-left px-2 sm:px-4">
                          Employee Name
                        </div>
                        <div className="break-words whitespace-normal text-left px-2 sm:px-4">
                          Username
                        </div>
                        <div className="break-words whitespace-normal text-left px-2 sm:px-4">
                          Password
                        </div>
                      </div>

                      {/* Body */}
                      <div className={company.tableColor}>
                        <div className="divide-y text-center">
                          {company?.employees?.length > 0 ? (
                            company.employees.map((emp) => (
                              <div
                                key={emp.employeeId}
                                className="grid grid-cols-4 items-start px-1 sm:px-2 py-2 text-xs sm:text-sm text-center"
                              >
                                <div className="break-words whitespace-normal text-left px-2 sm:px-4">
                                  {emp.employeeId}
                                </div>
                                <div className="break-words whitespace-normal text-left px-2 sm:px-4">
                                  {emp.fullName}
                                </div>
                                <div className="break-words whitespace-normal text-left px-2 sm:px-4">
                                  {emp.officialEmail}
                                </div>
                                <div className="break-words whitespace-normal text-left px-2 sm:px-4">
                                  {emp.password || "**********"}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm">No Employees Found.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer — outside the scroll area so it stays full width */}
                  <div
                    className={`text-center flex justify-center items-center px-4 py-2 text-xs sm:text-sm text-black hover:text-blue-800 hover:bg-blue-100 transition hover:underline duration-200 cursor-pointer mt-auto rounded-b-2xl ${company.seeColor}`}
                    onClick={() => {
                      fetchPerCompanyEmployeeLogin(company.seeAll, 1, 10);
                      handleNavigate();
                    }}
                  >
                    See all
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-6 text-center text-slate-500 col-span-full">
              No Data found
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeeLogin;
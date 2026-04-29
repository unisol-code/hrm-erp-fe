import { useEffect, useState } from "react";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import Pagination from "../../../../../components/Pagination";
import { FaGraduationCap } from "react-icons/fa";
import { IconButton } from "@mui/material";
import useEmpAchievement from "../../../../../hooks/unisol/empAchievement/useEmpAchievement";
import Select from "react-select";
import useEmployee from "../../../../../hooks/unisol/onboarding/useEmployee";

const EmpTrainingList = () => {
  const companyId = sessionStorage.getItem("companyId");
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const { loading, fetchEmployeeTrainingList, empTrainingList } =
    useEmpAchievement();

  const onPageChange = (data) => {
    setPage(data);
    fetchRewardPrograms(limit, data, grade);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    fetchRewardPrograms(limit, data, grade);
  };
  const {
    fetchDepartments,
    departmentDrop,
    fetchEmployeeByDept,
    employeeByDept,
  } = useEmployee();

  useEffect(() => {
    fetchEmployeeTrainingList();
    fetchDepartments();
    fetchEmployeeByDept();
  }, []);

  const filteredData = empTrainingList?.data?.filter((item) => {
    let matchesDept = selectedDepartment
      ? item.department === selectedDepartment
      : true;
    let matchesEmployee = selectedEmployee
      ? item.employeeName === selectedEmployee
      : true;
    return matchesDept && matchesEmployee;
  });

  // Mock data - replace with actual API call
  const [trainingList, setTrainingList] = useState({
    data: [
      {
        id: 1,
        empId: "EMP001",
        employeeName: "John Doe",
        department: "IT",
        grade: "A2",
        designation: "Developer",
        action: "Pending",
      },
    ],
  });

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb
        linkText={[
          {
            text: "Employee Achievement",
            href: "/hr/employeeAchievement",
          },
          ,
          { text: "Employee's Project List" },
        ]}
      />
      {/* Header Section */}
      <div className="py-4 px-8 flex flex-col md:flex-row md:items-center rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
        <div className="flex items-center gap-3 flex-1">
          <FaGraduationCap
            style={{ color: theme.primaryColor, fontSize: 32 }}
          />
          <span className="text-2xl font-bold">Employee's Project List</span>
        </div>
      </div>
      <section className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
        {/* Section Header - Gradient, Icon, Title */}
        <div
          className="w-full h-[60px] flex items-center justify-between px-8 bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff]"
          style={{
            background: `linear-gradient(90deg, #f5f9fc 0%, ${theme.highlightColor} 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <FaGraduationCap className="text-blue-600 text-xl" />
            <h2 className="font-bold text-xl text-gray-700">Project List</h2>
          </div>

          <div className=" grid grid-cols-1 lg:grid-cols-2  gap-6 ">
            {/* Department Field */}
            <div>
              <Select
                name="department"
                placeholder="Select department"
                isLoading={loading}
                options={departmentDrop.map((dept) => ({
                  label: dept,
                  value: dept,
                }))}
                classNamePrefix="react-select"
                isClearable
                onChange={(selected) => {
                  if (selected) {
                    setSelectedDepartment(selected.value);
                    fetchEmployeeByDept(selected.value); // fetch employees for dept
                    setSelectedEmployee(""); // reset employee when dept changes
                  } else {
                    setSelectedDepartment("");
                    setSelectedEmployee("");
                  }
                }}
                styles={{
                  control: (base) => ({
                    ...base,
                    width: "300px",
                    borderColor: theme.secondaryColor,
                    borderRadius: "0.375rem",
                    padding: "2px 6px",
                  }),
                  option: (base) => ({
                    ...base,
                    width: "300px",
                    padding: "8px 12px",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                  }),
                  menu: (base) => ({
                    ...base,
                    width: "300px",
                    zIndex: 999,
                  }),
                }}
              />
            </div>

            {/* Candidate Field */}
            <div>
              <Select
                name="fullName"
                placeholder="Select Full Name"
                isLoading={loading}
                isDisabled={!selectedDepartment}
                isClearable
                options={
                  Array.isArray(employeeByDept?.employees)
                    ? employeeByDept.employees.map((e) => ({
                        label: e.fullName,
                        value: e.fullName,
                      }))
                    : []
                }
                onChange={(selected) => {
                  setSelectedEmployee(selected ? selected.value : "");
                }}
                styles={{
                  control: (base) => ({
                    ...base,
                    width: "300px",
                    borderColor: theme.secondaryColor,
                    borderRadius: "0.375rem",
                    padding: "2px 6px",
                  }),
                  option: (base) => ({
                    ...base,
                    width: "300px",
                    padding: "8px 12px",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                  }),
                  menu: (base) => ({
                    ...base,
                    width: "300px",
                    zIndex: 999,
                  }),
                }}
              />
            </div>
          </div>
        </div>
        {/* Table Section */}
        <div className="w-full p-4">
          <table className="w-full text-center">
            <thead>
              <tr className="font-semibold text-gray-600 h-[50px] border-b-2 border-gray-300">
                <th className="px-4">Sr. No.</th>
                <th className="px-4">Emp ID</th>
                <th className="px-4">Employee Name</th>
                <th className="px-4">Department</th>
                <th className="px-4">Grade</th>
                <th className="px-4">Designation</th>
                <th className="px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-gray-500 text-lg">
                    No training records found.
                  </td>
                </tr>
              ) : (
                filteredData?.map((item, index) => (
                  <tr
                    key={item.id}
                    className="h-[60px] border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 font-medium">{index + 1}</td>
                    <td className="px-4">{item.empId}</td>
                    <td className="px-4 font-semibold text-slate-700">
                      {item.employeeName}
                    </td>
                    <td className="px-4">{item.department}</td>
                    <td className="px-4">{item.grade}</td>
                    <td className="px-4">{item.designation}</td>
                    <td className="px-4">
                      <IconButton
                        onClick={() => {
                          navigate(
                            `/hr/employeeAchievement/empTrainingList/viewEmpTraining/${item.id}`
                          );
                        }}
                      >
                        <Eye size={20} style={{ color: theme.primaryColor }} />
                      </IconButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <Pagination
          currentPage={empTrainingList?.currentPage}
          totalPages={empTrainingList?.totalPages}
          totalItems={empTrainingList?.totalCount}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      </section>
    </div>
  );
};

export default EmpTrainingList;

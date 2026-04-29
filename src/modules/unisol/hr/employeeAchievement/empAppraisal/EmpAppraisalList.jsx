import { useEffect, useState } from "react";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import Pagination from "../../../../../components/Pagination";
import { FaGraduationCap } from "react-icons/fa";
import { IconButton } from "@mui/material";
import { RiImageCircleLine } from "react-icons/ri";
import Select from "react-select";
import useEmployee from "../../../../../hooks/unisol/onboarding/useEmployee";
import Button from "../../../../../components/Button";
import useLeadershipAppraisal from "../../../../../hooks/unisol/empAchievement/useLeadershipAppraisal";
import useDebounce from "../../../../../hooks/debounce/useDebounce";
import LoaderSpinner from "../../../../../components/LoaderSpinner";

const EmpAppraisalList = () => {
  const { fetchDepartments, departmentDrop } = useEmployee();

  const {
    loading,
    empAppraisalList,
    fetchEmpAppraisalList,
  } = useLeadershipAppraisal();

  const { theme } = useTheme();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  // ================= FETCH DEPARTMENTS =================
  useEffect(() => {
    fetchDepartments();
  }, []);

  // ================= FETCH LIST =================
  useEffect(() => {
    fetchEmpAppraisalList({
      page,
      limit,
      department: selectedDepartment,
      debouncedSearch,
    });
  }, [page, limit, selectedDepartment, debouncedSearch]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedDepartment]);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const onView = (id) => {
    navigate(`/hr/employeeAchievement/appraisalList/empWiseAppraisal/${id}`);
  }
  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* ================= BREADCRUMB ================= */}
      <Breadcrumb
        linkText={[
          {
            text: "Employee Achievement",
            href: "/hr/employeeAchievement",
          },
          { text: "Employee's Appraisal List" },
        ]}
      />

      {/* ================= HEADER ================= */}
      <div className="py-4 px-8 flex flex-col md:flex-row md:items-center md:justify-between rounded-2xl bg-white shadow-lg gap-3 mb-4">
        <div className="flex items-center gap-3">
          <FaGraduationCap
            style={{ color: theme.primaryColor, fontSize: 32 }}
          />
          <span className="text-2xl font-bold">
            Employee's Appraisal List
          </span>
        </div>

        <div className="flex gap-3">
          <Button
            variant={1}
            onClick={() =>
              navigate(
                "/hr/employeeAchievement/appraisalList/setAppraisal"
              )
            }
            text="Set Business Appraisal"
          />
          <Button
            variant={1}
            onClick={() =>
              navigate(
                "/hr/employeeAchievement/appraisalList/leadership-Appraisal"
              )
            }
            text="Set Leadership Appraisal"
          />
        </div>
      </div>

      {/* ================= MAIN SECTION ================= */}
      <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* FILTER HEADER */}
        <div
          className="h-[80px] flex flex-col md:flex-row md:items-center md:justify-between px-8 gap-3"
          style={{
            background: `linear-gradient(90deg, #f5f9fc 0%, ${theme.highlightColor} 100%)`,
          }}
        >
          <h2 className="font-bold text-xl text-gray-700">
            Appraisal List
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search by Name */}
            <input
              type="text"
              placeholder="Search by Employee Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-[42px] px-4 border border-gray-300 rounded-md 
             focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <Select
              placeholder="Select Department"
              options={departmentDrop?.map((dept) => ({
                label: dept,
                value: dept,
              }))}
              isClearable
              onChange={(selected) =>
                setSelectedDepartment(selected?.value || "")
              }
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "42px",
                  height: "42px",
                }),
                valueContainer: (base) => ({
                  ...base,
                  height: "42px",
                  padding: "0 8px",
                }),
                indicatorsContainer: (base) => ({
                  ...base,
                  height: "42px",
                }),
              }}
            />

          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-center min-w-[900px]">
            <thead>
              <tr className="font-semibold text-gray-600 h-[50px] border-b-2 border-gray-300">
                <th>Sr. No.</th>
                <th>Emp ID</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Grade</th>
                <th>Designation</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8">
                    <div className="flex justify-center">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              ) : empAppraisalList?.data?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-gray-500">
                    No appraisal records found.
                  </td>
                </tr>
              ) : (
                empAppraisalList?.data?.map((item, index) => (
                  <tr
                    key={item.id}
                    className="h-[60px] border-b hover:bg-gray-50 transition"
                  >
                    {/* Serial Number */}
                    <td>{(page - 1) * limit + index + 1}</td>

                    <td>{item.employeeId}</td>

                    {/* Photo + Name */}
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        {item?.photo ? (
                          <img
                            src={item.photo}
                            alt={item.fullName}
                            className="h-[40px] w-[40px] rounded-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/default-avatar.png";
                            }}
                          />
                        ) : (
                          <RiImageCircleLine
                            size={25}
                            className="text-blue-500"
                          />
                        )}

                        <span className="font-semibold text-slate-700">
                          {item?.fullName || "-"}
                        </span>
                      </div>
                    </td>

                    <td>{item.department}</td>
                    <td>{item.payrollGrade}</td>
                    <td>{item.designation}</td>

                    <td>
                      <IconButton
                        onClick={() => onView(item._id)}
                      >
                        <Eye
                          size={20}
                          style={{ color: theme.primaryColor }}
                        />
                      </IconButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        <Pagination
          currentPage={empAppraisalList?.currentPage}
          totalPages={empAppraisalList?.totalPages}
          totalItems={empAppraisalList?.totalItems}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </section>
    </div>
  );
};

export default EmpAppraisalList;

import { useEffect, useState } from "react";
import { RiImageCircleLine } from "react-icons/ri";
import { FaChevronDown } from "react-icons/fa6";
import { IoCloudUploadOutline } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import useAttendence from "../../../../hooks/unisol/attendence/useAttendence";
import Pagination from "../../../../components/Pagination";
import useEmployee from "../../../../hooks/unisol/onboarding/useEmployee";
import { CiSearch } from "react-icons/ci";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import Button from "../../../../components/Button";
import Select from "react-select";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import useEmpAttendence from "../../../../hooks/unisol/empAttendence/useEmpAttendence";
import Profile from "../../../../assets/images/profile-image.png";
import RemarkDialog from "../../../../utils/remarkDialog";
import { FaEye } from "react-icons/fa";
import { negate } from "lodash";

const EmployeeAttendence = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [todayDate, setTodayDate] = useState(new Date());
  const getFormattedDate = (date) => date.toISOString().split("T")[0];
  const [filters, setFilters] = useState({
    department: "",
    date: getFormattedDate(todayDate),
  });
  const {
    fetchDepartments,
    departmentDrop,
    loading: employeeLoading,
  } = useEmployee();
  const {
    getAllEmployeeAttendanceDetails,
    allEmployeeAttendanceDetails,
    loading,
    remarkLeave,
  } = useAttendence();
  const { resetEmpById, resetTwoMonthAttendance, resetWeeklyAttendance } =
    useEmpAttendence();
  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    getAllEmployeeAttendanceDetails(page, limit, filters);
  }, [page, limit, filters]);
  console.log("allEmployeeAttendanceDetails : ", allEmployeeAttendanceDetails);

  const handleOnClick = (id) => {
    setSelectedEmpId(id);
    setShowDialog(true);
  };
  const onPageChange = (newPage) => {
    setPage(newPage);
  };

  const onItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };
  const handleFilterChange = (key, value) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleMonthlyAttendance = () => {
    navigate("/employeeAttendence/monthlyAttendance");
  }

  return (
    <div className="w-full min-h-screen">
      <RemarkDialog
        isOpen={showDialog}
        onClose={() => {
          setShowDialog(false);
          setSelectedEmpId(null);
        }}
        onSubmit={async (remark) => {
          if (!selectedEmpId) return;
          try {
            setIsSubmitting(true);
            // send employeeId and remark in request body; date remains in query params
            await remarkLeave(filters, { employeeId: selectedEmpId, remark });
            // refresh the list after successful change
            getAllEmployeeAttendanceDetails(page, limit, filters);
          } catch (err) {
            // error handling is done in hook; still ensure UI resets
            console.error("Error submitting remark:", err);
          } finally {
            setIsSubmitting(false);
            setShowDialog(false);
            setSelectedEmpId(null);
          }
        }}
        isLoading={isSubmitting}
      />
      <Breadcrumb
        linkText={[
          { text: "Attendance Management" },
          { text: "Employee Attendance" },
        ]}
      />
      {/* Card Container */}
      <div className="w-full bg-white rounded-2xl overflow-hidden">
        {/* Search & Filter Bar */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 py-4 px-8 rounded-t-xl"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <h1 className="text-[#252C58] text-xl whitespace-nowrap">
            Employee List
          </h1>

          <div className="flex justify-end items-center gap-2">

            <Button
              variant={1}
              onClick={handleMonthlyAttendance}
              text="Monthly Attendance"
            />

            <Select
              name="department"
              isLoading={employeeLoading}
              options={departmentDrop.map((dept) => ({
                label: dept,
                value: dept,
              }))}
              value={
                filters.department
                  ? { label: filters.department, value: filters.department }
                  : null
              }
              onChange={(selected) => {
                const value = selected?.value || "";
                handleFilterChange("department", value);
              }}
              placeholder="Select Department"
              isClearable
              classNamePrefix="react-select"
              menuPortalTarget={document.body}
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  borderColor: state.isFocused
                    ? theme.secondaryColor
                    : "#d1d5db",
                  boxShadow: state.isFocused
                    ? `0 0 0 2px ${theme.secondaryColor}33`
                    : "none",
                  borderRadius: "0.5rem",
                  padding: "3px",
                  zIndex: 100,
                }),
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
              }}
            />

            {/* Date Picker */}
            <input
              className="text-base px-4 py-2 rounded-md text-black border"
              type="date"
              onChange={(e) => handleFilterChange("date", e.target.value)}
              value={filters.date}
            />
          </div>
        </div>

        {/* Table & Pagination */}
        <div>
          <div className="max-h-[480px] overflow-y-scroll">
            <table className="min-w-[650px] w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-base font-semibold text-gray-700 whitespace-nowrap">
                    Sr. No.
                  </th>
                  <th className="p-4 text-base font-semibold text-gray-700">
                    Employee
                  </th>
                  <th className="p-4 text-base font-semibold text-gray-700">
                    Designation
                  </th>
                  <th className="p-4 text-base font-semibold text-gray-700">
                    Employment Type
                  </th>
                  <th className="p-4 text-base font-semibold text-gray-700">
                    Department
                  </th>
                  <th className="p-4 text-base font-semibold text-gray-700">
                    Attendance Mark
                  </th>
                  <th className="p-4 text-base font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="py-4 flex justify-center items-center">
                        <LoaderSpinner />
                      </div>
                    </td>
                  </tr>
                ) : allEmployeeAttendanceDetails?.data?.employees?.length >
                  0 ? (
                  allEmployeeAttendanceDetails?.data?.employees?.map(
                    (detail, index) => (
                      <tr
                        key={detail?._id}
                        className="border-b border-gray-300"
                      >
                        <td className="p-4 text-sm">
                          {" "}
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="p-4 text-sm">
                          <div className="flex items-center">
                            {/* <RiImageCircleLine size={24} className="mr-2" /> */}
                            <img
                              src={detail?.photo || Profile}
                              alt="img"
                              className="h-[40px] w-[40px] rounded-full object-cover mr-2"
                            />
                            {detail?.employeeName}
                          </div>
                        </td>
                        <td className="p-4 text-sm">{detail?.jobTitle}</td>
                        <td className="p-4 text-sm">
                          {detail?.employeementType}
                        </td>
                        <td className="p-4 ">{detail?.department}</td>
                        <td className="p-4">
                          <div className="flex flex-col justify-center items-start space-y-2">
                            <h2
                              className={`py-2 px-4 text-center font-semibold rounded-md 
                            ${detail?.status === "Present"
                                  ? "text-[#03A300] bg-[#B7FFBAC9]"
                                  : "text-[#AA0000] bg-[#FFE5EE]"
                                }`}
                            >
                              {detail?.status}
                            </h2>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <Button
                              variant={2}
                              onClick={() => {
                                resetEmpById(),
                                  resetTwoMonthAttendance(),
                                  resetWeeklyAttendance();
                                handleOnClick(detail?.EmpObjectId);
                              }}
                              text="A|P"
                            />

                            {/* vertical divider */}
                            <div
                              aria-hidden="true"
                              className="h-9 w-[2px] bg-gray-900 ml-2 mr-0"
                            />

                            <button
                              type="button"
                              title="View"
                              style={{ color: theme.primaryColor }}
                              className="hover:scale-110 transition"
                              onClick={() => navigate(`/employeeAttendence/employeeAttendenceDetails/${detail?.EmpObjectId}`)}
                            >
                              <FaEye size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex justify-center items-center w-full py-4 text-gray-700">
                        No Data Found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {!loading &&
            allEmployeeAttendanceDetails?.data?.employees.length > 0 && (
              <Pagination
                currentPage={
                  allEmployeeAttendanceDetails?.data?.pagination?.currentPage
                }
                totalPages={
                  allEmployeeAttendanceDetails?.data?.pagination?.totalPages
                }
                totalItems={
                  allEmployeeAttendanceDetails?.data?.pagination?.totalCount
                }
                itemsPerPage={limit}
                onPageChange={onPageChange}
                onItemsPerPageChange={onItemsPerPageChange}
              />
            )}
        </div>
      </div>
    </div>
  );
};
export default EmployeeAttendence;

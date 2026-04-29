import { useEffect, useState } from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { RiImageCircleLine } from "react-icons/ri";
import { IoEyeOutline } from "react-icons/io5";
import { IoIosArrowRoundForward } from "react-icons/io";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import AddEmployee from "../../../../components/Dialogs/AddEmployee";
import EmployeeDetail from "../../../../components/Dialogs/EmployeeDetail";
import SearchEmp from "../../../../components/Dialogs/SearchEmp";
import AddEvent from "../../../../components/Dialogs/AddEvent";
import { Tree, TreeNode } from "react-organizational-chart";
import { LiaExpandArrowsAltSolid } from "react-icons/lia";
import OrganizationalHierarchy from "../../../../components/Dialogs/OrganizationalHierarchy";
import useCoreHR from "../../../../hooks/unisol/coreHr/useCoreHR";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CiEdit } from "react-icons/ci";
import useCoreHRAttendance from "../../../../hooks/unisol/coreHr/useCoreHRAttendance";
import useCoreHREvent from "../../../../hooks/unisol/coreHr/useCoreHREvent";
import Pagination from "../../../../components/Pagination";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import useEmployee from "../../../../hooks/unisol/onboarding/useEmployee";
import Select from "react-select";
import Button from "../../../../components/Button";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import { Eye } from "lucide-react";
import { IconButton } from "@mui/material";
import useHierarchy from "../../../../hooks/unisol/coreHr/useHierarchy";

const colors = [
  "#4a90e2",
  "#50e3c2",
  "#bd10e0",
  "#f5a623",
  "#9013fe",
  "#e94e77",
  "#7ed321",
  "#d0021b",
  "#f8e71c",
  "#417505",
  "#b8e986",
  "#8b572a",
  "#f78da7",
  "#00bcd4",
  "#9b9b9b",
];

const CoreHR = () => {
  const {
    fetchSearchEmpCoreHR,
    fetchCoreHREmployeeById,
    fetchCoreHREmployeeList,
    // fetchDesignation,
    fetchDeptDataChart,
    resetSearchEmpCoreHr,
    designation,
    sendDeptDataChart,
    coreHREmployeeList,
    searchEmpCoreHr,
    getAllEmployeeIdAndNameAccordingToDesignation,
    allEmployeeIdWithName,
    loading: coreHRloading,
    resetEmployeeDetails,
  } = useCoreHR();

  const {
    departmentDrop,
    designationByDept,
    fetchDesignation,
    fetchDepartments,
    loading: employeeLoading,
  } = useEmployee();

  const { hierarchy, fetchHierarchy } = useHierarchy();

  console.log("Employee-List:", coreHREmployeeList);
  const {
    fetchTodaysEmpAttendance,
    todaysEmpAttendance,
    fetchTotalEmpAttendance,
    totalEmpAttendance,
    fetchNewEmployeeCount,
    newEmployeeCount,
    loading,
  } = useCoreHRAttendance();

  const {
    fetchEventList,
    getEventList,
    fetchEventById,
    getEventById,
    resetEventById,
  } = useCoreHREvent();

  console.log("getEventList", getEventList);
  const [addEmp, setAddEmp] = useState(false);
  const [addEvent, setAddEvent] = useState(false);
  const [empDetails, setEmpDetails] = useState(false);
  const [isSearchEmpDialogOpen, setIsSearchEmpDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [piedata, setPiedata] = useState([]);
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [hierarchyDialog, setHierarchyDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDesignation, setSelectDesignation] = useState(null);
  const { theme } = useTheme();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      department: "",
      designation: "",
      empId: "",
    },
    validationSchema: Yup.object({
      empId: Yup.string().required("Employee's name is required"),
      department: Yup.string().required("Department is required"),
      designation: Yup.string().required("Designation is required"),
    }),
    onSubmit: (values) => {
      fetchSearchEmpCoreHR(values);
      console.log("submit", values);
      setIsSearchEmpDialogOpen(true);
      formik.resetForm();
      setSelectedEmployeeId("");
    },
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [locaLoading, setLocalLoading] = useState(false);
  const fetchAllData = async () => {
    setLocalLoading(true);
    try {
      await Promise.all([
        fetchDepartments(),
        fetchDesignation(),
        fetchDeptDataChart(),
        fetchCoreHREmployeeList(page, limit),
        fetchTodaysEmpAttendance(),
        fetchTotalEmpAttendance(),
        fetchEventList(),
        fetchNewEmployeeCount(),
        fetchHierarchy(),
      ]);
    } catch (error) {
      console.error("Error fetching corehr data:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetchDesignation(selectedDepartment);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (sendDeptDataChart && sendDeptDataChart.length) {
      const formattedData = sendDeptDataChart.map((item) => ({
        name: item.department,
        value: item.percentage,
      }));
      setPiedata(formattedData);
    }
  }, [sendDeptDataChart]);

  useEffect(() => {
    getAllEmployeeIdAndNameAccordingToDesignation(
      selectedDesignation,
      selectedDepartment
    );
    console.log(allEmployeeIdWithName);
    console.log(selectedDepartment, selectedDesignation);
    console.log(selectedDepartment, selectedDesignation);
  }, [selectedDepartment, selectedDesignation]);

  const handleEmployeeDetail = (row) => {
    fetchCoreHREmployeeById(row._id);
    setEmpDetails(true);
  };

  const handleEditClick = async (eventId) => {
    const eventData = await fetchEventById(eventId);
    setSelectedEvent(eventData);
    setEditing(true);
    setAddEvent(true);
  };
  const handleDepartmentChange = (event) => {
    const departmentCode = event.target.value;
    formik.setFieldValue("department", departmentCode);
    console.log(departmentCode);
    setSelectedDepartment(departmentCode);
  };
  const handleDesignationChange = (event) => {
    const designationCode = event.target.value;
    formik.setFieldValue("designation", designationCode);
    console.log(designationCode);
    setSelectDesignation(designationCode);
  };

  const handleEditEvent = (id) => {
    setSelectedId(id);
    setEditing(true);
  };

  const onPageChange = (data) => {
    console.log("data", data);
    setPage(data);
    fetchCoreHREmployeeList(data, limit);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    fetchCoreHREmployeeList(page, data);
  };
  console.log("searchEmpCoreHr : ", searchEmpCoreHr);
  console.log("hierarchy : ", hierarchy);
  if (locaLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb linkText={[{ text: "Core HR" }]} />
      <div className="space-y-2 ">
        <div className="w-full h-[103px]  bg-white rounded-2xl flex flex-col space-y-1 justify-center">
          <div className="flex items-center space-x-8">
            <h2 className="font-bold text-xl ml-6">
              Employee Information System
            </h2>
          </div>
          <h1 className="ml-6 font-medium text-base">Hi, Welcome!</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6  md:grid-cols-2">
          {/* Total Employee Section */}
          <div className="w-full rounded-lg flex  flex-col bg-white py-4 px-6 justify-evenly">
            <div className="flex">
              <h2 className="font-bold">Total Employee</h2>
              <span className="flex-1"></span>
              <div
                className={`rounded-full w-[80px] h-[24px] px-1 bg-opacity-15 flex items-start justify-between
        ${totalEmpAttendance && totalEmpAttendance?.percentageIncrease > 0
                    ? "bg-[#23C10A] text-[#0BBA00]"
                    : "bg-[#C10A0A26] text-[#C71026]"
                  }`}
              >
                {totalEmpAttendance &&
                  totalEmpAttendance?.percentageIncrease > 0 ? (
                  <TrendingUpIcon />
                ) : (
                  <TrendingDownIcon />
                )}
                {totalEmpAttendance &&
                  `${totalEmpAttendance?.percentageIncrease}%`}
              </div>
            </div>
            <h2 className="text-2xl font-bold">
              {totalEmpAttendance && totalEmpAttendance?.empCount}
            </h2>
            {/* <h2 className="text-[#949494]">Employee</h2> */}
          </div>

          {/* New Employee Section */}
          <div className="w-full rounded-lg flex  flex-col bg-white py-4 px-6 justify-evenly">
            <div className="flex">
              <h2 className="font-bold">New Employee</h2>
              <span className="flex-1"></span>
            </div>
            <h2 className="text-2xl font-bold">
              {newEmployeeCount && newEmployeeCount?.empCount}
            </h2>
            {/* <h2 className="text-[#949494]">Viewers</h2> */}
          </div>

          {/* Today's Attendance Section */}
          <div className="w-full rounded-md flex  flex-col bg-white py-4 px-6 justify-evenly">
            <div className="flex items-center">
              <h2 className="font-bold text-sm sm:text-base">
                Today's Attendance
              </h2>
              <span className="flex-1"></span>
              <div
                className={`rounded-full w-[80px] h-[24px] px-1 bg-opacity-15 flex items-center justify-between
        ${todaysEmpAttendance && todaysEmpAttendance?.presentPercentage > 0
                    ? "bg-[#23C10A] text-[#0BBA00]"
                    : "bg-[#C10A0A26] text-[#C71026]"
                  }`}
              >
                {todaysEmpAttendance &&
                  todaysEmpAttendance?.presentPercentage > 0 ? (
                  <TrendingUpIcon />
                ) : (
                  <TrendingDownIcon />
                )}
                {todaysEmpAttendance &&
                  `${todaysEmpAttendance?.presentPercentage}%`}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-truncate">
              {todaysEmpAttendance && todaysEmpAttendance?.presentToday}
            </h2>
            {/* <h2 className="text-[#949494] text-sm sm:text-base">Applicants</h2> */}
          </div>
        </div>

        {/* Search Block */}

        <form
          onSubmit={formik.handleSubmit}
          className="w-full bg-white rounded-xl shadow-lg p-2 "
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Department */}
            <div className="flex flex-col mt-5">
              {/* <label className="mb-1 text-gray-700 font-medium">Department</label> */}
              <Select
                name="department"
                isLoading={employeeLoading}
                options={departmentDrop.map((dept) => ({
                  label: dept,
                  value: dept,
                }))}
                value={
                  formik.values.department
                    ? {
                      label: formik.values.department,
                      value: formik.values.department,
                    }
                    : null
                }
                onChange={(selected) => {
                  const value = selected?.value || "";
                  if (!value) {
                    formik.resetForm();
                    setSelectedEmployeeId("");
                  }
                  formik.setFieldValue("department", value);
                  handleDepartmentChange({
                    target: { name: "department", value },
                  });
                }}
                onBlur={() => formik.setFieldTouched("department", true)}
                placeholder="Select Department"
                isClearable
                classNamePrefix="react-select"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    borderColor: state.isFocused
                      ? theme.secondaryColor
                      : "#d1d5db",
                    boxShadow: state.isFocused
                      ? `0 0 0 2px ${theme.secondaryColor}33`
                      : "none",
                    borderRadius: "0.75rem",
                    padding: "2px",
                  }),
                }}
              />
              <div className="min-h-[20px] text-red-500 text-sm">
                {formik.touched.department && formik.errors.department}
              </div>
            </div>

            {/* Designation */}
            <div className="flex flex-col  mt-5">
              {/* <label className="mb-1 text-gray-700 font-medium">Designation</label> */}
              <Select
                name="designation"
                isLoading={employeeLoading}
                options={designationByDept?.map((d) => ({
                  label: d,
                  value: d,
                }))}
                value={
                  formik.values.designation
                    ? {
                      label: formik.values.designation,
                      value: formik.values.designation,
                    }
                    : null
                }
                isDisabled={!formik.values.department}
                onChange={(selected) => {
                  const value = selected?.value || "";
                  if (!value) {
                    formik.setFieldValue("empId", "");
                    setSelectedEmployeeId("");
                  }
                  formik.setFieldValue("designation", value);
                  handleDesignationChange({
                    target: { name: "designation", value },
                  });
                }}
                onBlur={() => formik.setFieldTouched("designation", true)}
                placeholder="Select Designation"
                isClearable
                classNamePrefix="react-select"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    borderColor: state.isFocused
                      ? theme.secondaryColor
                      : "#d1d5db",
                    boxShadow: state.isFocused
                      ? `0 0 0 2px ${theme.secondaryColor}33`
                      : "none",
                    borderRadius: "0.75rem",
                    padding: "2px",
                  }),
                }}
              />
              <div className="min-h-[20px] text-red-500 text-sm">
                {formik.touched.designation && formik.errors.designation}
              </div>
            </div>

            {/* Employee ID */}
            <div className="flex flex-col  mt-5">
              {/* <label className="mb-1 text-gray-700 font-medium">Employee ID</label> */}
              <Select
                name="empId"
                isLoading={coreHRloading}
                isDisabled={
                  !formik.values.designation || !formik.values.department
                }
                options={allEmployeeIdWithName?.employees?.map((e) => ({
                  label: e.fullName,
                  value: e.employeeId,
                }))}
                value={
                  formik.values.empId
                    ? allEmployeeIdWithName?.employees
                      ?.map((e) => ({
                        label: e.fullName,
                        value: e.employeeId,
                      }))
                      .find((opt) => opt.value === formik.values.empId) || null
                    : null
                }
                onChange={(selected) => {
                  const value = selected?.value || "";
                  formik.setFieldValue("empId", value);

                  const selectedEmployee =
                    allEmployeeIdWithName?.employees.find(
                      (emp) => emp.employeeId === value
                    );

                  setSelectedEmployeeId(selectedEmployee?.employeeId || ""); // store employee ID
                }}

                onBlur={() => formik.setFieldTouched("empId", true)}
                placeholder="Select Employee Name"
                isClearable
                classNamePrefix="react-select"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    borderColor: state.isFocused
                      ? theme.secondaryColor
                      : "#d1d5db",
                    boxShadow: state.isFocused
                      ? `0 0 0 2px ${theme.secondaryColor}33`
                      : "none",
                    borderRadius: "0.75rem",
                    padding: "2px",
                  }),
                }}
              />
              <div className="min-h-[20px] text-red-500 text-sm">
                {formik.touched.empId && formik.errors.empId}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="invisible ">Search</label>
              <div className="pb-8">
                {" "}
                <Button type="submit" variant={2} text="Search" />
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 items-center w-full mt-2">
            {/* Employee Name */}
            {selectedEmployeeId && (
              <div className="flex gap-2 items-center">
                <label className="mb-1 text-gray-700 text-md font-semibold">
                  Employee Id:
                </label>
                <span
                  className="text-md font-semibold"
                  style={{ color: theme.primaryColor }}
                >
                  {selectedEmployeeId}
                </span>
              </div>
            )}
            {/* <input
                type="text" 
                style={{ borderColor: theme.secondaryColor }}
                className="placeholder:font-medium rounded-xl md:w-auto  bg-white py-2 px-4 border-2 outline-none shadow-sm"
                placeholder="Employee's Name"
                name="employeeName"
                value={selectedEmployeeName}
                disabled
                readOnly/> */}
            {/* <Button type="submit" variant={2} text="Search" /> */}
          </div>
        </form>

        {isSearchEmpDialogOpen && searchEmpCoreHr && (
          <SearchEmp
            onClose={() => {
              resetSearchEmpCoreHr();
              setIsSearchEmpDialogOpen(false);
            }}
            empdata={searchEmpCoreHr} 
          />
        )}

        {/* Hierarchy and Pie Chart and Events Block */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
          {/* Hierarchy Section */}
          <div className="w-full md:flex-[150px] bg-white rounded-lg h-[300px] p-3 shadow-md relative">

            {/* Title */}
            <div className="absolute top-2 left-2">
              <h2 className="text-[#878684]">Organizational Hierarchy</h2>
            </div>

            {/* Expand Button */}
            <div className="absolute top-2 right-2">
              <LiaExpandArrowsAltSolid
                className="cursor-pointer"
                size={20}
                onClick={() => setHierarchyDialog(true)}
              />
            </div>

            {/* Scrollable Tree Content */}
            <div className="overflow-auto h-full pt-10">
              {!hierarchy || !hierarchy?.admin ? (
                <div className="flex justify-center items-center h-full">
                  <LoaderSpinner />
                </div>
              ) : (
                <Tree
                  className="flex justify-center items-center w-full"
                  lineWidth="2px"
                  lineColor="#e5e7eb"
                  lineBorderRadius="8px"
                  label={
                    <div className="px-2 py-1 rounded-lg border bg-white shadow-sm text-center min-w-[120px]">
                      <div className="w-full flex flex-col items-center">
                        {hierarchy?.admin?.image ? (
                          <img
                            src={hierarchy.admin.image}
                            alt={hierarchy?.admin?.name || "Admin"}
                            className="w-8 h-8 rounded-full object-cover mb-1"
                          />
                        ) : null}
                        <div className="text-[10px] font-semibold">
                          {hierarchy?.admin?.name || "Admin"}
                        </div>
                        <div className="text-[9px] text-gray-600">
                          {hierarchy?.admin?.designation || ""}
                        </div>
                      </div>
                    </div>
                  }
                >
                  {hierarchy?.admin?.managers?.map((mgr, idx) => (
                    <TreeNode
                      key={`m-${idx}`}
                      label={
                        <div className="px-2 py-1 rounded-lg border bg-white shadow-sm text-center min-w-[120px]">
                          <div className="text-[10px] font-semibold">
                            {mgr?.name || mgr?.department || ""}
                          </div>
                          <div className="text-[9px] text-gray-600">
                            {mgr?.designation || (mgr?.department ? "Department" : "")}
                          </div>
                        </div>
                      }
                    >
                      {Array.isArray(mgr?.employees) &&
                        mgr.employees.map((emp, eIdx) => (
                          <TreeNode
                            key={`e-${idx}-${eIdx}`}
                            label={
                              <div className="px-2 py-1 rounded-lg border bg-white shadow-sm text-center min-w-[120px]">
                                <div className="text-[10px] font-semibold">
                                  {emp?.name || ""}
                                </div>
                                <div className="text-[9px] text-gray-600">
                                  {emp?.designation || ""}
                                </div>
                              </div>
                            }
                          />
                        ))}
                    </TreeNode>
                  ))}
                </Tree>
              )}
            </div>

            {/* Hierarchy Dialog Popup */}
            {hierarchyDialog && hierarchy && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
                <OrganizationalHierarchy
                  data={{ admin: hierarchy?.admin || {} }}
                  onClose={() => setHierarchyDialog(false)}
                />
              </div>
            )}
          </div>
          {/* Pie Chart Section */}
          <div className="w-full md:flex-[150px] min-w-0 bg-white rounded-lg h-[300px] p-3 shadow-md overflow-hidden">
            <h1 className="ml-3 text-xs text-[#222529AD] font-medium py-1">
              % of Employee in different departments
            </h1>
            <hr />
            <div className="flex flex-col md:flex-row flex-wrap h-full">
              {/* Pie Chart Section */}
              <div className="w-full md:w-2/3 flex items-center justify-center">
                <PieChart width={420} height={200}>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={piedata}
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    fill="#8884d8"
                  >
                    {piedata.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>

              {/* Legend Section */}
              <div className="w-full md:w-1/3 p-2 flex items-center justify-center py-3 overflow-y-auto max-h-full">
                <div className="flex flex-col space-y-2">
                  {piedata.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: colors[index % colors.length],
                        }}
                      />
                      <span className="text-gray-700 text-sm font-medium ">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Events Section */}
          <div className="w-full md:flex-1 rounded-lg h-[300px] shadow-md">
            <div
              className="flex justify-between items-center py-4 rounded-t-lg px-4 md:px-7"
              style={{ backgroundColor: theme.secondaryColor }}
            >
              <div className="flex items-center space-x-1">
                <h1 className="font-semibold text-black/65 text-xs md:text-base">
                  Events
                </h1>
                <AddCircleOutlineIcon
                  onClick={() => {
                    setAddEvent(true);
                    resetEventById();
                  }}
                  style={{
                    color: "#535D9F",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                />
              </div>
              {addEvent && <AddEvent onClose={() => setAddEvent(false)} />}
            </div>

            <div className="bg-[#F6F6F6] h-[203px] rounded-b-2xl overflow-auto scrollbar-hide">
              <ul className="p-4 md:p-7 space-y-4 md:space-y-6">
                {getEventList.length > 0 ? (
                  getEventList?.map((data, index) => (
                    <li
                      key={index}
                      className="flex flex-wrap items-center justify-between space-x-2 md:space-x-4"
                    >
                      <h1 className="text-start tracking-widest font-semibold text-[10px] md:text-[12px] w-full md:w-[200px]">
                        {data?.eventTitle}
                      </h1>
                      <h1 className="font-semibold text-[10px] md:text-[12px]">
                        {data?.startTime}
                      </h1>
                      <button
                        onClick={() => handleEditEvent(data._id)}
                        className="flex-shrink-0"
                      >
                        <CiEdit size={20} />
                      </button>
                      {editing && selectedId === data._id && (
                        <AddEvent
                          data={data}
                          editing
                          onClose={() => {
                            setSelectedId(null);
                            setEditing(false);
                          }}
                        />
                      )}
                    </li>
                  ))
                ) : (
                  <div className="flex justify-center"> No events found.</div>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/*Table Employee List */}
        <h1 className="px-4 pt-2 text-lg font-semibold text-gray-800">
          Employee List
        </h1>

        <div className="w-full rounded-2xl bg-white shadow-lg overflow-hidden">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="sticky top-0 bg-gray-100 border-b border-gray-300 z-10">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Sr. No.</th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Phone No
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Joining Date
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {coreHRloading ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center">
                      <div className="flex justify-center items-center w-full">
                        <LoaderSpinner />
                      </div>
                    </td>
                  </tr>
                ) : coreHREmployeeList?.data?.employees?.length > 0 ? (
                  coreHREmployeeList?.data?.employees?.map((row, index) => (
                    <tr
                      key={row._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-center">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              row.photo ||
                              "https://cdn-icons-png.flaticon.com/512/8847/8847419.png"
                            }
                            alt="Employee"
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                          <span className="font-medium">
                            {row.employeeName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{row.empId}</td>
                      <td className="px-6 py-4">{row.phoneNumber || "N/A"}</td>
                      <td className="px-6 py-4">
                        {row.joiningDate
                          ? new Date(row.joiningDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">{row.jobTitle || "N/A"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <IconButton>
                            <Eye
                              style={{ color: theme.primaryColor }}
                              onClick={() => {
                                resetEmployeeDetails();
                                handleEmployeeDetail(row);
                              }}
                            />
                          </IconButton>
                        </div>
                        {empDetails && (
                          <EmployeeDetail
                            onClose={() => setEmpDetails(false)}
                          />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <div className="py-4 text-center flex items-center text-lg font-semibold">
                        No Data Found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div>
            {!loading && coreHREmployeeList?.data?.employees?.length > 0 && (
              <Pagination
                currentPage={coreHREmployeeList?.data?.pagination?.currentPage}
                totalPages={coreHREmployeeList?.data?.pagination?.totalPages}
                totalItems={coreHREmployeeList?.data?.pagination?.totalCount}
                itemsPerPage={limit}
                onPageChange={onPageChange}
                onItemsPerPageChange={onItemsPerPageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreHR;

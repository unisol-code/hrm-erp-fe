import React, { useEffect, useState , useRef } from 'react'
import LoaderSpinner from '../../../../components/LoaderSpinner';
import BreadCrumb from '../../../../components/BreadCrumb';
import { useTheme } from '../../../../hooks/theme/useTheme';
import Select from "react-select";
import { useLocation, useNavigate } from 'react-router-dom';
import useEmployee from '../../../../hooks/unisol/onboarding/useEmployee';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from '../../../../components/Button';
import useEmpAttendence from '../../../../hooks/unisol/empAttendence/useEmpAttendence';
import { FaEye } from 'react-icons/fa6';
import Pagination from '../../../../components/Pagination';
import Profile from "../../../../assets/images/profile-image.png";
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const MonthlyAttendance = () => {
    const { fetchAllMonthsAllEmpAttendance, allMonthsAllEmpAttendance, loading } = useEmpAttendence();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [filters, setFilters] = useState({
        department: "",
    });
    const query = useQuery();
    const monthParam = query.get("month");
    const yearParam = query.get("year");
    const pdfTableRef = useRef(null);
    const selectedMonth =
        monthParam && yearParam
            ? new Date(`${monthParam} 1, ${yearParam}`)
            : null;

    const {
        fetchDepartments,
        departmentDrop,
        loading: employeeLoading,
    } = useEmployee();

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        fetchAllMonthsAllEmpAttendance( page,limit,filters.department, monthParam, yearParam);
    }, [ page , limit ,filters.department, monthParam, yearParam]);
    console.log("allMonthsAllEmpAttendance", allMonthsAllEmpAttendance);

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

    const handleMonthChange = (date) => {
        if (!date) {
            navigate("", { replace: true });
            return;
        }

        const monthName = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();

        if (monthName !== monthParam || year !== yearParam) {
            navigate(`?month=${monthName}&year=${year}`, { replace: true });
        }
    };


const downloadAsPDF = () => {
  if (!allMonthsAllEmpAttendance?.data?.employees?.length) return;

  const pdf = new jsPDF("p", "mm", "a4");

  const marginX = 10;

  const fileMonth = monthParam ?? "All";
  const fileYear = yearParam ?? new Date().getFullYear();

  // Title
  pdf.setFontSize(14);
  pdf.text(
    `Employee Monthly Attendance`,
    marginX,
    12
  );

  pdf.setFontSize(10);
  pdf.text(
    `Month: ${fileMonth} ${fileYear}`,
    marginX,
    18
  );

  const columns = [
    "Sr No",
    "Employee Name",
    "Department",
    "Designation",
    "Leaves",
    "Present",
    "Absent"
  ];

  const rows = allMonthsAllEmpAttendance.data.employees.map(
    (emp, index) => [
      (page - 1) * limit + index + 1,
      emp.employeeName || "-",
      emp.department || "-",
      emp.designation || "-",
      emp.leavesTaken ?? 0,
      emp.presentDays ?? 0,
      emp.absentDays ?? 0,
    ]
  );

  autoTable(pdf, {
    head: [columns],
    body: rows,
    startY: 24,
    margin: { left: marginX, right: marginX },
    styles: {
      fontSize: 9,
      cellPadding: 3,
      valign: "middle",
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: 20,
      fontStyle: "bold",
    },
    didDrawPage: () => {
      pdf.setFontSize(9);
      pdf.text(
        `Page ${pdf.getNumberOfPages()}`,
        pdf.internal.pageSize.getWidth() - 20,
        pdf.internal.pageSize.getHeight() - 10
      );
    },
  });

  pdf.save(`Employee_Attendance_${fileMonth}_${fileYear}.pdf`);
};



 

    const handleViewDetail = (detail) => {
  if (!detail?._id) return;

  const year = yearParam || new Date().getFullYear();
  const month = monthParam
    ? new Date(`${monthParam} 1, ${year}`).getMonth() + 1
    : new Date().getMonth() + 1;

  const formattedMonth = String(month).padStart(2, "0");

  navigate(
    `/employeeAttendence/employeeAttendenceDetails/${detail._id}/${year}/${formattedMonth}`
  );
};


    return (
        <div className="w-full min-h-screen">
            <BreadCrumb
                linkText={[
                    { text: "Attendance Management" },
                    { text: "Employee Attendance", href: "/employeeAttendence" },
                    { text: "Employee Monthly Attendance" }
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
                        Employee Monthly Attendance List
                    </h1>

                    <div className="flex justify-end items-center gap-2">
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
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label={"month"}
                                openTo="month"
                                views={["year", "month"]}
                                value={selectedMonth}
                                onChange={handleMonthChange}
                                slotProps={{
                                    textField: {
                                        className:
                                            "min-w-[180px] max-w-[180px] bg-transparent focus:bg-transparent transition-all duration-200 shadow-none outline-none",
                                        fullWidth: true,
                                        variant: "outlined",
                                        size: "small",
                                        sx: {
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "0.5rem",
                                                height: "42px",
                                                minWidth: "180px",
                                                maxWidth: "180px",
                                                backgroundColor: "white",
                                                boxShadow: "none",
                                                color: "black",
                                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: "#94a3b8",
                                                },
                                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: "#ffffff",
                                                    boxShadow: "none",
                                                },
                                                "& .MuiOutlinedInput-input": {
                                                    "&::placeholder": {
                                                        color: "black",
                                                        opacity: 1,
                                                    },
                                                },
                                            },
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#e5e7eb",
                                            },
                                            "& .MuiInputLabel-root": {
                                                fontSize: "0.95rem",
                                                color: "black",
                                            },
                                        },
                                    },
                                }}
                            />
                        </LocalizationProvider>

                        <Button
                            variant={1}
                           onClick={downloadAsPDF}
                            text="Export"
                        />
                    </div>
                </div>

                {/* Table & Pagination */}
                <div>
                    <div className="overflow-x-auto w-full" ref={pdfTableRef}>

                        <table className="min-w-[650px] w-full text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4 text-base font-semibold text-gray-700 whitespace-nowrap">
                                        Sr. No.
                                    </th>
                                    {/* <th className="p-4 text-base font-semibold text-gray-700">
                                        Date
                                    </th> */}
                                    <th className="p-4 text-base font-semibold text-gray-700">
                                        Employee Name
                                    </th>
                                    <th className="p-4 text-base font-semibold text-gray-700">
                                        Department
                                    </th>
                                    <th className="p-4 text-base font-semibold text-gray-700">
                                        Designation
                                    </th>
                                    <th className="p-4 text-base font-semibold text-gray-700">
                                        Leaves Taken
                                    </th>
                                    <th className="p-4 text-base font-semibold text-gray-700">
                                        Present Days
                                    </th>
                                    <th className="p-4 text-base font-semibold text-gray-700">
                                        Absent Days
                                    </th>
                                    <th className="p-4 text-base font-semibold text-gray-700 no-pdf">
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
                                ) : allMonthsAllEmpAttendance?.data?.employees?.length >
                                    0 ? (
                                    allMonthsAllEmpAttendance?.data?.employees?.map(
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
                                                        <img
                                                            src={detail?.photo || Profile}
                                                            alt="img"
                                                            className="h-[40px] w-[40px] rounded-full object-cover mr-2"
                                                        />
                                                        {detail?.employeeName}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm">
                                                    {detail?.department}
                                                </td>
                                                <td className="p-4 text-sm">{detail?.designation}</td>
                                                <td className="p-4 text-sm text-yellow-600 font-semibold">{detail?.leavesTaken}</td>
                                                <td className="p-4 text-sm text-green-600 font-semibold">{detail?.presentDays}</td>
                                                <td className="p-4 text-sm text-red-600 font-semibold">{detail?.absentDays}</td>
                                                <td className="p-4 text-sm">
                                                    <button
                                                        className="p-2 rounded-full hover:bg-red-100 hover:scale-105 transition-all duration-200 no-pdf"
                                                        style={{ color: theme.primaryColor }}
                                                        onClick={() =>
                                                            handleViewDetail(detail)
                                                        }
                                                    >
                                                        <FaEye size={18} />
                                                    </button>
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
                        allMonthsAllEmpAttendance?.data?.employees.length > 0 && (
                            <Pagination
                                currentPage={
                                    allMonthsAllEmpAttendance?.data?.pagination?.currentPage
                                }
                                totalPages={
                                    allMonthsAllEmpAttendance?.data?.pagination?.totalPages
                                }
                                totalItems={
                                    allMonthsAllEmpAttendance?.data?.pagination?.totalCount
                                }
                                itemsPerPage={limit}
                                onPageChange={onPageChange}
                                onItemsPerPageChange={onItemsPerPageChange}
                                showRowPerPage={true}
                                
                            />
                        )}
                </div>
            </div>
        </div>
    )
}

export default MonthlyAttendance
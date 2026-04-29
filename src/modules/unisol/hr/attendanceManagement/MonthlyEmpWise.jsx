import React, { useEffect, useState, useRef } from 'react'
import Button from '../../../../components/Button'
import BreadCrumb from '../../../../components/BreadCrumb';
import { useTheme } from '../../../../hooks/theme/useTheme';
import useEmpAttendence from '../../../../hooks/unisol/empAttendence/useEmpAttendence';
import { useNavigate, useParams } from 'react-router-dom';
import LoaderSpinner from '../../../../components/LoaderSpinner';
import Pagination from '../../../../components/Pagination';
import html2canvas from 'html2canvas';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
    FaCalendarAlt,
    FaUserCircle,
    FaArrowLeft,
    FaDownload,
    FaPrint,
    FaFilter,
    FaSearch,
    FaCalendarCheck,
    FaCalendarTimes,
    FaUmbrellaBeach,
    FaSun,
    FaHome,
    FaUserAlt
} from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn, MdWork } from 'react-icons/md';

const MonthlyEmpWise = () => {
    const { loading, fetchMonthlyAttendanceOfEmployee, monthlyAttendanceOfEmployee } = useEmpAttendence();
    const { id, year, month } = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { theme } = useTheme();

    const pdfTableRef = useRef(null);


    useEffect(() => {
        if (id && month && year) {
            let monthParam = month;
            const monthNumber = parseInt(month);
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            if (!isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
                monthParam = monthNames[monthNumber - 1];
            }

            fetchMonthlyAttendanceOfEmployee(id, year, monthParam, page, limit);
        }
    }, [id, year, month, page, limit]);

    const downloadAsPDF = () => {
        if (!monthlyAttendanceOfEmployee?.data) return;

        const pdf = new jsPDF("p", "mm", "a4");

        const marginX = 10;
        const marginTop = 15;

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const employeeId = monthlyAttendanceOfEmployee.data.employeeId || "N/A";


        const fileMonth =
            !isNaN(month) && month >= 1 && month <= 12
                ? monthNames[month - 1]
                : month;

        const fileYear = year;

        // Title
        pdf.setFontSize(14);
        pdf.text("Monthly Attendance Report", marginX, 10);

        pdf.setFontSize(10);
        pdf.text(
            `Employee: ${monthlyAttendanceOfEmployee.data.employeeName}`,
            marginX,
            18
        );

        pdf.text(
            `Employee ID: ${employeeId}`,
            marginX,
            24
        );

        pdf.text(
            `Month: ${fileMonth} ${fileYear}`,
            marginX,
            30
        );


        const tableColumn = [
            "Sr No",
            "Date",
            "Day",
            "Status",
            "Leave Type",
            "Remarks"
        ];

        const tableRows = [];

        monthlyAttendanceOfEmployee.data.dailyAttendance.forEach((day, index) => {
            tableRows.push([
                index + 1,
                day.Date,
                day.Day,
                day.Status,
                day["Leave Type"] || "—",
                "-"
            ]);
        });

        autoTable(pdf, {
            head: [tableColumn],
            body: tableRows,
            startY: 38,
            margin: { left: marginX, right: marginX },
            styles: {
                fontSize: 9,
                cellPadding: 3,
                overflow: "linebreak",
            },
            headStyles: {
                fillColor: [240, 240, 240],
                textColor: 20,
                fontStyle: "bold",
            },
            bodyStyles: {
                valign: "middle",
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

        pdf.save(
            `Employee_Attendance_${monthlyAttendanceOfEmployee.data.employeeName}_${fileMonth}_${fileYear}.pdf`
        );
    };




    const handlePrint = () => {
        window.print();
    }

    const onPageChange = (newPage) => {
        setPage(newPage);
    };

    const onItemsPerPageChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Present': return <FaCalendarCheck className="text-green-500" />;
            case 'Absent': return <FaCalendarTimes className="text-red-500" />;
            case 'Leave': return <FaUmbrellaBeach className="text-blue-500" />;
            case 'Holiday': return <FaHome className="text-purple-500" />;
            case 'Sunday': return <FaSun className="text-orange-500" />;
            default: return <FaCalendarAlt className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present': return 'bg-green-50 text-green-700 border-green-200';
            case 'Absent': return 'bg-red-50 text-red-700 border-red-200';
            case 'Leave': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Holiday': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'Sunday': return 'bg-orange-50 text-orange-700 border-orange-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="w-full min-h-screen">
            <BreadCrumb
                linkText={[
                    { text: "Dashboard", href: "/dashboard" },
                    { text: "Attendance", href: "/employeeAttendence" },
                    { text: "Employee Details", href: `/employeeAttendence/employeeAttendenceDetails/${id}` },
                    { text: "Monthly Attendance" }
                ]}
                className="bg-white p-3 rounded-lg shadow-sm"
            />

            {/* Employee Profile Card */}
            <div className="mb-4" ref={pdfTableRef}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="md:flex">
                        {/* Profile Image Section */}
                        <div className="md:w-1/4 p-6 flex flex-col items-center justify-center"
                            style={{ backgroundColor: theme.primaryColor }}
                        >
                            {monthlyAttendanceOfEmployee?.data?.photo ? (
                                <img
                                    src={monthlyAttendanceOfEmployee.data.photo}
                                    alt="Employee"
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover mb-4"
                                />
                            ) : (
                                <FaUserCircle className="w-32 h-32 text-white opacity-90 mb-4" />
                            )}
                            <h3 className="text-white text-xl font-bold text-center">
                                {monthlyAttendanceOfEmployee?.data?.employeeName || 'Employee Name'}
                            </h3>
                            <p className="text-blue-100 text-sm mt-1">Employee ID: {monthlyAttendanceOfEmployee?.data?.employeeId}</p>
                        </div>

                        {/* Profile Details Section */}
                        <div className="md:w-3/4 p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">
                                        {monthlyAttendanceOfEmployee?.data?.month} {monthlyAttendanceOfEmployee?.data?.year} Attendance
                                    </h1>
                                    <p className="text-gray-600 mt-1 flex items-center gap-2">
                                        <FaCalendarAlt className="text-blue-500" />
                                        Monthly Attendance Report
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                                    <span className="text-sm text-blue-600 font-medium">Report Period: </span>
                                    <span className="text-blue-800 font-semibold">
                                        {monthlyAttendanceOfEmployee?.data?.month} 1 - {monthlyAttendanceOfEmployee?.data?.month} {monthlyAttendanceOfEmployee?.data?.totalDaysInMonth}, {monthlyAttendanceOfEmployee?.data?.year}
                                    </span>
                                </div>
                                <Button
                                    variant={1}
                                    onClick={downloadAsPDF}
                                    text="Export"
                                    className="no-pdf"  
                                />
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-green-600 font-medium">Present</p>
                                            <p className="text-2xl font-bold text-green-700 mt-1">
                                                {monthlyAttendanceOfEmployee?.data?.summary?.present || 0}
                                            </p>
                                        </div>
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <FaCalendarCheck className="text-green-600 text-xl" />
                                        </div>
                                    </div>
                                    <div className="h-2 bg-green-200 rounded-full mt-3 overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 rounded-full"
                                            style={{
                                                width: `${((monthlyAttendanceOfEmployee?.data?.summary?.present || 0) / (monthlyAttendanceOfEmployee?.data?.workingDays || 1)) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-red-600 font-medium">Absent</p>
                                            <p className="text-2xl font-bold text-red-700 mt-1">
                                                {monthlyAttendanceOfEmployee?.data?.summary?.absent || 0}
                                            </p>
                                        </div>
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <FaCalendarTimes className="text-red-600 text-xl" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-blue-600 font-medium">Leaves</p>
                                            <p className="text-2xl font-bold text-blue-700 mt-1">
                                                {monthlyAttendanceOfEmployee?.data?.summary?.leaves || 0}
                                            </p>
                                        </div>
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FaUmbrellaBeach className="text-blue-600 text-xl" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-purple-600 font-medium">Holidays</p>
                                            <p className="text-2xl font-bold text-purple-700 mt-1">
                                                {monthlyAttendanceOfEmployee?.data?.summary?.holidays || 0}
                                            </p>
                                        </div>
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <FaHome className="text-purple-600 text-xl" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-orange-600 font-medium">Sundays</p>
                                            <p className="text-2xl font-bold text-orange-700 mt-1">
                                                {monthlyAttendanceOfEmployee?.data?.summary?.sundays || 0}
                                            </p>
                                        </div>
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <FaSun className="text-orange-600 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Summary Bar */}
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Working Days</p>
                                            <p className="text-lg font-bold text-gray-800">
                                                {monthlyAttendanceOfEmployee?.data?.summary?.workingDays || 0}
                                            </p>
                                        </div>
                                        <div className="h-8 w-px bg-gray-300"></div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Total Days</p>
                                            <p className="text-lg font-bold text-gray-800">
                                                {monthlyAttendanceOfEmployee?.data?.totalDaysInMonth || 0}
                                            </p>
                                        </div>
                                        <div className="h-8 w-px bg-gray-300"></div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Attendance %</p>
                                            <p className="text-lg font-bold text-green-600">
                                                {monthlyAttendanceOfEmployee?.data?.summary?.present && monthlyAttendanceOfEmployee?.data?.summary?.workingDays
                                                    ? `${Math.round((monthlyAttendanceOfEmployee.data.summary.present / monthlyAttendanceOfEmployee.data.summary.workingDays) * 100)}%`
                                                    : '0%'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance Table Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mt-4">
                    {/* Table Header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Daily Attendance Details</h2>
                                <p className="text-gray-600 text-sm mt-1">Day-wise attendance record for the month</p>
                            </div>
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead className="bg-gray-50">
                                <tr>
                                    {/* Sr. No. - Left aligned, minimal width */}
                                    <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <FaUserAlt className="text-blue-500" />
                                            Sr. No.
                                        </div>
                                    </th>
                                    {/* Date - Center aligned */}
                                    <th className="p-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-2">
                                            <FaCalendarAlt className="text-blue-500" />
                                            Date
                                        </div>
                                    </th>
                                    {/* Day - Center aligned */}
                                    <th className="p-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Day
                                    </th>
                                    {/* Status - Center aligned */}
                                    <th className="p-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Status
                                    </th>
                                    {/* Leave Type - Center aligned */}
                                    <th className="p-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Leave Type
                                    </th>
                                    {/* Remarks - Left aligned, responsive width */}
                                    <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider w-auto min-w-[150px]">
                                        Remarks
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="p-8">
                                            <div className="flex flex-col items-center justify-center">
                                                <LoaderSpinner />
                                                <p className="mt-4 text-gray-600">Loading attendance data...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : monthlyAttendanceOfEmployee?.data?.dailyAttendance?.length > 0 ? (
                                    monthlyAttendanceOfEmployee.data.dailyAttendance.map((det, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            {/* Sr. No. - Left aligned */}
                                            <td className="p-4 text-left align-middle whitespace-nowrap">
                                                <span className="font-semibold text-gray-800">
                                                    {(page - 1) * limit + index + 1}
                                                </span>
                                            </td>

                                            {/* Date - Centered with consistent alignment */}
                                            <td className="p-4 align-middle whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="flex flex-col items-center justify-center min-w-[40px] h-10 bg-blue-50 rounded-lg px-2 flex-shrink-0">
                                                        <span className="text-sm font-bold text-blue-700">
                                                            {new Date(det.Date).getDate()}
                                                        </span>
                                                        <span className="text-xs text-blue-600">
                                                            {new Date(det.Date).toLocaleDateString('en-US', { month: 'short' })}
                                                        </span>
                                                    </div>
                                                    <div className="text-center min-w-[200px]">
                                                        <p className="font-medium text-gray-800 whitespace-nowrap">{det.Date}</p>
                                                        <p className="text-xs text-gray-500 whitespace-nowrap">
                                                            {new Date(det.Date).toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Day - Centered */}
                                            <td className="p-4 text-center align-middle whitespace-nowrap">
                                                <div className={`inline-block px-3 py-1.5 rounded-full font-medium ${det.Day === 'Saturday' || det.Day === 'Sunday'
                                                        ? 'bg-indigo-50 text-indigo-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {det.Day}
                                                </div>
                                            </td>

                                            {/* Status - Centered */}
                                            <td className="p-4 text-center align-middle whitespace-nowrap">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(det.Status)}`}>
                                                    {getStatusIcon(det.Status)}
                                                    <span className="font-medium">{det.Status}</span>
                                                </div>
                                            </td>

                                            {/* Leave Type - Centered */}
                                            <td className="p-4 text-center align-middle whitespace-nowrap">
                                                <div className={`px-3 py-1.5 rounded-lg ${det["Leave Type"] === "None" || !det["Leave Type"]
                                                        ? 'text-gray-500 italic'
                                                        : 'text-gray-700 font-medium'
                                                    }`}>
                                                    {det["Leave Type"] === "None" || !det["Leave Type"] ? 'No Leave' : det["Leave Type"]}
                                                </div>
                                            </td>

                                            {/* Remarks - Left aligned, auto-adjusting width */}
                                            <td className="p-4 text-left align-middle">
                                                <div className="text-gray-700 max-w-md break-words">
                                                    {det.remark && det.remark.trim() !== "" ? det.remark : "-"}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-8">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <FaCalendarTimes className="text-gray-400 text-4xl mb-3" />
                                                <p className="text-gray-700 text-lg font-medium">No Attendance Records Found</p>
                                                <p className="text-gray-500 mt-1">No attendance data available for this period</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {!loading && monthlyAttendanceOfEmployee?.data?.dailyAttendance?.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <Pagination
                                    currentPage={monthlyAttendanceOfEmployee.data.pagination.currentPage}
                                    totalPages={monthlyAttendanceOfEmployee.data.pagination.totalPages}
                                    totalItems={monthlyAttendanceOfEmployee.data.pagination.totalCount}
                                    itemsPerPage={limit}
                                    onPageChange={onPageChange}
                                    onItemsPerPageChange={onItemsPerPageChange}
                                    showRowPerPage={true}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-700">Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm text-gray-700">Absent</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-700">Leave</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm text-gray-700">Holiday</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-sm text-gray-700">Sunday</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MonthlyEmpWise
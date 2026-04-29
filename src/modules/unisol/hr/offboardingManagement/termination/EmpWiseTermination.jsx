import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, Calendar, FileText, User, Tag, CheckCircle, XCircle, Clock, Download, AlertCircle } from "lucide-react";
import { FaEdit, FaSearch } from "react-icons/fa";
import Select from "react-select";
import dayjs from "dayjs";

import BreadCrumb from "../../../../../components/BreadCrumb";
import Pagination from "../../../../../components/Pagination";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { useSignIn } from "../../../../../hooks/auth/useSignIn.js";
import { usePermissions } from "../../../../../hooks/auth/usePermissions.js";
import Profile from "../../../../../assets/images/profile-image.png";
import { useRoles } from "../../../../../hooks/auth/useRoles";
import useEmpTermination from "../../../../../hooks/unisol/offboardingManagement/useEmpTermination.js";
import { MdDelete } from "react-icons/md";

const EmpWiseTermination = () => {
  const { fetchEmpWiseTerminationList, empWiseTerminationList, loading, deleteTerminatedEmployee} = useEmpTermination();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { hrDetails } = useSignIn();
  const { id } = useParams();
  const { canRead } = usePermissions(hrDetails, "Termination");
  const { isSuperAdmin, isHR } = useRoles();
  const role = isSuperAdmin ? "superAdmin" : "hr";

  useEffect(() => {
    fetchEmpWiseTerminationList({ page, limit, role, id });
  }, [page, limit, role, id]);

  // Format date function
  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD MMM YYYY");
  };
  const getStatusStyles = (status) => {
    switch (status) {
      case "approved":
        return {
          bg: "bg-green-50",
          text: "text-green-800",
          border: "border-green-200",
          icon: <CheckCircle size={14} className="text-green-600" />,
          label: "Approved",
        };

      case "rejected":
        return {
          bg: "bg-red-50",
          text: "text-red-800",
          border: "border-red-200",
          icon: <XCircle size={14} className="text-red-600" />,
          label: "Rejected",
        };

      case "pending":
      default:
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-800",
          border: "border-yellow-200",
          icon: <Clock size={14} className="text-yellow-600" />,
          label: "Pending",
        };
    }
  };

  const handlePageChange = (newPage) => setPage(newPage);

  const handleItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleViewClick = (id) => {
    navigate(`/offboardingManagement/termination/view-emp-wise/${id}`);
  };

  const handleEditClick = (id) => {
    navigate(`/offboardingManagement/termination/edit-emp-wise/${id}`);
  };

  const handleDeleteClick = async(delId) => {
    await deleteTerminatedEmployee(delId);
    fetchEmpWiseTerminationList({ page, limit, role, id });
  }

  const renderTableRow = (term, index) => {
    const statusStyles = getStatusStyles(term.status);
    const terminationDate = formatDate(term.terminationDate);
    return (
      <tr
        key={term?._id}
        className="border-b hover:bg-gray-50 transition-colors duration-150"
      >
        <td className="px-6 py-4 whitespace-nowrap text-center">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
              <span className="text-sm font-medium text-gray-700">
                {(page - 1) * limit + index + 1}
              </span>
            </div>
          </div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-center">
          <div className="flex flex-col items-center gap-1">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {term.terminationCode}
            </span>
          </div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-center">
          <div className="flex items-center justify-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <span className="font-medium">{terminationDate}</span>
          </div>
        </td>

        <td className="px-6 py-4 text-center">
          <div className="flex items-center justify-center">
            <div className="max-w-[200px]">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 whitespace-normal break-words">
                {term.terminationReason}
              </span>
            </div>
          </div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-center">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
            {statusStyles.icon}
            <span className="text-sm font-medium">{statusStyles.label}</span>
          </div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            {term.settlementStatus}
          </span>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-center">
          <button
            onClick={() => handleViewClick(term?._id)}
            disabled={!canRead}
            className={`p-2 rounded-full hover:bg-yellow-100 hover:scale-105 transition-all duration-200`}
            style={{ color: theme.primaryColor }}
          >
            <Eye size={20} />
          </button>

          {isHR && (
            <>
              <button
                onClick={() => handleEditClick(term?._id)}
                title={term?.status !== "pending" ? "Edit is not allowed for this status" : "Edit"}
                disabled={term?.status !== "pending"}
                className={`p-2 rounded-full hover:bg-yellow-100 hover:scale-105 transition-all duration-200 ${term?.status !== "pending" ? "cursor-not-allowed opacity-50" : ""}`}
                style={{ color: theme.primaryColor }}
              >
                <FaEdit size={20} />
              </button>
              <button
                title="Delete"
                onClick={() => handleDeleteClick(term?._id)}
                className="bg-gray-100 hover:bg-red-500 text-red-700 hover:text-white hover:scale-500 p-1 rounded-full transition-transform duration-200 group-hover:scale-110 group-hover:bg-white"
              >
                <MdDelete size={20} />
              </button>
            </>
          )}
        </td>
      </tr>
    );
  };

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="7" className="px-6 py-16 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <LoaderSpinner />
              <p className="text-gray-500">Loading termination records...</p>
            </div>
          </td>
        </tr>
      );
    }

    if (!empWiseTerminationList?.data?.length) {
      return (
        <tr>
          <td colSpan="7" className="px-6 py-16 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <FaSearch className="text-gray-400 text-2xl" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-600 mb-1">No termination records found</p>
              </div>
            </div>
          </td>
        </tr>
      );
    }

    return empWiseTerminationList.data.map(renderTableRow);
  };

  // Employee info card component
  const EmployeeInfoCard = () => {
    if (!empWiseTerminationList) return null;

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left side - Employee Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={empWiseTerminationList.employeePhoto || Profile}
                  alt={empWiseTerminationList.employeeName}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-md"
                  style={{ borderColor: `${theme.primaryColor}20` }}
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {empWiseTerminationList.employeeName}
                </h2>
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-gray-500" />
                  <span className="text-gray-600 font-medium">
                    ID: {empWiseTerminationList.employeeId}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Stats */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                  <FileText size={18} />
                  <span className="font-bold text-lg">{empWiseTerminationList.totalRequests}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Total Requests</p>
              </div>

              <div className="h-8 w-px bg-gray-300 hidden lg:block"></div>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                  <CheckCircle size={18} />
                  <span className="font-medium">Active</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Current Status</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Offboarding Management" },
          { text: "Employee Termination", href: "/offboardingManagement/termination" },
          { text: "Employee Termination History" }
        ]}
      />

      <div className="space-y-4">
        {/* Employee Info Card */}
        {!loading && empWiseTerminationList && <EmployeeInfoCard />}

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div
            className="px-6 py-4 border-b border-gray-200"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Termination History</h3>
                <p className="text-gray-600 mt-1">
                  View and manage all termination requests for this employee
                </p>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 tracking-wider">
                    Sr. No.
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 tracking-wider">
                    Termination Code
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 tracking-wider">
                    Termination Date
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 tracking-wider">
                    Termination Reason
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 tracking-wider">
                    Settlement Status
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {renderTableBody()}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && empWiseTerminationList?.data?.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={empWiseTerminationList?.totalPages || 1}
              totalItems={empWiseTerminationList?.totalRequests || 0}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmpWiseTermination;
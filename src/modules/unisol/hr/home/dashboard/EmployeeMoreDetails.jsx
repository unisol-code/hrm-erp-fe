/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Pagination from "../../../../../components/Pagination";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { useNavigate, useParams } from "react-router-dom";
import useHomeDashboard from "../../../../../hooks/unisol/homeDashboard/useHomeDashboard";
import Profile from "../../../../../assets/images/profile-image.png";
import BreadCrumb from "../../../../../components/BreadCrumb";

const EmployeeMoreDetails = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { switchTheme } = useTheme();
  const { companyName } = useParams();

  const { homeEmployeeOverview, fetchHomeEmployeeOverview } = useHomeDashboard();
  console.log("homeEmployeeOverview", homeEmployeeOverview);

  useEffect(() => {
    fetchHomeEmployeeOverview(companyName, page, limit);
  }, []);

  const onPageChange = (data) => {
    console.log("data", data);
    setPage(data);
    fetchHomeEmployeeOverview(companyName, data, limit);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    fetchHomeEmployeeOverview(companyName, page, data);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'holiday': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <BreadCrumb
        linkText={[
          { text: "Home Dashboard", href: "/homeDashboard" },
          { text: "Employee Status Overview" },
        ]}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {companyName} Employee Status Overview
          </h2>
          <p className="text-gray-600 mt-1">View and manage employee statuses and upcoming leaves</p>
        </div>

        {/* <div className=""> */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-700 font-semibold">
                  <th className="px-6 py-4">Employee ID</th>
                  <th className="px-6 py-4">Employee Name</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Upcoming Leaves</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {homeEmployeeOverview?.employees?.map((list) => (
                  <tr key={list?._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                      {list?.empId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                            src={list?.photo || Profile}
                            alt="Employee"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{list?.employeeName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {list?.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(list?.status)}`}>
                        {list?.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {list?.upcomingLeaves[0]
                        ? `${new Date(
                          list?.upcomingLeaves[0]?.fromDate
                        ).toLocaleDateString("en-GB")} to ${new Date(
                          list?.upcomingLeaves[0]?.toDate
                        ).toLocaleDateString("en-GB")}`
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          {/* </div> */}

          {/* Show empty state if no employees */}
          {(!homeEmployeeOverview?.employees || homeEmployeeOverview.employees.length === 0) && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">No employees found</div>
              <p className="text-gray-500">There are no employees to display at this time.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {homeEmployeeOverview?.pagination && homeEmployeeOverview.pagination.totalPages > 1 && (
          // <div className="px-8 py-4 border-t border-gray-200 bg-gray-50">
            <Pagination
              currentPage={homeEmployeeOverview?.pagination?.currentPage}
              totalPages={homeEmployeeOverview?.pagination?.totalPages}
              itemsPerPage={limit}
              totalItems={homeEmployeeOverview?.pagination?.totalCount}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          // </div>
        )}
      </div>
    </div>
  );
};
export default EmployeeMoreDetails;
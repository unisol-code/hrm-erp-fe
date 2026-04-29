import { useEffect, useState } from "react";
import useDashboard from "../../../../hooks/unisol/hrDashboard/useDashborad";
import Pagination from "../../../../components/Pagination";
import LoaderSpinner from "../../../../components/LoaderSpinner";

const UpcomingLeaves = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { getAllUpcomingLeaveList, allUpcomingLeaveList, loading } =
    useDashboard();
  console.log("allUpcomingLeaveList : ", allUpcomingLeaveList);

  useEffect(() => {
    getAllUpcomingLeaveList(page, limit);
  }, [page, limit]);

  const onPageChange = (newPage) => {
    setPage(newPage);
  };

  const onItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };
  if (loading) {
    console.log(loading);
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl pt-4 px-4 flex flex-col">
      <div className="px-8 h-[513px] overflow-y-scroll">
        <table className="w-full text-center">
          {allUpcomingLeaveList?.data?.employees?.length > 0 ? (
            <>
              <thead>
                <tr className="font-semibold text-gray-500 h-[40px] border-b-2 border-gray-500">
                  <th>Sr. No.</th>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Leave Type</th>
                  <th>Starting Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {allUpcomingLeaveList?.data?.employees?.map((list, index) => (
                  <tr key={list?._id} className="border-b border-gray-400">
                    <td className="text-gray-400 px-3 py-4">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="text-gray-400 px-3 py-4">
                      {list?.employee?.fullName}
                    </td>
                    <td className="text-gray-400 px-3 py-4">
                      {list?.employee?.department}
                    </td>
                    <td className="text-gray-400 px-3 py-4">
                      {list?.leaveType}
                    </td>
                    <td className="text-gray-400 px-3 py-4">
                      {new Date(list?.fromDate).toLocaleDateString("en-GB")}
                    </td>
                    <td className="text-gray-400 px-3 py-4">
                      {new Date(list?.toDate).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          ) : (
            <div className="text-gray-700 text-lg font-semibold py-5 justify-center items-center text-center w-full">
              No upcoming leaves have taken leave today.
            </div>
          )}
        </table>
      </div>
      {/* pagination */}
      <Pagination
        currentPage={allUpcomingLeaveList?.data?.pagination?.currentPage}
        totalPages={allUpcomingLeaveList?.data?.pagination?.totalPages}
        totalItems={allUpcomingLeaveList?.data?.pagination?.totalCount}
        itemsPerPage={limit}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </div>
  );
};

export default UpcomingLeaves;

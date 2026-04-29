import { useEffect, useState } from "react";
import useDashboard from "../../../../hooks/unisol/hrDashboard/useDashborad";
import Pagination from "../../../../components/Pagination";
import LoaderSpinner from "../../../../components/LoaderSpinner";

const TodayAllLeaves = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { allTodayLeaveList, fetchAllTodayLeaveList, loading } = useDashboard();
  console.log("allTodayLeaveList : ", allTodayLeaveList);
  console.log(allTodayLeaveList);
  useEffect(() => {
    fetchAllTodayLeaveList(page, limit);
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
          {allTodayLeaveList?.data?.leaveApplications?.length > 0 ? (
            <>
              <thead>
                <tr className="font-semibold text-gray-500 h-[40px] border-b-2 border-gray-500">
                  <th>Sr. No.</th>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Leave Type</th>
                </tr>
              </thead>

              <tbody className="text-gray-700 text-sm font-light">
                {allTodayLeaveList?.data?.leaveApplications?.map(
                  (data, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50 transition duration-150"
                    >
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        {data?.employee?.fullName}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {data?.employee?.department}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {data?.leaveType}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </>
          ) : (
            <div className="text-gray-700 text-lg font-semibold py-5 justify-center items-center text-center w-full">
              No employees have taken leave today.
            </div>
          )}
        </table>
      </div>

      {/* pagination */}
      <Pagination
        currentPage={allTodayLeaveList?.data?.pagination?.currentPage}
        totalItems={allTodayLeaveList?.data?.pagination?.totalCount}
        totalPages={allTodayLeaveList?.data?.pagination?.totalPages}
        itemsPerPage={limit}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </div>
  );
};

export default TodayAllLeaves;

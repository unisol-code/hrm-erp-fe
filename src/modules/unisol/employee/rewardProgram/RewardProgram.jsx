import React, { useEffect } from "react";
import { IconButton } from "@mui/material";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import Pagination from "../../../../components/Pagination";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { GoStar } from "react-icons/go";
import useRewardProgram from "../../../../hooks/unisol/rewardProgram/useRewardProgram";

const RewardProgram = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { loading, rewardList, fetchRewardProgramList } = useRewardProgram();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  // React.useEffect(() => {
  //   fetchRewardPrograms(limit, page, search);
  // }, [limit, page, search]);

  // const onPageChange = (data) => {
  //   setPage(data);
  //   fetchRewardPrograms(limit, data, grade);
  // };

  // const onItemsPerPageChange = (data) => {
  //   setLimit(data);
  //   fetchRewardPrograms(limit, data, grade);
  // };

  console.log("Data :", rewardList);

  useEffect(() => {
    fetchRewardProgramList(limit, page);
  }, [limit, page]);

  const onPageChange = (data) => {
    setPage(data);
    fetchRewardProgramList(limit, data);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    fetchRewardProgramList(limit, data);
  };
  return (
    <div>
      <Breadcrumb linkText={[{ text: "Reward Program" }]} />

      <div className="py-4 px-8 flex flex-col md:flex-row md:items-center rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
        <div className="flex items-center gap-3 flex-1">
          <GoStar style={{ color: theme.primaryColor, fontSize: 32 }} />
          <span className="text-2xl font-bold">Reward Program List</span>
        </div>
      </div>

      {/* Header */}

      <header
        className="px-8 py-4 rounded-t-2xl  flex flex-col md:flex-row flex-wrap md:items-center justify-between gap-4"
        style={{
          background: `linear-gradient(90deg, #f5f9fc 0%, ${theme.highlightColor} 100%)`,
        }}
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">
            Reward Program
          </h1>
        </div>
      </header>
      <hr className="h-1" />
      <div className="bg-white  pb-4 rounded-2xl shadow-md ">
        <div className="overflow-x-auto overflow-y-auto max-h-[550px]">
          <table className="w-full text-sm text-left text-slate-700 table-fixed">
            <thead className="bg-slate-100 sticky top-0 z-10">
              <tr>
                <th className="w-1/4 px-4 py-3 font-semibold tracking-wider text-center">
                  SR. NO.
                </th>
                <th className="w-1/4 px-4 py-3 font-semibold tracking-wider text-start">
                  Title
                </th>
                <th className="w-1/4 px-4 py-3 font-semibold tracking-wider text-center">
                  Payroll Grade
                </th>
                <th className="w-1/4 px-4 py-3 font-semibold tracking-wider text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="w-full">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center">
                    <div className="flex justify-center">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              ) : rewardList?.length > 0 ? (
                rewardList?.map((item, index) => (
                  <tr
                    key={item._id + index}
                    className="border-b border-slate-200 hover:bg-slate-50 text-center"
                  >
                    <td className="w-1/4 px-4 py-4 font-medium">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="w-1/4 px-4 py-4 font-medium text-left">
                      {item.rewardProgramTitle}
                    </td>
                    <td className="w-1/4 px-4 py-4 font-medium">
                      {item?.payrollGrade?.length > 0
                        ? item?.payrollGrade?.map((g, i) => (
                            <span key={g}>
                              {g}
                              {i < item.payrollGrade.length - 1 ? ", " : ""}
                            </span>
                          ))
                        : "-"}
                    </td>
                    <td className="w-1/4 px-4 py-4 font-medium text-center">
                      <div className="flex justify-center">
                        <IconButton
                          onClick={() => {
                            navigate(
                              `/emp/rewardprogram/viewrewardprogramdetails/${item._id}`
                            );
                          }}
                        >
                          <FaEye
                            size={20}
                            style={{ color: theme.primaryColor }}
                          />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-500">
                    No Reward Program Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={rewardList?.currentPage}
          totalPages={rewardList?.totalPages}
          totalItems={rewardList?.totalRewards}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      </div>
    </div>
  );
};

export default RewardProgram;

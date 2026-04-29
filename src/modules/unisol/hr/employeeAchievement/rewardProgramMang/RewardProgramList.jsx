import React from "react";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { FaGraduationCap } from "react-icons/fa";
import Button from "../../../../../components/Button";
import { useNavigate } from "react-router-dom";
import useEmpAchievement from "../../../../../hooks/unisol/empAchievement/useEmpAchievement";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import { Eye } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSignIn } from "../../../../../hooks/auth/useSignIn";
import { usePermissions } from "../../../../../hooks/auth/usePermissions";
import ConfirmationDialog from "../../../../../utils/ConfirmationDialog";
import Pagination from "../../../../../components/Pagination.jsx";

const RewardProgramList = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const { hrDetails } = useSignIn();
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions(
    hrDetails,
    "Policies"
  );
  const [selectRewardProgram, setselectRewardProgram] = React.useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const {
    loading,
    rewardPrograms,
    fetchRewardPrograms,
    deleteRewardProgramData,
  } = useEmpAchievement();

  console.log("Reward Program data : ", rewardPrograms);

  React.useEffect(() => {
    fetchRewardPrograms(limit, page, search);
  }, [limit, page, search]);

  const handleDeleteClick = (id) => {
    setselectRewardProgram(id);
    setShowDeleteDialog(true);
  };

  const onPageChange = (data) => {
    setPage(data);
    fetchRewardPrograms(limit, data, grade);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    fetchRewardPrograms(limit, data, grade);
  };
  const confirmDelete = async () => {
    if (selectRewardProgram) {
      try {
        await deleteRewardProgramData(selectRewardProgram);
        fetchRewardPrograms(limit, page, search);
      } catch (error) {
        console.error("Error deleting Reward Program:", error);
      }
      setShowDeleteDialog(false);
    }
  };
  return (
    <div className="min-h-screen">
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title={`Are you sure you want to delete this Reward Program`}
        confirmText="Delete"
      />
      <BreadCrumb
        linkText={[
          {
            text: "Employee Achievement",
            href: "/hr/employeeAchievement",
          },
          { text: "Reward Program List" },
        ]}
      />

      <header
        className="px-8 py-4 rounded-t-2xl flex flex-col md:flex-row flex-wrap md:items-center justify-between gap-4"
        style={{ backgroundColor: theme.secondaryColor }}
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">
            Reward Program List
          </h1>
        </div>
        <input
          type="text"
          placeholder="Search by Grade"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-72"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <Button
          variant={1}
          type="button"
          text="Add Reward"
          disabled={!canCreate}
          onClick={() => {
            navigate(
              "/hr/employeeAchievement/employeeRewards/addRewardProgram"
            );
          }}
        />
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
              ) : rewardPrograms?.data?.length > 0 ? (
                rewardPrograms?.data?.map((item, index) => (
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
                      {item.grade?.map((g, i) => (
                        <span key={g}>
                          {g}
                          {i < item.grade.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </td>
                    <td className="w-1/4 px-3 py-4">
                      <div className="flex justify-center">
                        <button
                          aria-label="View"
                          title={canRead ? "View" : "No permission"}
                          className={`p-2 rounded-full hover:bg-yellow-100 hover:scale-105 transition-all duration-200 ${!canRead ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          onClick={() => {
                            navigate(
                              `/hr/employeeAchievement/employeeRewards/viewRewardProgram/${item._id}`
                            );
                          }}
                          disabled={!canRead}
                          style={{ color: theme.primaryColor }}
                        >
                          <Eye size={20} />
                        </button>

                        <button
                          aria-label="Edit"
                          title={canUpdate ? "Edit" : "No permission"}
                          className={`p-2 rounded-full hover:bg-yellow-100 hover:scale-105 transition-all duration-200 ${!canUpdate ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          onClick={() => {
                            if (canUpdate) {
                              navigate(
                                `/hr/employeeAchievement/employeeRewards/viewRewardProgram/${item._id}`
                              );
                            }
                          }}
                          disabled={!canUpdate}
                          style={{ color: theme.primaryColor }}
                        >
                          <FaEdit size={20} />
                        </button>

                        <button
                          aria-label="Delete"
                          title="Delete"
                          className={`p-2 rounded-full hover:bg-red-100 hover:scale-105 transition-all duration-200 ${!canDelete ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          onClick={() => handleDeleteClick(item._id)}
                          disabled={!canDelete}
                          style={{ color: theme.primaryColor }}
                        >
                          <MdDelete size={20} />
                        </button>
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
          <Pagination
            currentPage={rewardPrograms?.currentPage}
            totalPages={rewardPrograms?.totalPages}
            totalItems={rewardPrograms?.totalPrograms}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default RewardProgramList;

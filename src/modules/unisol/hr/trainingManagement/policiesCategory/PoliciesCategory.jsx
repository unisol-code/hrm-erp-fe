import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Breadcrumb from "../../../../../components/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import { Eye } from "lucide-react";
import usePoliciesCatagory from "../../../../../hooks/policiesCatagory/usePoliciesCatagory.js";
import Button from "../../../../../components/Button.jsx";
import ConfirmationDialog from "../../../../../utils/ConfirmationDialog.jsx";
import Pagination from "../../../../../components/Pagination.jsx";
import LoaderSpinner from "../../../../../components/LoaderSpinner.jsx";
import { useSignIn } from "../../../../../hooks/auth/useSignIn.js";
import { usePermissions } from "../../../../../hooks/auth/usePermissions.js";

export default function PoliciesCategory() {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [limit, setLimit] = useState(10);
  const { hrDetails } = useSignIn();
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions(
    hrDetails,
    "Policies"
  );
  console.log("Permissions:", { canCreate, canRead, canUpdate, canDelete });
  const navigate = useNavigate();

  const {
    fetchAllPoliciesCategory,
    PoliciesCategory,
    loading,
    deletePoliciesCategory,
    resetPoliciesCategoryDetails,
  } = usePoliciesCatagory();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAllPoliciesCategory(limit, page, search);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [limit, page, search]);

  const confirmDelete = async () => {
    if (selectedPolicy) {
      try {
        await deletePoliciesCategory(selectedPolicy);
        fetchAllPoliciesCategory(limit, page, search);
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
      setShowDeleteDialog(false);
    }
  };
  const onPageChange = (data) => {
    setPage(data);
    fetchAllPoliciesCategory(limit, data, grade);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    fetchAllPoliciesCategory(data, page, grade);
  };

  const handleDeleteClick = (id) => {
    setSelectedPolicy(id);
    setShowDeleteDialog(true);
  };

  console.log(PoliciesCategory);
  return (
    <div className="min-h-screen">
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title={`Are you sure you want to delete this policy`}
        confirmText="Delete"
      />

      <Breadcrumb
        linkText={[{ text: "Training Management" }, { text: "Policies  List" }]}
      />
      <header
        className="px-8 py-4 rounded-t-2xl flex flex-col md:flex-row flex-wrap md:items-center justify-between gap-4"
        style={{ backgroundColor: theme.secondaryColor }}
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">
            Policy List
          </h1>
        </div>
        <input
          type="text"
          placeholder="Search by Grade"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-72"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          value={search}
        />
        <Button
          variant={1}
          type="button"
          text="Add Policy"
          disabled={!canCreate}
          onClick={() => {
            navigate("/PoliciesCategory/add");
            resetPoliciesCategoryDetails();
          }}
        />
      </header>
      {/* <hr className="h-1" /> */}

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
              ) : PoliciesCategory?.data?.length > 0 ? (
                PoliciesCategory.data.map((item, index) => (
                  <tr
                    key={item._id + index}
                    className="border-b border-slate-200 hover:bg-slate-50 text-center"
                  >
                    <td className="w-1/4 px-4 py-4 font-medium">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="w-1/4 px-4 py-4 font-medium text-left">
                      {item.policyModuleTitle}
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
                          className={`p-2 rounded-full hover:bg-yellow-100 hover:scale-105 transition-all duration-200 ${
                            !canRead ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() => {
                            navigate(`/PoliciesCategory/view/${item._id}`);
                            resetPoliciesCategoryDetails();
                          }}
                          disabled={!canRead}
                          style={{ color: theme.primaryColor }}
                        >
                          <Eye size={20} />
                        </button>

                        <button
                          aria-label="Edit"
                          title={canUpdate ? "Edit" : "No permission"}
                          className={`p-2 rounded-full hover:bg-yellow-100 hover:scale-105 transition-all duration-200 ${
                            !canUpdate ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() => {
                            if (canUpdate) {
                              navigate(`/PoliciesCategory/view/${item._id}`);
                              resetPoliciesCategoryDetails();
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
                          className={`p-2 rounded-full hover:bg-red-100 hover:scale-105 transition-all duration-200 ${
                            !canDelete ? "opacity-50 cursor-not-allowed" : ""
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
                    No Policies Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={PoliciesCategory?.currentPage}
          totalPages={PoliciesCategory?.totalPages}
          totalItems={PoliciesCategory?.totalModules}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      </div>
    </div>
  );
}

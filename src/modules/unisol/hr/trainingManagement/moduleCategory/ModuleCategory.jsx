import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Breadcrumb from "../../../../../components/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import { Eye } from "lucide-react";
import useModuleCategory from "../../../../../hooks/moduleCategory/useModuleCategory.js";
import Pagination from "../../../../../components/Pagination.jsx";
import Button from "../../../../../components/Button.jsx";
import ConfirmationDialog from "../../../../../utils/ConfirmationDialog.jsx";
import LoaderSpinner from "../../../../../components/LoaderSpinner.jsx";
import { usePermissions } from "../../../../../hooks/auth/usePermissions.js";
import { useSignIn } from "../../../../../hooks/auth/useSignIn.js";

export default function ModuleCategory() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [grade, setGrade] = useState("");
  const { hrDetails } = useSignIn();
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions(
    hrDetails,
    "Training Module"
  );
  const {
    fetchAllModuleCategory,
    moduleCategory,
    loading,
    deleteModuleCategory,
    resetModuleCategoryDetails,
  } = useModuleCategory();

  useEffect(() => {
    fetchAllModuleCategory(limit, page, grade);
  }, [limit, page, grade]);
  console.log(moduleCategory);

  const confirmDelete = async () => {
    if (selectedModule) {
      try {
        await deleteModuleCategory(selectedModule);
        fetchAllModuleCategory(limit, page, grade);
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
      setShowDeleteDialog(false);
    }
  };

  const onPageChange = (data) => {
    setPage(data);
    fetchAllModuleCategory(limit, data, grade);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    fetchAllModuleCategory(data, page, grade);
  };

  const handleSearch = (e) => {
    setGrade(e.target.value);
    setPage(1);
  };
  console.log(moduleCategory);
  return (
    <div className="min-h-screen">
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title={`Are you sure you want to delete ${moduleCategory?.data?.trainingModuleTitle}`}
        confirmText="Delete"
      />

      <Breadcrumb
        linkText={[
          { text: "Training Management" },
          { text: "Training Module List" },
        ]}
      />
      <header
        className="px-8 py-4 rounded-t-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ backgroundColor: theme.secondaryColor }}
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">
            Training Module List
          </h1>
        </div>
        <input
          type="text"
          placeholder="Search by grade"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-72"
          value={grade}
          onChange={handleSearch}
        />
        <Button
          type="button"
          text=" Add Training Module"
          disabled={!canCreate}
          onClick={() => {
            navigate("/moduleCategory/add");
            resetModuleCategoryDetails();
          }}
        />
      </header>

      {/* <hr className="h-1" /> */}

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[550px]">
          <table className="w-full text-sm text-left text-slate-700 table-fixed">
            <thead className="bg-slate-100 sticky top-0 z-10">
              <tr>
                <th className="w-1/5 px-4 py-3 font-semibold tracking-wider text-center">
                  SR. NO.
                </th>
                <th className="w-1/5 px-4 py-3 font-semibold tracking-wider text-center">
                  Title
                </th>
                <th className="w-1/5 px-4 py-3 font-semibold tracking-wider text-center">
                  Payroll Grade
                </th>
                <th className="w-1/5 px-4 py-3 font-semibold tracking-wider text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center">
                    <div className="flex justify-center">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              ) : moduleCategory?.data?.length > 0 ? (
                moduleCategory.data.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b border-slate-200 hover:bg-slate-50 text-center"
                  >
                    <td className="w-1/4 px-4 py-4 font-medium">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="w-1/4 px-4 py-4 font-medium">
                      {item.trainingModuleTitle}
                    </td>
                    <td className="w-1/4 px-4 py-4 font-medium">
                      {item?.grade?.join(", ")}
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
                            navigate(`/moduleCategory/view/${item._id}`);
                            resetModuleCategoryDetails();
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
                            navigate(`/moduleCategory/edit/${item._id}`);
                            resetModuleCategoryDetails();
                          }}
                          disabled={!canUpdate}
                          style={{ color: theme.primaryColor }}
                        >
                          <FaEdit size={20} />
                        </button>

                        <button
                          aria-label="Delete"
                          title={canDelete ? "Delete" : "No permission"}
                          className="p-2 rounded-full hover:bg-red-100 hover:scale-105 transition-all duration-200"
                          style={{ color: theme.primaryColor }}
                          onClick={() => {
                            setSelectedModule(item._id);
                            setShowDeleteDialog(true);
                          }}
                          disabled={!canDelete}
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No Modules Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={moduleCategory?.currentPage}
          totalPages={moduleCategory?.totalPages}
          totalItems={moduleCategory?.totalModules}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      </div>
    </div>
  );
}

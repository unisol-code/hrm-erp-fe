import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { useFormik } from "formik";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Button from "../../../../../components/Button";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import useQuestionAnswer from "../../../../../hooks/questionAnswer/useQuestionAnswer";
import { trainingPolicyState } from "../../../../../state/questionAnswer/questionAnswerState";
import { useRecoilState } from "recoil";
import Pagination from "../../../../../components/Pagination";
import ConfirmationDialog from "../../../../../components/Dialogs/ConfirmationDialog";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import { usePermissions } from "../../../../../hooks/auth/usePermissions";
import { useSignIn } from "../../../../../hooks/auth/useSignIn";
import { Eye } from "lucide-react";

export default function QuestionAnswer() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useRecoilState(trainingPolicyState);
  const [hovered, setHovered] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQaId, setSelectedQaId] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const { hrDetails } = useSignIn();
  const { canCreate, canRead, canDelete } = usePermissions(
    hrDetails,
    "Question & Answer"
  );

  const {
    fetchQATitlesList,
    questionsTitlesList,
    loading,
    resetTrainingPolicyQuestionDetails,
    deleteQAForParticularTitle,
  } = useQuestionAnswer();

  useEffect(() => {
    fetchQATitlesList(activeType, page, limit, searchTerm);
  }, [activeType, page, limit, searchTerm]);

  const onPageChange = (newPage) => {
    setPage(newPage);
  };

  const onItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };
  console.log(questionsTitlesList);
  console.log(activeType);

  return (
    <div className="min-h-screen">
      <Breadcrumb
        linkText={[
          { text: "Training Management" },
          { text: "Question & Answer List" },
        ]}
      />
      <header
        className="rounded-t-2xl flex-wrap px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ backgroundColor: theme.secondaryColor }}
      >
        <div className="flex">
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">
            Question & Answer List
          </h1>
        </div>
        <div className="relative">
          <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl cursor-pointer" />
          <input
            type="text"
            placeholder="Search by name"
            className="h-[40px] rounded-[10px] pl-10 pr-4 py-2 border border-gray-500 outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
              setLimit(10);
            }}
          />
        </div>
        <div className="flex gap-2 px-8">
          <button
            className="py-2 px-6 rounded-md shadow-md"
            style={{
              backgroundColor:
                activeType === "Policy"
                  ? "white"
                  : hovered === "Policy"
                  ? theme.highlightColor
                  : theme.primaryColor,
              color:
                activeType === "Policy" ||
                (hovered === "Policy" && activeType !== "Policy")
                  ? "black"
                  : "white",
            }}
            onMouseEnter={() => setHovered("Policy")}
            onMouseLeave={() => setHovered("")}
            onClick={() => setActiveType("Policy")}
          >
            For Policies
          </button>
          <button
            className="py-2 px-6 rounded-md shadow-md"
            style={{
              backgroundColor:
                activeType === "Training"
                  ? "white"
                  : hovered === "Training"
                  ? theme.highlightColor
                  : theme.primaryColor,
              color:
                activeType === "Training" ||
                (hovered === "Training" && activeType !== "Training")
                  ? "black"
                  : "white",
            }}
            onMouseEnter={() => setHovered("Training")}
            onMouseLeave={() => setHovered("")}
            onClick={() => setActiveType("Training")}
          >
            For Training
          </button>
        </div>

        <Button
          type="button"
          variant={1}
          disabled={!canCreate}
          onClick={() => navigate("/questionAnswer/add")}
          text="Add Questions"
        />
      </header>
      <hr className="h-1" />

      <div className="bg-white pb-4 rounded-lg shadow-md ">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-700 table-fixed">
            <thead className="bg-slate-100 sticky top-0 z-10">
              <tr>
                <th className="w-1/3 px-4 py-3 font-semibold tracking-wider text-center">
                  SR. NO.
                </th>
                <th className="w-1/3 px-4 py-3 font-semibold tracking-wider text-left">
                  {activeType === "Policy" ? "Policy Name" : "Training Module"}
                </th>
                <th className="w-1/3 px-4 py-3 font-semibold tracking-wider text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {!questionsTitlesList ||
              questionsTitlesList.modules?.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-4 text-lg font-semibold text-gray-700"
                  >
                    No Data Found...
                  </td>
                </tr>
              ) : !loading ? (
                questionsTitlesList.modules?.map((questionTitle, index) => {
                  const moduleId =
                    questionTitle.policyModuleId ||
                    questionTitle.trainingModuleId;
                  return (
                    <tr
                      key={moduleId}
                      className="border-b border-slate-200 hover:bg-slate-50 text-center"
                    >
                      <td className="w-1/3 px-4 py-3 font-medium">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className="w-1/3 px-4 py-3">
                        <div className="text-left">
                          <span className="text-slate-900">
                            {questionTitle.title}
                          </span>
                        </div>
                      </td>
                      <td className="w-1/3 px-3 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            title={canRead ? "View" : "No permission"}
                            className={`p-2 rounded-full hover:bg-yellow-100 hover:scale-105 transition-all duration-200 ${
                              !canRead ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            style={{ color: theme.primaryColor }}
                            disabled={!canRead}
                            onClick={() => {
                              resetTrainingPolicyQuestionDetails();
                              navigate(`/questionAnswer/module/${moduleId}`);
                            }}
                          >
                            <Eye size={20} />
                          </button>
                          <button
                            className={`p-2 rounded-full hover:bg-red-100 hover:scale-105 transition-all duration-200 ${
                              !canDelete ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            style={{ color: theme.primaryColor }}
                            onClick={() => {
                              setSelectedQaId(questionTitle.qaId);
                              setSelectedTitle(questionTitle.title);
                              setOpenDialog(true);
                            }}
                            disabled={!canDelete}
                          >
                            <MdDelete size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-4 text-lg font-semibold text-gray-700"
                  >
                    <div className="flex justify-center items-center">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <ConfirmationDialog
            isOpen={openDialog}
            onClose={() => setOpenDialog(false)}
            onConfirm={async () => {
              await deleteQAForParticularTitle(selectedQaId);
              fetchQATitlesList(activeType, limit, page, searchTerm);
              setOpenDialog(false);
            }}
            title={`Are you sure you want to delete questions for ${selectedTitle}?`}
            message="This will permanently delete the question & answers from this module."
            confirmText="Delete"
          />

          {!loading && questionsTitlesList.modules?.length > 0 ? (
            <Pagination
              currentPage={questionsTitlesList?.currentPage || 1}
              totalPages={questionsTitlesList?.totalPages || 1}
              totalItems={questionsTitlesList?.totalModules || 0}
              limit={limit}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

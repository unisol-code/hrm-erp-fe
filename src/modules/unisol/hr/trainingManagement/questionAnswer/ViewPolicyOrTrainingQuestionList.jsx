import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Button from "../../../../../components/Button";
import useQuestionAnswer from "../../../../../hooks/questionAnswer/useQuestionAnswer";
import { useRecoilState } from "recoil";
import { trainingPolicyState } from "../../../../../state/questionAnswer/questionAnswerState";
import { useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import Pagination from "../../../../../components/Pagination";
import ConfirmationDialog from "../../../../../components/Dialogs/ConfirmationDialog";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import { Eye } from "lucide-react";

const ViewPolicyOrTrainingQuestionList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { loading, fetchTrainingPolicyQuestionDetails, viewQuestions, resetQATitlesList, resetQuestionDetails, deleteParticularQuestion } = useQuestionAnswer();
  const [activeType, setActiveType] = useRecoilState(trainingPolicyState);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { id } = useParams();
  const [qaId, setQaId] = useState(null);
  const [questionId, setQuestionId] = useState(null);

  const onPageChange = (newPage) => {
    setPage(newPage);
    fetchTrainingPolicyQuestionDetails(activeType, id, limit, newPage);
  };

  const onItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
    fetchTrainingPolicyQuestionDetails(activeType, id, newLimit, 1);
  };

  useEffect(() => {
    if (id && activeType) {
      fetchTrainingPolicyQuestionDetails(activeType, id, limit, page);
    }
  }, [id, activeType, limit, page]);
  console.log(viewQuestions);
  console.log(viewQuestions.
    moduleTitle
  )
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    )
  }
  return (
    <div className="min-h-screen w-full">
      <Breadcrumb
        linkText={[
          { text: "Training Management"},
          { text: "Question & Answer List", href: "/questionAnswer" },
          { text: "View Question List" }
        ]}
      />
      <header className="px-8 py-4 rounded-t-2xl flex flex-wrap items-center justify-between gap-4" style={{ backgroundColor: theme.secondaryColor }}>
        <div className="flex flex-wrap gap-2 items-center">
          <IoMdArrowRoundBack className="w-6 h-6 cursor-pointer" onClick={() => { resetQATitlesList(); navigate('/questionAnswer') }} />
          <h1 className="font-bold text-lg text-slate-900">{viewQuestions.moduleTitle}</h1>
        </div>

        <div className="flex justify-end pr-2">
          <button className="text-white text-lg px-6 py-2 rounded-md shadow-md" style={{ backgroundColor: theme.primaryColor }}>{activeType}</button>
        </div>
        {/* <Button variant={1} onClick={() => navigate("/questionAnswer/add")}
          text={
            <div className="flex items-center gap-1 "><FaPlus />
              <span>Add Questions</span></div>} /> */}
      </header>
      {/* <hr className="h-1" /> */}
      <div className="bg-white pb-4 shadow-md overflow-x-auto rounded-b-2xl">
        <ConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={async () => {
            await deleteParticularQuestion(qaId, questionId);
            fetchTrainingPolicyQuestionDetails(activeType, id, limit, page);
            setShowDeleteDialog(false)
          }}
          title={`Are you sure you want to delete the question?`}
          confirmText="Delete"
        />
        <table className="w-full text-sm text-left text-slate-700 table-fixed">
          <thead className="bg-slate-100 sticky top-0 z-10">
            <tr>
              <th className="w-1/3 px-4 py-3 text-center font-semibold">SR. NO.</th>
              {/* <th className="w-1/4 px-4 py-3 text-left font-semibold">CATEGORY</th> */}
              <th className="w-1/3 px-4 py-3 text-center font-semibold">QUESTION</th>
              <th className="w-1/3 px-4 py-3 text-center font-semibold">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {viewQuestions?.questions?.length > 0 ? (
              viewQuestions.questions.map((item, index) => (
                <tr key={item._id} className="border-b border-slate-200 hover:bg-slate-50 text-center">
                  <td className="w-1/3 px-4 py-3">{index + 1}</td>
                  <td className="w-1/3 px-4 py-3">{item.questionText}</td>
                  <td className="w-1/3 px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        title="View"
                        className="p-2 rounded-full hover:bg-blue-100"
                        style={{ color: theme.primaryColor }}
                        onClick={() => { resetQuestionDetails(); navigate(`/questionAnswer/module/${id}/question/${viewQuestions.qaId}/view/${item._id}`) }}
                      >
                       <Eye size={20} />
                      </button>
                      <button
                        title="Edit"
                        className="p-2 rounded-full hover:bg-yellow-100"
                        style={{ color: theme.primaryColor }}
                        onClick={() => navigate(`/questionAnswer/edit/${viewQuestions.qaId}/${item._id}`)}
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        title="Delete"
                        className="p-2 rounded-full hover:bg-red-100"
                        style={{ color: theme.primaryColor }}
                        onClick={() => {
                          setQaId(viewQuestions.qaId);
                          setQuestionId(item._id)
                          setShowDeleteDialog(true)
                        }
                        }
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4 text-lg font-semibold text-gray-700">
                  No Data Found...
                </td>
              </tr>
            )}


          </tbody>
        </table>
        <Pagination
          currentPage={viewQuestions.currentPage}
          totalPages={viewQuestions.totalPages}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      </div>
    </div>
  );
};

export default ViewPolicyOrTrainingQuestionList;

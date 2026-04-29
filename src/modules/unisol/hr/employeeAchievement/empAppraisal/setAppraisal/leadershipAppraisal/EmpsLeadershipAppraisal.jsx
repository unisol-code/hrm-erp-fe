import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../../../hooks/theme/useTheme";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaGraduationCap } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Button from "../../../../../../../components/Button";
import useLeadershipAppraisal from "../../../../../../../hooks/unisol/empAchievement/useLeadershipAppraisal";
import LoaderSpinner from "../../../../../../../components/LoaderSpinner";
import useDebounce from "../../../../../../../hooks/debounce/useDebounce";

const EmpsLeadershipAppraisal = () => {
  const {
    loading,
    fetchLeadershipAppraisalList,
    ledershipAppraisalList,
    deleteLeadershipAppraisal,
  } = useLeadershipAppraisal();

  const navigate = useNavigate();
  const { theme } = useTheme();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const categories = Array.isArray(ledershipAppraisalList?.data)
  ? ledershipAppraisalList.data
  : [];

  useEffect(() => {
    fetchLeadershipAppraisalList({ title: debouncedSearch });
  }, [debouncedSearch]);

  const handleEdit = (id) => {
    navigate(
      `/hr/employeeAchievement/appraisalList/leadershipGoals/edit/${id}`
    );
  };

  const handleAddMore = () => {
    navigate(
      "/hr/employeeAchievement/appraisalList/leadershipGoals/add"
    );
  };

  const handleDeleteClick = async (id) => {
    const isDeleted = await deleteLeadershipAppraisal(id);
    if (isDeleted) {
      fetchLeadershipAppraisalList({ title: debouncedSearch });
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      
      {/* ================= BREADCRUMB ================= */}
      <Breadcrumb
        linkText={[
          { text: "Employee Achievement", href: "/hr/employeeAchievement" },
          {
            text: "Employee's Appraisal List",
            href: "/hr/employeeAchievement/appraisalList",
          },
          { text: "Set Leadership Appraisal" },
        ]}
      />

      {/* ================= HEADER ================= */}
      <div className="py-4 px-8 flex flex-col md:flex-row md:items-center md:justify-between rounded-2xl bg-white shadow-lg gap-3 mb-4">
        <div className="flex items-center gap-3">
          <FaGraduationCap
            style={{ color: theme.primaryColor, fontSize: 30 }}
          />
          <span className="text-2xl font-bold">
            Set Leadership Appraisal
          </span>
        </div>

        <Button
          onClick={handleAddMore}
          variant={1}
          text="+ Add Leadership Goal"
        />
      </div>

      {/* ================= MAIN SECTION ================= */}
      <section className="bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* FILTER HEADER */}
        <div
          className="h-[80px] flex flex-col md:flex-row md:items-center md:justify-between px-8 gap-3"
          style={{
            background: `linear-gradient(90deg, #f5f9fc 0%, ${theme.highlightColor} 100%)`,
          }}
        >
          <h2 className="font-bold text-xl text-gray-700">
            Leadership Categories
          </h2>

          <input
            type="text"
            placeholder="Search by Title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-[42px] px-4 border border-gray-300 rounded-md 
            focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* ================= TABLE ================= */}
        <div className="p-4 overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="font-semibold text-gray-600 h-[50px] border-b-2 border-gray-300">
                <th className="px-4">Sr. No.</th>
                <th className="px-4">Title</th>
                <th className="px-4">Detailed Description</th>
                <th className="px-4 text-center">Weightage</th>
                <th className="px-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10">
                    <div className="flex justify-center">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              ) : categories?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">
                    No Leadership categories found.
                  </td>
                </tr>
              ) : (
                categories?.map((category, index) => (
                  <tr
                    key={category._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {/* Serial Number */}
                    <td className="px-4 py-4 font-medium">
                      {index + 1}
                    </td>

                    {/* Title + Description */}
                    <td className="px-4 py-4 whitespace-normal break-words max-w-[350px]">
                      <div className="font-semibold text-slate-800">
                        {category.title}
                      </div>
                      <div className="text-gray-600 mt-1">
                        {category.description}
                      </div>
                    </td>

                    {/* Detailed Description */}
                    <td className="px-4 py-4 whitespace-normal break-words max-w-[400px] text-gray-500">
                      {category.detailedDescription}
                    </td>

                    {/* Weightage */}
                    <td className="px-4 py-4 text-center">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-semibold"
                        style={{
                          backgroundColor: `${theme.primaryColor}20`,
                          color: theme.primaryColor,
                        }}
                      >
                        {category.weightage}%
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(category._id)}
                          className="p-2 rounded-lg hover:bg-orange-50 transition"
                          style={{ color: theme.primaryColor }}
                        >
                          <FaEdit size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteClick(category._id)
                          }
                          className="p-2 rounded-lg hover:bg-red-100 transition"
                          style={{ color: theme.primaryColor }}
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </section>
    </div>
  );
};

export default EmpsLeadershipAppraisal;
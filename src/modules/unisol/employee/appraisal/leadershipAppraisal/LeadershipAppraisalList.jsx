import { FaEdit, FaEye, FaRegArrowAltCircleLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useExpAppraisal from "../../../../../hooks/unisol/empAppraisal/useExpAppraisal.js";
import { useEffect, useState } from "react";
import Pagination from "../../../../../components/Pagination.jsx";
import Breadcrumb from "../../../../../components/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import LoaderSpinner from "../../../../../components/LoaderSpinner.jsx";
import Button from "../../../../../components/Button.jsx";
import { Add } from "@mui/icons-material";
import Select from "react-select";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";

const currentYear = new Date().getFullYear();

const LeadershipAppraisalList = () => {
  const navigate = useNavigate();
  const {
    fetchLeadershipAppraisalList,
    submittedLeadershipAppraisaldata,
    loading,
    deleteLeadershipAppraisal,
    fetchEmpLeadershipAppraisalYear,
    leadershipAppraisalYear,
  } = useExpAppraisal();

  const { theme } = useTheme();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedCycle, setSelectedCycle] = useState(null);

  const Tooltip = ({ children, title }) => (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
        {title}
      </div>
    </div>
  );

  useEffect(() => {
    fetchLeadershipAppraisalList({
      page,
      limit,
      year: selectedYear,
      cycle1: selectedCycle === "cycle1" ? true : undefined,
      cycle2: selectedCycle === "cycle2" ? true : undefined,
    });
  }, [page, limit, selectedYear, selectedCycle]);

  useEffect(() => {
    fetchEmpLeadershipAppraisalYear();
  }, []);

  const handleDelete = async (id, status) => {
    if (status === "pending") {
      return; // Don't delete if status is pending
    }
    if (window.confirm("Are you sure you want to delete this appraisal?")) {
      await deleteLeadershipAppraisal(id);
      fetchLeadershipAppraisalList({
        page,
        limit,
        year: selectedYear,
      });
    }
  };

  const cycleOptions = [
    { value: "cycle1", label: "Cycle 1 (Jan-Jun)" },
    { value: "cycle2", label: "Cycle 2 (Jul-Dec)" },
  ];

  const yearOptions =
    leadershipAppraisalYear?.map((year) => ({
      value: year,
      label: year,
    })) || [];

  console.log("submittedLeadershipAppraisaldata", submittedLeadershipAppraisaldata);

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumb
        linkText={[
          { text: "Appraisal", href: "/emp/appraisal" },
          { text: "Leadership Appraisal", href: "#" },
        ]}
      />

      {/* Header */}
      <div className="px-8 py-4 flex items-center bg-white rounded-2xl shadow-md">

        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Link to="/emp/appraisal">
            <FaRegArrowAltCircleLeft size={24} />
          </Link>

          <h1 className="text-2xl font-bold">
            Leadership Appraisal List
          </h1>
        </div>

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-4">

          {/* Year Filter */}
          <Select
            options={yearOptions}
            value={yearOptions.find((y) => y.value === selectedYear)}
            onChange={(option) => setSelectedYear(option.value)}
            placeholder="Select Year"
            styles={{
              container: (base) => ({ ...base, minWidth: 120 }),
              control: (base) => ({
                ...base,
                borderColor: theme.primaryColor,
                '&:hover': { borderColor: theme.secondaryColor }
              })
            }}
          />

          {/* Cycle Filter */}
          <Select
            options={cycleOptions}
            value={cycleOptions.find((c) => c.value === selectedCycle)}
            onChange={(option) => setSelectedCycle(option?.value || null)}
            placeholder="Select Cycle"
            isClearable
            styles={{
              container: (base) => ({ ...base, minWidth: 180 }),
              control: (base) => ({
                ...base,
                borderColor: theme.primaryColor,
                '&:hover': { borderColor: theme.secondaryColor }
              })
            }}
          />

          {/* Give Appraisal Button */}
          <Button
            type="button"
            icon={<Add />}
            text="Give Leadership Appraisal"
            onClick={() =>
              navigate("/emp/appraisal/leadershipappraisal/giveappraisal")
            }
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 bg-white rounded-2xl overflow-x-auto shadow-md">
        <table className="w-full">
          <thead
            className="text-white"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <tr>
              <th className="px-6 py-4 text-center">Sr. No.</th>
              <th className="px-6 py-4 text-center">Date</th>
              <th className="px-6 py-4 text-center">Cycle 1</th>
              <th className="px-6 py-4 text-center">Cycle 2</th>
              <th className="px-6 py-4 text-center">Year</th>
              <th className="px-6 py-4 text-center">Final Rating Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  <div className="flex justify-center">
                    <LoaderSpinner />
                  </div>
                </td>
              </tr>
            ) : submittedLeadershipAppraisaldata?.data?.length ? (
              submittedLeadershipAppraisaldata.data.map(
                (appraisal, index) => (
                  <tr key={appraisal._id} className="border-b hover:bg-gray-50">
                    <td className="text-center py-3">
                      {(page - 1) * limit + index + 1}
                    </td>

                    <td className="text-center">
                      {new Date(appraisal.date).toLocaleDateString()}
                    </td>

                    <td className="text-center">
                      {appraisal.cycle1 ? (
                        <Tooltip title="Completed">
                          <div className="inline-flex items-center justify-center">
                            <IoMdCheckmarkCircleOutline className="text-green-500 text-2xl animate-pulse" />
                          </div>
                        </Tooltip>
                      ) : (
                        <span className="text-gray-300 text-xl">−</span>
                      )}
                    </td>

                    <td className="text-center">
                      {appraisal.cycle2 ? (
                        <Tooltip title="Completed">
                          <div className="inline-flex items-center justify-center">
                            <IoMdCheckmarkCircleOutline className="text-green-500 text-2xl animate-pulse" />
                          </div>
                        </Tooltip>
                      ) : (
                        <span className="text-gray-300 text-xl">−</span>
                      )}
                    </td>

                    <td className="text-center">{appraisal.year}</td>

                    <td className="text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs capitalize ${appraisal.finalRatingStatus === "pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : appraisal.finalRatingStatus === "approved" ||
                              appraisal.finalRatingStatus === "submitted"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                      >
                        {appraisal.finalRatingStatus}
                      </span>
                    </td>

                    <td className="text-center space-x-4">
                      {/* View Button - Always enabled */}
                      <button
                        onClick={() =>
                          navigate(
                            `/emp/appraisal/leadershipappraisal/${appraisal._id}`
                          )
                        }
                        className="hover:scale-110 transition"
                        style={{ color: theme.primaryColor }}
                        title="View"
                      >
                        <FaEye size={18} />
                      </button>

                      {/* Edit Button - Disabled if status is pending */}
                      <button
                        onClick={() => {
                          // if (appraisal.finalRatingStatus !== "pending") {
                            navigate(
                              `/emp/appraisal/leadershipappraisal/edit-appraisal/${appraisal._id}`
                            );
                          // }
                        }}
                        className={`hover:scale-110 transition ${appraisal.finalRatingStatus === "submitted"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                          }`}
                        style={{
                          color: appraisal.finalRatingStatus === "submitted"
                            ? "#9CA3AF"
                            : theme.primaryColor
                        }}
                        disabled={appraisal.finalRatingStatus === "submitted"}
                        title={
                          appraisal.finalRatingStatus === "submitted"
                            ? "Cannot edit while status is pending"
                            : "Edit"
                        }
                      >
                        <FaEdit size={18} />
                      </button>

                      {/* Delete Button - Disabled if status is pending */}
                      <button
                        onClick={() => handleDelete(appraisal._id, appraisal.finalRatingStatus)}
                        className={`hover:scale-110 transition ${appraisal.finalRatingStatus === "submitted"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                          }`}
                        style={{
                          color: appraisal.finalRatingStatus === "submitted"
                            ? "#9CA3AF"
                            : theme.primaryColor
                        }}
                        disabled={appraisal.finalRatingStatus === "submitted"}
                        title={
                          appraisal.finalRatingStatus === "submitted"
                            ? "Cannot delete while status is pending"
                            : "Delete"
                        }
                      >
                        <MdDelete size={18} />
                      </button>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No appraisal records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={submittedLeadershipAppraisaldata?.pagination?.currentPage}
          totalPages={submittedLeadershipAppraisaldata?.pagination?.totalPages}
          totalItems={submittedLeadershipAppraisaldata?.pagination?.totalItems}
          onPageChange={(newPage) => setPage(newPage)}
          onItemsPerPageChange={(newLimit) => setLimit(newLimit)}
        />
      </div>
    </div>
  );
};

export default LeadershipAppraisalList;
import { FaRegArrowAltCircleLeft, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Pagination from "../../../../../components/Pagination";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Button from "../../../../../components/Button";
import { Add } from "@mui/icons-material";
import Select from "react-select";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import useEmpBusinessAppraisal from "../../../../../hooks/unisol/empAppraisal/useEmpBusinessAppraisal";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FiCalendar } from "react-icons/fi";
import "react-circular-progressbar/dist/styles.css";
import { MdDelete } from "react-icons/md";

const BusinessAppraisalList = () => {
  const {
    fetchSubmittedBusinessAppraisal,
    submittedBusinessAppraisal,
    loading,
    fetchAppraisalYears,
    appraisalYear, deleteBusinessAppraisal,
    resetBusinessAppraisalList
  } = useEmpBusinessAppraisal();

  const navigate = useNavigate();
  const { theme } = useTheme();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCycle, setSelectedCycle] = useState(null);

  /* ================= FETCH APPRAISALS ================= */
  useEffect(() => {
    const query = { page, limit };

    if (selectedYear) query.year = selectedYear;
    if (selectedCycle === "cycle1") query.cycle1 = true;
    if (selectedCycle === "cycle2") query.cycle2 = true;

    fetchSubmittedBusinessAppraisal(query);
  }, [page, limit, selectedYear, selectedCycle]);

  /* ================= FETCH YEARS ================= */
  useEffect(() => {
    fetchAppraisalYears();
  }, []);

  /* ================= SAFE YEAR HANDLING ================= */
  const yearArray = Array.isArray(appraisalYear)
    ? appraisalYear
    : appraisalYear?.data || [];

  const yearOptions = yearArray.map((year) => ({
    value: year,
    label: year,
  }));

  const cycleOptions = [
    { value: "cycle1", label: "Cycle 1 (Jan–Jun)" },
    { value: "cycle2", label: "Cycle 2 (Jul–Dec)" },
  ];

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "38px",
      borderColor: state.isFocused ? theme.primaryColor : "#e2e8f0",
      boxShadow: state.isFocused
        ? `0 0 0 2px ${theme.primaryColor}20`
        : "none",
      "&:hover": { borderColor: theme.primaryColor },
    }),
  };

  const renderStatusBadge = (status) => {
    const value = status?.toLowerCase();

    let classes = "bg-gray-100 text-gray-600";

    if (value === "pending")
      classes = "bg-yellow-50 text-yellow-600";
    else if (value === "reject")
      classes = "bg-red-50 text-red-600";
    else if (value === "approve")
      classes = "bg-green-50 text-green-600";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${classes}`}
      >
        {value || "N/A"}
      </span>
    );
  };

  const handleDelete = async (id) => {
    const isDeleted = await deleteBusinessAppraisal(id);
    if (isDeleted) {
      const query = { page, limit };

      if (selectedYear) query.year = selectedYear;
      if (selectedCycle === "cycle1") query.cycle1 = true;
      if (selectedCycle === "cycle2") query.cycle2 = true;

      fetchSubmittedBusinessAppraisal(query);
    };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumb
        linkText={[
          { text: "Appraisal", href: "/emp/appraisal" },
          { text: "Business Appraisal", href: "/emp/appraisal/businessappraisal" },
        ]}
      />

      {/* ================= HEADER ================= */}
      <div className="px-8 py-4 bg-white rounded-2xl shadow-md flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/emp/appraisal"
            className="hover:bg-gray-100 rounded-full transition"
          >
            <FaRegArrowAltCircleLeft size={22} />
          </Link>

          <h1 className="text-2xl font-bold text-gray-800">
            Business Appraisal
          </h1>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <Select
            options={yearOptions}
            value={
              yearOptions.find((opt) => opt.value === selectedYear) || null
            }
            onChange={(option) =>
              setSelectedYear(option?.value || null)
            }
            placeholder="Select Year"
            isClearable
            styles={selectStyles}
            className="min-w-[140px]"
          />

          <Select
            options={cycleOptions}
            value={
              cycleOptions.find((opt) => opt.value === selectedCycle) || null
            }
            onChange={(option) =>
              setSelectedCycle(option?.value || null)
            }
            placeholder="Select Cycle"
            isClearable
            styles={selectStyles}
            className="min-w-[180px]"
          />

          <Button
            variant={1}
            type="button"
            text="Give Business Appraisal"
            onClick={() =>
              navigate("/emp/appraisal/businessappraisal/giveappraisal")
            }
            icon={<Add />}
          />
        </div>
      </div>

      <div className="mt-4 bg-white w-full rounded-2xl overflow-x-auto shadow-md">
        <table className="w-full">
          <thead>
            <tr
              className="text-white"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.primaryColor}dd 100%)`,
              }}
            >
              <th className="px-6 py-4 text-center">Sr.No.</th>
              <th className="px-6 py-4 text-center">Date</th>
              <th className="px-6 py-4 text-center">Cycle 1</th>
              <th className="px-6 py-4 text-center">Cycle 2</th>
              <th className="px-6 py-4 text-center">Year</th>
              <th className="px-6 py-4 text-center">Total Business Rating</th>
              <th className="px-6 py-4 text-center">Final Rating Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center">
                  <div className="flex justify-center">
                    <LoaderSpinner />
                  </div>
                </td>
              </tr>
            ) : submittedBusinessAppraisal?.data?.length ? (
              submittedBusinessAppraisal.data.map((appr, index) => (
                <tr
                  key={appr._id}
                  className="even:bg-gray-50 hover:bg-indigo-50 transition border-b"
                >
                  <td className="px-6 py-4 text-center">
                    {index + 1 + (page - 1) * limit}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {new Date(appr?.date).toLocaleDateString("en-GB")}
                  </td>

                  {/* Cycle 1 */}
                  <td className="px-6 py-4 text-center">
                    {appr?.cycle1 ? (
                      <div className="flex justify-center items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full">
                        <IoMdCheckmarkCircleOutline size={18} />
                        <span className="text-xs font-medium">
                          Completed
                        </span>
                      </div>
                    ) : (
                      <span className="text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    )}
                  </td>

                  {/* Cycle 2 */}
                  <td className="px-6 py-4 text-center">
                    {appr?.cycle2 ? (
                      <div className="flex justify-center items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full">
                        <IoMdCheckmarkCircleOutline size={18} />
                        <span className="text-xs font-medium">
                          Completed
                        </span>
                      </div>
                    ) : (
                      <span className="text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {appr?.year}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {appr?.totalBusinessRating || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {renderStatusBadge(appr?.finalRatingStatus)}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        navigate(
                          `/emp/appraisal/business-appraisal/view-appraisal/${appr._id}`
                        )
                      }
                      style={{ color: theme.primaryColor }}
                      className="hover:scale-110 transition"
                    >
                      <FaEye size={18} />
                    </button>
                    {appr?.finalRatingStatus === "pending" && (
                      <>
                        <button
                          onClick={() => {
                            navigate(
                              `/emp/appraisal/business-appraisal/edit-appraisal/${appr._id}`
                            )
                            resetBusinessAppraisalList();
                          }
                          }
                          className="ml-2"
                          style={{ color: theme.primaryColor }}
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(appr._id)}
                          className="ml-2"
                          style={{ color: theme.primaryColor }}>
                          <MdDelete size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <FiCalendar size={32} className="text-gray-400" />
                    <p className="text-gray-600">
                      No appraisal records found
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ================= PAGINATION ================= */}
        <div className="border-t border-gray-100">
          <Pagination
            currentPage={
              submittedBusinessAppraisal?.pagination?.currentPage
            }
            totalPages={
              submittedBusinessAppraisal?.pagination?.totalPages
            }
            totalItems={
              submittedBusinessAppraisal?.pagination?.totalItems
            }
            onPageChange={(data) => setPage(data)}
            onItemsPerPageChange={(data) => {
              setLimit(data);
              setPage(1);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessAppraisalList;

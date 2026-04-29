import React, { useEffect } from "react";
import { IconButton } from "@mui/material";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import Pagination from "../../../../components/Pagination";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { UserMinus } from "lucide-react";
import useResignation from "../../../../hooks/unisol/resignation/useResignation";

const Resignation = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [status, setStatus] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { resignationData, fetchAllDataResignation, deleteResignationById } =
    useResignation();
  useEffect(() => {
    fetchAllDataResignation();
  }, []);
  console.log("resignationData", resignationData);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {}, 500);

    return () => clearTimeout(delayDebounce);
  }, [limit, page, status, search]);

  const onPageChange = (data) => {
    setPage(data);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    setPage(1);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-green-600 bg-green-50 px-3 py-1 rounded-full";
      case "pending":
        return "text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full";
      case "rejected":
        return "text-red-600 bg-red-50 px-3 py-1 rounded-full";
      default:
        return "text-slate-600 bg-slate-50 px-3 py-1 rounded-full";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDeleteClick = (id) => {
    deleteResignationById(id);
  };

  return (
    <div>
      <Breadcrumb linkText={[{ text: "Resignation" }]} />

      <div className="py-4 px-8 flex flex-col md:flex-row md:items-center md:justify-between rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
        <div className="flex items-center gap-3">
          <UserMinus style={{ color: theme.primaryColor, fontSize: 32 }} />
          <span className="text-2xl font-bold">Resignation List</span>
        </div>
        <button
          onClick={() => navigate("/emp/resignation/applyforresignation")}
          className="px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-200"
          style={{
            backgroundColor: theme.primaryColor,
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = "1";
          }}
        >
          Apply for Resignation
        </button>
      </div>

      {/* Header */}
      <header
        className="px-8 py-4 rounded-t-2xl flex flex-col md:flex-row flex-wrap md:items-center justify-between gap-4"
        style={{
          background: `linear-gradient(90deg, #f5f9fc 0%, ${theme.highlightColor} 100%)`,
        }}
      >
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">
            Resignation Requests
          </h1>
        </div>
      </header>
      <hr className="h-1" />
      <div className="bg-white pb-4 rounded-2xl shadow-md">
        <div className="overflow-x-auto overflow-y-auto max-h-[550px]">
          <table className="w-full text-sm text-left text-slate-700 table-fixed">
            <thead className="bg-slate-100 sticky top-0 z-10">
              <tr>
                <th className="w-[20%] px-4 py-3 font-semibold tracking-wider text-center">
                  SR. NO.
                </th>
                <th className="w-[20%] px-4 py-3 font-semibold tracking-wider text-center">
                  Applied Date
                </th>
                <th className="w-[20%] px-4 py-3 font-semibold tracking-wider text-start">
                  Resignation Reason
                </th>
                <th className="w-[20%] px-4 py-3 font-semibold tracking-wider text-center">
                  Status
                </th>
                <th className="w-[20%] px-4 py-3 font-semibold tracking-wider text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="w-full">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center">
                    <div className="flex justify-center">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              ) : resignationData?.length > 0 ? (
                resignationData?.map((item, index) => (
                  <tr
                    key={item._id + index}
                    className="border-b border-slate-200 hover:bg-slate-50"
                  >
                    <td className="w-[8%] px-4 py-4 font-medium text-center">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="w-[13%] px-4 py-4 font-medium text-center">
                      {formatDate(item.resignationDate)}
                    </td>

                    <td className="w-[10%] px-4 py-4 font-medium">
                      {item.resignationReason}
                    </td>

                    <td className="w-[10%] px-4 py-4 font-medium text-center">
                      <span className={getStatusColor(item.status)}>
                        {item.status}
                      </span>
                    </td>
                    <td className="w-[10%] px-4 py-4 font-medium text-center">
                      <div className="flex justify-center gap-1">
                        {/* VIEW (always enabled) */}
                        <IconButton
                          onClick={() => {
                            navigate(
                              `/emp/resignation/viewresignation/${item._id}`
                            );
                          }}
                        >
                          <FaEye
                            size={20}
                            style={{ color: theme.primaryColor }}
                          />
                        </IconButton>

                        {/* EDIT */}
                        <IconButton
                          onClick={() => {
                            if (item.status === "pending") {
                              navigate(
                                `/emp/resignation/editresignation/${item._id}`
                              );
                            }
                          }}
                          disabled={!item.status === "pending"}
                          style={{
                            cursor:
                              item.status === "pending"
                                ? "pointer"
                                : "not-allowed",
                            opacity: item.status === "pending" ? 1 : 0.4,
                          }}
                        >
                          <FaEdit
                            size={20}
                            style={{ color: theme.primaryColor }}
                          />
                        </IconButton>

                        {/* DELETE */}
                        <IconButton
                          onClick={() => {
                            if (item.status === "pending") {
                              handleDeleteClick(item._id);
                            }
                          }}
                          disabled={!item.status === "pending"}
                          style={{
                            cursor:
                              item.status === "pending"
                                ? "pointer"
                                : "not-allowed",
                            opacity: item.status === "pending" ? 1 : 0.4,
                          }}
                        >
                          <MdDelete
                            size={20}
                            style={{ color: theme.primaryColor }}
                          />
                        </IconButton>
                      </div>
                    </td>


                    {/* <td className="w-[10%] px-4 py-4 font-medium text-center"> <div className="flex justify-center gap-1"> <IconButton onClick={() => { navigate( /emp/resignation/viewresignation/${item._id} ); }} > <FaEye size={20} style={{ color: theme.primaryColor }} /> </IconButton> <IconButton onClick={() => { if (item.status !== "approved") { navigate( /emp/resignation/editresignation/${item._id} ); } }} disabled={item.status === "approved" || item.status === "rejected"} style={{ cursor: item.status === "approved" || item.status === "rejected" ? "not-allowed" : "pointer", opacity: item.status === "approved" ? 0.4 : 1, }} > <FaEdit size={20} style={{ color: theme.primaryColor }} /> </IconButton> <IconButton onClick={() => { if (item.status !== "approved" || item.status === "rejected") { handleDeleteClick(item._id); } }} disabled={item.status === "approved" || item.status === "rejected"} style={{ cursor: item.status === "approved" || item.status === "rejected" ? "not-allowed" : "pointer", opacity: item.status === "approved" ? 0.4 : 1, }} > <MdDelete size={20} style={{ color: theme.primaryColor }} /> </IconButton> </div> </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500">
                    No Resignation Request Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={resignationData?.currentPage}
          totalPages={resignationData?.totalPages}
          totalItems={resignationData?.totalRequests}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      </div>
    </div>
  );
};

export default Resignation;

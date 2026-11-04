import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useHRPrivilege from "../../../../../hooks/unisol/homeDashboard/useHRPrivilege";
import { useEffect } from "react";
import LoaderSpinner from "../../../../../components/LoaderSpinner";

const IconView = ({ className = "text-gray-600 hover:text-gray-900" }) => (
  <svg
    className={`w-5 h-5 cursor-pointer ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const COLOR_CLASSES = [
  "bg-green-100 text-green-800",
  "bg-blue-100 text-blue-800",
  "bg-purple-100 text-purple-800",
  "bg-orange-100 text-orange-800",
  "bg-pink-100 text-pink-800",
];

export default function HrPrivilegeTable() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { hRPrivilegeList, fetchHRPrivilegeList, loading, deleteHRPrivilege } = useHRPrivilege();

  useEffect(() => {
    fetchHRPrivilegeList();
  }, []);

  const getInitials = (name) => {
    if (!name) return "";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  const getColorByIndex = (index) => COLOR_CLASSES[index % COLOR_CLASSES.length];

  const handleView = (id) => navigate(`/home/hrPrivilege/view/${id}`);

  const handleDelete = async (id) => {
    await deleteHRPrivilege(id);
    fetchHRPrivilegeList();
  };

  return (
    <section className="px-2 sm:px-4 md:px-0">
      <Breadcrumb linkText={[{ text: "HR Privilege" }]} />

      <div className="w-full rounded-lg bg-white shadow-lg overflow-hidden">
        {/* Header */}
        <header className="bg-slate-100 px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              HR Privilege Management
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Manage and assign HR privileges to your team members
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 text-white px-5 py-3 rounded-md shadow-md font-semibold w-full md:w-auto transition"
            style={{ backgroundColor: theme.primaryColor }}
            aria-label="Assign HR Privilege"
            onClick={() => navigate("/home/hrPrivilege/add")}
          >
            Assign HR Privilege
          </button>
        </header>

        <hr className="h-1" />

        {/* Table — horizontal scroll on small screens, no separate mobile view */}
        <div className="max-h-[550px] overflow-auto">
          <table className="w-full min-w-[820px] text-sm text-left text-slate-700">
            <thead className="bg-slate-100 sticky top-0 z-10">
              <tr>
                <th className="px-3 sm:px-4 py-3 font-semibold tracking-wider text-left whitespace-nowrap">
                  SR. NO.
                </th>
                <th className="px-3 sm:px-4 py-3 font-semibold tracking-wider text-left whitespace-nowrap">
                  COMPANY
                </th>
                <th className="px-3 sm:px-4 py-3 font-semibold tracking-wider text-left whitespace-nowrap">
                  HR NAMES
                </th>
                <th className="px-3 sm:px-4 py-3 font-semibold tracking-wider text-left whitespace-nowrap">
                  DESIGNATION
                </th>
                <th className="px-3 sm:px-4 py-3 font-semibold tracking-wider text-left whitespace-nowrap">
                  COMPANIES ACCESS
                </th>
                <th className="px-3 sm:px-4 py-3 font-semibold tracking-wider text-left whitespace-nowrap">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="w-full py-4">
                    <div className="w-full flex justify-center items-center">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              ) : hRPrivilegeList?.length ? (
                hRPrivilegeList.map((hr, index) => {
                  const color = getColorByIndex(index);
                  return (
                    <tr
                      key={hr._id}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="px-3 sm:px-4 py-4 font-medium text-left whitespace-nowrap">
                        {index + 1}.
                      </td>

                      <td className="px-3 sm:px-4 py-4 text-left whitespace-nowrap">
                        <span
                          className={`inline-block py-1.5 px-3 rounded-full text-xs font-semibold ${color}`}
                        >
                          {hr.companyName}
                        </span>
                      </td>

                      <td className="px-3 sm:px-4 py-4 text-left">
                        <div className="flex items-center gap-3 min-w-0">
                          {hr.photo ? (
                            <img
                              src={hr.photo}
                              alt={hr.fullName}
                              className="w-10 h-10 rounded-full object-cover shadow-md shrink-0"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/40";
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#8890f2] shadow-md text-white font-semibold text-lg flex items-center justify-center select-none shrink-0">
                              {getInitials(hr.fullName)}
                            </div>
                          )}
                          <span className="text-slate-900 whitespace-nowrap">
                            {hr.fullName}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 sm:px-4 py-4 text-left whitespace-nowrap">
                        {hr.designation}
                      </td>

                      <td className="px-3 sm:px-4 py-4 text-left">
                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                          {hr.companyAccess?.map((company, i) => (
                            <span
                              key={i}
                              className={`inline-block py-1 px-2 rounded-full text-xs font-semibold ${color}`}
                            >
                              {company}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-3 sm:px-4 py-4 text-left whitespace-nowrap">
                        <div className="flex gap-1">
                          <button
                            aria-label={`View ${hr.fullName}`}
                            title={`View ${hr.fullName}`}
                            className="p-2 rounded-full hover:bg-blue-100 hover:scale-105 transition-all duration-200"
                            onClick={() => handleView(hr._id)}
                          >
                            <IconView className="text-blue-600" />
                          </button>

                          <button
                            aria-label={`Edit ${hr.fullName}`}
                            title={`Edit ${hr.fullName}`}
                            className="p-2 rounded-full hover:bg-yellow-100 hover:scale-105 transition-all duration-200"
                            onClick={() => navigate(`/home/hrPrivilege/edit/${hr._id}`)}
                          >
                            <FaEdit size={20} />
                          </button>

                          <button
                            aria-label={`Delete ${hr.fullName}`}
                            title={`Delete ${hr.fullName}`}
                            className="p-2 rounded-full hover:bg-red-100 hover:scale-105 transition-all duration-200"
                            onClick={() => handleDelete(hr._id)}
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
                  <td colSpan="6" className="text-center py-8 text-slate-500">
                    No HR privileges found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
import { useEffect, useState } from "react";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import { useNavigate } from "react-router-dom";
import { FaEye, FaShieldAlt } from "react-icons/fa";
import useEmpPolicy from "../../../../hooks/unisol/empPolicy/useEmpPolicy";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import Pagination from "../../../../components/Pagination";

const PrivacyPolicy = () => {
  const { theme } = useTheme();
  const { fetchEmpPolicyList, empPolicyList, loading } = useEmpPolicy();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEmpPolicyList(page, limit, search);
  }, [page, limit, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // reset to first page on search
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}|${month}|${year}`;
  };

  if (loading || !empPolicyList) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    );
  }

  // const totalItems = empPolicyList?.total || 0;
  // const totalPages = Math.ceil(totalItems / limit);
  const totalItems = empPolicyList?.total ?? empPolicyList?.data?.length ?? 0;
const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb
        linkText={[
          { text: "Policies", href: "/emp/privacypolicy" },
          { text: "Policy List" },
        ]}
      />

      {/* Header Section */}
      <div className="py-4 px-8 flex flex-col md:flex-row md:items-center rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
        <div className="flex items-center gap-3 flex-1">
          <FaShieldAlt style={{ color: theme.primaryColor, fontSize: 32 }} />
          <span className="text-2xl font-bold">Privacy Policy List</span>
        </div>
      </div>

      <section className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
        {/* Section Header */}
        <div
          className="w-full h-[60px] flex items-center justify-between px-8"
          style={{
            background: `linear-gradient(90deg, #f5f9fc 0%, ${theme.highlightColor} 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <FaShieldAlt className="text-blue-600 text-xl" />
            <h2 className="font-bold text-xl text-gray-700">Policy List</h2>
          </div>
          <div className="mt-3 md:mt-0 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by policy name"
              className="border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-600 transition w-full md:w-72 shadow-sm"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Table */}
        <div className="w-full p-4">
          <table className="w-full text-center">
            <thead>
              <tr className="font-semibold text-gray-600 h-[50px] border-b-2 border-gray-300">
                <th className="px-4">SR. NO.</th>
                <th className="px-4">Policy Name</th>
                <th className="px-4">Date</th>
                <th className="px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {empPolicyList?.data?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-gray-500 text-lg">
                    No policies found.
                  </td>
                </tr>
              ) : (
                empPolicyList?.data?.map((item, index) => (
                  <tr
                    key={item._id}
                    className="h-[60px] border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 font-medium">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-4 font-semibold text-slate-700">
                      {item.policyModuleTitle}
                    </td>
                    <td className="px-4">
                      <span className=" text-gray-700 px-3 py-1 text-md font-medium">
                        {formatDate(item.createdAt)}
                      </span>
                    </td>
                    <td className="px-4">
                      <button
                        aria-label={`View ${item.category}`}
                        title={`View ${item.category}`}
                        style={{ color: theme.primaryColor }}
                        className="hover:scale-110 transition-transform duration-150"
                        onClick={() => {
                          navigate(`/emp/privacypolicy/view/${item._id}`);
                        }}
                      >
                        <FaEye size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={limit}
          onPageChange={setPage}
          onItemsPerPageChange={setLimit}
        />
      </section>
    </div>
  );
};

export default PrivacyPolicy;

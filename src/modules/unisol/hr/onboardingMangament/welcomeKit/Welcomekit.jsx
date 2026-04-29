import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Eye } from "lucide-react";
import BreadCrumb from "../../../../../components/BreadCrumb";
import Button from "../../../../../components/Button";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import ConfirmationDialog from "../../../../../utils/ConfirmationDialog";
import Pagination from "../../../../../components/Pagination";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import useWelcomeKit from "../../../../../hooks/unisol/onboarding/useWelcomekit";

const WelcomeKit = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedKit, setSelectedKit] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  const {
    loading,
    welcomeKitList,
    fetchWelcomeKits,
    deleteWelcomeKit,
    changeWelcomeKitStatus,
  } = useWelcomeKit();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchWelcomeKits({
        search,
        page,
        limit,
      });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, page, limit]);

  const handleDeleteClick = async (id) => {
    const isDeleted = await deleteWelcomeKit(id);

    if (isDeleted) {
      fetchWelcomeKits({ search, page, limit });
    }
  };

  const handleToggleStatus = async (id) => {
    const success = await changeWelcomeKitStatus(id);

    if (success) {
      fetchWelcomeKits({ search, page, limit });
    }
  };

  // const confirmDelete = async () => {
  //   if (!selectedKit) return;

  //   try {
  //     await deleteWelcomeKit(selectedKit);

  //     // Refresh list after delete
  //     fetchWelcomeKits({
  //       search,
  //       page,
  //       limit,
  //     });
  //   } catch (error) {
  //     console.error("Error deleting welcome kit:", error);
  //   } finally {
  //     setShowDeleteDialog(false);
  //     setSelectedKit(null);
  //   }
  // };

  const handleAddClick = () => {
    navigate("/onboardingmanegement/welcomeKit/addEditWelcomeKit");
  };

  const handleViewClick = (id) => {
    navigate(`/onboardingmanegement/welcomeKit/viewWelcomeKit/${id}`);
  };

  const handleEditClick = (id) => {
    navigate(`/onboardingmanegement/welcomeKit/addEditWelcomeKit/${id}`);
  };

  return (
    <div className="min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Onboarding Management" },
          { text: "Welcome Kit List" },
        ]}
      />

      <header
        className="px-8 py-4 rounded-t-2xl flex flex-col md:flex-row flex-wrap md:items-center justify-between gap-4"
        style={{ backgroundColor: theme.secondaryColor }}
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">
            Welcome Kit List
          </h1>
        </div>
        <input
          type="text"
          placeholder="Search by name or description"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-72"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <Button
          variant={1}
          type="button"
          text="Add Welcome Kit"
          onClick={handleAddClick}
        />
      </header>

      {/* <hr className="h-1" /> */}

      <div className="bg-white pb-4 rounded-2xl shadow-md">
        <div className="overflow-x-auto overflow-y-auto max-h-[550px]">
          <table className="w-full text-sm text-left text-slate-700 table-fixed">
            <thead className="bg-slate-100 sticky top-0 z-10">
              <tr>
                <th className="w-[10%] px-4 py-3 font-semibold tracking-wider text-center">
                  SR. NO.
                </th>
                <th className="w-[20%] px-4 py-3 font-semibold tracking-wider text-center">
                  PHOTOS
                </th>
                <th className="w-[20%] px-4 py-3 font-semibold tracking-wider text-start">
                  NAME
                </th>
                <th className="w-[30%] px-4 py-3 font-semibold tracking-wider text-start">
                  DESCRIPTION
                </th>
                <th className="w-[10%] px-4 py-3 font-semibold tracking-wider text-center">
                  STATUS
                </th>
                <th className="w-[20%] px-4 py-3 font-semibold tracking-wider text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="w-full">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    <div className="flex justify-center">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              ) : welcomeKitList?.data?.length > 0 ? (
                welcomeKitList.data.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b border-slate-200 hover:bg-slate-50"
                  >
                    <td className="w-[10%] px-4 py-4 font-medium text-center">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="w-[20%] px-4 py-4">
                      <div className="flex justify-center">
                        {item.photos && item.photos.length > 0 ? (
                          <div className="relative w-12 h-12">
                            <img
                              src={item.photos[0]}
                              alt={`${item.name}`}
                              className="w-12 h-12 rounded object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/48/cccccc/666666?text=No+Image";
                              }}
                            />
                            {item.photos.length > 1 && (
                              <div className="absolute top-0 left-0 w-12 h-12 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs rounded">
                                +{item.photos.length - 1}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-400 border border-gray-200">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="w-[20%] px-4 py-4 font-medium text-left">
                      {item.name}
                    </td>
                    <td className="w-[30%] px-4 py-4 text-left text-slate-600">
                      <p
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: "1.4em",
                          maxHeight: "2.8em",
                        }}
                      >
                        {" "}
                        {item.description}
                      </p>
                    </td>
                    <td className="w-[10%] px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={item.isActive}
                        onChange={async () => {
                          const success = await changeWelcomeKitStatus(
                            item._id,
                            item.isActive
                          );
                          if (success) {
                            fetchWelcomeKits({ search, page, limit }); // refresh table
                          }
                        }}
                        className="w-6 h-6 cursor-pointer"
                      />
                    </td>

                    <td className="w-[20%] px-3 py-4">
                      <div className="flex justify-center gap-1">
                        <button
                          aria-label="View"
                          title="View"
                          className="p-2 rounded-full hover:bg-yellow-100 hover:scale-105 transition-all duration-200"
                          onClick={() => handleViewClick(item._id)}
                          style={{ color: theme.primaryColor }}
                        >
                          <Eye size={20} />
                        </button>

                        <button
                          aria-label="Edit"
                          title="Edit"
                          className="p-2 rounded-full hover:bg-yellow-100 hover:scale-105 transition-all duration-200"
                          onClick={() => handleEditClick(item._id)}
                          style={{ color: theme.primaryColor }}
                        >
                          <FaEdit size={20} />
                        </button>

                        <button
                          aria-label="Delete"
                          title="Delete"
                          className="p-2 rounded-full hover:bg-red-100 hover:scale-105 transition-all duration-200"
                          onClick={() => handleDeleteClick(item._id)}
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
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    No Welcome Kits Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            currentPage={welcomeKitList?.pagination?.currentPage}
            totalPages={welcomeKitList?.pagination?.totalPages}
            totalItems={welcomeKitList?.pagination?.totalCount}
            onPageChange={(page) => setPage(page)}
            onItemsPerPageChange={(limit) => setLimit(limit)}
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeKit;

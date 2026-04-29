import React, { useEffect, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useHRPrivilege from "../../../../../hooks/unisol/homeDashboard/useHRPrivilege";
import Profile from "../../../../../assets/images/profile-image.png";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import { FaGraduationCap } from "react-icons/fa6";

function ViewHRPrivilege() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { fetchPrivilegeById, privilegeDetails, loading, resetPrivilegeById } =
    useHRPrivilege();
  const { id } = useParams();
  const [companyPrivileges, setCompanyPrivileges] = useState({});
  const [modulePrivileges, setModulePrivileges] = useState({});

  useEffect(() => {
    if (id) {
      fetchPrivilegeById(id);
    }
    return () => resetPrivilegeById();
  }, [id]);

  console.log("id", id, "privilegeDetails", privilegeDetails);

  useEffect(() => {
    if (privilegeDetails) {
      const companyAccess = privilegeDetails.companyAccess.reduce(
        (acc, company) => {
          acc[company.name] = true;
          return acc;
        },
        {}
      );
      setCompanyPrivileges(companyAccess);

      const modulesAccess = privilegeDetails.modules.reduce((acc, module) => {
        acc[module.moduleName] = {
          selected: true,
          add: module.accessTypes.includes("create"),
          view: module.accessTypes.includes("read"),
          update: module.accessTypes.includes("update"),
          delete: module.accessTypes.includes("delete"),
        };
        return acc;
      }, {});
      setModulePrivileges(modulesAccess);
    }
  }, [privilegeDetails]);

  if (loading || !privilegeDetails) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Breadcrumb
        linkText={[
          { text: "HR Privilege", href: "/home/hrPrivilege" },
          { text: "View HR Privilege" },
        ]}
      />
      {/* Header Section */}
      <div className="py-4 px-8 flex flex-col md:flex-row md:items-center rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
        <div className="flex items-center gap-3 flex-1">
          <FaGraduationCap
            style={{ color: theme.primaryColor, fontSize: 32 }}
          />
          <span className="text-2xl font-bold">View {privilegeDetails?.employee_id?.fullName}'s Privileges</span>
        </div>
      </div>

      {/* Main content container */}
      <main className="flex-grow  bg-white mx-auto rounded-xl sm:px-6 lg:px-8 py-8 w-full">
        <section className="mb-8 p-4 shadow-sm border rounded-2xl space-y-4 text-gray-800">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Side - Photo */}
            <div className="flex justify-center md:justify-start">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src={privilegeDetails?.employee_id?.photo || Profile}
                  alt="Employee Photo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = Profile;
                  }}
                />
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <span className="font-semibold w-36">Company:</span>
                <span>
                  {privilegeDetails?.employee_id?.companyName || "Loading..."}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <span className="font-semibold w-36">Department:</span>
                <span>
                  {privilegeDetails?.employee_id?.department || "Loading..."}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <span className="font-semibold w-36">Designation:</span>
                <span>
                  {privilegeDetails?.employee_id?.designation || "Loading..."}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <span className="font-semibold w-36">HR Full Name:</span>
                <span>
                  {privilegeDetails?.employee_id?.fullName || "Loading..."}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <span className="font-semibold w-36">Email ID:</span>
                <span>
                  {privilegeDetails?.employee_id?.officialEmail || "Loading..."}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Privileges Table */}
        <section className="bg-white font-bold overflow-x-auto h-full w-full p-6 shadow-sm border rounded-2xl">
          <p className="text-[20px] text-black-400">Choose Privileges</p>
          <br />

          {/* Company Selection Header */}
          <table className="table-fixed w-full">
            <thead className="bg-[#E9EBF7] text-gray-500 text-md font-semibold text-center">
              <tr>
                <th className="border-t border-l border-r border-black border-b-0 min-w-[300px] px-6 py-3 text-left">
                  Select Company
                </th>
                {privilegeDetails?.companyAccess?.map((company) => (
                  <th
                    key={company._id}
                    className="border border-black min-w-[650px] px-4 py-3 text-center"
                  >
                    {company.name}
                  </th>
                ))}
              </tr>
              <tr>
                <td className="border-t-0 border-l border-r border-b border-black min-w-[300px] px-6 py-2"></td>
                {privilegeDetails?.companyAccess?.map((company) => (
                  <td
                    key={`${company._id}-toggle`}
                    className="border border-black min-w-[650px] px-4 py-2 text-center"
                  >
                    <label
                      htmlFor={`company-toggle-${company._id}`}
                      className="inline-flex relative items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id={`company-toggle-${company._id}`}
                        className="sr-only peer"
                        checked={companyPrivileges[company.name] || false}
                        readOnly
                      />
                      <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500 peer-checked:bg-indigo-600 transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow transform peer-checked:translate-x-4 transition-transform" />
                    </label>
                  </td>
                ))}
              </tr>
            </thead>
          </table>

          {/* Modules + Privileges */}
          <table className="min-w-full mt-2">
            <tbody className="text-md text-gray-500 font-semibold text-center">
              {/* Header Row */}
              <tr className="bg-[#EBFBFF] font-semibold">
                <th className="border border-black w-[125px] h-[60px]">
                  Modules
                </th>
                <th className="border border-black w-[100px] h-[60px]">
                  Access
                </th>
                <th className="border border-black w-[100px] h-[60px]">
                  Create
                </th>
                <th className="border border-black w-[100px] h-[60px]">Read</th>
                <th className="border border-black w-[100px] h-[60px]">
                  Update
                </th>
                <th className="border border-black w-[100px] h-[60px]">
                  Delete
                </th>
              </tr>

              {privilegeDetails?.modules?.map((module) => (
                <tr key={module._id} className="even:bg-white odd:bg-gray-50">
                  <td className="border border-black w-[50px] h-[60px] pl-4 text-left">
                    {module.moduleName}
                  </td>
                  <td className="border border-black w-[100px] h-[60px]">
                    <input
                      type="checkbox"
                      checked={true}
                      readOnly
                      className="appearance-none w-6 h-6 border border-black rounded-sm checked:bg-black checked:border-black flex items-center justify-center text-sm font-bold checked:before:content-['✓'] checked:before:text-white checked:before:text-sm checked:before:leading-5 mx-auto"
                    />
                  </td>
                  {["create", "read", "update", "delete"].map((perm) => (
                    <td
                      className="border border-black w-[100px] h-[60px]"
                      key={`${module._id}-${perm}`}
                    >
                      <ToggleSwitch
                        id={`${module._id}-${perm}`}
                        checked={module.accessTypes.includes(perm)}
                        readOnly
                        label={`${perm} ${module.moduleName}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center">
            <button
              type="button"
              style={{ backgroundColor: theme.primaryColor }}
              className="inline-flex items-center mt-5 gap-2 transition text-white px-2 py-3 rounded-md shadow-md font-semibold min-w-[215px] justify-center"
              aria-label="Edit HR Privilege"
              onClick={() =>
                navigate(`/home/hrPrivilege/edit/${privilegeDetails?._id}`)
              }
            >
              Edit
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

// Reusable toggle switch component with Tailwind CSS and proper accessibility
function ToggleSwitch({ id, checked, onChange, label, readOnly = false }) {
  return (
    <label
      htmlFor={id}
      className={`inline-flex relative items-center ${readOnly ? "cursor-default" : "cursor-pointer"
        }`}
      title={label}
    >
      <input
        type="checkbox"
        id={id}
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
        readOnly={readOnly}
      />
      <div
        className={`w-9 h-5 bg-gray-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500 peer-checked:bg-indigo-600 transition-colors ${readOnly ? "opacity-50" : ""
          }`}
      ></div>
      <div
        className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow transform peer-checked:translate-x-4 transition-transform"
        aria-hidden="true"
      ></div>
    </label>
  );
}

export default ViewHRPrivilege;

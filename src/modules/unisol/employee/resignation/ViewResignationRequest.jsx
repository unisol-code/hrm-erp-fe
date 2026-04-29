import React, { useEffect, useState } from "react";
import {
  UserMinus,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import useResignation from "../../../../hooks/unisol/resignation/useResignation";
import useEmpExpense from "../../../../hooks/unisol/empExpense/useEmpExpense";
import { useParams } from "react-router-dom";

const ViewResignationPage = () => {
  const { theme } = useTheme();
  const { fetchResignationDetailById, resignationData, updateResignationById } =
    useResignation();
  const { fetachNameAndDepartment, nameDeptManager } = useEmpExpense();
  const { id } = useParams();
  // const [assetForm, setAssetForm] = useState({
  //   assetLaptop: false,
  //   assetPhone: false,
  //   assetCard: false,
  //   handoverCompleted: "no",
  //   assetRemarks: ""
  // });
  const empId = sessionStorage.getItem("empId");
  const employeeKits = resignationData?.welcomeKits || [];
  const [kits, setKits] = useState([]);

  console.log("nameDeptManager", empId);

  useEffect(() => {
    fetchResignationDetailById(id);
    fetachNameAndDepartment(empId);
  }, [id]);

useEffect(() => {
  if (resignationData?.welcomeKits) {
    const updatedKits = resignationData.welcomeKits.map((kit) => ({
      ...kit,
      isReturned: kit.isReturned ?? false,
    }));
    setKits(updatedKits);
  }
}, [resignationData]);

 const handleKitToggle = (kitId) => {
  setKits((prev) =>
    prev.map((kit) =>
      kit.welcomeKitId === kitId
        ? { ...kit, isReturned: !kit.isReturned }
        : kit
    )
  );
};


  const handleSubmitKits = () => {
    const payload = {
      employeeKits: kits.map((kit) => ({
        welcomeKitId: kit.welcomeKitId,
        isReturned: kit.isReturned || false, // <-- map to API field
      })),
    };

    updateResignationById(id, payload);
  };

  // const handleAssetChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setAssetForm(prev => ({
  //     ...prev,
  //     [name]: type === 'checkbox' ? checked : value
  //   }));
  // };

  // const [resignationData] = useState({

  //   employeeId: "EMP001",
  //   employeeName: "John Doe",
  //   department: "Software Development",
  //   designation: "Senior Developer",
  //   joiningDate: "2020-05-15",
  //   employmentType: "Full Time",
  //   reportingManager: "Jane Smith",

  //   // Offboarding Details
  //   offboardingType: "Resignation",
  //   resignationReason: "Better Opportunity",
  //   otherReason: "",
  //   detailedRemarks: "I have received an offer from a leading tech company that aligns better with my career goals and offers opportunities for growth in cloud computing technologies.",

  //   // Notice Period
  //   noticePeriod: 60, // from backend
  //   resignationDate: "2025-01-15",
  //   noticePeriodStatus: "Approved", // Pending, Approved, Rejected
  //   noticePeriodStartDate: "2025-01-16",
  //   lastWorkingDate: "2025-03-16",

  //   // Approval Status
  //   approvalStatus: "Approved", // Pending, Approved, Rejected

  //   // Asset Information
  //   assets: [
  //     { id: 1, assetName: "Laptop - Dell XPS 15", assetId: "AST001", status: "Pending Return" },
  //     { id: 2, assetName: "Mobile Phone - iPhone 13", assetId: "AST002", status: "Pending Return" },
  //     { id: 3, assetName: "Access Card", assetId: "AST003", status: "Pending Return" }
  //   ],

  //   // Declaration
  //   employeeDeclaration: true,

  //   // Additional Info
  //   submittedDate: "2025-01-15",
  //   approvedBy: "Jane Smith",
  //   approvedDate: "2025-01-16"
  // });

  const InfoField = ({ label, value, fullWidth = false }) => (
    <div className={`mb-4 ${fullWidth ? "md:col-span-2" : ""}`}>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>
      <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
        {value || "-"}
      </div>
    </div>
  );

  const SectionHeader = ({ number, title }) => (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg"
        style={{ backgroundColor: theme.primaryColor }}
      >
        {number}
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      Pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
      Approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: CheckCircle,
      },
      Rejected: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bg}`}
      >
        <Icon className={`w-5 h-5 ${config.text}`} />
        <span className={`font-semibold ${config.text}`}>{status}</span>
      </div>
    );
  };

  return (
    <div>
      <Breadcrumb
        linkText={[
          { text: "Resignation", href: "/emp/resignation" },
          { text: "View Resignation" },
        ]}
      />

      {/* Header Card */}
      <div className="py-4 px-8 flex flex-col md:flex-row md:items-center justify-between rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
        <div className="flex items-center gap-3 flex-1">
          <UserMinus style={{ color: theme.primaryColor, fontSize: 32 }} />
          <span className="text-2xl font-bold">Resignation Details</span>
        </div>
        <div>
          <StatusBadge status={new Date(resignationData.updatedAt).toLocaleDateString()} />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-md p-8">

           {resignationData.rejectionReason && (
                  <div className="mb-5 p-3 bg-red-200 border border-red-100 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="text-red-500 mt-0.5" />
                      <div className="flex justify-between w-full">
                        <p className="text-sm font-medium text-red-700 mb-1">Rejection Reason :</p>
                        <p className="text-sm text-slate-700 whitespace-pre-line">
                          {resignationData.rejectionReason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
        {/* Section 1: Employee Information */}
        <div className="mb-8">
          <SectionHeader number="1" title="Employee Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoField
              label="Employee ID"
              value={nameDeptManager?.data?.employeeId}
            />
            <InfoField
              label="Employee Name"
              value={nameDeptManager?.data?.employeeName}
            />
            <InfoField
              label="Department"
              value={nameDeptManager?.data?.department}
            />
            <InfoField
              label="Designation"
              value={nameDeptManager?.data?.designation}
            />
            <InfoField
              label="Date of Joining"
              value={nameDeptManager?.data?.joiningDate}
            />
            <InfoField
              label="Employment Type"
              value={nameDeptManager?.data?.employeementType}
            />
            <InfoField
              label="Reporting Manager"
              value={nameDeptManager?.data?.manager}
            />
          </div>
        </div>

        <hr className="my-8 border-slate-200" />

        {/* Section 2: Offboarding Details */}
        <div className="mb-8">
          <SectionHeader number="2" title="Offboarding Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoField
              label="Offboarding Type"
              value={resignationData.offboardingtype}
            />
            <InfoField
              label="Resignation Reason"
              value={resignationData.resignationReason}
            />
            {resignationData.otherReason && (
              <InfoField
                label="Other Reason Specified"
                value={resignationData.otherReason}
                fullWidth
              />
            )}
            <InfoField
              label="Detailed Remarks"
              value={resignationData.detailedRemarks}
              fullWidth
            />
          </div>
        </div>

        <hr className="my-8 border-slate-200" />

        {/* Section 3: Notice Period */}
        <div className="mb-8">
          <SectionHeader number="3" title="Notice Period" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoField
              label="Notice Period (in Days)"
              value={`${resignationData.noticePeriodDays} Days`}
            />
            <InfoField
              label="Resignation Date"
              value={new Date(resignationData.resignationDate).toLocaleDateString()}
            />

            {/* Notice Period Status */}
            <div className="mb-4 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Notice Period Status
              </label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                {resignationData.status}
              </div>
            </div>

            {/* Show these fields only if approved */}
            {resignationData.noticePeriodStatus === "Approved" && (
              <>
                <InfoField
                  label="Notice Period Start Date"
                  value={resignationData.noticePeriodStartDate}
                />
                <InfoField
                  label="Last Working Date"
                  value={resignationData.lastWorkingDate}
                />
              </>
            )}
          </div>
        </div>

        {/* Section 4: Loan / Advance Details */}
        <hr className="my-8 border-slate-200" />

        <div className="mb-8">
          <SectionHeader number="4" title="Loan / Advance Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoField
              label="Any Active Loan / Advance?"
              value={resignationData.anyActiveLoan ? "Yes" : "No"}
            />

            {resignationData.anyActiveLoan && (
              <>
                <InfoField
                  label="Outstanding Loan Amount"
                  value={resignationData.outstandingLoanAmount}
                />

                <InfoField
                  label="Final Settlement via Pay?"
                  value={resignationData.finalSettlement ? "Yes" : "No"}
                />
              </>
            )}
          </div>
        </div>

        <hr className="my-8 border-slate-200" />

        {/* Section 5: Asset Information */}
   <div className="mb-8">
  <SectionHeader number="5" title="Handover Assets (Welcome Kits)" />

  {kits.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {kits.map((kit) => (
        <div
          key={kit.welcomeKitId}
          className="border rounded-xl p-4 shadow-sm bg-slate-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-800">
              {kit.name}
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={kit.isReturned}
                onChange={() => handleKitToggle(kit.welcomeKitId)}
                className="w-4 h-4"
                style={{ accentColor: theme.primaryColor }}
              />
              <span
                className={`text-xs font-semibold ${
                  kit.isReturned ? "text-green-600" : "text-red-600"
                }`}
              >
                {kit.isReturned ? "Returned" : "Pending"}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 mb-3">
            {kit.description || "No description available"}
          </p>

          {/* Photos */}
          {kit.photos?.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {kit.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`${kit.name}-${index}`}
                  className="w-24 h-24 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-slate-500">
      No welcome kits assigned to this employee.
    </p>
  )}

  <div className="flex justify-end">
    <button
      className="px-6 py-3 mt-6 rounded-lg font-semibold text-white"
      style={{ backgroundColor: theme.primaryColor }}
      onClick={handleSubmitKits}
      hidden={kits.length === 0}
    >
      Submit
    </button>
  </div>
</div>

        <hr className="my-8 border-slate-200" />

        {/* Section 6: Declaration & Confirmation */}
        <div className="mb-8">
          <SectionHeader number="6" title="Declaration & Confirmation" />
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 mt-1">
                {resignationData.employeeDeclaration ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-800 mb-2">
                  Employee Declaration
                </p>
                <p className="text-sm text-slate-600">
                  I hereby declare that the information provided above is true
                  and accurate to the best of my knowledge. I understand that I
                  am required to serve the notice period as per company policy
                  and complete all handover formalities before my last working
                  day.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-lg font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors duration-200"
          >
            Back to List
          </button>
          <button
            className="px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-200"
            style={{ backgroundColor: theme.primaryColor }}
            onMouseEnter={(e) => {
              e.target.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = "1";
            }}
          >
            Print Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewResignationPage;

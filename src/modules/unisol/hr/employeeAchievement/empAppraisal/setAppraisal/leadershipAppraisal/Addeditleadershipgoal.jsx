import React, { useState, useEffect } from "react";
import Breadcrumb from "../../../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../../../hooks/theme/useTheme";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import Button from "../../../../../../../components/Button";
import useLeadershipAppraisal from "../../../../../../../hooks/unisol/empAchievement/useLeadershipAppraisal";

const AddEditLeadershipGoal = () => {
  const {
    fetchLeadershipAppraisalListDetails,
    updateLeadershipAppraisal,
    setLeadershipAppraisal,
    ledershipAppraisalListDetails,
    loading,
  } = useLeadershipAppraisal();

  const navigate = useNavigate();
  const { theme } = useTheme();
  const { id } = useParams();

  const isEditMode = !!id;

  // ---------------- FORM STATE ----------------
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    criteria: "",
    weightage: "",
  });

  const [errors, setErrors] = useState({});

  // ---------------- FETCH DETAILS IN EDIT MODE ----------------
  useEffect(() => {
    if (isEditMode) {
      fetchLeadershipAppraisalListDetails(id);
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode && ledershipAppraisalListDetails?.data) {
      const data = ledershipAppraisalListDetails.data;

      setFormData({
        name: data.title || "",
        description: data.description || "",
        criteria: data.detailedDescription || "",
        weightage: data.weightage || "",
      });
    }
  }, [ledershipAppraisalListDetails, isEditMode]);

  // ---------------- INPUT CHANGE ----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Title/Name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.criteria.trim()) {
      newErrors.criteria = "Criteria is required";
    }

    if (!formData.weightage) {
      newErrors.weightage = "Weightage is required";
    } else if (
      isNaN(formData.weightage) ||
      formData.weightage < 1 ||
      formData.weightage > 100
    ) {
      newErrors.weightage = "Weightage must be between 1 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- SAVE FUNCTION ----------------
  const handleSave = async () => {
    if (!validateForm()) return;

    const payload = {
      title: formData.name,
      description: formData.description,
      detailedDescription: formData.criteria,
      weightage: Number(formData.weightage),
    };

    let success;

    if (isEditMode) {
      success = await updateLeadershipAppraisal(id, payload);
    } else {
      success = setLeadershipAppraisal(payload);
    }

    if (success) {
      navigate("/hr/employeeAchievement/appraisalList/leadership-Appraisal");
    }
  };

  const handleCancel = () => {
    navigate("/hr/employeeAchievement/appraisalList/leadership-Appraisal");
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen flex flex-col">
      {/* Breadcrumb */}
      <Breadcrumb
        linkText={[
          { text: "Employee Achievement", href: "/hr/employeeAchievement" },
          {
            text: "Employee's Appraisal List",
            href: "/hr/employeeAchievement/appraisalList",
          },
          {
            text: "Set Leadership Appraisal",
            href: "/hr/employeeAchievement/appraisalList/leadership-Appraisal",
          },
          { text: isEditMode ? "Edit Leadership Goal" : "Add Leadership Goal" },
        ]}
      />

      {/* Header */}
      <div className="px-8 py-4 flex items-center gap-4 bg-white rounded-2xl shadow-md">
        <Link
          to="/hr/employeeAchievement/appraisalList/leadership-Appraisal"
          className="group"
        >
          <FaRegArrowAltCircleLeft
            size={24}
            className="text-black group-hover:text-gray-700 transition"
          />
        </Link>

        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? "Edit Leadership Goal" : "Add Leadership Goal"}
        </h1>
      </div>

      {/* Form Card */}
      <div className="flex items-center gap-4 mt-4 bg-white w-full rounded-t-2xl shadow-md p-8">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {/* Title */}
          <div>
            <label className="block font-semibold mb-2">
              Title/Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Integrity and Credo-based Actions"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description}
              </p>
            )}
          </div>

          {/* Criteria */}
          <div>
            <label className="block font-semibold mb-2">
              Criteria <span className="text-red-500">*</span>
            </label>
            <textarea
              name="criteria"
              rows={5}
              value={formData.criteria}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.criteria ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.criteria && (
              <p className="text-red-500 text-sm mt-1">{errors.criteria}</p>
            )}
          </div>

          {/* Weightage */}
          <div className="max-w-sm">
            <label className="block font-semibold mb-2">
              Weightage % <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="weightage"
              value={formData.weightage}
              onChange={handleInputChange}
              min="1"
              max="100"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.weightage ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.weightage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.weightage}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 bg-white rounded-b-2xl shadow-md py-6 px-8">
        <Button
          onClick={handleCancel}
          className="bg-white border border-gray-300 text-gray-700 px-8 py-2 rounded-lg"
          text="Cancel"
        />

        <Button
          onClick={handleSave}
          style={{ backgroundColor: theme.primaryColor }}
          className="text-white px-8 py-2 rounded-lg"
          text={loading ? "Saving..." : "Save"}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default AddEditLeadershipGoal;
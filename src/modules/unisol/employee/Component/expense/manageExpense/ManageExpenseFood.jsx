import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import CollectionsIcon from "@mui/icons-material/Collections";
import { IoIosPaper } from "react-icons/io";
import LimitExceed from "../../../../../../components/Dialogs/expense/LimitExceed";
import useEmpApplyLeave from "../../../../../../hooks/unisol/empLeave/useEmpApplyLeave";
// ../../../../../hooks/unisol/empLeave/useEmpApplyLeave
import useEmpExpense from "../../../../../../hooks/unisol/empExpense/useEmpExpense";
import {
  FaMapMarkerAlt,
  FaUtensils,
  FaUserFriends,
  FaRupeeSign,
  FaFileInvoice,
  FaPaperclip,
  FaExclamationTriangle,
  FaStickyNote,
} from "react-icons/fa";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  positionApplied: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const foodValidationSchema = Yup.object().shape({
  receipts: Yup.array()
    .min(1, "At least one receipt is required")
    .required("Receipt is required"),
});

const ManageExpenseFood = ({
  formik,
  handleDataChange,
  selectedCity,
  hrManagers = [],
  foodLimit
}) => {
  const [viewLimitPopUp, setViewLimitPopUp] = useState(false)
  // const [filePreview, setFilePreview] = useState(null);
  const { mealType, fetchMealType, resetMealType, addFoodExpense } =
    useEmpExpense();
  const [paymentType, setPaymentType] = useState("online");

  const { userForLeaveApply, userForApply } = useEmpApplyLeave();

  useEffect(() => {
    userForLeaveApply();
  }, []);
  console.log("userForApply", userForApply);

  const [foodData, setFoodData] = useState({
    // city: "",
    amount: {
      cash: "",
      online: "",
    },
    place: "",
    attendees: "",
    mealType: "",
    billNumber: "",
    receipts: [],
    remark: "",
    limitExceedExplanation: "",
    applyTo: "",

  });

  const showAttendeesField = [
    "Customer Lunch",
    "Customer Dinner",
    "Customer Breakfast",
  ];

  useEffect(() => {
    handleDataChange(foodData);
  }, [foodData]);

  useEffect(() => {
    if (selectedCity) {
      fetchMealType(selectedCity);
    }
    setFoodData((prev) => ({
      ...prev,
      limitExceedExplanation: "",
    }));
  }, [selectedCity]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFoodData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event) => {
    const files = Array.from(event.currentTarget.files);
    console.log("files", files);
    const newPreviews = files?.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFoodData((prev) => ({
      ...prev,
      receipts: [...prev.receipts, ...newPreviews],
    }));
  };

  const handleDeleteImage = (index) => {
    setTravelData((prev) => ({
      ...prev,
      receipts: prev.receipts.filter((_, i) => i !== index),
    }));
  };

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
  };

  const handleAmountChange = (e) => {
    const { value } = e.target;
    setFoodData((prev) => ({
      ...prev,
      amount: {
        ...prev.amount,
        [paymentType]: value === "" ? "" : parseFloat(value),
      },
    }));
  };
  const renderError = (fieldName) => {
    return formik.touched[fieldName] && formik.errors[fieldName] ? (
      <div className="text-red-500 text-sm mt-1">
        {formik.errors[fieldName]}
      </div>
    ) : null;
  };


  return (
    <div className="pt-6 mt-2 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div className="grid grid-cols-3 items-center gap-4">
          <label className="text-lg font-semibold text-[#3b4a5a] col-span-1 flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-500" /> Place
          </label>
          <input
            type="text"
            className="h-[40px] rounded-xl px-4 placeholder-gray-400 border border-gray-300 col-span-2 bg-gray-50 focus:bg-white focus:border-[#318bb1] focus:ring-2 focus:ring-[#b3d8ee] transition-all duration-200 shadow-sm hover:border-[#709EB1] outline-none"
            name="place"
            placeholder="Enter place"
            value={foodData.place}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <label className="text-lg font-semibold text-[#3b4a5a] col-span-1 flex items-center gap-2">
            <FaUtensils className="text-green-500" /> Meal Type
          </label>
          <select
            className="h-[40px] rounded-xl px-4 placeholder-gray-400 border border-gray-300 col-span-2 bg-gray-50 focus:bg-white focus:border-[#318bb1] focus:ring-2 focus:ring-[#b3d8ee] transition-all duration-200 shadow-sm hover:border-[#709EB1] outline-none"
            name="mealType"
            value={foodData.mealType}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Select Meal
            </option>
            {mealType?.map((meal, index) => (
              <option key={index} value={meal}>
                {meal}
              </option>
            ))}
          </select>
        </div>

        {showAttendeesField?.includes(foodData.mealType) && (
          <div className="grid grid-cols-3 items-center gap-4">
            <label className="text-lg font-semibold text-[#3b4a5a] col-span-1 flex items-center gap-2">
              <FaUserFriends className="text-purple-500" /> Attendees
            </label>
            <input
              type="number"
              placeholder="Enter no. of attendees"
              className="h-[40px] rounded-xl px-4 placeholder-gray-400 border border-gray-300 col-span-2 bg-gray-50 focus:bg-white focus:border-[#318bb1] focus:ring-2 focus:ring-[#b3d8ee] transition-all duration-200 shadow-sm hover:border-[#709EB1] outline-none no-spinner"
              name="attendees"
              value={foodData.attendees}
              onChange={handleInputChange}
            />
          </div>
        )}

        <div className="grid grid-cols-3 items-center gap-4">
          <label className="text-lg font-semibold text-[#3b4a5a] col-span-1 flex items-center gap-2">
            <FaRupeeSign className="text-yellow-600" /> Amount
          </label>
          <div className="col-span-2 flex items-center border border-gray-300 h-[40px] rounded-xl bg-gray-50 focus-within:bg-white focus-within:border-[#318bb1] focus-within:ring-2 focus-within:ring-[#b3d8ee] transition-all duration-200 shadow-sm hover:border-[#709EB1]">
            <select
              className="bg-gray-100 text-gray-700 h-full w-[90px] border-r border-gray-300 px-2 focus:outline-none rounded-l-xl"
              name="paymentType"
              value={paymentType}
              onChange={handlePaymentTypeChange}
            >
              <option value="online">Online</option>
              <option value="cash">Cash</option>
            </select>
            <input
              type="number"
              placeholder="0.00"
              className="flex-1 px-2 bg-transparent focus:outline-none rounded-r-xl no-spinner"
              name={paymentType}
              value={foodData.amount[paymentType]}
              onChange={handleAmountChange}
              onWheel={(e) => e.target.blur()}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <label className="text-lg font-semibold text-[#3b4a5a] col-span-1 flex items-center gap-2">
                      <IoIosPaper className="text-indigo-500" />
                      Apply to HR 
                    </label>
          <select
            name="applyTo"
            value={foodData.applyTo}
            onChange={handleInputChange}
            onBlur={formik.handleBlur}
            className="h-[40px] rounded-xl px-4 placeholder-gray-400 border border-gray-300 col-span-2 bg-gray-50 focus:bg-white focus:border-[#318bb1] focus:ring-2 focus:ring-[#b3d8ee] transition-all duration-200 shadow-sm hover:border-[#709EB1] outline-none"
          >
            <option value="" disabled>
              Select HR Name
            </option>
            {userForApply?.map((hr) => (  // Changed from hrManagers to userForApply based on your console.log
              <option key={hr._id} value={hr._id}>
                {hr.fullName}
              </option>
            ))}
          </select>
          {renderError("applyTo")}
        </div>


        {foodLimit?.islimitExceeded && (
          <>
            <div className="text-red-500 font-semibold flex justify-center mt-4 mb-2 text-lg">
              ***Limit Exceeded***
            </div>
            <div className="grid grid-cols-3 items-start gap-4 mb-4">
              <label className="text-lg font-semibold text-[#3b4a5a] col-span-1 flex items-center gap-2">
                <FaExclamationTriangle className="text-red-500" /> Limit Exceed
                Explanation
              </label>
              <textarea
                placeholder="Provide an explanation for exceeding the limit"
                className="h-[80px] rounded-xl px-4 py-2 border border-red-500 col-span-2 bg-gray-50 focus:bg-white focus:border-red-600 focus:ring-2 focus:ring-red-200 transition-all duration-200 shadow-sm outline-none resize-none"
                name="limitExceedExplanation"
                value={foodData.limitExceedExplanation}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}

        <div className="grid grid-cols-3 items-center gap-4">
          <label className="text-lg font-semibold text-[#3b4a5a] col-span-1 flex items-center gap-2">
            <FaFileInvoice className="text-orange-500" /> Bill Number
          </label>
          <input
            type="text"
            placeholder="Enter bill number"
            className="h-[40px] rounded-xl px-4 placeholder-gray-400 border border-gray-300 col-span-2 bg-gray-50 focus:bg-white focus:border-[#318bb1] focus:ring-2 focus:ring-[#b3d8ee] transition-all duration-200 shadow-sm hover:border-[#709EB1] outline-none"
            name="billNumber"
            value={foodData.billNumber}
            onChange={handleInputChange}
            onWheel={(e) => e.target.blur()}
          />
        </div>


        <div className="grid grid-cols-3 items-center gap-4">
          <label className="text-lg font-semibold text-[#3b4a5a] flex items-center gap-2">
            <FaStickyNote className="text-blue-400" /> Remark
          </label>
          <textarea
            type="text"
            placeholder="Enter working remark"
            className="h-[80px] rounded-xl px-4 placeholder-gray-400 border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#318bb1] focus:ring-2 focus:ring-[#b3d8ee] transition-all duration-200 shadow-sm hover:border-[#709EB1] outline-none col-span-2"
            name="remark"
            value={foodData.remark}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <label className="text-lg font-semibold text-[#3b4a5a] col-span-1 flex items-center gap-2">
            <FaPaperclip className="text-gray-500" /> Attach Receipt
          </label>
          <div className="col-span-2 flex space-x-4 items-center">
            <Button
              component="label"
              sx={{
                backgroundColor: "#A9C8F178",
                color: "#004096",
                border: 1,
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: 1,
                "&:hover": { backgroundColor: "#b3d8ee" },
              }}
              className="w-[110px] h-[40px] px-2 rounded-xl !border-solid transition-all duration-200"
            >
              Upload
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleSelectChange}
                name="receipt"
              />
            </Button>
            <div className="flex flex-wrap gap-2">
              {foodData.receipts?.map((receipt, index) => (
                <div key={index} className="relative group">
                  <img
                    src={receipt.preview}
                    alt="Receipt Preview"
                    className="w-12 h-12 rounded-lg border border-gray-300 object-cover shadow group-hover:opacity-80 transition-all duration-200"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full text-xs shadow hover:bg-red-700 transition-all duration-200"
                    onClick={() => handleDeleteImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {formik.touched.expenseDetails?.receipts && formik.errors.expenseDetails?.receipts && (
              <div className="text-sm text-red-600 font-medium mt-2 animate-pulse">
                {formik.errors.expenseDetails.receipts}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* {viewLimitPopUp && <LimitExceed onClose={() => setViewLimitPopUp(false)} />} */}
    </div>
  );
};

export default ManageExpenseFood;

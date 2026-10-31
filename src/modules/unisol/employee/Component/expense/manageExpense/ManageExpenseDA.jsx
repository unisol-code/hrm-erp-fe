import React, { useState, useEffect } from "react";
import useEmpApplyLeave from "../../../../../../hooks/unisol/empLeave/useEmpApplyLeave";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import {
    FaStickyNote,
    FaRupeeSign,
    FaFileInvoice,
    FaMapMarkerAlt,
    FaPaperclip,
    FaExclamationTriangle,
} from "react-icons/fa";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
});

const ManageExpenseDA = ({ formik, daLimit, handleDataChange }) => {
    const { userForLeaveApply, userForApply } = useEmpApplyLeave();
    const [dailyAllowanceData, setDailyAllowanceData] = useState({
        amount: {
            cash: "",
            online: "",
        },
        description: "",
        billNumber: "",
        receipts: [],
        remark: "",
        applyTo: "",
        // place: "",
        limitExceedExplanation: "",
    });
    console.log(daLimit)
    useEffect(() => {
        handleDataChange(dailyAllowanceData);
    }, [dailyAllowanceData]);

    useEffect(() => {
        userForLeaveApply();
    }, []);
    console.log("userForApply", userForApply);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDailyAllowanceData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (event) => {
        const files = Array.from(event.currentTarget.files);
        const newPreviews = files?.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setDailyAllowanceData((prev) => ({
            ...prev,
            receipts: [...prev.receipts, ...newPreviews],
        }));
    };

    const handleDeleteImage = (index) => {
        setDailyAllowanceData((prev) => ({
            ...prev,
            receipts: prev.receipts.filter((_, i) => i !== index),
        }));
    };

    const handleAmountChange = (e) => {
        const { name, value } = e.target;
        setDailyAllowanceData((prev) => ({
            ...prev,
            amount: {
                ...prev.amount,
                [name]: value === "" ? "" : parseFloat(value),
            },
        }));
    };
    const renderError = (fieldName) => {
        return formik.touched[fieldName] && formik.errors[fieldName] ? (
            <div className="flex items-center gap-1 mt-2 text-red-500 text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {formik.errors[fieldName]}
            </div>
        ) : null;
    };

    return (
        <div className="pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Amount */}
                <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-lg font-semibold text-[#3b4a5a] flex items-center gap-2">
                        <FaRupeeSign className="text-yellow-600" /> Amount
                    </label>
                    <div className="col-span-2 flex flex-col gap-3">
                        <div className="relative flex items-center border-2 border-gray-300 rounded-xl bg-white focus-within:border-[#318bb1] focus-within:ring-4 focus-within:ring-[#b3d8ee] focus-within:ring-opacity-30 transition-all duration-200 shadow-sm hover:border-[#709EB1]">
                            <span className="bg-gradient-to-b from-gray-100 to-gray-200 text-gray-700 h-full px-4 border-r-2 border-gray-300 rounded-l-xl flex items-center text-sm font-semibold">
                                Cash
                            </span>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="flex-1 px-4 py-3 bg-transparent focus:outline-none rounded-r-xl no-spinner text-gray-800"
                                name="cash"
                                value={dailyAllowanceData.amount.cash}
                                onChange={handleAmountChange}
                                onWheel={(e) => e.target.blur()}
                            />
                        </div>
                        <div className="relative flex items-center border-2 border-gray-300 rounded-xl bg-white focus-within:border-[#318bb1] focus-within:ring-4 focus-within:ring-[#b3d8ee] focus-within:ring-opacity-30 transition-all duration-200 shadow-sm hover:border-[#709EB1]">
                            <span className="bg-gradient-to-b from-gray-100 to-gray-200 text-gray-700 h-full px-4 border-r-2 border-gray-300 rounded-l-xl flex items-center text-sm font-semibold">
                                Online
                            </span>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="flex-1 px-4 py-3 bg-transparent focus:outline-none rounded-r-xl no-spinner text-gray-800"
                                name="online"
                                value={dailyAllowanceData.amount.online}
                                onChange={handleAmountChange}
                                onWheel={(e) => e.target.blur()}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-lg font-semibold text-[#3b4a5a] flex items-center gap-2">
                        <FaStickyNote className="text-blue-400" /> Remark
                    </label>
                    <div className="col-span-2 relative">
                        <textarea
                            placeholder="Enter remark"
                            rows="3"
                            name="remark"
                            value={dailyAllowanceData.remark}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:border-[#318bb1] focus:ring-4 focus:ring-[#b3d8ee] focus:ring-opacity-30 transition-all duration-200 shadow-sm hover:border-[#709EB1] outline-none resize-none"
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                            {dailyAllowanceData.remark?.length || 0}/200
                        </div>
                    </div>
                </div>
                {/* {daLimit?.islimitExceeded && ( */}
                    <>
                        {/* Description */}
                        {/* <div className="grid grid-cols-3 items-start gap-4">
                            <label className="text-lg font-semibold text-[#3b4a5a] flex items-center gap-2 pt-2">
                                <FaStickyNote className="text-blue-400" /> Description Of Expense
                            </label>
                            <div className="col-span-2 relative">
                                <textarea
                                    placeholder="Enter description"
                                    rows="3"
                                    name="description"
                                    value={dailyAllowanceData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:border-[#318bb1] focus:ring-4 focus:ring-[#b3d8ee] focus:ring-opacity-30 transition-all duration-200 shadow-sm hover:border-[#709EB1] outline-none resize-none"
                                />
                                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                    {dailyAllowanceData.description?.length || 0}/200
                                </div>
                            </div>
                        </div> */}

                        {/* Bill number */}
                        {/* <div className="grid grid-cols-3 items-center gap-4">
                            <label className="text-lg font-semibold text-[#3b4a5a] flex items-center gap-2">
                                <FaFileInvoice className="text-orange-500" /> Bill Number
                            </label>
                            <div className="col-span-2 relative">
                                <input
                                    type="text"
                                    placeholder="Enter bill number"
                                    name="billNumber"
                                    value={dailyAllowanceData.billNumber}
                                    onChange={handleInputChange}
                                    onWheel={(e) => e.target.blur()}
                                    className="w-full h-[48px] px-4 rounded-xl border-2 border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:border-[#318bb1] focus:ring-4 focus:ring-[#b3d8ee] focus:ring-opacity-30 transition-all duration-200 shadow-sm hover:border-[#709EB1] outline-none"
                                />
                            </div>
                        </div> */}

                        {/* Attach receipts */}
                        {/* {/* Attach receipts */}
                        {/* {daLimit?.islimitExceeded && (
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-lg font-semibold text-[#3b4a5a] flex items-center gap-2">
                                    <FaPaperclip className="text-gray-500" /> Attach Receipt
                                </label>
                                <div className="col-span-2">
                                    <div className="flex space-x-4 items-center">
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
                                            {dailyAllowanceData.receipts.map((receipt, index) => (
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
                                    </div>
                                    {formik.touched.expenseDetails?.receipts && formik.errors.expenseDetails?.receipts && (
                                        <div className="text-sm text-red-600 font-medium mt-2 animate-pulse">
                                            {formik.errors.expenseDetails.receipts}
                                        </div>
                                    )}

                                </div>
                                <div className="grid grid-cols-1 items-center gap-4">
                                    <label className="text-lg font-semibold text-[#3b4a5a] col-span-1 flex items-center gap-2">
                                        Apply HR <span className="text-red-500">*</span>
                                    </label>
                                    <div className="col-span-3">
                                        <select
                                            name="applyTo"
                                            value={dailyAllowanceData.applyTo}
                                            onChange={handleInputChange}
                                            onBlur={formik.handleBlur}
                                            className="relative h-[48px] w-full px-4 rounded-xl border-2 border-gray-300 bg-white text-gray-800 focus:border-[#318bb1] focus:ring-4 focus:ring-[#b3d8ee] focus:ring-opacity-30 transition-all duration-200 shadow-sm hover:border-[#709EB1] outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled className="text-gray-400">
                                                Select HR Name
                                            </option>
                                            {userForApply?.map((hr) => (
                                                <option key={hr._id} value={hr._id} className="text-gray-800">
                                                    {hr.fullName}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-8 pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    {renderError("applyTo")}
                                </div>

                            </div>

                        )} */}


                        {/* Limit exceeded */}
                        {/* <div className="relative overflow-hidden bg-gradient-to-r from-red-50 via-orange-50 to-red-50 border-2 border-red-300 rounded-xl shadow-lg">
                            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-red-500 to-orange-500"></div>
                            <div className="flex items-center gap-2 p-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                    <FaExclamationTriangle className="text-red-600 text-xl" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-red-800 font-bold text-lg">
                                        Limit Exceeded - Receipt Required
                                    </h3>
                                    <p className="text-red-700 text-sm mt-0.5">
                                        You have exceeded the daily allowance limit. Please attach at least one receipt to proceed.
                                    </p>
                                </div>
                            </div>
                        </div> */}

                        {/* Limit exceed explanation */}
                        {/* <div className="grid grid-cols-3 items-start gap-4 mb-4">
                            <label className="text-lg font-semibold text-[#3b4a5a] flex items-center gap-2 pt-2">
                                <FaExclamationTriangle className="text-red-500" /> Limit Exceed
                                Explanation
                            </label>
                            <div className="col-span-2 relative">
                                <textarea
                                    placeholder="Provide an explanation for exceeding the limit..."
                                    rows="4"
                                    name="limitExceedExplanation"
                                    value={dailyAllowanceData.limitExceedExplanation}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-red-300 bg-white text-gray-800 placeholder-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-200 focus:ring-opacity-30 transition-all duration-200 shadow-sm hover:border-red-400 outline-none resize-none"
                                />
                                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                    {dailyAllowanceData.limitExceedExplanation?.length || 0}/200
                                </div>
                            </div>
                        </div> */}

                        {/* Place */}
                        {/* <div className="grid grid-cols-3 items-center gap-4">
                            <label className="text-lg font-semibold text-[#3b4a5a] flex items-center gap-2">
                                <FaMapMarkerAlt className="text-blue-500" /> Place
                            </label>
                            <input
                                type="text"
                                placeholder="Enter place"
                                className="h-[40px] rounded-xl px-4 placeholder-gray-400 border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#318bb1] focus:ring-2 focus:ring-[#b3d8ee] transition-all duration-200 shadow-sm hover:border-[#709EB1] outline-none col-span-2"
                                name="place"
                                value={dailyAllowanceData.place}
                                onChange={handleInputChange}
                            />
                        </div> */}
                    </>
                {/* )} */}

                
{daLimit?.islimitExceeded && (
    <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6 items-start">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">

            {/* Description */}
            <div className="grid grid-cols-[190px_minmax(0,1fr)] items-start gap-4">
                <label className="text-lg font-semibold text-[#3b4a5a] pt-2">
                    Description Of Expense
                </label>
                <div className="relative">
                    <textarea
                        placeholder="Enter description"
                        rows={3}
                        name="description"
                        value={dailyAllowanceData.description}
                        onChange={handleInputChange}
                        maxLength={200}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300
                        bg-white text-gray-800 placeholder-gray-400
                        focus:border-[#318bb1] focus:ring-4 focus:ring-[#b3d8ee]
                        outline-none resize-none shadow-sm"
                    />
                    <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                        {dailyAllowanceData.description?.length || 0}/200
                    </span>
                </div>
            </div>

            {/* Bill Number */}
            <div className="grid grid-cols-[190px_minmax(0,1fr)] items-center gap-4">
                <label className="text-lg font-semibold text-[#3b4a5a]">
                    Bill Number
                </label>
                <input
                    type="text"
                    placeholder="Enter bill number"
                    name="billNumber"
                    value={dailyAllowanceData.billNumber}
                    onChange={handleInputChange}
                    className="w-full h-[48px] px-4 rounded-xl border-2 border-gray-300
                    bg-white text-gray-800 focus:border-[#318bb1]
                    focus:ring-4 focus:ring-[#b3d8ee] outline-none shadow-sm"
                />
            </div>

            {/* Attach Receipt */}
            <div className="grid grid-cols-[190px_minmax(0,1fr)] items-start gap-4">
                <label className="text-lg font-semibold text-[#3b4a5a] flex items-center gap-2 pt-2">
                    <FaPaperclip className="text-gray-500" />
                    Attach Receipt
                </label>

                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        component="label"
                        sx={{
                            backgroundColor: "#A9C8F178",
                            color: "#004096",
                            border: 1,
                            borderRadius: 2,
                            fontWeight: 600,
                            boxShadow: 1,
                            "&:hover": {
                                backgroundColor: "#b3d8ee"
                            }
                        }}
                        className="!w-[110px] !h-[48px] !px-2"
                    >
                        Upload
                        <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleSelectChange}
                            name="receipt"
                        />
                    </Button>

                    {dailyAllowanceData.receipts.map((receipt, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={receipt.preview}
                                alt="Receipt Preview"
                                className="w-12 h-12 rounded-lg border border-gray-300 object-cover shadow"
                            />
                            <button
                                type="button"
                                className="absolute -top-2 -right-2 bg-red-500 text-white
                                w-5 h-5 rounded-full text-xs shadow hover:bg-red-700"
                                onClick={() => handleDeleteImage(index)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                {formik.touched.expenseDetails?.receipts &&
                    formik.errors.expenseDetails?.receipts && (
                        <p className="col-start-2 text-sm text-red-600">
                            {formik.errors.expenseDetails.receipts}
                        </p>
                    )}
            </div>

            {/* Apply HR */}
            <div className="grid grid-cols-[190px_minmax(0,1fr)] items-center gap-4">
                <label className="text-lg font-semibold text-[#3b4a5a]">
                    Apply HR <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                    <select
                        name="applyTo"
                        value={dailyAllowanceData.applyTo}
                        onChange={handleInputChange}
                        onBlur={formik.handleBlur}
                        className="w-full h-[48px] px-4 pr-10 rounded-xl border-2 border-gray-300
                        bg-white text-gray-800 focus:border-[#318bb1]
                        focus:ring-4 focus:ring-[#b3d8ee] outline-none appearance-none"
                    >
                        <option value="" disabled>
                            Select HR Name
                        </option>

                        {userForApply?.map((hr) => (
                            <option key={hr._id} value={hr._id}>
                                {hr.fullName}
                            </option>
                        ))}
                    </select>

                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>

                    {renderError("applyTo")}
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">

            {/* Limit Exceeded Alert */}
            <div className="relative overflow-hidden bg-gradient-to-r
                from-red-50 via-orange-50 to-red-50 border-2 border-red-300
                rounded-xl shadow-md">

                <div className="absolute top-0 left-0 w-2 h-full
                    bg-gradient-to-b from-red-500 to-orange-500" />

                <div className="flex items-center gap-3 p-5">
                    <div className="flex-shrink-0 w-11 h-11 rounded-full
                        bg-red-100 flex items-center justify-center">
                        <FaExclamationTriangle className="text-red-600 text-xl" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-red-800 font-bold text-lg">
                            Limit Exceeded - Receipt Required
                        </h3>
                        <p className="text-red-700 text-sm mt-1 leading-5">
                            You have exceeded the daily allowance limit.
                            Please attach at least one receipt to proceed.
                        </p>
                    </div>
                </div>
            </div>

            {/* Limit Exceed Explanation */}
            <div className="grid grid-cols-[190px_minmax(0,1fr)] items-start gap-4">
                <label className="text-lg font-semibold text-[#3b4a5a]
                    flex items-start gap-2 pt-2">
                    <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />
                    Limit Exceed Explanation
                </label>

                <div className="relative">
                    <textarea
                        placeholder="Provide an explanation for exceeding the limit..."
                        rows={4}
                        maxLength={200}
                        name="limitExceedExplanation"
                        value={dailyAllowanceData.limitExceedExplanation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border-2
                        border-red-300 bg-white text-gray-800
                        placeholder-gray-400 focus:border-red-500
                        focus:ring-4 focus:ring-red-200 outline-none
                        resize-none shadow-sm"
                    />

                    <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                        {dailyAllowanceData.limitExceedExplanation?.length || 0}/200
                    </span>
                </div>
            </div>
        </div>
    </div>
)}

            </div>
        </div>
    );
};

export default ManageExpenseDA;
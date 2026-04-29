import React, { useState } from "react";
import { useTheme } from "../hooks/theme/useTheme";

const RemarkDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  title = "Add Remark",
  cancelText = "Cancel",
  submitText = "Submit",
}) => {
  const { theme } = useTheme();
  const [remark, setRemark] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setRemark("");
    if (onClose) onClose();
  };

  const handleSubmit = () => {
    if (isLoading) return;
    onSubmit(remark);
    setRemark("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent backdrop */}
      <div
        className="absolute inset-0 bg-opacity-30 backdrop-blur-xs"
        onClick={handleClose}
      />

      {/* Dialog Box */}
      <div className="relative z-50 bg-white min-w-[70%] md:min-w-[30vw] min-h-[22vh] rounded-md shadow-lg p-6 border border-gray-200 flex flex-col gap-6">
        <h1 className="font-[600] text-lg mt-2 text-center">{title}</h1>

        {/* Text Area */}
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Enter your remark..."
          className="border border-gray-300 rounded-md p-3 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
        />

        {/* Buttons */}
        <div className="flex justify-around gap-6 my-2 items-center mx-6">
          <button
            style={{
              color: theme.primaryColor,
              borderColor: theme.primaryColor,
            }}
            className="cursor-pointer bg-white border-2 px-8 py-2 rounded-md font-[500] text-sm hover:bg-gray-50 transition-colors"
            onClick={handleClose}
          >
            {cancelText}
          </button>
          <button
            style={{ backgroundColor: theme.primaryColor }}
            disabled={isLoading}
            className={
              "cursor-pointer text-white px-10 py-2 rounded-md font-[500] text-sm hover:bg-opacity-90 transition-colors " +
              (isLoading ? " opacity-60 cursor-not-allowed" : "")
            }
            onClick={handleSubmit}
          >
            {isLoading ? "Submitting..." : submitText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemarkDialog;

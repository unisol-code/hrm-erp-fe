import React from "react";
import { useTheme } from "../hooks/theme/useTheme";
const ConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    confirmText,
    cancelText = "Cancel",
  }) => {
    if (!isOpen) return null;
   const { theme } = useTheme();
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Semi-transparent background (still lets CustomerList show through) */}
        <div
          className="absolute inset-0 bg-opacity-30 backdrop-blur-xs"
          onClick={onClose}
        />
        {/* Dialog box */}
        <div className="relative z-50 bg-white min-w-[70%] md:min-w-[25vw] min-h-[18vh] rounded-md shadow-lg p-6 border border-gray-200 flex flex-col gap-8">
          <h1 className="font-[600] text-lg mt-4 text-center">{title}</h1>
          <div className="flex justify-around gap-6 my-2 items-center mx-6">
            <button
              style={{
                color: theme.primaryColor,
                borderColor: theme.primaryColor
              }}
              className="cursor-pointer bg-white border-2 px-8 py-2 rounded-md font-[500] text-sm hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              style={{ backgroundColor: theme.primaryColor }}
              className="cursor-pointer text-white px-11 py-2 rounded-md font-[500] text-sm hover:bg-opacity-90 transition-colors"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmationDialog;  
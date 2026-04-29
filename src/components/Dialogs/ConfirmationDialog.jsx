import React from "react";
import Button from "../Button";
const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText,
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

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
          <Button variant={3} onClick={onClose} text={cancelText} />
          <Button variant={1} onClick={onConfirm} text={confirmText} />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;  
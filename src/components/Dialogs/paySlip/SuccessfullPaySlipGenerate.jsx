/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import bacground from "../../../assets/images/background-abstract.png";
import paySlipSuccessfully from "../../../assets/images/payment-succcessfully.png";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const SuccessfullPaySlipGenerate = ({
  onClose,
  employeeDetails,
  period,
  payslipRef,
}) => {
  const [viewPaySlipDetails, setViewPaySlipDetails] = useState(false);

  const handelViewPaySlip = () => {
    setViewPaySlipDetails(true);
  };
  const handleDownloadPaySlip = async () => {
    console.log("Download button clicked!");

    if (!payslipRef || !payslipRef.current) {
      console.error("Error: payslipRef is null!");
      return;
    }
    const inputs = payslipRef.current.querySelectorAll("input");
    const inputValues = [];

    inputs.forEach((input, index) => {
      inputValues[index] = input.value;
      const span = document.createElement("span");
      span.textContent = input.value;
      span.style.padding = input.style.padding;
      span.style.border = input.style.border;
      span.style.display = "inline-block";
      span.style.width = input.style.width;
      input.parentNode.replaceChild(span, input);
    });

    try {
      console.log("Generating PDF...");
      const payslipElement = payslipRef.current;

      // Hide the download button before capturing
      const downloadButton = payslipElement.querySelector("#downloadBtn");
      if (downloadButton) downloadButton.style.display = "none";

      // Ensure full height
      payslipElement.style.height = "auto";
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(payslipElement, {
        scale: 2,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: payslipElement.scrollHeight,
      });

      // Restore original height and show the button
      payslipElement.style.height = "";
      if (downloadButton) downloadButton.style.display = "block";

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let y = 0;
      const pageHeight = 297;

      while (y < imgHeight) {
        pdf.addImage(imgData, "PNG", 0, y * -1, imgWidth, imgHeight);
        y += pageHeight;
        if (y < imgHeight) pdf.addPage();
      }

      pdf.save(`Payslip_${employeeDetails?.employee?.fullName}.pdf`);
      console.log("Payslip downloaded successfully!");
    } catch (error) {
      console.error("Error generating payslip PDF:", error);
    }
  };

  return (
    <div className="fixed inset-0  bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="h-screen w-screen flex justify-center items-center">
        <div
          className="w-[600px]    h-[390px] bg-contain max-h-screen overflow-auto scrollbar-hide  rounded-xl shadow-lg"
          style={{ backgroundImage: `url(${bacground})` }}
        >
          <div className="mt-4 flex items-center  justify-between px-10">
            <h1 className="text-xl font-semibold text-center w-full">
              Payslip Generation Confirmation
            </h1>

            {/* Close Button */}
            <div className="flex items-end px-6 space-x-4 cursor-pointer">
              <button onClick={onClose}>
                <IoMdClose size={28} />
              </button>
            </div>
          </div>
          <div className=" flex justify-center items-center">
            <img src={paySlipSuccessfully} className="  mt-5 h-[40px] " />
          </div>
          <div className="mx-[15%] text-center">
            <h3 className="mt-7">
              The payslip for {employeeDetails?.employee?.fullName} has been
              generated successfully.
            </h3>
            <h3 className="ml-10 mr-8 mt-6">
              You can now view or download the payslip using the button below.
            </h3>
          </div>
          <div className="flex items-center justify-between mx-[15%] mt-8">
            <button
              className="px-3 rounded-lg text-white py-2 bg-[#709EB1]"
              onClick={handelViewPaySlip}
            >
              View paySlip
            </button>
            <button
              className="px-3 rounded-lg text-white py-2 bg-[#709EB1]"
              onClick={handleDownloadPaySlip}
            >
              {" "}
              Downalod paySlip
            </button>
            <button
              className="px-3 rounded-lg text-white py-2 bg-[#709EB1]"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      {viewPaySlipDetails && (
        <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
          <PaySlip
            ref={payslipRef}
            onClose={onClose}
            employeeByQuery={employeeDetails}
            period={period}
          />
        </div>
      )}
    </div>
  );
};

export default SuccessfullPaySlipGenerate;

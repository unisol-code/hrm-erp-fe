import React, { useState, useEffect, useRef } from 'react';
import { MdOutlineFileDownload } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import SuccessfullPaySlipGenerate from './SuccessfullPaySlipGenerate';

const NewPaySlip = ({ onClose, close }) => {
    const dropdownRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [paySlipGenerate, setPaySlipGenerate] = useState(false);
    const currentDate = new Date();
    const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);  // Close the dropdown when clicking outside
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);  // Cleanup the event listener
        };
    }, [isDropdownOpen]);

    const handlePayslipGenerate=()=>{
        setPaySlipGenerate(true);

    }

    return (
        <div className="max-w-4xl mx-auto p-4 border border-gray-300">
            {/* Header */}
            <div className="flex justify-between mb-4">
                <div className="text-lg font-bold">[Your company name here]</div>
                <div>[COMPANY LOGO]</div>
            </div>
            <div className="mb-4">[COMPANY ADDRESS]</div>
            <div className="text-center mb-4">Payslip for the month of April, 2024</div>

            {/* Employee Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                    <div className="grid grid-cols-2">
                        <div className="font-semibold">Employee Name:</div>
                        <div></div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="font-semibold">Designation:</div>
                        <div></div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="font-semibold">Employee ID:</div>
                        <div></div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="font-semibold">Date of Joining:</div>
                        <div></div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="font-semibold">Department:</div>
                        <div></div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="font-semibold">Location:</div>
                        <div></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="grid grid-cols-2">
                        <div className="font-semibold">PAN:</div>
                        <div></div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="font-semibold">Bank Name:</div>
                        <div></div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="font-semibold">Bank A/C No:</div>
                        <div></div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="font-semibold">PF A/C Number:</div>
                        <div></div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="font-semibold">UAN Number:</div>
                        <div></div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="font-semibold">Days Worked:</div>
                        <div></div>
                    </div>
                </div>
            </div>

            {/* Earnings and Deductions Table */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-300">
                    <div className="bg-gray-100 p-2 font-bold">EARNINGS</div>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2 text-left">Particulars</th>
                                <th className="p-2 text-right">Master</th>
                                <th className="p-2 text-right">Earnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-2">Basic</td>
                                <td className="p-2 text-right">₹0.00</td>
                                <td className="p-2 text-right">₹0.00</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-2">House Rent Allowance</td>
                                <td className="p-2 text-right">₹0.00</td>
                                <td className="p-2 text-right">₹0.00</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-2">Special Allowance</td>
                                <td className="p-2 text-right">₹0.00</td>
                                <td className="p-2 text-right">₹0.00</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-2">Statutory Bonus</td>
                                <td className="p-2 text-right">₹0.00</td>
                                <td className="p-2 text-right">₹0.00</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-2">LTA Allowance</td>
                                <td className="p-2 text-right">₹0.00</td>
                                <td className="p-2 text-right">₹0.00</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-50">
                                <td className="p-2 font-bold">Gross Earnings</td>
                                <td className="p-2 text-right font-bold">₹0.00</td>
                                <td className="p-2 text-right font-bold">₹0.00</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="border border-gray-300">
                    <div className="bg-gray-100 p-2 font-bold">DEDUCTIONS</div>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2 text-left">Particulars</th>
                                <th className="p-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-2">Income Tax Deduction</td>
                                <td className="p-2 text-right">₹0.00</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-2">Professional Tax</td>
                                <td className="p-2 text-right">₹0.00</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-2">PF</td>
                                <td className="p-2 text-right">₹0.00</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-2">Other Deduction 1</td>
                                <td className="p-2 text-right">₹0.00</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-2">Other Deduction 2</td>
                                <td className="p-2 text-right">₹0.00</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-50">
                                <td className="p-2 font-bold">Total Deductions</td>
                                <td className="p-2 text-right font-bold">₹0.00</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Net Pay Section */}
            <div className="border border-gray-300 mb-6">
                <div className="bg-gray-100 p-2 font-bold">NET PAY</div>
                <table className="w-full">
                    <tbody>
                        <tr className="border-b">
                            <td className="p-2">Gross Earnings</td>
                            <td className="p-2 text-right">₹0.00</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-2">Total Deductions</td>
                            <td className="p-2 text-right">₹0.00</td>
                        </tr>
                        <tr className="bg-gray-50 font-bold">
                            <td className="p-2">Total Net Payable</td>
                            <td className="p-2 text-right">₹0.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="text-center text-sm">
                <div>Total Net Payable in Words: Zero Rupees Only</div>
                <div className="mt-2">**This is a computer generated payslip and does not require signature**</div>
            </div>
        </div>
    )
}

export default NewPaySlip
import React from 'react';
import { FaRupeeSign, FaCalculator, FaClipboardCheck } from 'react-icons/fa';

const FullAndFinalForm = ({ theme, formData, fullAndFinalData, onInputChange, formatINR }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                <h3 className="text-xl font-bold text-gray-800">5. Full & Final Settlement</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Earnings */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaRupeeSign className="text-green-500" />
                        Earnings
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Salary till Last Working Day</span>
                            <span className="font-medium">{formatINR(fullAndFinalData.earnings.salary)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Leave Encashment</span>
                            <span className="font-medium">{formatINR(fullAndFinalData.earnings.leaveEncashment)}</span>
                        </div>
                        <div className="pt-3 border-t">
                            <div className="flex justify-between font-semibold text-gray-800">
                                <span>Total Earnings</span>
                                <span>{formatINR(fullAndFinalData.earnings.totalEarnings)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deductions */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaCalculator className="text-red-500" />
                        Deductions
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Loan / Advance</span>
                            <span className="font-medium">{formatINR(fullAndFinalData.deductions.loanAdvance)}</span>
                        </div>
                        <div className="pt-3 border-t">
                            <div className="flex justify-between font-semibold text-gray-800">
                                <span>Total Deductions</span>
                                <span>{formatINR(fullAndFinalData.deductions.totalDeductions)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Net Amount */}
            <div className="mt-8 px-4 py-2 rounded-lg border-2" style={{ 
                borderColor: fullAndFinalData.netAmount >= 0 ? '#10b981' : '#ef4444',
                backgroundColor: fullAndFinalData.netAmount >= 0 ? '#d1fae5' : '#fee2e2'
            }}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <FaClipboardCheck className={`w-6 h-6 ${fullAndFinalData.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                        <div>
                            <h5 className="font-bold text-deafult">
                                {fullAndFinalData.netAmount >= 0 ? 'Net Payable Amount' : 'Net Recoverable Amount'}
                            </h5>
                            <p className="text-sm text-gray-600">
                                {fullAndFinalData.netAmount >= 0 
                                    ? 'Amount to be paid to employee' 
                                    : 'Amount to be recovered from employee'}
                            </p>
                        </div>
                    </div>
                    <div className={`text-2xl font-bold ${fullAndFinalData.netAmount >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {formatINR(Math.abs(fullAndFinalData.netAmount))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullAndFinalForm;
import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

const LoanSettlementForm = ({ theme, formData, onInputChange, loanDetails, totalApprovedLoanAmount, formatINR }) => {
    // Check if there are any approved loans
    const hasActiveLoan = loanDetails?.some(loan => loan.status === "approved") || false;
    
    // Calculate total outstanding loan amount
    const outstandingLoanAmount = hasActiveLoan 
        ? (loanDetails
            .filter(loan => loan.status === "approved")
            .reduce((total, loan) => total + (loan.loanAmount || 0), 0))
        : 0;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                <h3 className="text-xl font-bold text-gray-800">4. Loan / Advance Settlement</h3>
            </div>

            {/* Active Loan Status - View Only */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Active Loan Status
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-300">
                    <span className={`font-medium ${hasActiveLoan ? 'text-red-600' : 'text-green-600'}`}>
                        {hasActiveLoan ? 'Active Loan Exists' : 'No Active Loan'}
                    </span>
                </div>
            </div>

            {/* Outstanding Loan Amount - View Only */}
            {hasActiveLoan && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Outstanding Loan Amount
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-300">
                        <span className="font-medium text-gray-900">
                            {formatINR(outstandingLoanAmount || totalApprovedLoanAmount)}
                        </span>
                    </div>
                </div>
            )}

            {/* Loan Details Table - View Only */}
            {loanDetails && loanDetails.length > 0 ? (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loan Details
                    </label>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Loan Amount</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Tenure (Months)</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Deduction Start</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loanDetails.map((loan, index) => (
                                    <tr key={loan._id || index}>
                                        <td className="px-4 py-2">{formatINR(loan.loanAmount)}</td>
                                        <td className="px-4 py-2">{loan.repaymentTenureInMonths}</td>
                                        <td className="px-4 py-2">{loan.deductionStartMonth || 'N/A'}</td>
                                        <td className="px-4 py-2">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                                loan.status === 'approved' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : loan.status === 'rejected'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {loan.status === 'approved' ? 
                                                    <FaCheckCircle className="mr-1" /> : 
                                                    loan.status === 'rejected' ?
                                                    <FaTimesCircle className="mr-1" /> :
                                                    <FaExclamationTriangle className="mr-1" />
                                                }
                                                {loan.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No loan records found for this employee.</p>
                </div>
            )}

            {/* Loan Remark - Editable */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Remark
                </label>
                <textarea
                    value={formData.loanRemark}
                    onChange={(e) => onInputChange('loanRemark', e.target.value)}
                    rows="3"
                    placeholder="Enter remarks regarding loan settlement..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
            </div>
        </div>
    );
};

export default LoanSettlementForm;
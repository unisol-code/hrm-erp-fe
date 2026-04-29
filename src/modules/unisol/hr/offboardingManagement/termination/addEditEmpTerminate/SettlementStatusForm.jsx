import React from 'react';

const SettlementStatusForm = ({ theme, formData, onInputChange }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                <h3 className="text-xl font-bold text-gray-800">6. Final Settlement Status</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Settlement Status <span className="text-red-500">*</span>
                    </label>
                  <input
                        type="text"
                        value={formData.settlementStatus}
                        onChange={(e) => onInputChange('settlementStatus', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Date
                    </label>
                    <input
                        type="date"
                        value={formData.paymentDate}
                        onChange={(e) => onInputChange('paymentDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>

                {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Mode
                    </label>
                    <select
                        value={formData.paymentMode}
                        onChange={(e) => onInputChange('paymentMode', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="">Select Mode</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="cash">Cash</option>
                        <option value="cheque">Cheque</option>
                    </select>
                </div> */}
            </div>
        </div>
    );
};

export default SettlementStatusForm;
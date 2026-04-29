import React from 'react';
import { FaFilePdf, FaExclamationTriangle } from 'react-icons/fa';
import Select from 'react-select';

const TerminationDetailsForm = ({ theme, formData, onInputChange, onFileUpload,
    assignedToOptions, onAssignedToChange, employeeLoading, isEditMode, role
}) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            onFileUpload(file);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                <h3 className="text-xl font-bold text-gray-800">2. Termination Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Offboarding Type
                    </label>
                    <input
                        type="text"
                        value={formData.offboardingType}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apply Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={formData.terminationDate}
                        onChange={(e) => onInputChange('terminationDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Termination Reason <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.terminationReason}
                        onChange={(e) => onInputChange('terminationReason', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                    >
                        <option value="">Select Reason</option>
                        <option value="Performance Issues">Performance Issues</option>
                        <option value="Policy Violation">Policy Violation</option>
                        <option value="Absconding">Absconding</option>
                        <option value="Misconduct">Misconduct</option>
                        <option value="Redundancy">Redundancy</option>
                        <option value="Contract End">Contract End</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Termination Letter Upload (PDF)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="documents"
                        />
                        <label htmlFor="documents" className="cursor-pointer">
                            <FaFilePdf className="w-8 h-8 text-red-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                                {formData.documents
                                    ? formData.documents.name || 'PDF uploaded'
                                    : 'Click to upload termination letter (PDF)'}
                            </p>
                        </label>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Remark
                    </label>
                    <textarea
                        value={formData.terminationRemark}
                        onChange={(e) => onInputChange('terminationRemark', e.target.value)}
                        rows="3"
                        placeholder="Enter remarks regarding termination..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notice Period Applicable? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="noticePeriod"
                                value="yes"
                                checked={formData.noticePeriodApplicable === "yes"}
                                onChange={(e) => onInputChange('noticePeriodApplicable', e.target.value)}
                                className="mr-2"
                            />
                            Yes
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="noticePeriod"
                                value="no"
                                checked={formData.noticePeriodApplicable === "no"}
                                onChange={(e) => onInputChange('noticePeriodApplicable', e.target.value)}
                                className="mr-2"
                            />
                            No
                        </label>
                    </div>
                </div>

                {formData.noticePeriodApplicable === "yes" ? (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notice Period Start Date
                            </label>
                            <input
                                type="date"
                                value={formData.noticeStartDate}
                                onChange={(e) => onInputChange('noticeStartDate', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notice Period End Date
                            </label>
                            <input
                                type="date"
                                value={formData.noticeEndDate}
                                onChange={(e) => onInputChange('noticeEndDate', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </>
                ) : (
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Effective Date
                        </label>
                        <input
                            type="date"
                            value={formData.effectiveDate}
                            onChange={(e) => onInputChange('effectiveDate', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                )}
                {/* Show Assign To field only for superAdmin */}
                {role === "superAdmin" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assign To (HR-Priviledged) <span className="text-red-500">*</span>
                        </label>
                        <Select
                            options={assignedToOptions}
                            value={assignedToOptions?.find(option => option.value === formData.hr_id) || null}
                            onChange={(selectedOption) => onAssignedToChange(selectedOption ? selectedOption.value : '')}
                            isClearable
                            isLoading={employeeLoading}
                            isDisabled={isEditMode}
                            placeholder="Select HR Personnel"
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Only Super Admin can assign termination cases to HR personnel
                        </p>
                    </div>
                )}
                {role === "hr" && formData.hr_id && assignedToOptions?.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assigned To (Read Only)
                        </label>
                        <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                            <span className="text-gray-900">
                                {assignedToOptions.find(option => option.value === formData.hr_id)?.label || 'Not Assigned'}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            This termination case is assigned to you by Super Admin
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TerminationDetailsForm;
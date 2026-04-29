import React from 'react';
import Select from 'react-select';
import { FaUser, FaUserCheck, FaSpinner, FaUserTie, FaCalendarAlt, FaBriefcase, FaIdCard } from 'react-icons/fa';

const EmployeeSelectionForm = ({
    theme,
    departmentOptions,
    designationOptions,
    employeeOptions,
    selectedDepartment,
    selectedDesignation,
    selectedEmployeeId,
    employeeLoading,
    isFetchingEmployeeInfo,
    empInfoForTermination,
    empTerminationLoading,
    onDepartmentChange,
    onDesignationChange,
    onEmployeeChange,
    formatINR,
    isEditMode
}) => {
    const calculateYearsOfService = (joiningDate) => {
        if (!joiningDate) return 'N/A';
        const joinDate = new Date(joiningDate);
        const today = new Date();
        const diffYears = today.getFullYear() - joinDate.getFullYear();
        const diffMonths = today.getMonth() - joinDate.getMonth();
        let years = diffYears;
        let months = diffMonths;
        if (months < 0) {
            years--;
            months += 12;
        }
        return `${years} years ${months} months`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDepartmentSelect = (selectedOption) => {
        onDepartmentChange(selectedOption ? selectedOption.value : null);
    };

    const handleDesignationSelect = (selectedOption) => {
        onDesignationChange(selectedOption ? selectedOption.value : null);
    };

    const handleEmployeeSelect = (selectedOption) => {
        onEmployeeChange(selectedOption ? selectedOption.value : '');
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                <h3 className="text-xl font-bold text-gray-800">1. Employee Selection</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Department */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department <span className="text-red-500">*</span>
                    </label>
                    <Select
                        options={departmentOptions}
                        value={departmentOptions.find(option => option.value === selectedDepartment) || null}
                        onChange={handleDepartmentSelect}
                        placeholder="Select Department"
                        isClearable
                        isLoading={employeeLoading}
                        isDisabled={isEditMode}
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
                </div>

                {/* Designation */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Designation <span className="text-red-500">*</span>
                    </label>
                    <Select
                        options={designationOptions}
                        value={designationOptions.find(option => option.value === selectedDesignation) || null}
                        onChange={handleDesignationSelect}
                        placeholder={selectedDepartment ? "Select Designation" : "Select Department First"}
                        isClearable
                        isDisabled={!selectedDepartment || isEditMode}
                        isLoading={employeeLoading}
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
                </div>

                {/* Employee */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employee <span className="text-red-500">*</span>
                    </label>
                    <Select
                        options={employeeOptions}
                        value={employeeOptions.find(option => option.value === selectedEmployeeId) || null}
                        onChange={handleEmployeeSelect}
                        placeholder={selectedDesignation ? "Select Employee" : "Select Designation First"}
                        isClearable
                        isDisabled={!selectedDesignation || isEditMode}
                        isLoading={employeeLoading}
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
                </div>
            </div>

            {/* Employee Info Display */}
            {selectedEmployeeId && isFetchingEmployeeInfo ? (
                <div className="mt-8 p-8 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                    <FaSpinner className="w-8 h-8 text-gray-400 animate-spin mb-4" />
                    <p className="text-gray-600">Loading employee information...</p>
                </div>
            ) : empInfoForTermination && !empTerminationLoading && selectedEmployeeId ? (
                <>
                    {/* Main Employee Card */}
                    <div className="mt-8 p-6 rounded-lg border" style={{ 
                        borderColor: theme.secondaryColor,
                        backgroundColor: `${theme.backgroundColor}`
                    }}>
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Left Column - Profile Image and Basic Info */}
                            <div className="flex-shrink-0">
                                <div className="text-center">
                                    {/* Profile Image */}
                                    {empInfoForTermination.photo ? (
                                        <img
                                            src={empInfoForTermination.photo}
                                            alt={empInfoForTermination.fullName}
                                            className="w-32 h-32 rounded-full object-cover shadow-lg mx-auto mb-4"
                                            style={{ border: `4px solid ${theme.secondaryColor}` }}
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4"
                                            style={{
                                                background: `linear-gradient(135deg, ${theme.secondaryColor}, ${theme.primaryColor})`,
                                                border: `4px solid ${theme.secondaryColor}`
                                            }}>
                                            <FaUser className="w-16 h-16 text-white" />
                                        </div>
                                    )}
                                    
                                    {/* Employee Name and ID below image */}
                                    <div className="text-center">
                                        <h4 className="text-xl font-bold text-gray-900 mb-1">
                                            {empInfoForTermination.fullName}
                                        </h4>
                                        <div className="flex items-center justify-center gap-2 mb-3">
                                            <FaIdCard className="w-4 h-4" style={{ color: theme.accentColor }} />
                                            <p className="text-md font-medium" style={{ color: theme.accentColor }}>
                                                {empInfoForTermination.employeeId}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Details */}
                            <div className="flex-grow">
                                {/* Quick Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="p-3 rounded-lg" style={{ backgroundColor: theme.secondaryColor + '20' }}>
                                        <p className="text-sm text-gray-600 mb-1">Department</p>
                                        <p className="font-semibold text-gray-900">{empInfoForTermination.department}</p>
                                    </div>
                                    <div className="p-3 rounded-lg" style={{ backgroundColor: theme.secondaryColor + '20' }}>
                                        <p className="text-sm text-gray-600 mb-1">Designation</p>
                                        <p className="font-semibold text-gray-900">{empInfoForTermination.designation}</p>
                                    </div>
                                    <div className="p-3 rounded-lg" style={{ backgroundColor: theme.secondaryColor + '20' }}>
                                        <p className="text-sm text-gray-600 mb-1">Years of Service</p>
                                        <p className="font-semibold text-gray-900">{calculateYearsOfService(empInfoForTermination.joiningDate)}</p>
                                    </div>
                                    <div className="p-3 rounded-lg" style={{ backgroundColor: theme.secondaryColor + '20' }}>
                                        <p className="text-sm text-gray-600 mb-1">Basic Salary</p>
                                        <p className="font-semibold text-gray-900">{formatINR(empInfoForTermination.basicSalary)}</p>
                                    </div>
                                </div>

                                {/* Additional Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                                        <div className="flex-shrink-0">
                                            <FaUserTie className="w-5 h-5" style={{ color: theme.primaryColor }} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Onboarding Manager</p>
                                            <p className="font-medium text-gray-900">
                                                {empInfoForTermination.onboardingManager || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                                        <div className="flex-shrink-0">
                                            <FaBriefcase className="w-5 h-5" style={{ color: theme.primaryColor }} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Employment Type</p>
                                            <p className="font-medium text-gray-900">
                                                {empInfoForTermination.employmentType || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                                        <div className="flex-shrink-0">
                                            <FaCalendarAlt className="w-5 h-5" style={{ color: theme.primaryColor }} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Joining Date</p>
                                            <p className="font-medium text-gray-900">
                                                {formatDate(empInfoForTermination.joiningDate)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default EmployeeSelectionForm;
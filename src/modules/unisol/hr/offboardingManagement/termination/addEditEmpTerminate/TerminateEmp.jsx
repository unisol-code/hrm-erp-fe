import React, { useEffect, useState } from 'react'
import BreadCrumb from '../../../../../../components/BreadCrumb'
import { useTheme } from '../../../../../../hooks/theme/useTheme';
import { useNavigate, useParams } from 'react-router-dom';
import useEmployee from '../../../../../../hooks/unisol/onboarding/useEmployee';
import useCoreHR from '../../../../../../hooks/unisol/coreHr/useCoreHR';
import useEmpTermination from '../../../../../../hooks/unisol/offboardingManagement/useEmpTermination';
import EmployeeSelectionForm from './EmployeeSelectionForm';
import TerminationDetailsForm from './TerminationDetailsForm';
import AssetClearanceForm from './AssetClearanceForm';
import LoanSettlementForm from './LoanSettlementForm';
import FullAndFinalForm from './FullAndFinalForm';
import SettlementStatusForm from './SettlementStatusForm';
import ImageZoomModal from './ImageZoomModal'; // Add this import
import { FaArrowLeft } from 'react-icons/fa';
import useEmpApplyLeave from '../../../../../../hooks/unisol/empLeave/useEmpApplyLeave';
import { useRoles } from '../../../../../../hooks/auth/useRoles';

const TerminateEmp = () => {
    const {
        departmentDrop,
        designationByDept,
        fetchDesignation,
        fetchDepartments,
        loading: employeeLoading,
    } = useEmployee();
    const { getAllEmployeeIdAndNameAccordingToDesignation, allEmployeeIdWithName } = useCoreHR();
    const {
        empInfoForTermination,
        fetchEmpInfoForTermination,
        loading: empTerminationLoading,
        fetchTerminatedEmpById,
        terminatedEmpById, updateTerminatedEmployee, terminateEmployee
    } = useEmpTermination();
    const { userForLeaveApply, userForApply } = useEmpApplyLeave();

    const { id } = useParams();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { isSuperAdmin, isHR } = useRoles();
    const role = isSuperAdmin ? "superAdmin" : "hr";

    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedDesignation, setSelectDesignation] = useState(null);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [designationOptions, setDesignationOptions] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [isFetchingEmployeeInfo, setIsFetchingEmployeeInfo] = useState(false);
    const [zoomImage, setZoomImage] = useState(null); // Add this state

    const getTodayDate = () => {
        return new Date().toISOString().split("T")[0];
    };
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toISOString().split('T')[0];
        } catch (e) {
            return '';
        }
    };
    const [formData, setFormData] = useState({
        offboardingType: 'Termination',
        terminationDate: getTodayDate(),
        terminationReason: '',
        terminationRemark: '',
        documents: null,
        hr_id: '',
        noticePeriodApplicable: false,
        noticeStartDate: '',
        noticeEndDate: '',
        effectiveDate: '',
        loanRemark: '',
        outstandingLoanAmount: '',
        bonusAmount: '0',
        otherDeductionsAmount: '0',
        paymentDate: '',
        paymentMode: '',
        settlementStatus: 'pending'
    });
    const resetTerminationDetails = () => {
        setFormData({
            offboardingType: 'Termination',
            terminationDate: getTodayDate(),
            terminationReason: '',
            terminationRemark: '',
            documents: null,
            hr_id: '',
            noticePeriodApplicable: false,
            noticeStartDate: '',
            noticeEndDate: '',
            effectiveDate: '',
            loanRemark: '',
            outstandingLoanAmount: '',
            bonusAmount: '0',
            otherDeductionsAmount: '0',
            paymentDate: '',
            paymentMode: '',
            settlementStatus: 'pending'
        });
        setFullAndFinalData({
            earnings: { salary: 0, leaveEncashment: 0, bonus: 0, totalEarnings: 0 },
            deductions: { loanAdvance: 0, assetRecovery: 0, noticeShortfall: 0, otherDeductions: 0, totalDeductions: 0 },
            netAmount: 0
        });
    };
    const [fullAndFinalData, setFullAndFinalData] = useState({
        earnings: {
            salary: 0,
            leaveEncashment: 0,
            bonus: 0,
            totalEarnings: 0
        },
        deductions: {
            loanAdvance: 0,
            assetRecovery: 0,
            noticeShortfall: 0,
            otherDeductions: 0,
            totalDeductions: 0
        },
        netAmount: 0
    });

    // Load data for edit mode
    useEffect(() => {
        if (id) {
            fetchTerminatedEmpById({id, role});
        }
    }, [id, role]);

    // If editing and terminatedEmpById exists, populate form
    useEffect(() => {
        if (id && terminatedEmpById) {
            // Support APIs that return nested data under `TerminationDetalis` and `employeeDetails`
            const terminationDetails = terminatedEmpById.TerminationDetalis || terminatedEmpById;
            const employeeDetails = terminatedEmpById.employeeDetails || terminatedEmpById;

            setFormData(prev => ({
                ...prev,
                terminationDate: formatDateForInput(terminationDetails.terminationDate) || '',
                terminationReason: terminationDetails.terminationReason || '',
                terminationRemark: terminationDetails.terminationRemark || '',
                noticePeriodApplicable: terminationDetails.noticePeriodApplicable === true ? "yes" : "no",
                noticeStartDate: formatDateForInput(terminationDetails.noticeStartDate) || '',
                noticeEndDate: formatDateForInput(terminationDetails.noticeEndDate) || '',
                effectiveDate: formatDateForInput(terminationDetails.effectiveDate) || '',
                loanRemark: terminatedEmpById.loanRemarks || terminationDetails.loanRemark || '',
                outstandingLoanAmount: terminationDetails.outstandingLoanAmount || '',
                bonusAmount: terminationDetails.bonusAmount || '0',
                otherDeductionsAmount: terminationDetails.otherDeductionsAmount || '0',
                paymentDate: formatDateForInput(terminationDetails.paymentDate) || '',
                paymentMode: terminationDetails.paymentMode || '',
                settlementStatus: terminationDetails.settlementStatus || terminatedEmpById.settlementStatus || 'pending',
                hr_id: terminationDetails.hr_id || terminatedEmpById.hr_id || ''
            }));

            if (terminatedEmpById.fullAndFinal) {
                setFullAndFinalData(terminatedEmpById.fullAndFinal);
            }

            // Auto-select employee if we have the data (support nested employeeDetails)
            const employeeIdToUse = employeeDetails.employeeId || terminatedEmpById.employeeId;
            if (employeeIdToUse) {
                setSelectedEmployeeId(employeeIdToUse);
                // We need to fetch employee details
                setIsFetchingEmployeeInfo(true);
                 fetchEmpInfoForTermination(employeeIdToUse).finally(() => {
                    setIsFetchingEmployeeInfo(false);
                });
            }
        }
    }, [id, terminatedEmpById]);

    // Fetch initial data
    useEffect(() => {
        fetchDepartments();
        userForLeaveApply();
    }, []);

    // Fetch designations when department changes
    useEffect(() => {
        if (selectedDepartment) {
            fetchDesignation(selectedDepartment);
            setSelectDesignation(null);
            setSelectedEmployeeId("");
            setEmployeeOptions([]);
            // Reset loan and asset data
            setFullAndFinalData({
                earnings: { salary: 0, leaveEncashment: 0, bonus: 0, totalEarnings: 0 },
                deductions: { loanAdvance: 0, assetRecovery: 0, noticeShortfall: 0, otherDeductions: 0, totalDeductions: 0 },
                netAmount: 0
            });
        }
    }, [selectedDepartment]);

    // Update designation options
    useEffect(() => {
        if (designationByDept && designationByDept.length > 0) {
            const options = designationByDept.map(dept => ({
                value: dept,
                label: dept
            }));
            setDesignationOptions(options);
        } else {
            setDesignationOptions([]);
        }
    }, [designationByDept]);

    // Fetch employees when department and designation are selected
    useEffect(() => {
        if (selectedDepartment && selectedDesignation) {
            getAllEmployeeIdAndNameAccordingToDesignation(
                selectedDesignation,
                selectedDepartment
            );
        }
    }, [selectedDepartment, selectedDesignation]);

    // Update employee options
    useEffect(() => {
        if (allEmployeeIdWithName?.employees && allEmployeeIdWithName.employees.length > 0) {
            const options = allEmployeeIdWithName.employees?.map(emp => ({
                value: emp.employeeId,
                label: `${emp.employeeId} - ${emp.fullName}`
            }));
            setEmployeeOptions(options);
        } else {
            setEmployeeOptions([]);
        }
    }, [allEmployeeIdWithName]);

    // Fetch employee info when employee is selected
    useEffect(() => {
        if (selectedEmployeeId && !id) { // Don't fetch if we're in edit mode and already have data
            setIsFetchingEmployeeInfo(true);
            fetchEmpInfoForTermination(selectedEmployeeId).finally(() => {
                setIsFetchingEmployeeInfo(false);
            });
        }
    }, [selectedEmployeeId, id]);

    // Handle form field changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    // Calculate full & final settlement when employee data or relevant fields change
    useEffect(() => {
        if (empInfoForTermination) {
            const basicSalary = parseFloat(empInfoForTermination.basicSalary) || 0;
            const leaveEncashment = basicSalary * 0.5;
            const bonusAmount = parseFloat(formData.bonusAmount) || 0;

            // Calculate loan advance from approved loans
            let loanAdvance = 0;
            if (empInfoForTermination.activeLoanDetails) {
                const approvedLoans = empInfoForTermination.activeLoanDetails.filter(
                    loan => loan.status === "approved"
                );
                loanAdvance = approvedLoans.reduce((total, loan) => total + (loan.loanAmount || 0), 0);
            }

            const otherDeductions = parseFloat(formData.otherDeductionsAmount) || 0;

            const totalEarnings = basicSalary + leaveEncashment + bonusAmount;
            const totalDeductions = loanAdvance + otherDeductions;
            const netAmount = totalEarnings - totalDeductions;

            setFullAndFinalData(prev => ({
                earnings: {
                    salary: basicSalary,
                    leaveEncashment,
                    bonus: bonusAmount,
                    totalEarnings
                },
                deductions: {
                    ...prev.deductions,
                    loanAdvance,
                    otherDeductions,
                    totalDeductions
                },
                netAmount
            }));

            // Update outstanding loan amount in form data
            if (loanAdvance > 0) {
                handleInputChange('outstandingLoanAmount', loanAdvance.toString());
            }
        }
    }, [empInfoForTermination, formData.bonusAmount, formData.otherDeductionsAmount]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataObj = new FormData();

            // Add all fields
            formDataObj.append('employeeId', selectedEmployeeId);
            formDataObj.append('offboardingType', formData.offboardingType);
            formDataObj.append('terminationDate', formData.terminationDate);
            formDataObj.append('terminationReason', formData.terminationReason);
            formDataObj.append('terminationRemark', formData.terminationRemark);
            formDataObj.append('noticePeriodApplicable', formData.noticePeriodApplicable === "yes");
            formDataObj.append('noticeStartDate', formData.noticeStartDate);
            formDataObj.append('noticeEndDate', formData.noticeEndDate);
            formDataObj.append('effectiveDate', formData.effectiveDate);

            if (formData.documents) {
                formDataObj.append('documents', formData.documents);
            }
            if(role === "superAdmin"){
                formDataObj.append('hr_id', formData.hr_id);
            }

            if (id) {
                formDataObj.append('fullAndFinal', JSON.stringify(fullAndFinalData));
                // formDataObj.append('loanRemark', formData.loanRemark);
                // formDataObj.append('outstandingLoanAmount', formData.outstandingLoanAmount);
                // formDataObj.append('bonusAmount', formData.bonusAmount);
                // formDataObj.append('otherDeductionsAmount', formData.otherDeductionsAmount);
                // formDataObj.append('paymentDate', formData.paymentDate);
                // formDataObj.append('paymentMode', formData.paymentMode);
                // formDataObj.append('settlementStatus', formData.settlementStatus);
            }

            console.log('Submitting termination:', formDataObj);

            if (id) {
                // Update existing termination
                await updateTerminatedEmployee(id, formDataObj);
            } else {
                // Create new termination
                await terminateEmployee(formDataObj);
            }

            // navigate('/offboardingManagement/termination');
        } catch (error) {
            console.error('Termination error:', error);
        }
    };

    // Format currency to Indian Rupees
    const formatINR = (amount) => {
        if (amount === undefined || amount === null) return '₹0';
        return `₹${parseFloat(amount).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    console.log('terminatedEmpById', terminatedEmpById);

    return (
        <div className="min-h-screen" style={{ backgroundColor: theme.backgroundColor }}>
            <BreadCrumb
                linkText={[
                    { text: "Offboarding Management" },
                    { text: "Terminated Employee's List", href: "/offboardingManagement/termination" },
                    { text: id ? "Emp's Termination Data" : "Terminate Employee", href: id ? `/offboardingManagement/termination/emp-wise/${terminatedEmpById?.employeeDetails?.employeeId}` : undefined },
                    { text: id ? "Edit Termination" : null },
                ]}
            />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-4"
                    style={{ borderLeft: `4px solid ${theme.primaryColor}` }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {id ? 'Edit Termination' : 'Terminate Employee'}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {id ? 'Update termination details' : 'Complete the termination process step by step'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Section 1: Employee Selection */}
                    <EmployeeSelectionForm
                        theme={theme}
                        departmentOptions={departmentDrop.map(dept => ({ value: dept, label: dept }))}
                        designationOptions={designationOptions}
                        employeeOptions={employeeOptions}
                        selectedDepartment={selectedDepartment}
                        selectedDesignation={selectedDesignation}
                        selectedEmployeeId={selectedEmployeeId}
                        employeeLoading={employeeLoading}
                        isFetchingEmployeeInfo={isFetchingEmployeeInfo}
                        empInfoForTermination={empInfoForTermination}
                        empTerminationLoading={empTerminationLoading}
                        onDepartmentChange={(value) => {
                            setSelectedDepartment(value);
                            setSelectDesignation(null);
                            setSelectedEmployeeId("");
                            if (!value) resetTerminationDetails();
                        }}
                        onDesignationChange={(value) => {
                            setSelectDesignation(value);
                            setSelectedEmployeeId("");
                            if (!value) resetTerminationDetails();
                        }}
                        onEmployeeChange={(value) => {
                            setSelectedEmployeeId(value);
                            if (!value) resetTerminationDetails();
                        }}
                        formatINR={formatINR}
                        isEditMode={!!id}
                    />

                    {/* Section 2: Termination Details */}
                    {empInfoForTermination && !isFetchingEmployeeInfo && selectedEmployeeId && (
                        <TerminationDetailsForm
                            theme={theme}
                            formData={formData}
                            onInputChange={handleInputChange}
                            onFileUpload={(file) => handleInputChange('documents', file)}
                            assignedToOptions={userForApply?.map(user => ({ value: user?._id, label: user?.fullName }))}
                            onAssignedToChange={(value) => handleInputChange('hr_id', value)}
                            employeeLoading={employeeLoading}
                            isEditMode={!!id}
                            role={role}
                        />
                    )}

                    {/* Section 3: Asset Clearance */}
                    {empInfoForTermination && !isFetchingEmployeeInfo && selectedEmployeeId &&
                        empInfoForTermination.welcomeKits && empInfoForTermination.welcomeKits.length > 0 && (
                            <AssetClearanceForm
                                theme={theme}
                                welcomeKits={empInfoForTermination.welcomeKits}
                                onImageZoom={setZoomImage}
                            />
                        )}

                    {/* Section 4: Loan / Advance Settlement */}
                    {empInfoForTermination && !isFetchingEmployeeInfo && selectedEmployeeId && (
                        <LoanSettlementForm
                            theme={theme}
                            formData={formData}
                            onInputChange={handleInputChange}
                            loanDetails={empInfoForTermination.activeLoanDetails || empInfoForTermination.loanDetails}
                            totalApprovedLoanAmount={empInfoForTermination.totalApprovedLoanAmount}
                            formatINR={formatINR}
                        />
                    )}

                    {/* Section 5: Full & Final Settlement */}
                    {empInfoForTermination && !isFetchingEmployeeInfo && selectedEmployeeId && (
                        <FullAndFinalForm
                            theme={theme}
                            formData={formData}
                            fullAndFinalData={fullAndFinalData}
                            onInputChange={handleInputChange}
                            formatINR={formatINR}
                        />
                    )}

                    {/* Section 6: Final Settlement Status */}
                    {empInfoForTermination && !isFetchingEmployeeInfo && selectedEmployeeId && (
                        <SettlementStatusForm
                            theme={theme}
                            formData={formData}
                            onInputChange={handleInputChange}
                        />
                    )}

                    {/* Form Actions */}
                    {empInfoForTermination && !isFetchingEmployeeInfo && selectedEmployeeId && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/offboardingManagement/termination')}
                                    className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    style={{
                                        borderColor: theme.primaryColor,
                                        backgroundColor: `${theme.primaryColor}10`
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={empTerminationLoading}
                                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {empTerminationLoading ? 'Processing...' : (id ? 'Update Termination' : 'Submit Termination')}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>

            {/* Image Zoom Modal */}
            <ImageZoomModal
                zoomImage={zoomImage}
                onClose={() => setZoomImage(null)}
            />
        </div>
    );
};

export default TerminateEmp;
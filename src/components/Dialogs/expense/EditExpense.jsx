import React, { useEffect, useRef, useState } from 'react'
import useEmpExpense from '../../../hooks/unisol/empExpense/useEmpExpense';
import { useTheme } from '../../../hooks/theme/useTheme';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import {
    HiOutlineClipboardList,
    HiOutlineCalendar,
    HiOutlineLocationMarker,
    HiOutlineTag,
    HiOutlineDocumentText,
    HiOutlineCurrencyRupee,
    HiOutlineReceiptRefund,
    HiOutlineGift,
    HiOutlineShoppingBag,
    HiOutlineHome,
    HiOutlineBriefcase,
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
    HiOutlineTrash,
    HiOutlinePlus
} from 'react-icons/hi';
import {
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiUpload,
    FiEye,
    FiInfo,
    FiDollarSign,
    FiTruck,
    FiEdit,
    FiLock
} from 'react-icons/fi';
import LoaderSpinner from '../../LoaderSpinner';
import Button from '../../Button';
import EditInputFields from '../../../modules/unisol/employee/Component/expense/viewStatus/EditInputFields';
import { toast } from 'react-toastify';

const EditExpense = ({ onClose, openDialog, expense = {}, onUpdated}) => {
    const [open, setOpen] = useState(openDialog);
    const {
        loading,
        fetchExpenseDetails,
        expenseDetails,
        updateExpense,
        deleteReceipt,
        uploadReceipt
    } = useEmpExpense();
    const { theme } = useTheme();
    const contentRef = useRef(null);
    const id = expense._id;
    const [errors, setErrors] = useState({});
    const [uploadingReceipts, setUploadingReceipts] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);

    // Initialize form state
    const [formData, setFormData] = useState({
        date: '',
        expenseCategory: '',
        amount: {
            cash: 0,
            online: 0,
            total: 0
        },
        extraFields: {
            city: '',
            place: '',
            mealType: '',
            attendees: '',
            itemName: '',
            receiverName: '',
            receiverNumber: ''
        },
        description: '',
        purpose: '',
        billNumber: '',
        remark: '',
        fromDate: '',
        toDate: '',
        lodgingName: '',
        workingRemark: ''
    });

    // Calculate total amount
    useEffect(() => {
        const cash = parseFloat(formData.amount.cash) || 0;
        const online = parseFloat(formData.amount.online) || 0;
        const total = cash + online;

        setFormData(prev => ({
            ...prev,
            amount: {
                ...prev.amount,
                total: total
            }
        }));
    }, [formData.amount.cash, formData.amount.online]);

    // Fetch expense details
    useEffect(() => {
        if (id) {
            fetchExpenseDetails(id);
        }
    }, [id]);

    console.log("expenseDetails", expenseDetails)

    // Initialize form when data is loaded
    useEffect(() => {
        if (expenseDetails?.data) {
            const data = expenseDetails.data;
            setFormData({
                date: data.date || '',
                expenseCategory: data.expenseCategory || '',
                amount: {
                    cash: data.amount?.cash || 0,
                    online: data.amount?.online || 0,
                    total: data.amount?.total || 0
                },
                extraFields: {
                    city: data.extraFields?.city || '',
                    place: data.extraFields?.place || '',
                    mealType: data.extraFields?.mealType || '',
                    attendees: data.extraFields?.attendees || '',
                    itemName: data.extraFields?.itemName || '',
                    receiverName: data.extraFields?.receiverName || '',
                    receiverNumber: data.extraFields?.receiverNumber || ''
                },
                description: data.description || '',
                purpose: data.purpose || '',
                billNumber: data.billNumber || '',
                remark: data.remark || '',
                fromDate: data.fromDate || '',
                toDate: data.toDate || '',
                lodgingName: data.lodgingName || '',
                workingRemark: data.workingRemark || ''
            });
        }
    }, [expenseDetails]);

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    const handleInputChange = (field, value) => {
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }

        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            if (parent === 'amount') {
                setFormData(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: value
                    }
                }));
            } else if (parent === 'extraFields') {
                setFormData(prev => ({
                    ...prev,
                    extraFields: {
                        ...prev.extraFields,
                        [child]: value
                    }
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (formData.amount.total <= 0) newErrors.amount = 'Amount must be greater than 0';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const prepareUpdatePayload = () => {
        const basePayload = {
            amount: formData.amount,
            billNumber: formData.billNumber,
            remark: formData.remark
        };

        // Add description for relevant categories (if changed)
        if (['Food', 'Stationary', 'Other', 'Daily Allowance', 'Travel'].includes(formData.expenseCategory)) {
            if (formData.description !== expenseDetails?.data?.description) {
                basePayload.description = formData.description;
            }
        }

        // Add purpose for Gift category (if changed)
        if (formData.expenseCategory === 'Gift') {
            if (formData.purpose !== expenseDetails?.data?.purpose) {
                basePayload.purpose = formData.purpose;
            }
        }

        // Add lodging-specific fields (if changed)
        if (formData.expenseCategory === 'Lodging') {
            if (formData.fromDate !== expenseDetails?.data?.fromDate) basePayload.fromDate = formData.fromDate;
            if (formData.toDate !== expenseDetails?.data?.toDate) basePayload.toDate = formData.toDate;
            if (formData.lodgingName !== expenseDetails?.data?.lodgingName) basePayload.lodgingName = formData.lodgingName;
            if (formData.workingRemark !== expenseDetails?.data?.workingRemark) basePayload.workingRemark = formData.workingRemark;
        }

        // Prepare extraFields based on category (only if changed)
        const originalExtraFields = expenseDetails?.data?.extraFields || {};
        const extraFields = {};

        // Check each field for changes
        const fieldMappings = {
            'Food': ['place', 'mealType', 'attendees'],
            'Stationary': ['place', 'itemName'],
            'Gift': ['place', 'receiverName', 'receiverNumber'],
            'Lodging': ['place'],
            'Travel': [],
            'Other': [],
            'Daily Allowance': []
        };

        const fieldsToCheck = fieldMappings[formData.expenseCategory] || [];

        fieldsToCheck.forEach(field => {
            if (formData.extraFields[field] !== originalExtraFields[field]) {
                extraFields[field] = formData.extraFields[field];
            }
        });

        // Always include city (read-only, but still in payload if changed elsewhere)
        if (Object.keys(extraFields).length > 0) {
            extraFields.city = formData.extraFields.city;
            basePayload.extraFields = extraFields;
        }

        return basePayload;
    };

    const handleUpdate = async () => {
        if (!validateForm()) {
            return;
        }
        const updateData = prepareUpdatePayload();
       const success = await updateExpense(id, updateData);
        // handleClose();
        if (success === true) {
            onUpdated?.();   // 🔥 refresh list
            handleClose();
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            const maxSize = 10 * 1024 * 1024; // 10MB
            return validTypes.includes(file.type) && file.size <= maxSize;
        });

        if (validFiles.length !== files.length) {
            toast.error('Some files were rejected. Only JPG, PNG, PDF files up to 10MB are allowed.');
        }

        setSelectedFiles(prev => [...prev, ...validFiles]);
    };

    const handleUploadReceipts = async () => {
        if (selectedFiles.length === 0) {
            toast.warning('Please select files to upload');
            return;
        }

        try {
            setUploadingReceipts(true);
            await uploadReceipt(id, selectedFiles);
            toast.success(`${selectedFiles.length} receipt(s) uploaded successfully`);
            setSelectedFiles([]);
            // Refresh expense details
            fetchExpenseDetails(id);
        } catch (error) {
            console.error("Error uploading receipts:", error);
            toast.error('Failed to upload receipts');
        } finally {
            setUploadingReceipts(false);
        }
    };

    const handleDeleteReceipt = async (receiptUrl, index) => {
        if (window.confirm('Are you sure you want to delete this receipt?')) {
            try {
                await deleteReceipt(id, receiptUrl);
                toast.success('Receipt deleted successfully');
                // Refresh expense details
                fetchExpenseDetails(id);
            } catch (error) {
                console.error("Error deleting receipt:", error);
                toast.error('Failed to delete receipt');
            }
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <FiCheckCircle className="text-green-500 text-xl" />;
            case 'rejected': return <FiXCircle className="text-red-500 text-xl" />;
            default: return <FiClock className="text-yellow-500 text-xl" />;
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Travel': return <FiTruck className="text-blue-500" />;
            case 'Lodging': return <HiOutlineHome className="text-green-500" />;
            case 'Food': return <HiOutlineBriefcase className="text-orange-500" />;
            case 'Gift': return <HiOutlineGift className="text-purple-500" />;
            case 'Stationary': return <HiOutlineShoppingBag className="text-indigo-500" />;
            case 'Other': return <HiOutlineDocumentText className="text-gray-500" />;
            case 'Daily Allowance': return <HiOutlineCurrencyRupee className="text-yellow-500" />;
            default: return <HiOutlineTag className="text-gray-500" />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
            PaperProps={{
                className: "rounded-2xl overflow-hidden shadow-2xl"
            }}
        >
            <DialogTitle
                className="flex items-center justify-between p-6"
                style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor}15, ${theme.secondaryColor}15)`,
                    borderBottom: `1px solid ${theme.primaryColor}20`
                }}
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                        <HiOutlineClipboardList className="text-2xl" />
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800">Edit Expense Details</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                {getCategoryIcon(formData.expenseCategory || expense?.expenseCategory)}
                                <span className="font-medium">{formData.expenseCategory || expense?.expenseCategory || 'Expense'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <CloseIcon
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-all duration-200"
                    onClick={handleClose}
                    style={{ color: theme.primaryColor }}
                />
            </DialogTitle>

            {loading ? (
                <div className="py-16 w-full flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                        <LoaderSpinner size="large" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <HiOutlineClipboardList className="text-blue-500 text-2xl animate-pulse" />
                        </div>
                    </div>
                    <p className="text-gray-600 font-medium">Loading expense details...</p>
                </div>
            ) : (
                <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                    <DialogContent className="p-0" ref={contentRef}>
                        <div className="p-4 space-y-8">
                            {/* Read-only Basic Information */}
                            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Date - Read Only */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date of Expense
                                        </label>
                                        <div className="flex items-center gap-2 p-3 bg-white border border-gray-300 rounded-lg">
                                            <HiOutlineCalendar className="text-gray-400" />
                                            <span className="text-gray-900">
                                                {formatDate(formData.date)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* City - Read Only */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City Type
                                        </label>
                                        <div className="flex items-center gap-2 p-3 bg-white border border-gray-300 rounded-lg">
                                            <HiOutlineLocationMarker className="text-gray-400" />
                                            <span className="text-gray-900">
                                                {formData.extraFields.city}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Expense Category - Read Only */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Expense Category
                                        </label>
                                        <div className="flex items-center gap-2 p-3 bg-white border border-gray-300 rounded-lg">
                                            {getCategoryIcon(formData.expenseCategory)}
                                            <span className="text-gray-900">
                                                {formData.expenseCategory}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Editable Details */}
                            <div className="space-y-6">

                                {/* Category Specific Fields */}
                                {formData.expenseCategory === 'Food' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <EditInputFields
                                            label="Place"
                                            type="text"
                                            value={formData.extraFields.place || ''}
                                            onChange={(e) => handleInputChange('extraFields.place', e.target.value)}
                                            placeholder="Enter place"
                                            icon={HiOutlineLocationMarker}
                                        />
                                        <EditInputFields
                                            label="Attendees"
                                            type="text"
                                            value={formData.extraFields.attendees || ''}
                                            onChange={(e) => handleInputChange('extraFields.attendees', e.target.value)}
                                            placeholder="Enter number of attendees"
                                        />
                                        <EditInputFields
                                            label="Meal Type"
                                            type="text"
                                            value={formData.extraFields.mealType || ''}
                                            onChange={(e) => handleInputChange('extraFields.mealType', e.target.value)}
                                            placeholder="Enter meal type"
                                        />
                                    </div>
                                )}

                                {formData.expenseCategory === 'Stationary' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <EditInputFields
                                            label="Place"
                                            type="text"
                                            value={formData.extraFields.place || ''}
                                            onChange={(e) => handleInputChange('extraFields.place', e.target.value)}
                                            placeholder="Enter place"
                                            icon={HiOutlineLocationMarker}
                                        />
                                        <EditInputFields
                                            label="Item Name"
                                            type="text"
                                            value={formData.extraFields.itemName || ''}
                                            onChange={(e) => handleInputChange('extraFields.itemName', e.target.value)}
                                            placeholder="Enter item name"
                                        />
                                    </div>
                                )}

                                {formData.expenseCategory === 'Gift' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <EditInputFields
                                            label="Place"
                                            type="text"
                                            value={formData.extraFields.place || ''}
                                            onChange={(e) => handleInputChange('extraFields.place', e.target.value)}
                                            placeholder="Enter place"
                                            icon={HiOutlineLocationMarker}
                                        />
                                        <EditInputFields
                                            label="Receiver Name"
                                            type="text"
                                            value={formData.extraFields.receiverName || ''}
                                            onChange={(e) => handleInputChange('extraFields.receiverName', e.target.value)}
                                            placeholder="Enter receiver name"
                                        />
                                        <EditInputFields
                                            label="Receiver Contact"
                                            type="text"
                                            value={formData.extraFields.receiverNumber || ''}
                                            onChange={(e) => handleInputChange('extraFields.receiverNumber', e.target.value)}
                                            placeholder="Enter receiver contact"
                                        />
                                    </div>
                                )}

                                {formData.expenseCategory === 'Lodging' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <EditInputFields
                                            label="Place"
                                            type="text"
                                            value={formData.extraFields.place || ''}
                                            onChange={(e) => handleInputChange('extraFields.place', e.target.value)}
                                            placeholder="Enter place"
                                            icon={HiOutlineLocationMarker}
                                        />
                                        <EditInputFields
                                            label="Lodging Name"
                                            type="text"
                                            value={formData.lodgingName || ''}
                                            onChange={(e) => handleInputChange('lodgingName', e.target.value)}
                                            placeholder="Enter lodging name"
                                            icon={HiOutlineHome}
                                        />
                                        <EditInputFields
                                            label="Check-in Date"
                                            type="date"
                                            value={formData.fromDate || ''}
                                            onChange={(e) => handleInputChange('fromDate', e.target.value)}
                                        />
                                        <EditInputFields
                                            label="Check-out Date"
                                            type="date"
                                            value={formData.toDate || ''}
                                            onChange={(e) => handleInputChange('toDate', e.target.value)}
                                        />
                                        <EditInputFields
                                            label="Working Remark"
                                            type="textarea"
                                            value={formData.workingRemark || ''}
                                            onChange={(e) => handleInputChange('workingRemark', e.target.value)}
                                            placeholder="Enter purpose of stay"
                                            className="md:col-span-2"
                                        />
                                    </div>
                                )}

                                {/* Description Field for relevant categories */}
                                {['Food', 'Stationary', 'Other', 'Daily Allowance', 'Travel'].includes(formData.expenseCategory) && (
                                    <EditInputFields
                                        label="Description"
                                        type="textarea"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Enter detailed description of the expense..."
                                        icon={HiOutlineDocumentText}
                                    />
                                )}

                                {/* Purpose Field for Gift category */}
                                {formData.expenseCategory === 'Gift' && (
                                    <EditInputFields
                                        label="Purpose of Gift"
                                        type="textarea"
                                        value={formData.purpose}
                                        onChange={(e) => handleInputChange('purpose', e.target.value)}
                                        placeholder="Explain the purpose and context of this gift..."
                                        icon={HiOutlineGift}
                                    />
                                )}
                            </div>

                            {/* Financial Details */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Cash Amount - Read Only */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Cash Amount
                                                </label>
                                                <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-300 rounded-lg">
                                                    <span className="text-gray-900 font-medium">
                                                        ₹{formData.amount.cash.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Online Amount - Read Only */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Online Amount
                                                </label>
                                                <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-300 rounded-lg">
                                                    <span className="text-gray-900 font-medium">
                                                        ₹{formData.amount.online.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <EditInputFields
                                            label="Bill/Receipt Number"
                                            type="text"
                                            value={formData.billNumber}
                                            onChange={(e) => handleInputChange('billNumber', e.target.value)}
                                            placeholder="Enter bill or receipt number"
                                            icon={HiOutlineReceiptRefund}
                                        />

                                        <EditInputFields
                                            label="Additional Remarks"
                                            type="textarea"
                                            value={formData.remark}
                                            onChange={(e) => handleInputChange('remark', e.target.value)}
                                            placeholder="Any additional notes or comments..."
                                            icon={HiOutlineDocumentText}
                                        />
                                    </div>
                                    <div className="space-y-6">
                                        {/* Total Amount Display */}
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-white rounded-lg border border-blue-200">
                                                        <HiOutlineCurrencyRupee className="text-blue-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-800">Total Amount</h4>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-3xl font-bold text-blue-600">
                                                        ₹{formData.amount.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </div>
                                                </div>
                                            </div>

                                            {errors.amount && (
                                                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                                                    <div className="flex items-center gap-2">
                                                        <HiOutlineExclamationCircle className="text-red-500" />
                                                        <span className="text-red-700 font-medium">{errors.amount}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Receipts Management Section */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                                    <HiOutlineReceiptRefund className="text-purple-500" />
                                    Receipts Management
                                </h3>

                                {/* Upload New Receipts */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium text-gray-700">Upload New Receipts</h4>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                            multiple
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            <HiOutlinePlus />
                                            Select Files
                                        </button>
                                    </div>

                                    {selectedFiles.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-600">
                                                    {selectedFiles.length} file(s) selected
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={handleUploadReceipts}
                                                    disabled={uploadingReceipts}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                                                >
                                                    {uploadingReceipts ? (
                                                        <>
                                                            <LoaderSpinner size="small" />
                                                            Uploading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiUpload />
                                                            Upload Selected
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {selectedFiles.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                                        <span className="text-xs text-gray-500">
                                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <p className="text-xs text-gray-500">
                                        Supported formats: JPG, PNG, PDF (Max 10MB per file)
                                    </p>
                                </div>

                                {/* Existing Receipts */}
                                {expenseDetails?.data?.receipts?.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-3">
                                            Existing Receipts ({expenseDetails.data.receipts.length})
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {expenseDetails.data.receipts.map((receipt, index) => (
                                                <div key={index} className="group relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                                    <div className="aspect-square bg-gray-100 overflow-hidden">
                                                        {receipt.match(/\.(jpg|jpeg|png)$/i) ? (
                                                            <img
                                                                src={receipt}
                                                                alt={`Receipt ${index + 1}`}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                                <HiOutlineDocumentText className="text-4xl text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                Receipt {index + 1}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => window.open(receipt, '_blank')}
                                                                    className="p-1 text-blue-500 hover:text-blue-700"
                                                                    title="View receipt"
                                                                >
                                                                    <FiEye size={18} />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteReceipt(receipt, index)}
                                                                    className="p-1 text-red-500 hover:text-red-700"
                                                                    title="Delete receipt"
                                                                >
                                                                    <HiOutlineTrash size={18} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status Information */}
                            {expenseDetails?.data && (
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                                        <HiOutlineCheckCircle className="text-gray-600" />
                                        Approval Status
                                    </h3>

                                    <div className="space-y-4">
                                        <div className={`p-4 rounded-lg border ${expenseDetails.data.status === 'approved'
                                            ? 'bg-green-50 border-green-200'
                                            : expenseDetails.data.status === 'rejected'
                                                ? 'bg-red-50 border-red-200'
                                                : 'bg-yellow-50 border-yellow-200'
                                            }`}>
                                            <div className="flex items-center justify-between">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${expenseDetails.data.status === 'approved'
                                                    ? 'bg-green-100 text-green-700'
                                                    : expenseDetails.data.status === 'rejected'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {expenseDetails.data.status?.toUpperCase() || 'PENDING'}
                                                </span>
                                            </div>
                                        </div>

                                        {expenseDetails.data.adminRemarks && (
                                            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                                <div className="flex items-start gap-2">
                                                    <FiInfo className="text-red-500 text-lg mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <h4 className="font-medium text-red-800 mb-1">Admin Remarks</h4>
                                                        <p className="text-red-700 italic">{expenseDetails.data.adminRemarks}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {expenseDetails.data.limitExceed?.amount > 0 && (
                                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                                                <div className="flex items-start gap-2">
                                                    <HiOutlineExclamationCircle className="text-orange-500 text-lg mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <h4 className="font-medium text-orange-800 mb-1">Limit Exceeded</h4>
                                                        <p className="text-orange-700">{expenseDetails.data.limitExceed.message}</p>
                                                        <p className="text-sm text-orange-600 mt-1">
                                                            Excess Amount: ₹{expenseDetails.data.limitExceed.amount}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </DialogContent>

                    <DialogActions className="bg-white border-t p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                <FiInfo className="text-gray-400" />
                                <span>Fields marked with <span className="text-red-500">*</span> are required</span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <Button
                                    variant={3}
                                    onClick={handleClose}
                                    text="Cancel"
                                    type="button"
                                    className="px-8 py-3"
                                />
                                <Button
                                    variant={1}
                                    text="Update Expense"
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 shadow-lg hover:shadow-xl transition-all"
                                    style={{
                                        background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                                    }}
                                />
                            </div>
                        </div>
                    </DialogActions>
                </form>
            )}
        </Dialog>
    )
}

export default EditExpense;
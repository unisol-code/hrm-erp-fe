import React from 'react'

const BankDetailsTab = ({formik}) => {

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="px-8">
                <div className="grid grid-cols-2 gap-8">
                    {/* Bank Account Name */}
                    <div className="grid grid-cols-3">
                        <div className="w-full col-span-1">
                            <label>Bank Holder Name:</label>
                        </div>
                        <div className=" col-span-2">
                            <input
                                type="text"
                                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                                name="bankAccountName"
                                placeholder="Enter Bank Account Name"
                                value={formik.values.bankAccountName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.bankAccountName &&
                                formik.errors.bankAccountName ? (
                                <div className="text-red-500">
                                    {formik.errors.bankAccountName}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Bank Name */}
                    <div className="grid grid-cols-3">
                        <div className="w-full col-span-1">
                            <label>Bank Name:</label>
                        </div>
                        <div className=" col-span-2">
                            <input
                                type="text"
                                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                                name="bankName"
                                value={formik.values.bankName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter Bank Name"
                            />
                            {formik.touched.bankName && formik.errors.bankName ? (
                                <div className="text-red-500">
                                    {formik.errors.bankName}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Branch Name */}

                    <div className="grid grid-cols-3">
                        <div className="w-full col-span-1">
                            <label>Branch Name:</label>
                        </div>
                        <div className=" col-span-2">
                            <input
                                type="text"
                                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                                name="branchName"
                                value={formik.values.branchName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter Branch Name"
                            />
                            {formik.touched.branchName &&
                                formik.errors.branchName ? (
                                <div className="text-red-500">
                                    {formik.errors.branchName}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Bank Account Number */}
                    <div className="grid grid-cols-3">
                        <div className="w-full col-span-1">
                            <label>Account No:</label>
                        </div>
                        <div className=" col-span-2">
                            <input
                                type="text"
                                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                                name="bankAccountNumber"
                                placeholder="Enter Bank Account No"
                                value={formik.values.bankAccountNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.bankAccountNumber &&
                                formik.errors.bankAccountNumber ? (
                                <div className="text-red-500">
                                    {formik.errors.bankAccountNumber}
                                </div>
                            ) : null}
                        </div>
                    </div>


                    {/* IFSC Code */}
                    <div className="grid grid-cols-3">
                        <div className="w-full col-span-1">
                            <label>IFSC Code:</label>
                        </div>
                        <div className=" col-span-2">
                            <input
                                type="text"
                                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                                name="ifscCode"
                                value={formik.values.ifscCode}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter IFSC Code"
                            />
                            {formik.touched.ifscCode &&
                                formik.errors.ifscCode ? (
                                <div className="text-red-500">
                                    {formik.errors.ifscCode}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default BankDetailsTab

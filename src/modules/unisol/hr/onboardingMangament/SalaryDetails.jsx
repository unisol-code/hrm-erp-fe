import React from 'react'

const SalaryDetails = ({ formik }) => {
    const handleNumericChange = (fieldName) => (e) => {
        const { value } = e.target;
        const currentValue = formik.values[fieldName];

        if (currentValue == 0 && /^\d$/.test(value)) {
            formik.setFieldValue(fieldName, value);
            return;
        }

        const sanitized = value.replace(/^0+(?=\d)/, "") || "0";
        formik.setFieldValue(fieldName, sanitized);
    };
    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="px-10">
                <div className="grid grid-cols-1 gap-5">
                    {/* Earnings Section */}
                    <h2 className="text-lg font-semibold mt-4 mb-2">Earnings</h2>

                    {/* Basic Salary */}
                    <div className="grid grid-cols-3 items-center">
                        <div className="col-span-1">
                            <label>Basic Salary</label>
                        </div>
                        <div className="col-span-2">
                            <input
                                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                                placeholder="Enter Basic Salary"
                                type="text"
                                name="basicSalary"
                                value={formik.values.basicSalary}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.basicSalary && formik.errors.basicSalary && (
                                <div className="text-red-500">{formik.errors.basicSalary}</div>
                            )}
                        </div>
                    </div>

                    {/* House Rent Allowance */}
                    <div className="grid grid-cols-3 items-center">
                        <div className="col-span-1">
                            <label>House Rent Allowance</label>
                        </div>
                        <div className="col-span-2">
                            <input
                                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                                placeholder="House Rent Allowance"
                                type="text"
                                name="houseRentAllowance"
                                value={formik.values.houseRentAllowance}
                                onChange={handleNumericChange("houseRentAllowance")}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.houseRentAllowance && formik.errors.houseRentAllowance && (
                                <div className="text-red-500">{formik.errors.houseRentAllowance}</div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                        <div className="col-span-1">
                            <label>Conveyance Allowance</label>
                        </div>
                        <div className="col-span-2">
                            <input
                                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                                placeholder="Conveyance Allowance"
                                type="text"
                                name="conveyanceAllowance"
                                value={formik.values.conveyanceAllowance}
                                onChange={handleNumericChange("conveyanceAllowance")}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.conveyanceAllowance && formik.errors.conveyanceAllowance && (
                                <div className="text-red-500">{formik.errors.conveyanceAllowance}</div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 items-center">
                        <div className="col-span-1">
                            <label>Dearness Allowance</label>
                        </div>
                        <div className="col-span-2">
                            <input
                                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                                placeholder="Dearness Allowance"
                                type="text"
                                name="dearnessAllowance"
                                value={formik.values.dearnessAllowance}
                                onChange={handleNumericChange("dearnessAllowance")}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.dearnessAllowance && formik.errors.dearnessAllowance && (
                                <div className="text-red-500">{formik.errors.dearnessAllowance}</div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                        <div className="col-span-1">
                            <label>Medical Allowance</label>
                        </div>
                        <div className="col-span-2">
                            <input
                                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                                placeholder="Medical Allowance"
                                type="text"
                                name="medicalAllowance"
                                value={formik.values.medicalAllowance}
                                onChange={handleNumericChange("medicalAllowance")}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.medicalAllowance && formik.errors.medicalAllowance && (
                                <div className="text-red-500">{formik.errors.medicalAllowance}</div>
                            )}
                        </div>
                    </div>

                    {/* joining Bonus */}
                    <div className="grid grid-cols-3 items-center">
                        <div className="col-span-1">
                            <label>Joining Bonus</label>
                        </div>
                        <div className="col-span-2">
                            <input
                                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                                placeholder="Joining Bonus"
                                type="text"
                                name="joiningBonus"
                                value={formik.values.joiningBonus}
                                onChange={handleNumericChange("joiningBonus")}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.joiningBonus && formik.errors.joiningBonus && (
                                <div className="text-red-500">{formik.errors.joiningBonus}</div>
                            )}
                        </div>
                    </div>
                    {/* LTA Allowance */}
                    <div className="grid grid-cols-3 items-center">
                        <div className="col-span-1">
                            <label>LTA Allowance</label>
                        </div>
                        <div className="col-span-2">
                            <input
                                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                                placeholder="LTA Allowance"
                                type="text"
                                name="LTAAllowance"
                                value={formik.values.LTAAllowance}
                                onChange={handleNumericChange("LTAAllowance")}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.LTAAllowance && formik.errors.LTAAllowance && (
                                <div className="text-red-500">{formik.errors.LTAAllowance}</div>
                            )}
                        </div>
                    </div>

                    {/*special allowances */}
                    <div className="grid grid-cols-3 items-center">
                        <div className="col-span-1">
                            <label>Special Allowance</label>
                        </div>
                        <div className="col-span-2">
                            <input
                                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                                placeholder="Special Allowance"
                                type="text"
                                name="specialAllowance"
                                value={formik.values.specialAllowance}
                                onChange={handleNumericChange("specialAllowance")}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.specialAllowance && formik.errors.specialAllowance && (
                                <div className="text-red-500">{formik.errors.specialAllowance}</div>
                            )}
                        </div>
                    </div>

                    <hr />

                    {/* Deductions Section */}
                    <h2 className="text-lg font-semibold mt-2 mb-2">Deductions</h2>
                    {/* Income Tax Deduction */}
                    <div className="grid grid-cols-3 items-start gap-2">
                        <div className="col-span-1 pt-2">
                            <label>Income Tax (if any)</label>
                        </div>
                        <div className="col-span-2 space-y-2">
                            {/* Radio Buttons */}
                            <div className="flex gap-4">
                                <label className="flex items-center gap-1">
                                    <input
                                        type="radio"
                                        name="isIncomeTaxApplicable"
                                        value="yes"
                                        checked={formik.values.isIncomeTaxApplicable === "yes"}
                                        onChange={formik.handleChange}
                                    />
                                    Yes
                                </label>
                                <label className="flex items-center gap-1">
                                    <input
                                        type="radio"
                                        name="isIncomeTaxApplicable"
                                        value="no"
                                        checked={formik.values.isIncomeTaxApplicable === "no"}
                                        onChange={formik.handleChange}
                                    />
                                    No
                                </label>
                            </div>

                            {/* Income Tax Amount (only if yes) */}
                            {formik.values.isIncomeTaxApplicable === "yes" && (
                                <div>
                                    <input
                                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                                        placeholder="Income Tax Deduction Amount"
                                        type="text"
                                        name="incomeTaxDeduction"
                                        value={formik.values.incomeTaxDeduction}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.incomeTaxDeduction && formik.errors.incomeTaxDeduction && (
                                        <div className="text-red-500">{formik.errors.incomeTaxDeduction}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Professional Tax */}
                    <div className="grid grid-cols-3 items-center">
                        <div className="col-span-1">
                            <label>Professional Tax</label>
                        </div>
                        <div className="col-span-2">
                            <input
                                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                                placeholder="Professional Tax"
                                type="text"
                                name="professionalTax"
                                value={formik.values.professionalTax}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.professionalTax && formik.errors.professionalTax && (
                                <div className="text-red-500">{formik.errors.professionalTax}</div>
                            )}
                        </div>
                    </div>

                    {/* PF Account Number */}
                    <div className="grid grid-cols-3 items-center">
                        <div className="col-span-1">
                            <label>PF Account Number (optional)</label>
                        </div>
                        <div className="col-span-2">
                            <input
                                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                                placeholder="PF Account Number"
                                type="text"
                                name="pfAccountNumber"
                                value={formik.values.pfAccountNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.pfAccountNumber && formik.errors.pfAccountNumber && (
                                <div className="text-red-500">{formik.errors.pfAccountNumber}</div>
                            )}
                        </div>
                    </div>
                    {/* Advance Loan Deduction */}
                    <div className="grid grid-cols-3 items-start gap-2">
                        <div className="col-span-1 pt-2">
                            <label>Advance Loan (if any)</label>
                        </div>
                        <div className="col-span-2 space-y-2">
                            {/* Radio Buttons */}
                            <div className="flex gap-4">
                                <label className="flex items-center gap-1">
                                    <input
                                        type="radio"
                                        name="hasAdvanceLoan"
                                        value="yes"
                                        checked={formik.values.hasAdvanceLoan === "yes"}
                                        onChange={formik.handleChange}
                                    />
                                    Yes
                                </label>
                                <label className="flex items-center gap-1">
                                    <input
                                        type="radio"
                                        name="hasAdvanceLoan"
                                        value="no"
                                        checked={formik.values.hasAdvanceLoan === "no"}
                                        onChange={formik.handleChange}
                                    />
                                    No
                                </label>
                            </div>
                            {/* Amount Field – Visible only if Yes */}
                            {formik.values.hasAdvanceLoan === "yes" && (
                                <div>
                                    <input
                                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                                        placeholder="Advance Loan Amount"
                                        type="text"
                                        name="advanceLoanDeductions"
                                        value={formik.values.advanceLoanDeductions}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.advanceLoanDeductions && formik.errors.advanceLoanDeductions && (
                                        <div className="text-red-500">{formik.errors.advanceLoanDeductions}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default SalaryDetails

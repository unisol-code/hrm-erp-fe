import React from "react";
import Select from "react-select";

const HRPrivilegeForm = ({
  theme,
  navigate,
  isEditMode,
  formik,
  companyOptions,
  handleCompanyChange,
  handleDepartmentChange,
  departmentOptions,
  handleDesignationChange,
  designationOptions,
  hrNameOptions,
  loading,
  companyId,
}) => {
  return (
    <section className="mb-6 p-4 shadow-sm border rounded-2xl space-y-4 text-gray-500">
      <form onSubmit={formik.handleSubmit} noValidate>
        {/* Company */}
        <div className="mb-4">
          <label htmlFor="company" className="block text-xl mb-2 font-medium text-gray-700">
            Company
          </label>
          <Select
            placeholder="Select company"
            inputId="company"
            name="company"
            options={companyOptions}
            onChange={handleCompanyChange}
            onBlur={formik.handleBlur}
            isClearable
            value={companyOptions.find(opt => opt.value === formik.values.company) || null}
            isDisabled={isEditMode}
          />
          {formik.touched.company && formik.errors.company && (
            <div className="text-red-500 text-sm">{formik.errors.company}</div>
          )}
        </div>

        {/* Department */}
        <div className="mb-4">
          <label htmlFor="department" className="block text-xl mb-2 font-medium text-gray-700">
            Department
          </label>
          <Select
            inputId="department"
            name="department"
            options={departmentOptions}
            onChange={handleDepartmentChange}
            onBlur={formik.handleBlur}
            value={departmentOptions.find(opt => opt.value === formik.values.department) || null}
            isLoading={loading}
            isClearable
            isDisabled={isEditMode || !companyId}
            placeholder={companyId ? "Select department" : "Select company first"}
            noOptionsMessage={() => loading ? "Loading..." : "No department found"}
          />
          {formik.touched.department && formik.errors.department && (
            <div className="text-red-500 text-sm">{formik.errors.department}</div>
          )}
        </div>

        {/* Designation */}
        <div className="mb-4">
          <label htmlFor="designation" className="block text-xl mb-2 font-medium text-gray-700">
            Designation
          </label>
          <Select
            inputId="designation"
            name="designation"
            options={designationOptions}
            onChange={handleDesignationChange}
            onBlur={formik.handleBlur}
            value={designationOptions.find(opt => opt.value === formik.values.designation) || null}
            isLoading={loading}
            isClearable
            isDisabled={isEditMode || !formik.values.department}
            placeholder={formik.values.department ? 'Select designation' : 'Select department first'}
            noOptionsMessage={() => (loading ? 'Loading...' : 'No designation found')}
          />
          {formik.touched.designation && formik.errors.designation && (
            <div className="text-red-500 text-sm">{formik.errors.designation}</div>
          )}
        </div>

        {/* HR Name */}
        <div className="mb-4">
          <label htmlFor="hrName" className="block text-xl mb-2 font-medium text-gray-700">
            HR Name
          </label>
          <Select
            inputId="hrName"
            name="hrName"
            options={hrNameOptions}
            onChange={(selected) => {
              formik.setFieldValue('hrName', selected?.value || '');
              formik.setFieldValue('email', selected?.email || '');
            }}
            onBlur={formik.handleBlur}
            value={hrNameOptions.find(opt => opt.value === formik.values.hrName) || null}
            isClearable
            isLoading={loading}
            isDisabled={isEditMode || !formik.values.company || !formik.values.department || !formik.values.designation}
            placeholder={
              formik.values.company && formik.values.department && formik.values.designation
                ? 'Select HR Name'
                : 'Select company, department, and designation first'
            }
            noOptionsMessage={() => loading ? 'Loading...' : 'No HR name found'}
          />
          {formik.touched.hrName && formik.errors.hrName && (
            <div className="text-red-500 text-sm">{formik.errors.hrName}</div>
          )}
        </div>

        {/* Email */}
        <div className="mb-2">
          <label htmlFor="email" className="block text-xl mb-2 font-medium text-gray-700">
            Email Id
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formik.values.email}
            placeholder="Enter email Id"
            className={`block w-full border h-12 border-gray-200 p-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              formik.touched.email && formik.errors.email ? 'border-red-500' : ''
            }`}
            readOnly={isEditMode || loading}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          )}
        </div>
      </form>
    </section>
  );
};

export default HRPrivilegeForm;
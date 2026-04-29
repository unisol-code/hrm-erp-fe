import React, { useEffect, useState, useMemo } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from 'formik';
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import * as Yup from "yup";
import useHRPrivilege from "../../../../../hooks/unisol/homeDashboard/useHRPrivilege";
import useEmployee from "../../../../../hooks/unisol/onboarding/useEmployee";
import { AdminOperation } from "./AdminOperationData";
import HRPrivilegeForm from "./HRPrivilegeForm";
import PrivilegeTable from "./PrivilegeTable";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import { FaGraduationCap } from "react-icons/fa6";

const validationSchema = Yup.object().shape({
  company: Yup.string().required('Required'),
  department: Yup.string().required('Required'),
  designation: Yup.string().required('Required'),
  hrName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
});

function AddHRPrivilege() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    fetchPrivilegeCompany,
    privilegeCompany,
    loading,
    fetchCompaniesDept,
    companyDepartment,
    fetchPrivilegeHRName,
    privilegeHRName,
    updateHRPrivilege,
    fetchPrivilegeById,
    privilegeDetails,
    assignHRPrivilege
  } = useHRPrivilege();

  const { designationByDept, fetchDesignation } = useEmployee();
  const [companyId, setCompanyId] = useState('');
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [hrNameOptions, setHrNameOptions] = useState([]);
  const [companyPrivileges, setCompanyPrivileges] = useState({});
  const [accessErrors, setAccessErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFetchingPrivilege, setIsFetchingPrivilege] = useState(false);

  const initialModulePrivileges = useMemo(() => {
    const privileges = {};
    AdminOperation?.forEach((module) => {
      if (module.children) {
        module.children.forEach(child => {
          privileges[child.label] = {
            ...child.permissionTypes.reduce((childPerms, perm) => {
              childPerms[perm.toLowerCase()] = false;
              return childPerms;
            }, {}),
            parent: module.label
          };
        });
      } else {
        privileges[module.label] = {
          ...module.permissionTypes.reduce((perms, perm) => {
            perms[perm.toLowerCase()] = false;
            return perms;
          }, {})
        };
      }
    });
    return privileges;
  }, []);

  const [modulePrivileges, setModulePrivileges] = useState(initialModulePrivileges);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      setIsFetchingPrivilege(true);
      fetchPrivilegeById(id)
        .catch(error => console.error("Error fetching privilege:", error))
        .finally(() => setIsFetchingPrivilege(false));
    }
    fetchPrivilegeCompany();
  }, [id]);

  useEffect(() => {
    if (privilegeDetails && isEditMode) {
      const companyAccess = privilegeDetails.companyAccess.reduce((acc, company) => {
        acc[company.name] = true;
        return acc;
      }, {});
      setCompanyPrivileges(companyAccess);

      const updatedModulePrivileges = { ...initialModulePrivileges };
      privilegeDetails.modules.forEach(module => {
        if (updatedModulePrivileges[module.moduleName]) {
          updatedModulePrivileges[module.moduleName] = {
            ...updatedModulePrivileges[module.moduleName],
            access: true,
            create: module.accessTypes.includes('create'),
            read: module.accessTypes.includes('read'),
            update: module.accessTypes.includes('update'),
            delete: module.accessTypes.includes('delete'),
          };
        }
      });
      setModulePrivileges(updatedModulePrivileges);

      const company = privilegeCompany.find(c => c.name === privilegeDetails.employee_id?.companyName);
      const companyId = company?._id || '';

      formik.setValues({
        company: companyId,
        department: privilegeDetails.employee_id?.department || '',
        designation: privilegeDetails.employee_id?.designation || '',
        hrName: privilegeDetails.employee_id?._id || '',
        email: privilegeDetails.employee_id?.officialEmail || '',
      });

      if (companyId) {
        fetchCompaniesDept(companyId);
        setCompanyId(companyId);
      }
    }
  }, [privilegeDetails, isEditMode, initialModulePrivileges, privilegeCompany]);

  const formik = useFormik({
    initialValues: {
      company: '',
      department: '',
      designation: '',
      hrName: '',
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (!validateAccessPermissions()) {
        return;
      }

      try {
        const companyAccess = Object.entries(companyPrivileges)
          .filter(([_, isSelected]) => isSelected)
          .map(([companyName]) => {
            const company = privilegeCompany.find(c => c.name === companyName);
            return company?._id;
          })
          .filter(Boolean);

        const modules = Object.entries(modulePrivileges)
          .filter(([_, permissions]) => permissions.access)
          .map(([moduleName, permissions]) => {
            const accessTypes = Object.entries(permissions)
              .filter(([permName, isAllowed]) =>
                permName !== 'access' &&
                permName !== 'parent' &&
                isAllowed
              )
              .map(([permName]) => permName);

            return {
              moduleName,
              accessTypes
            };
          });

        const requestBody = {
          employee_id: values.hrName,
          companyAccess,
          modules
        };

        const response = isEditMode
          ? await updateHRPrivilege(id, requestBody)
          : await assignHRPrivilege(requestBody);

        console.log("Privileges saved successfully:", response);
        navigate('/home/hrPrivilege');
      } catch (error) {
        console.error("Error saving privileges:", error);
      }
    },
  });

  const validateAccessPermissions = () => {
    const errors = {};
    let isValid = true;

    Object.entries(modulePrivileges).forEach(([moduleName, permissions]) => {
      if (permissions.access) {
        const hasPermission = ['create', 'read', 'update', 'delete'].some(
          perm => permissions[perm]
        );

        if (!hasPermission) {
          errors[moduleName] = 'Select at least one permission';
          isValid = false;
        }
      }
    });

    setAccessErrors(errors);
    return isValid;
  };

  const toggleCompany = (company) => {
    setCompanyPrivileges((prev) => ({
      ...prev,
      [company]: !prev[company],
    }));
  };

  const toggleModulePrivilege = (module, privilege) => {
    setModulePrivileges(prev => {
      const newState = { ...prev };
      newState[module] = {
        ...newState[module],
        [privilege]: !newState[module]?.[privilege]
      };
      if (privilege !== 'access' && newState[module].access && accessErrors[module]) {
        setAccessErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          delete newErrors[module];
          return newErrors;
        });
      }
      return newState;
    });
  };

  const handleCompanyChange = async (selectedOption) => {
    const selectedId = selectedOption?.value || '';
    setCompanyId(selectedId);
    formik.setFieldValue('company', selectedId);

    if (!selectedId) {
      formik.setFieldValue('department', '');
      formik.setFieldValue('designation', '');
      formik.setFieldValue('hrName', '');
      formik.setFieldValue('email', '');
      setDepartmentOptions([]);
      setDesignationOptions([]);
      setHrNameOptions([]);
    } else {
      await fetchCompaniesDept(selectedId);
    }
  };

  const handleDepartmentChange = (selectedOption) => {
    const deptName = selectedOption?.value || '';
    formik.setFieldValue('department', deptName);
    if (!deptName) {
      formik.setFieldValue('designation', '');
      formik.setFieldValue('hrName', '');
      formik.setFieldValue('email', '');
      setDesignationOptions([]);
      setHrNameOptions([]);
    } else {
      fetchDesignation(deptName);
    }
  };

  const handleDesignationChange = (selectedOption) => {
    const designation = selectedOption?.value || '';
    formik.setFieldValue('designation', designation);
    if (!designation) {
      formik.setFieldValue('hrName', '');
      formik.setFieldValue('email', '');
      setHrNameOptions([]);
    }
  };

  useEffect(() => {
    if (companyDepartment?.length) {
      setDepartmentOptions(companyDepartment.map(dept => ({
        label: dept,
        value: dept,
      })));
    } else {
      setDepartmentOptions([]);
    }
  }, [companyDepartment]);

  useEffect(() => {
    if (designationByDept?.length) {
      setDesignationOptions(designationByDept.map(d => ({
        label: d,
        value: d
      })));
    } else {
      setDesignationOptions([]);
    }
  }, [designationByDept]);

  useEffect(() => {
    if (privilegeCompany?.length) {
      const initialPrivileges = {};
      privilegeCompany.forEach(c => {
        initialPrivileges[c.name] = false;
      });
      setCompanyPrivileges(initialPrivileges);
    }
  }, [privilegeCompany]);

  useEffect(() => {
    const { company, department, designation } = formik.values;
    if (company && department && designation) {
      fetchPrivilegeHRName(company, department, designation);
    } else {
      setHrNameOptions([]);
      formik.setFieldValue('hrName', '');
      formik.setFieldValue('email', '');
    }
  }, [formik.values.company, formik.values.department, formik.values.designation]);

  useEffect(() => {
    if (privilegeHRName?.length) {
      setHrNameOptions(privilegeHRName.map(name => ({
        label: name?.fullName,
        value: name?._id,
        email: name?.officialEmail,
      })));
    } else {
      setHrNameOptions([]);
    }
  }, [privilegeHRName]);

  const companyOptions = privilegeCompany?.map(company => ({
    label: company.name,
    value: company._id
  })) || [];

  if (isFetchingPrivilege) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      {/* Header */}
      <Breadcrumb
        linkText={[
          { text: "HR Privilege", href: "/home/hrPrivilege" },
          { text: isEditMode ? "Edit HR Privilege" : "Assign HR Privilege" }
        ]}
      />
      {/* Header Section */}
      <div className="py-4 px-8 flex flex-col md:flex-row md:items-center rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
        <div className="flex items-center gap-3 flex-1">
          <FaGraduationCap
            style={{ color: theme.primaryColor, fontSize: 32 }}
          />
          <span className="text-2xl font-bold">{isEditMode ? "Edit HR Privilege" : "Assign HR Privilege"}</span>
        </div>
      </div>

      {/* Main content container */}
      <main className="flex-grow max-w-screen-xl bg-white mx-auto rounded-xl sm:px-6 lg:px-8 py-8 w-full">
        <HRPrivilegeForm
          theme={theme}
          navigate={navigate}
          isEditMode={isEditMode}
          formik={formik}
          companyOptions={companyOptions}
          handleCompanyChange={handleCompanyChange}
          departmentOptions={departmentOptions}
          handleDepartmentChange={handleDepartmentChange}
          designationOptions={designationOptions}
          handleDesignationChange={handleDesignationChange}
          hrNameOptions={hrNameOptions}
          loading={loading}
          companyId={companyId}
        />

        <PrivilegeTable
          companyOptions={companyOptions}
          companyPrivileges={companyPrivileges}
          toggleCompany={toggleCompany}
          AdminOperation={AdminOperation}
          modulePrivileges={modulePrivileges}
          toggleModulePrivilege={toggleModulePrivilege}
          accessErrors={accessErrors}
        />

        <div className="flex justify-center items-center pt-5">
          <button
            type="submit"
            style={{ backgroundColor: theme.primaryColor }}
            className="inline-flex items-center gap-2 transition text-white px-5 py-3 rounded-md shadow-md font-semibold min-w-[220px] justify-center"
            aria-label="Assign HR Privilege"
            onClick={formik.handleSubmit}
            disabled={loading}
          >
            {loading ? "Loading..." : isEditMode ? "Update HR Privilege" : "Assign HR Privilege"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default AddHRPrivilege;
export const useRoles = () => {
  const isSuperAdmin = sessionStorage.getItem("isSuperAdminLogin") === 'true';
  const isHR = sessionStorage.getItem("isHrLogin") === 'true';
  const isEmployee = sessionStorage.getItem("isEmployeeLogin") === 'true';
  
  return { isSuperAdmin, isHR, isEmployee };
};
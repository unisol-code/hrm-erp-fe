// hooks/auth/usePermissions.js
import { useEffect, useState } from 'react';
import { useRoles } from './useRoles';

export const usePermissions = (hrDetails, moduleName) => {
  const { isSuperAdmin } = useRoles();

  const getDefaultPermissions = () => ({
    canCreate: isSuperAdmin,
    canRead: isSuperAdmin,
    canUpdate: isSuperAdmin,
    canDelete: isSuperAdmin
  });

  const [permissions, setPermissions] = useState(getDefaultPermissions());

  useEffect(() => {
    if (isSuperAdmin) {
      setPermissions({
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true
      });
      return;
    }
    if (hrDetails?.modules) {
      console.log(hrDetails)
      const module = hrDetails.modules.find(m => m.moduleName === moduleName);
      if (module) {
        setPermissions({
          canCreate: module.accessTypes.includes('create') ?? false,
          canRead: module.accessTypes.includes('read') ?? false,
          canUpdate: module.accessTypes.includes('update') ?? false,
          canDelete: module.accessTypes.includes('delete') ?? false
        });
      }
    }
  }, [hrDetails, moduleName, isSuperAdmin]);

  return permissions;
};
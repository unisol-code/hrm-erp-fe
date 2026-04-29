import React from "react";

const ToggleSwitch = ({ id, checked, onChange, label, disabled = false }) => {
  return (
    <label
      htmlFor={id}
      className={`inline-flex relative items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={label}
    >
      <input
        type="checkbox"
        id={id}
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <div className={`w-9 h-5 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500 peer-checked:bg-indigo-600 transition-colors ${disabled ? 'bg-gray-200' : 'bg-gray-300'}`}></div>
      <div
        className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow transform peer-checked:translate-x-4 transition-transform"
        aria-hidden="true"
      ></div>
    </label>
  );
};

const PrivilegeTable = ({
  companyOptions,
  companyPrivileges,
  toggleCompany,
  AdminOperation,
  modulePrivileges,
  toggleModulePrivilege,
  accessErrors,
}) => {
  return (
    <section className="bg-white font-bold overflow-x-auto h-full w-full p-6 shadow-sm border rounded-2xl">
      <p className="text-[20px] text-black-400">Choose Privileges</p>
      <br />

      {/* Company Selection Header */}
      <table className="table-fixed w-full">
        <thead className="bg-[#E9EBF7] text-gray-500 text-md font-semibold text-center">
          <tr>
            <th className="border-t border-l border-r border-black border-b-0 min-w-[300px] px-6 py-3 text-left">
              Select Company
            </th>
            {companyOptions?.map((company) => (
              <th
                key={company.value}
                className="border border-black min-w-[650px] px-4 py-3 text-center"
              >
                {company.label}
              </th>
            ))}
          </tr>
          <tr>
            <td className="border-t-0 border-l border-r border-b border-black min-w-[300px] px-6 py-2"></td>
            {companyOptions?.map((company) => (
              <td
                key={`${company.value}-toggle`}
                className="border border-black min-w-[650px] px-4 py-2 text-center"
              >
                <label
                  htmlFor={`company-toggle-${company.label}`}
                  className="inline-flex relative items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id={`company-toggle-${company.label}`}
                    className="sr-only peer"
                    checked={!!companyPrivileges[company.label]}
                    onChange={() => toggleCompany(company.label)}
                  />
                  <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500 peer-checked:bg-indigo-600 transition-colors"></div>
                  <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow transform peer-checked:translate-x-4 transition-transform" />
                </label>
              </td>
            ))}
          </tr>
        </thead>
      </table>

      {/* Modules + Privileges */}
      <table className="min-w-full mt-2">
        <tbody className="text-md text-gray-500 font-semibold text-center">
          <tr className="bg-[#EBFBFF] font-semibold">
            <th className="border border-black w-[125px] h-[60px]">Modules</th>
            <th className="border border-black w-[100px] h-[60px]">Access</th>
            <th className="border border-black w-[100px] h-[60px]">Create</th>
            <th className="border border-black w-[100px] h-[60px]">Read</th>
            <th className="border border-black w-[100px] h-[60px]">Update</th>
            <th className="border border-black w-[100px] h-[60px]">Delete</th>
          </tr>

          {AdminOperation?.map((module) => {
            const moduleData = modulePrivileges[module.label];

            return (
              <React.Fragment key={module.label}>
                {module.children ? (
                  <tr className="bg-gray-100">
                    <td colSpan="6" className="border border-black h-[60px] font-bold pl-4 text-left">
                      {module.label}
                    </td>
                  </tr>
                ) : (
                  moduleData && (
                    <tr className="even:bg-white odd:bg-gray-50">
                      <td className="border border-black w-[50px] h-[60px] pl-4 text-left">
                        {module.label}
                        {accessErrors[module.label] && (
                          <div className="text-red-500 text-xs mt-1">{accessErrors[module.label]}</div>
                        )}
                      </td>
                      <td className="border border-black w-[100px] h-[60px]">
                        <input
                          type="checkbox"
                          checked={moduleData.access || false}
                          onChange={() => toggleModulePrivilege(module.label, "access")}
                          className={`appearance-none w-6 h-6 border rounded-sm flex items-center justify-center text-sm font-bold checked:before:content-['✓'] checked:before:text-white checked:before:text-sm checked:before:leading-5 mx-auto ${accessErrors[module.label]
                            ? 'border-red-500 checked:border-red-500 checked:bg-red-500'
                            : 'border-black checked:border-black checked:bg-black'
                            }`}
                        />
                      </td>
                      {['create', 'read', 'update', 'delete'].map((perm) => (
                        module.permissionTypes.includes(perm) ? (
                          <td className="border border-black w-[100px] h-[60px]" key={`${module.label}-${perm}`}>
                            <ToggleSwitch
                              id={`${module.label}-${perm}`}
                              checked={moduleData[perm] || false}
                              onChange={() => toggleModulePrivilege(module.label, perm)}
                              label={`${perm} ${module.label}`}
                            />
                          </td>
                        ) : (
                          <td className="border border-black w-[100px] h-[60px]" key={`${module.label}-${perm}`}></td>
                        )
                      ))}
                    </tr>
                  )
                )}

                {module.children?.map((child) => {
                  const childData = modulePrivileges[child.label];
                  return childData ? (
                    <tr key={child.label} className="even:bg-white odd:bg-gray-50">
                      <td className="border border-black w-[50px] h-[60px] pl-8 text-left">
                        {child.label}
                        {accessErrors[child.label] && (
                          <div className="text-red-500 text-xs mt-1">{accessErrors[child.label]}</div>
                        )}
                      </td>
                      <td className="border border-black w-[100px] h-[60px]">
                        <input
                          type="checkbox"
                          checked={childData.access || false}
                          onChange={() => toggleModulePrivilege(child.label, "access")}
                          className="appearance-none w-6 h-6 border border-black rounded-sm checked:bg-black checked:border-black flex items-center justify-center text-sm font-bold checked:before:content-['✓'] checked:before:text-white checked:before:text-sm checked:before:leading-5 mx-auto"
                        />
                      </td>
                      {['create', 'read', 'update', 'delete'].map((perm) => (
                        child.permissionTypes.includes(perm) ? (
                          <td className="border border-black w-[100px] h-[60px]" key={`${child.label}-${perm}`}>
                            <ToggleSwitch
                              id={`${child.label}-${perm}`}
                              checked={childData[perm] || false}
                              onChange={() => toggleModulePrivilege(child.label, perm)}
                              label={`${perm} ${child.label}`}
                            />
                          </td>
                        ) : (
                          <td className="border border-black w-[100px] h-[60px]" key={`${child.label}-${perm}`}></td>
                        )
                      ))}
                    </tr>
                  ) : null;
                })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default PrivilegeTable;
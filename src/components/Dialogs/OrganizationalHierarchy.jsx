import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Tree, TreeNode } from "react-organizational-chart";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import useEmployee from "../../hooks/unisol/onboarding/useEmployee";
import Select from "react-select";
import useHRPrivilege from "../../hooks/unisol/homeDashboard/useHRPrivilege";
import { motion, AnimatePresence } from "framer-motion";
import useHierarchy from "../../hooks/unisol/coreHr/useHierarchy";
import LoaderSpinner from "../LoaderSpinner";

/** ---------- utilities ---------- */
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
const serializePath = (path) =>
  path.map((p) => `${p.type[0]}${p.index}`).join("-");

const getNodeAtPath = (rootNode, path) => {
  let node = rootNode;
  for (const seg of path) {
    if (!node) return null;
    node = node?.[seg.type]?.[seg.index];
  }
  return node;
};

const hasSubordinates = (node) =>
  (node?.managers?.length || 0) > 0 || (node?.employees?.length || 0) > 0;

// Serialize a node recursively to a backend-friendly payload structure
const serializeNode = (node) => {
  if (!node || typeof node !== "object") return null;

  const managers = Array.isArray(node.managers)
    ? node.managers.map(serializeNode).filter(Boolean)
    : [];
  const employees = Array.isArray(node.employees)
    ? node.employees.map(serializeNode).filter(Boolean)
    : [];

  const out = {};

  if (node.name && String(node.name).trim().length > 0) {
    out.name = node.name;
  }
  if (node.designation && String(node.designation).trim().length > 0) {
    out.designation = node.designation;
  }
  if (node.department && String(node.department).trim().length > 0) {
    out.department = node.department;
  }

  if (employees.length > 0) {
    out.employees = employees;
  }
  if (managers.length > 0) {
    out.managers = managers;
  }

  return out;
};

// Clears department, designation, and name recursively for all descendants of the node at parentPath
const clearDeptInDescendants = (rootSnapshot, parentPath) => {
  const parentNode =
    parentPath.length === 0
      ? rootSnapshot.admin
      : getNodeAtPath(rootSnapshot.admin, parentPath);
  if (!parentNode) return [];

  const clearedPathKeys = [];

  const walk = (node, curPath, skipSelf = true) => {
    if (!node) return;
    if (!skipSelf) {
      node.department = "";
      node.designation = "";
      node.name = "";
      clearedPathKeys.push(serializePath(curPath));
    }
    (node.managers || []).forEach((m, idx) =>
      walk(m, [...curPath, { type: "managers", index: idx }], false)
    );
    (node.employees || []).forEach((e, idx) =>
      walk(e, [...curPath, { type: "employees", index: idx }], false)
    );
  };

  walk(parentNode, parentPath, true);
  return clearedPathKeys;
};

// Force-set department for all descendants and clear their designation/name
const setDeptInDescendants = (rootSnapshot, parentPath, department) => {
  const parentNode =
    parentPath.length === 0
      ? rootSnapshot.admin
      : getNodeAtPath(rootSnapshot.admin, parentPath);
  if (!parentNode) return [];

  const updatedPathKeys = [];

  const walk = (node, curPath, skipSelf = true) => {
    if (!node) return;
    if (!skipSelf) {
      node.department = department;
      node.designation = "";
      node.name = "";
      updatedPathKeys.push(serializePath(curPath));
    }
    (node.managers || []).forEach((m, idx) =>
      walk(m, [...curPath, { type: "managers", index: idx }], false)
    );
    (node.employees || []).forEach((e, idx) =>
      walk(e, [...curPath, { type: "employees", index: idx }], false)
    );
  };

  walk(parentNode, parentPath, true);
  return updatedPathKeys;
};

const OrganizationalHierarchy = ({ data: initialData, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(initialData);

  const {
    fetchDepartments,
    fetchDesignation,
    departmentDrop,
    designationByDept,
  } = useEmployee();
  const { fetchPrivilegeHRName, privilegeHRName } = useHRPrivilege();

  const { loading, hierarchy, fetchHierarchy, updateHirarchy } = useHierarchy();

  const pendingDesignationsRef = useRef({});
  const [designationOptions, setDesignationOptions] = useState({});
  const [nameOptions, setNameOptions] = useState({});
  const [loadingDesignations, setLoadingDesignations] = useState({});
  const [loadingNames, setLoadingNames] = useState({});
  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);
  const fetchedDesignationsRef = useRef(new Set());
  const fetchedNamesRef = useRef(new Set());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchDepartments();
    fetchHierarchy();
  }, []);
  console.log("hierarchy", hierarchy);

  // When API hierarchy changes, update local state unless we're actively editing
  useEffect(() => {
    if (!isEditing && hierarchy && typeof hierarchy === "object") {
      const wrapped = hierarchy ? hierarchy : hierarchy;
      const next = wrapped?.admin ? wrapped : { admin: wrapped };
      if (next && next.admin) {
        setData(next);
      }
    }
  }, [hierarchy, isEditing]);

  // Preload designations and names for existing data when entering edit mode
  // useEffect(() => {
  //   if (!isEditing || !data?.admin) return;

  //   // reset caches on new edit session so preloads can fire
  //   fetchedDesignationsRef.current = new Set();
  //   fetchedNamesRef.current = new Set();

  //   const deptToPathKeys = {};
  //   const nameRequests = [];

  //   const traverse = (node, path) => {
  //     const pathKey = serializePath(path);
  //     const dept = node?.department || "";
  //     const desig = node?.designation || "";

  //     if (dept) {
  //       if (!deptToPathKeys[dept]) deptToPathKeys[dept] = [];
  //       deptToPathKeys[dept].push(pathKey);
  //     }

  //     if (dept && desig) {
  //       nameRequests.push({ dept, desig, pathKey });
  //     }

  //     (node.managers || []).forEach((m, idx) =>
  //       traverse(m, [...path, { type: "managers", index: idx }])
  //     );
  //     (node.employees || []).forEach((e, idx) =>
  //       traverse(e, [...path, { type: "employees", index: idx }])
  //     );
  //   };

  //   traverse(data.admin, []);

  //   // Batch fetch designations by department (only if not already fetched)
  //   const loadDesignations = async () => {
  //     const entries = Object.entries(deptToPathKeys);
  //     for (const [dept, keys] of entries) {
  //       const deptKey = `dept_${dept}`;
  //       if (!fetchedDesignationsRef.current.has(deptKey)) {
  //         fetchedDesignationsRef.current.add(deptKey);
  //         await fetchAndSetDesignations(dept, keys);
  //       }
  //     }
  //   };

  //   // Fetch names for nodes with department+designation (only if not already fetched)
  //   const loadNames = async () => {
  //     for (const req of nameRequests) {
  //       const nameKey = `name_${req.dept}_${req.desig}`;
  //       if (!fetchedNamesRef.current.has(nameKey)) {
  //         fetchedNamesRef.current.add(nameKey);
  //         await fetchNamesForDesignation(req.dept, req.desig, req.pathKey);
  //       }
  //     }
  //   };

  //   loadDesignations().then(loadNames);
  // }, [isEditing]); // Removed data dependency to prevent infinite loops

  // Preload designations and names for existing data when entering edit mode
  useEffect(() => {
    if (!isEditing || !data?.admin) return;

    fetchedDesignationsRef.current = new Set();
    fetchedNamesRef.current = new Set();
    setDesignationOptions({});
    setNameOptions({});

    const deptToPathKeys = {};
    const nameRequests = {};

    const traverse = (node, path) => {
      const pathKey = serializePath(path);
      const dept = node?.department || "";
      const desig = node?.designation || "";

      if (dept) {
        if (!deptToPathKeys[dept]) deptToPathKeys[dept] = [];
        deptToPathKeys[dept].push(pathKey);
      }

      if (dept && desig) {
        const nameKey = `name_${dept}_${desig}`;
        if (!nameRequests[nameKey]) {
          nameRequests[nameKey] = { dept, desig, pathKeys: [] };
        }
        nameRequests[nameKey].pathKeys.push(pathKey);
      }

      (node.managers || []).forEach((m, idx) =>
        traverse(m, [...path, { type: "managers", index: idx }])
      );
      (node.employees || []).forEach((e, idx) =>
        traverse(e, [...path, { type: "employees", index: idx }])
      );
    };

    traverse(data.admin, []);

    const loadDesignations = async () => {
      const entries = Object.entries(deptToPathKeys);
      for (const [dept, keys] of entries) {
        const deptKey = `dept_${dept}`;
        if (!fetchedDesignationsRef.current.has(deptKey)) {
          fetchedDesignationsRef.current.add(deptKey);
          await fetchAndSetDesignations(dept, keys);
        }
      }
    };

    const loadNames = async () => {
      const requests = Object.values(nameRequests);
      for (const req of requests) {
        const { dept, desig, pathKeys } = req;
        const nameKey = `name_${dept}_${desig}`;

        if (!fetchedNamesRef.current.has(nameKey)) {
          fetchedNamesRef.current.add(nameKey);

          if (!companyId || !dept || !desig) continue;

          setLoadingNames((p) => {
            const next = { ...p };
            pathKeys.forEach((k) => (next[k] = true));
            return next;
          });

          try {
            const res = await fetchPrivilegeHRName(companyId, dept, desig);
            const employees = res?.data ?? res ?? privilegeHRName ?? [];
            const options = (employees || []).map((person) => ({
              value: person._id ?? person.employeeId ?? person.officialEmail,
              label: person.fullName ?? person.name ?? person.employeeId,
              email: person.officialEmail ?? person.email,
              icon: <PersonIcon style={{ fontSize: 14 }} />,
            }));

            setNameOptions((p) => {
              const next = { ...p };
              pathKeys.forEach((k) => (next[k] = options));
              return next;
            });
          } catch (error) {
            console.error(`Error fetching names for ${desig}:`, error);
          } finally {
            setLoadingNames((p) => {
              const next = { ...p };
              pathKeys.forEach((k) => (next[k] = false));
              return next;
            });
          }
        }
      }
    };

    loadDesignations().then(loadNames);
  }, [isEditing]);

  const departmentOptions = (departmentDrop || []).map((dept) => ({
    value: dept,
    label: dept,
    icon: <BusinessIcon style={{ fontSize: 14 }} />,
  }));

  const updateFieldAtPath = (path, field, value) => {
    setData((prev) => {
      const next = deepClone(prev);
      const node =
        path.length === 0 ? next.admin : getNodeAtPath(next.admin, path);
      if (node) node[field] = value;
      return next;
    });
  };

  const addEmployee = (path) => {
    const next = deepClone(data);
    const parentNode =
      path.length === 0 ? next.admin : getNodeAtPath(next.admin, path);
    if (!parentNode) return;

    if (!parentNode.employees) parentNode.employees = [];

    const inheritedDept = parentNode.department || "";

    const newNode = {
      name: "",
      designation: "",
      department: inheritedDept,
      managers: [],
      employees: [],
    };

    parentNode.employees.push(newNode);

    const newIndex = parentNode.employees.length - 1;
    const newPath = [...path, { type: "employees", index: newIndex }];
    const newPathKey = serializePath(newPath);

    setData(next);

    if (inheritedDept) {
      console.log(
        "Adding employee - fetching designations for",
        inheritedDept,
        newPathKey
      );
      fetchAndSetDesignations(inheritedDept, [newPathKey]);
    }
  };

  const fetchAndSetDesignations = async (department, pathKeys = []) => {
    if (!department) return;

    pendingDesignationsRef.current[department] = [
      ...(pendingDesignationsRef.current[department] || []),
      ...pathKeys,
    ];

    setLoadingDesignations((p) => {
      const out = { ...p };
      pathKeys.forEach((k) => (out[k] = true));
      return out;
    });

    try {
      console.log(
        "[component] fetchAndSetDesignations called for",
        department,
        "keys:",
        pathKeys
      );

      const res = await fetchDesignation(department);
      console.log("fetchDesignation returned", res);

      const designations =
        (res && res.length ? res : designationByDept || []) || [];

      const options = designations.map((d) => ({
        value: d,
        label: d,
        icon: <WorkIcon style={{ fontSize: 14 }} />,
      }));

      // const pending = pendingDesignationsRef.current[department] || [];

      // setDesignationOptions((p) => {
      //   const out = { ...p };
      //   pending.forEach((k) => (out[k] = options));
      //   return out;
      // });

      // console.log(
      //   "[component] setDesignationOptions for dept",
      //   department,
      //   "keys:",
      //   pending,
      //   "options:",
      //   options
      // );
      setDesignationOptions((p) => {
        const out = { ...p };
        pathKeys.forEach((k) => (out[k] = options));
        return out;
      });

      delete pendingDesignationsRef.current[department];
    } catch (e) {
      console.error("fetchAndSetDesignations error:", e);
    } finally {
      setLoadingDesignations((p) => {
        const out = { ...p };
        pathKeys.forEach((k) => (out[k] = false));
        return out;
      });
    }
  };

  useEffect(() => {
    const deptList = Object.keys(pendingDesignationsRef.current);
    if (!deptList.length) return;

    deptList.forEach((dept) => {
      const pending = pendingDesignationsRef.current[dept];
      if (!pending || pending.length === 0) return;

      const designations = designationByDept || [];
      const options = designations.map((d) => ({
        value: d,
        label: d,
        icon: <WorkIcon style={{ fontSize: 14 }} />,
      }));

      setDesignationOptions((p) => {
        const out = { ...p };
        pending.forEach((k) => (out[k] = options));
        return out;
      });

      console.log(
        "[component useEffect] applied designationByDept fallback for",
        dept,
        "keys:",
        pending
      );

      delete pendingDesignationsRef.current[dept];
    });
  }, [designationByDept]);

  const propagateDepartmentToDescendants = (
    nextSnapshot,
    parentPath,
    department
  ) => {
    if (!department) return [];
    const parentNode =
      parentPath.length === 0
        ? nextSnapshot.admin
        : getNodeAtPath(nextSnapshot.admin, parentPath);
    if (!parentNode) return [];
    const collectedPathKeys = [];

    const walk = (node, curPath) => {
      if (!node) return;
      if (!node.department) node.department = department;
      collectedPathKeys.push(serializePath(curPath));
      (node.managers || []).forEach((m, idx) =>
        walk(m, [...curPath, { type: "managers", index: idx }])
      );
      (node.employees || []).forEach((e, idx) =>
        walk(e, [...curPath, { type: "employees", index: idx }])
      );
    };

    (parentNode.managers || []).forEach((m, idx) =>
      walk(m, [...parentPath, { type: "managers", index: idx }])
    );
    (parentNode.employees || []).forEach((e, idx) =>
      walk(e, [...parentPath, { type: "employees", index: idx }])
    );

    return collectedPathKeys;
  };

  const handleDepartmentChange = async (path, selectedOption, isManager) => {
    const department = selectedOption?.value || "";
    const pathKey = serializePath(path);

    const next = deepClone(data);
    const node =
      path.length === 0 ? next.admin : getNodeAtPath(next.admin, path);
    if (!node) return;

    const prevDepartment = node.department || "";
    node.department = department;
    node.designation = "";
    node.name = "";

    let childPathKeys = [];

    if (department) {
      // On change, force descendants to adopt new department and clear designation/name
      childPathKeys = setDeptInDescendants(next, path, department);
    } else {
      // If cleared, also clear department/designation/name for entire subtree
      childPathKeys = clearDeptInDescendants(next, path);
    }

    setDesignationOptions((p) => ({ ...p, [pathKey]: [] }));
    setNameOptions((p) => ({ ...p, [pathKey]: [] }));
    childPathKeys.forEach((k) => {
      setDesignationOptions((p) => ({ ...p, [k]: [] }));
      setNameOptions((p) => ({ ...p, [k]: [] }));
    });

    setData(next);

    const allKeys = [pathKey, ...childPathKeys];
    if (department) {
      await fetchAndSetDesignations(department, allKeys);
    }
  };

  const fetchNamesForDesignation = async (department, designation, pathKey) => {
    if (!companyId || !department || !designation) return;

    setLoadingNames((p) => ({ ...p, [pathKey]: true }));
    setNameOptions((p) => ({ ...p, [pathKey]: [] }));

    try {
      const res = await fetchPrivilegeHRName(
        companyId,
        department,
        designation
      );
      console.log("[component] fetchPrivilegeHRName returned:", res);

      const employees = res?.data ?? res ?? privilegeHRName ?? [];
      const options = (employees || []).map((person) => ({
        value: person._id ?? person.employeeId ?? person.officialEmail,
        label: person.fullName ?? person.name ?? person.employeeId,
        email: person.officialEmail ?? person.email,
        icon: <PersonIcon style={{ fontSize: 14 }} />,
      }));

      setNameOptions((p) => ({ ...p, [pathKey]: options }));
      console.log("[component] setNameOptions for", pathKey, options);
    } catch (error) {
      console.error("Error fetching names:", error);
    } finally {
      setLoadingNames((p) => ({ ...p, [pathKey]: false }));
    }
  };

  console.log("nameOptions", nameOptions, "privilegeHRName", privilegeHRName);
  const findNearestDepartmentUp = (path) => {
    let cur = path.slice();
    while (cur.length >= 0) {
      const node =
        cur.length === 0 ? data.admin : getNodeAtPath(data.admin, cur);
      if (node?.department) return node.department;
      if (cur.length === 0) break;
      cur = cur.slice(0, -1);
    }
    return "";
  };

  const handleDesignationChange = async (path, selectedOption, isManager) => {
    const designation = selectedOption?.value || "";
    updateFieldAtPath(path, "designation", designation);
    updateFieldAtPath(path, "name", "");
    const pathKey = serializePath(path);
    setNameOptions((p) => ({ ...p, [pathKey]: [] }));

    const department =
      getNodeAtPath(data.admin, path)?.department ||
      findNearestDepartmentUp(path) ||
      "";

    if (department && designation) {
      await fetchNamesForDesignation(department, designation, pathKey);
    }
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: 32,
      height: 32,
      fontSize: 12,
      border: state.isFocused ? "2px solid #3b82f6" : "1px solid #d1d5db",
      borderRadius: 8,
      boxShadow: state.isFocused ? "0 0 0 3px rgba(59,130,246,.1)" : "none",
      transition: "all .15s ease",
    }),
    valueContainer: (p) => ({ ...p, height: 32, padding: "0 8px" }),
    input: (p) => ({ ...p, margin: 0, fontSize: 12 }),
    indicatorsContainer: (p) => ({ ...p, height: 32 }),
    option: (p, state) => ({
      ...p,
      fontSize: 12,
      padding: "8px 12px",
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      display: "flex",
      alignItems: "center",
      gap: 8,
    }),
    singleValue: (p) => ({
      ...p,
      display: "flex",
      alignItems: "center",
      gap: 6,
    }),
    menuPortal: (base) => ({ ...base, zIndex: 99999 }),
  };

  const NodeCard = ({ node, path, level }) => {
    const pathKey = serializePath(path);
    const isCEO = level === 0;
    const isDepartment = level === 1;
    const isEmployee = level >= 2;
    const canDelete = !hasSubordinates(node);
    const displayTitle =
      node?.name ||
      (isDepartment ? node?.department || "Unassigned Dept" : "Unassigned");

    const stopMouseDown = (e) => e.stopPropagation();

    return (
      <motion.div
        className={`relative group p-3 rounded-xl border-2 bg-white shadow-sm`}
        style={{ minWidth: 180 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 280, damping: 20 }}
        onMouseDown={stopMouseDown}
      >
        <div className="flex justify-center mb-2">
          <div
            className={`p-2 rounded-full ${
              isCEO
                ? "bg-blue-100 text-blue-600"
                : isDepartment
                ? "bg-green-100 text-green-600"
                : "bg-purple-100 text-purple-600"
            }`}
          >
            {isCEO ? (
              <PersonIcon />
            ) : isDepartment ? (
              <BusinessIcon />
            ) : (
              <WorkIcon />
            )}
          </div>
        </div>

        <div className="text-center space-y-2">
          {!isEditing && (
            <>
              <h4 className="font-semibold text-gray-800 text-sm">
                {displayTitle}
              </h4>
              {!isCEO && (
                <p className="text-xs text-gray-600">
                  {isDepartment
                    ? node?.department || "No department"
                    : node?.designation || "No designation"}
                </p>
              )}
            </>
          )}

          {isEditing && (
            <>
              {isCEO && (
                <div className="space-y-2">
                  <input
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={node?.name || ""}
                    onChange={(e) =>
                      updateFieldAtPath(path, "name", e.target.value)
                    }
                    placeholder="CEO Name"
                  />
                  <input
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={node?.designation || ""}
                    onChange={(e) =>
                      updateFieldAtPath(path, "designation", e.target.value)
                    }
                    placeholder="CEO Designation"
                  />
                </div>
              )}

              {isDepartment && (
                <Select
                  options={getAvailableDepartments(path)}
                  value={
                    getAvailableDepartments(path).find(
                      (o) => o.value === node?.department
                    ) || null
                  }
                  onChange={(opt) => handleDepartmentChange(path, opt, true)}
                  styles={customSelectStyles}
                  placeholder={
                    <div className="flex items-center gap-2 text-gray-500">
                      <BusinessIcon style={{ fontSize: 14 }} />
                      Select Department
                    </div>
                  }
                  isClearable
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  closeMenuOnScroll={false}
                />
              )}

              {isEmployee && (
                <div className="space-y-2">
                  <Select
                    options={designationOptions[pathKey] || []}
                    value={
                      (designationOptions[pathKey] || []).find(
                        (o) => o.value === node?.designation
                      ) || null
                    }
                    onChange={(opt) =>
                      handleDesignationChange(path, opt, false)
                    }
                    styles={customSelectStyles}
                    placeholder={
                      loadingDesignations[pathKey] ? (
                        "Loading..."
                      ) : (
                        <div className="flex items-center gap-2 text-gray-500">
                          <WorkIcon style={{ fontSize: 14 }} />
                          Select Designation
                        </div>
                      )
                    }
                    // isClearable
                    isLoading={!!loadingDesignations[pathKey]}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    closeMenuOnScroll={false}
                  />

                  <Select
                    options={nameOptions[pathKey] || []}
                    value={
                      (nameOptions[pathKey] || []).find(
                        (o) =>
                          o.label === node?.name || o.value === node?.employeeId
                      ) || null
                    }
                    onChange={(opt) => {
                      updateFieldAtPath(path, "name", opt?.label || "");
                      updateFieldAtPath(path, "employeeId", opt?.value || "");
                    }}
                    styles={customSelectStyles}
                    placeholder={
                      loadingNames[pathKey] ? (
                        "Loading..."
                      ) : (
                        <div className="flex items-center gap-2 text-gray-500">
                          <PersonIcon style={{ fontSize: 14 }} />
                          {!node?.designation
                            ? "Select Employee (disabled)"
                            : (nameOptions[pathKey] || []).length === 0
                            ? "Vacant"
                            : "Select Employee"}
                        </div>
                      )
                    }
                    isLoading={!!loadingNames[pathKey]}
                    // isClearable
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    closeMenuOnScroll={false}
                    isDisabled={!node?.designation}
                    noOptionsMessage={() => "Vacant"}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {isEditing && (
          <div className="absolute top-1 right-1 flex items-center gap-1">
            {!isCEO && canDelete && (
              <motion.button
                onClick={() => {
                  setData((prev) => {
                    const next = deepClone(prev);
                    const { parent, last } = (() => {
                      if (!path.length) return { parent: null, last: null };
                      const parentPath = path.slice(0, -1);
                      const lastSeg = path[path.length - 1];
                      const parentNode =
                        parentPath.length === 0
                          ? next.admin
                          : getNodeAtPath(next.admin, parentPath);
                      return { parent: parentNode, last: lastSeg };
                    })();
                    if (!parent || !last) return prev;
                    const target = parent[last.type][last.index];
                    if (hasSubordinates(target)) return prev; // guard
                    parent[last.type].splice(last.index, 1);
                    return next;
                  });
                }}
                className="bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                title="Delete"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <DeleteIcon style={{ fontSize: 14 }} />
              </motion.button>
            )}

            {isCEO && (
              <motion.button
                onClick={() => addManager(path)}
                className="bg-blue-500 text-white rounded-full px-2 py-1 shadow-md hover:bg-blue-600 text-xs"
              >
                + Dept
              </motion.button>
            )}

            {isDepartment && (
              <motion.button
                onClick={() => addEmployee(path)}
                className="bg-green-500 text-white rounded-full px-2 py-1 shadow-md hover:bg-green-600 text-xs"
              >
                + Emp
              </motion.button>
            )}

            {isEmployee && (
              <motion.button
                onClick={() => addEmployee(path)}
                className="bg-purple-500 text-white rounded-full px-2 py-1 shadow-md hover:bg-purple-600 text-xs"
              >
                + Sub
              </motion.button>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  const getAvailableDepartments = (currentPath) => {
    if (!departmentOptions) return [];

    const selectedDepartments = new Set();

    const collectDepartments = (node) => {
      if (node.department) {
        // ignore empty strings explicitly
        if (
          typeof node.department === "string" &&
          node.department.trim().length > 0
        ) {
          selectedDepartments.add(node.department);
        }
      }
      if (node.managers) node.managers.forEach((m) => collectDepartments(m));
      if (node.employees) node.employees.forEach((e) => collectDepartments(e));
    };

    collectDepartments(data.admin);

    const node =
      currentPath.length === 0
        ? data.admin
        : getNodeAtPath(data.admin, currentPath);
    if (node?.department) selectedDepartments.delete(node.department);

    return departmentOptions.filter(
      (option) => !selectedDepartments.has(option.value)
    );
  };

  const addManager = (path) => {
    const next = deepClone(data);
    const newNode = {
      name: "",
      designation: "",
      department: "",
      employees: [],
      managers: [],
    };

    if (path.length === 0) {
      next.admin.managers = next.admin.managers || [];
      next.admin.managers.push(newNode);
    } else {
      let current = next.admin;
      for (let i = 0; i < path.length; i++) {
        if (i === path.length - 1) {
          current.managers = current.managers || [];
          current.managers[path[i].index] =
            current.managers[path[i].index] || {};
          if (!current.managers[path[i].index].managers) {
            current.managers[path[i].index].managers = [];
          }
          current.managers[path[i].index].managers.push(newNode);
        } else {
          current = current.managers[path[i].index];
        }
      }
    }

    setData(next);
  };

  const renderBranch = (node, path = [], level = 0) => {
    const children = [];

    if (Array.isArray(node.managers) && node.managers.length > 0) {
      node.managers.forEach((child, index) => {
        children.push(
          <TreeNode
            key={`${serializePath(path)}-m${index}`}
            label={
              <NodeCard
                node={child}
                path={[...path, { type: "managers", index }]}
                level={level + 1}
              />
            }
          >
            {renderBranch(
              child,
              [...path, { type: "managers", index }],
              level + 1
            )}
          </TreeNode>
        );
      });
    }

    if (Array.isArray(node.employees) && node.employees.length > 0) {
      node.employees.forEach((child, index) => {
        children.push(
          <TreeNode
            key={`${serializePath(path)}-e${index}`}
            label={
              <NodeCard
                node={child}
                path={[...path, { type: "employees", index }]}
                level={level + 1}
              />
            }
          >
            {renderBranch(
              child,
              [...path, { type: "employees", index }],
              level + 1
            )}
          </TreeNode>
        );
      });
    }

    return children;
  };

  // const handleHierarchyEdit = () => setIsEditing(true);
  const handleHierarchyEdit = () => {
    fetchedNamesRef.current = new Set();
    setIsEditing(true);
  };

  const handleHierarchySave = async () => {
    try {
      setIsSaving(true);
      const payload = {
        admin: serializeNode(data?.admin || {}),
      };
      console.log("payload", payload);
      await updateHirarchy(payload);
      await fetchHierarchy();
      setIsEditing(false);
    } catch (e) {
      console.error("Failed to update hierarchy:", e);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    );

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex justify-center items-center w-screen h-screen"
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative p-6 min-w-0 w-[95vw] h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex items-center space-x-3">
              <BusinessIcon className="text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Organizational Hierarchy
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              {isEditing ? (
                <motion.button
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-medium shadow-md hover:shadow-lg transition-all"
                  onClick={handleHierarchySave}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </motion.button>
              ) : (
                <motion.button
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  onClick={handleHierarchyEdit}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Edit Hierarchy"
                >
                  <BorderColorIcon />
                </motion.button>
              )}

              <motion.button
                onClick={onClose}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Close"
              >
                <IoMdClose size={24} />
              </motion.button>
            </div>
          </div>

          {(isSaving || loading) && !data?.admin ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="flex items-center gap-3 text-gray-600">
                <svg
                  className="animate-spin h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>
                  {isSaving ? "Saving hierarchy..." : "Loading hierarchy..."}
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl overflow-visible">
                <Tree
                  lineWidth={"2px"}
                  lineColor={"#e5e7eb"}
                  lineBorderRadius={"8px"}
                  label={<NodeCard node={data?.admin} path={[]} level={0} />}
                >
                  <AnimatePresence>
                    {data?.admin && renderBranch(data.admin, [], 0)}
                  </AnimatePresence>
                </Tree>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-center space-x-6 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-100 border-2 border-blue-200 rounded" />
                    <span className="text-gray-600">CEO/Admin Level</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-100 border-2 border-green-200 rounded" />
                    <span className="text-gray-600">Department Level</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-purple-100 border-2 border-purple-200 rounded" />
                    <span className="text-gray-600">Designation & Name</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrganizationalHierarchy;

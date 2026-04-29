import { useRecoilState } from "recoil";
import {
  coreHREmployeeDetailsAtom,
  coreHREmployeeListAtom,
  designationAtom,
  sendDeptDataChartAtom,
  serachEmpCoreHrAtom,
  createCoreHREmployeeAtom,
  allEmployeeIdAtomWithName,
} from "../../../state/coreHR/coreHRState";
import conf from "../../../config/index";
import { useState } from "react";
import useFetch from "../../useFetch";
import { toastState } from "../../../state/toastState";
import { toast } from "react-toastify";

const useCoreHR = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [searchEmpCoreHr, setSearchEmpCoreHr] =
    useRecoilState(serachEmpCoreHrAtom);
  const [designation, setDesignation] = useRecoilState(designationAtom);
  const [updateSearchEmp, setUpdateSearchEmp] = useRecoilState(toastState);
  const [sendDeptDataChart, setSendDeptDataChart] = useRecoilState(
    sendDeptDataChartAtom
  );
  const [coreHREmployeeList, setCoreHREmployeeList] = useRecoilState(
    coreHREmployeeListAtom
  );
  const [coreHREmployeeDetails, setCoreHREmployeeDetails] = useRecoilState(
    coreHREmployeeDetailsAtom
  );
  const [updateCoreHREmployee, setUpdateCoreHREmployee] =
    useRecoilState(toastState);
  const [createEmployeeCoreHR, setCreateEmployeeCoreHR] =
    useRecoilState(toastState);
  const [allEmployeeIdWithName, setAllEmployeeIdWithName] = useRecoilState(
    allEmployeeIdAtomWithName
  );

  const fetchSearchEmpCoreHR = async (filters) => {
    setLoading(true);
    try {
      if (!filters) {
        throw new Error("No filters provided");
      }
      const params = new URLSearchParams(filters).toString();
      const url = `${conf.apiBaseUrl}hrmEmployee/HrmEmployeeSearching?${params}`;

      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || "Failed to fetch data");
      }

      const data = await response.json();
      setLoading(false);
      setSearchEmpCoreHr(data);
      toast.success(data?.message);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating email template:", error);
      const errorMessage = error.message || "An unexpected error occurred";
      toast.error(errorMessage);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchDesignation = async () => {
    setLoading(true);
    try {
      fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}hrmEmployee/getDesignations`,
      }).then((res) => {
        if (res) {
          setDesignation(res);
          setLoading(false);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating email template:", error);
      setLoading(false);
    }
  };

  const updateSearchEmpCoreHR = async (id, data) => {
    setLoading(true);
    try {
      fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}hrmEmployee/HrmEmployeeUpdate/${id}`,
        data: data,
      }).then((res) => {
        if (res) {
          setUpdateSearchEmp(res?.update);
          toast.success(res?.message);
          setLoading(false);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating :", error);
      toast.error(error?.response?.data?.error);
      setLoading(false);
    }
  };

  const fetchDeptDataChart = async () => {
    setLoading(true);
    try {
      fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}dashboard/getDepartmentChart`,
      }).then((res) => {
        if (res) {
          // console.log("res", res);
          setSendDeptDataChart(res?.data);
          setLoading(false);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating email template:", error);
      setLoading(false);
    }
  };

  /**
   * Fetches the list of all employees from the API.
   *
   * @memberof useCoreHR
   * @returns {Promise<void>} Resolves when the API call is complete.
   * @example
   *
   * const { fetchCoreHREmployeeList } = useCoreHR();
   * fetchCoreHREmployeeList().then(() => console.log('Fetched employee list'));
   */
  const fetchCoreHREmployeeList = async (page, limit) => {
    setCoreHREmployeeList(null);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
        companyName: sessionStorage.getItem("companyName"),
      });
      fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}hrmEmployee/getHrmEmployeeList?${params}`,
      }).then((res) => {
        if (res) {
          setCoreHREmployeeList(res);
          setLoading(false);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating email template:", error);
      setLoading(false);
    }
  };

  const fetchCoreHREmployeeById = async (id) => {
    setCoreHREmployeeDetails(null);
    setLoading(true);
    try {
      fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}hrmEmployee/getHrmEmployeeDetails/${id}`,
      }).then((res) => {
        if (res) {
          setCoreHREmployeeDetails(res);
          setLoading(false);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating email template:", error);
      setLoading(false);
    }
  };

  const updateCoreHREmployeeById = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}hrmEmployee/HrmCoreEmployeeUpdate/${id}`,
        data: data,
      });
      if (res) {
        setUpdateCoreHREmployee(res);
        fetchCoreHREmployeeList();
        toast.success(res?.message);
        setLoading(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating :", error);
      toast.error(error?.response?.data?.error);
      setLoading(false);
    }
  };

  const addEmployeeCoreHR = async (data) => {
    setLoading(true);
    try {
      fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}hrmEmployee/createEmployee`,
        data: data,
      })
        .then((res) => {
          if (res) {
            setCreateEmployeeCoreHR(res);
            setLoading(false);
            toast.success(res?.message);
          }
        })
        .catch((error) => {
          console.error("Error while creating employee:", error);
          toast.error(error?.response?.data?.error);
        });
    } catch (error) {
      console.error("Error while creating employee:", error);
      setLoading(false);
    }
  };

  const getAllEmployeeIdAndNameAccordingToDesignation = async (
    designation,
    department
  ) => {
    setAllEmployeeIdWithName(null);
    setLoading(true);

    try {
      const params = new URLSearchParams({ designation, department });

      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employees/getAllEmployeeIdAccordingToDesignation?${params}`,
      });

      if (res) {
        setAllEmployeeIdWithName(res);
      }
    } catch (error) {
      console.error("Error while fetching employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetSearchEmpCoreHr = () => {
    setSearchEmpCoreHr(null);
  };
  const resetEmployeeDetails = () => {
    setCoreHREmployeeDetails(null);
  };

  return {
    searchEmpCoreHr,
    fetchSearchEmpCoreHR,
    fetchDesignation,
    loading,
    errors,
    designation,
    updateSearchEmpCoreHR,
    updateSearchEmp,
    fetchDeptDataChart,
    sendDeptDataChart,
    fetchCoreHREmployeeList,
    coreHREmployeeList,
    coreHREmployeeDetails,
    fetchCoreHREmployeeById,
    updateCoreHREmployeeById,
    updateCoreHREmployee,
    addEmployeeCoreHR,
    createEmployeeCoreHR,
    resetSearchEmpCoreHr,

    getAllEmployeeIdAndNameAccordingToDesignation,
    allEmployeeIdWithName,
    resetEmployeeDetails,
  };
};

export default useCoreHR;

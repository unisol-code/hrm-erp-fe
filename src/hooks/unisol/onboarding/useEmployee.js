/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import conf from "../../../config/index";
import { toast } from "react-toastify";
// import {
//   AlertContentState,
//   AlertState,
//   toastState,
// } from "../../../state/toastState";
import {
  allEmployeeAtom,
  candidateDetailAtom,
  cityAtom,
  countryAtom,
  departmentDropAtom,
  designationByDeptAtom,
  employeeByDeptAtom,
  employeeByQueryAtom,
  employeeTypeDropAtom,
  onboardingManagerAtom,
  perCityAtom,
  perCountryAtom,
  perStateAtom,
  positionApplyDropAtom,
  stateAtom,
  updateEmployeeTaskAtom,
  payRollGradeAtom,
} from "../../../state/onBoarding/employeeState";
import useFetch from "../../useFetch";
import { useNavigate } from "react-router-dom";


const useEmployee = () => {
  const [fetchData] = useFetch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  // const setAlertContent = useSetRecoilState(AlertContentState);
  // const setAlertState = useSetRecoilState(AlertState);
  const [employee, setEmployee] = useRecoilState(allEmployeeAtom);
  // const [addEmployee, setAddEmployee] = useRecoilState(toastState);
  const [employeeDetails, setEmployeeDetails] =
    useRecoilState(candidateDetailAtom);
  const [departmentDrop, setDepartmentDrop] =
    useRecoilState(departmentDropAtom);
  const [positionApplyDrop, setPositionApplyDrop] = useRecoilState(
    positionApplyDropAtom
  );
  const [employeeTypeDrop, setEmployeeTypeDrop] =
    useRecoilState(employeeTypeDropAtom);
  const [employeeByDept, setEmployeeByDept] =
    useRecoilState(employeeByDeptAtom);
  const [designationByDept, setDesignationByDept] = useRecoilState(
    designationByDeptAtom
  );
  const [employeeByQuery, setEmployeeByQuery] =
    useRecoilState(employeeByQueryAtom);
  const [updateEmployeeTask, setUpdateEmployeeTask] = useRecoilState(
    updateEmployeeTaskAtom
  );
  const [city, setCity] = useRecoilState(cityAtom);
  const [state, setState] = useRecoilState(stateAtom);
  const [country, setCountry] = useRecoilState(countryAtom);
  const [perCity, setPerCity] = useRecoilState(perCityAtom);
  const [perState, setPerState] = useRecoilState(perStateAtom);
  const [perCountry, setPerCountry] = useRecoilState(perCountryAtom);
  const [getOnboardingManager, setOnboardingManager] = useRecoilState(
    onboardingManagerAtom
  );
  const [payRollGrade, setPayRollGrade] = useRecoilState(payRollGradeAtom);

  // const createNewEmployee = async (data) => {
  //   setLoading(true);
  //   try {
  //     fetchData({
  //       method: "POST",
  //       url: `${conf.apiBaseUrl}employees/create`,
  //       data: data,
  //     }).then((res) => {
  //       if (res) {
  //         toast.success(res?.message);
  //         navigate("/onboarding_employee");
  //       } else {
  //         throw new Error(res?.message);
  //       }
  //     });
  //   } catch (error) {
  //     // eslint-disable-next-line no-console
  //     console.error("Error updating email template:", error);
  //     toast.error(error.response?.data?.error);
  //     setLoading(false);
  //   }
  // };
  const createNewEmployee = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}employees/create`,
        data: data,
      });

      if (res) {
        // Ensure response is successful
        toast.success(res?.message);
        navigate("/onboarding_employee");
      } else {
        throw new Error(res?.message);
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  // const fetchCityStateCountry = async (pincode) => {
  //   console.log("pincode type", pincode);
  //   if (!pincode) {
  //     setCity("");
  //     setState("");
  //     setCountry("");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const response = await fetch(
  //       `https://api.postalpincode.in/pincode/${pincode}`
  //     ); // Fix the fetch call
  //     const data = await response.json(); // Parse JSON response

  //     if (data && data.length > 0 && data[0].PostOffice) {
  //       const postOfficeList = data[0].PostOffice;

  //       if (postOfficeList.length > 0) {
  //         const firstPostOffice = postOfficeList[0];
  //         setCity(firstPostOffice.District);
  //         setState(firstPostOffice.State);
  //         setCountry(firstPostOffice.Country);
  //       }
  //     }
  //   } catch (error) {
  //     // eslint-disable-next-line no-console
  //     console.error("Error fetching  :", error);
  //     setLoading(false);
  //   }
  // };
  // api.js (or wherever your API function is)
  const fetchCityStateCountry = async (pincode) => {
    if (!pincode) {
      return null;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data && data.length > 0 && data[0].PostOffice) {
        const firstPostOffice = data[0].PostOffice[0];
        return {
          city: firstPostOffice.District,
          state: firstPostOffice.State,
          country: firstPostOffice.Country,
        };
      }
    } catch (error) {
      console.error("Error fetching:", error);
      return null;
    }
    finally {
      setLoading(false)
    }
  };
  const fetchPermanentCityStateCountry = async (pincode) => {
    if (!pincode) {
      return null;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data && data.length > 0 && data[0].PostOffice) {
        const firstPostOffice = data[0].PostOffice[0];
        return {
          city: firstPostOffice.District,
          state: firstPostOffice.State,
          country: firstPostOffice.Country,
        };
      }
    } catch (error) {
      console.error("Error fetching:", error);
      return null;
    }
    finally {
      setLoading(false)
    }
  };
  // const fetchPermanentCityStateCountry = async (pincode) => {
  //   if (!pincode) {
  //     setPerCity("");
  //     setPerState("");
  //     setPerCountry("");
  //     return;
  //   }
  //   console.log("pincode type", pincode);
  //   setLoading(true);
  //   try {
  //     const response = await fetch(
  //       `https://api.postalpincode.in/pincode/${pincode}`
  //     ); // Fix the fetch call
  //     const data = await response.json(); // Parse JSON response

  //     if (data && data.length > 0 && data[0].PostOffice) {
  //       const postOfficeList = data[0].PostOffice;

  //       if (postOfficeList.length > 0) {
  //         const firstPostOffice = postOfficeList[0];
  //         setPerCity(firstPostOffice.District);
  //         setPerState(firstPostOffice.State);
  //         setPerCountry(firstPostOffice.Country);
  //       }
  //     }
  //   } catch (error) {
  //     // eslint-disable-next-line no-console
  //     console.error("Error fetching  :", error);
  //     setLoading(false);
  //   }
  // };

  const fetchAllEmployees = async (page, limit) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
      });
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employees?${params}`,
      }).then((res) => {
        if (res) {
          setEmployee(res?.data);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching  :", error);
    }
    finally {
      setLoading(false)
    }
  };

  const updateEmployeeTaskByID = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}employees/changedata/${id}`,
        data: data,
      });
      if (res && res.employee) {
        setUpdateEmployeeTask(res);
        setEmployeeByQuery({ employee: res.employee }); // Update state with fresh data
        toast.success(res?.message);
        return res.employee; // Return updated employee
      }
      return null;
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(error.response?.data?.error || "Failed to update task");
      return null;
    } finally {
      setLoading(false);
    }
  };
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        // url: `${conf.apiBaseUrl}employees/getDepartment`,
        url: `${conf.apiBaseUrl}employees/allDepartments`,
      }).then((res) => {
        if (res) {
          setDepartmentDrop(res?.departments);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching  :", error);
      setLoading(false);
    }
    finally {
      setLoading(false)
    }
  };

  const fetchDesignation = async (department) => {
    setDesignationByDept(null)
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employees/getAllDesignationsForDepartment?department=${department}`,
      })
      // console.log("[useEmployee] fetchDesignation API raw res:", res);
      if (res) {
        setDesignationByDept(res?.designations);
        setLoading(false);
        return res?.designations;
      }
      return [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching  :", error);
      setLoading(false);
    }
    finally {
      setLoading(false)
    }
  };
  // const fetchPayrollGrade = async (designation) => {
  //   setLoading(true);
  //   if (!designation) {
  //     console.log("No designation");
  //   }
  //   try {
  //     await fetchData({
  //       method: "GET",
  //       url: `${conf.apiBaseUrl}employees/getGradeAccordingToDesignation?designation=${designation}`,
  //     }).then((res) => {
  //       if (res) {
  //         setPayRollGrade(res?.grade);
  //       }
  //     });
  //   } catch (error) {
  //     // eslint-disable-next-line no-console
  //     console.error("Error fetching  :", error);
  //     setLoading(false);
  //   }
  // };
  const fetchPayrollGrade = async (designation, onSuccess, onError) => {
    setLoading(true);

    // Reset payrollGrade if designation is empty
    if (!designation) {
      onSuccess(null); // Call the callback with null to reset payrollGrade
      setLoading(false);
      return;
    }

    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employees/getGradeAccordingToDesignation?designation=${designation}`,
      }).then((res) => {
        if (res) {
          onSuccess(res?.grade); // Call the callback with the fetched grade
        }
      });
    } catch (error) {
      console.error("Error fetching:", error);
      onError(error); // Call the error callback if needed
    } finally {
      setLoading(false);
    }
  };
  const fetchEmployeeByDept = async (dept) => {
    setEmployeeByDept(null);
    setLoading(true);
    try {
      if (!dept) {
        throw new Error("No department provided");
      }
      // const params = new URLSearchParams(dept).toString();
      const url = `${conf.apiBaseUrl
        }employees/getCandidateNameByDepartment?department=${encodeURIComponent(
          dept
        )}`;

      const res = await fetchData({
        method:"GET",
        url
      });
      if(res){
      setEmployeeByDept(res);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching  :", error);
      setLoading(false);
    }
    finally {
      setLoading(false)
    }
  };

  const fetchPositionApplied = async () => {
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employees/positiontype`,
      }).then((res) => {
        if (res) {
          setPositionApplyDrop(res?.positiontypes);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching  :", error);
      setLoading(false);
    }
    finally {
      setLoading(false)
    }
  };

  const fetchEmployeeTypes = async () => {
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employees/employeeType`,
      }).then((res) => {
        if (res) {
          setEmployeeTypeDrop(res?.employeetype);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching  :", error);
      setLoading(false);
    }
    finally {
      setLoading(false)
    }
  };

  const fetchSearchEmployees = async (filters) => {
    setLoading(true);
    try {
      if (!filters) {
        throw new Error("No filters provided");
      }
      const params = new URLSearchParams(filters).toString();
      const url = `${conf.apiBaseUrl}employees/search?${params}`;

      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      // console.log("data fetchSearchEmployees", data);
      setEmployee(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching  :", error);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchCandidatebyQuery = async (filters) => {
    setEmployeeByQuery(null);
    setLoading(true);

    try {
      if (!filters) {
        throw new Error("No filters provided");
      }

      // console.log("Filters", filters);
      const params = new URLSearchParams(filters);
      // console.log("Params", params);

      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employees/viewcandidate?${params}`,
      });

      // console.log("res employee by query", res);

      if (res) {
        setEmployeeByQuery(res);
      }

      setLoading(false);
      return res || null; // ✅ RETURN the response properly
    } catch (error) {
      console.error("Error fetching:", error);
      setLoading(false);
      return null;
    }
  };


  const fetchEmployeeByID = async (id) => {
    setEmployeeDetails(null);
    setLoading(true);
    try {
      fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employees/profile/${id}`,
      }).then((res) => {
        // console.log("res employee by id", res);
        if (res) {
          setLoading(false);
          setEmployeeDetails(res?.result);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching email templates:", error);
      setLoading(false);
    }
  };

  const updateEmployeeDoc = async (id, data) => {
    setLoading(true);
    try {
      fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}employees/upload/${id}`,
        data: data,
      }).then((res) => {
        if (res) {
          toast.success(res?.message);
        } else {
          throw new Error(res?.message);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating email template:", error);
      toast.error(error.response?.data?.error);
      setLoading(false);
    }
  };

  const fetchOnboardingManager = async () => {
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employees/getOnboardingManager`,
      }).then((res) => {
        if (res) {
          setOnboardingManager(res?.data);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const resetEmployee = () => {
    setEmployeeDetails({});
  };
  const resetEmployeeByQuery = () => {
    setEmployeeByQuery(null);
  }

  return {
    createNewEmployee,
    fetchDesignation,
    fetchEmployeeByDept,
    designationByDept,
    employeeByDept,
    fetchCandidatebyQuery,
    employeeByQuery,
    updateEmployeeTask,
    // addEmployee,
    updateEmployeeTaskByID,
    employee,
    fetchAllEmployees,
    fetchEmployeeByID,
    fetchSearchEmployees,
    employeeDetails,
    loading,
    errors,
    resetEmployee,
    departmentDrop,
    fetchDepartments,
    fetchPositionApplied,
    positionApplyDrop,
    employeeTypeDrop,
    fetchPermanentCityStateCountry,
    perCity,
    perState,
    perCountry,
    fetchEmployeeTypes,
    fetchOnboardingManager,
    getOnboardingManager,
    updateEmployeeDoc,
    fetchCityStateCountry,
    city,
    state,
    country,
    fetchPayrollGrade,
    payRollGrade,
    resetEmployeeByQuery
  };
};

export default useEmployee;

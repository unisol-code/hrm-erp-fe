import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import {
  getEmployeePaySlipListAtom,
  getPayslipGenerationStatusListAtom,
  employeePaySlipDetailsAtom,
} from "../../../state/payrollManagment/payrollState";

const usePayrollManagement = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);

  const [employeePaySlipList, setEmployeePaySlipList] = useRecoilState(
    getEmployeePaySlipListAtom
  );
  const [payslipGenerationStatusList, setPayslipGenerationStatusList] =
    useRecoilState(getPayslipGenerationStatusListAtom);

  const [employeePaySlipDetails, setEmployeePaySlipDetails] = useRecoilState(
    employeePaySlipDetailsAtom
  );

  /* Fetch all Employee Payslip List */
  const FetchEmployeePaySlipList = async (page, limit, search = "") => {
    setEmployeePaySlipList(null);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit,
        employeeName: search,
      });

      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}hrmEmployee/getEmployeePayslipList?${params}`,
      });

      if (res) setEmployeePaySlipList(res);
    } catch (error) {
      console.error("Error while fetching employee payslip list", error);
    } finally {
      setLoading(false);
    }
  };

  /* Fetch all Employee Payslip Generation Status List */
  const FetchPayslipGenerationStatusList = async (page, limit, search = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit,
        employeeName: search,
      });

      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}hrmEmployee/getPayslipGenerationStatus?${params}`,
      });

      if (res) setPayslipGenerationStatusList(res);
    } catch (error) {
      console.error("Error while fetching payslip generation status list", error);
    } finally {
      setLoading(false);
    }
  };

  /* Fetch specific Employee Payslip Details */
  const getEmployeePaySlipDetails = async (id, month, year) => {
    setEmployeePaySlipDetails(null)
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employees/getEmployeeSalaryDetailsByEmployeeId/${id}?month=${month}&year=${year}`,
      });

      if (res) setEmployeePaySlipDetails(res?.data);
    } catch (error) {
      console.error("Error while fetching employee payslip details", error);
    } finally {
      setLoading(false);
    }
  };

  /* Reset Employee Payslip Details */
  const resetEmployeePaySlipDetails = () => {
    setEmployeePaySlipDetails(null);
  };

  return {
    loading,
    FetchEmployeePaySlipList,
    FetchPayslipGenerationStatusList,
    getEmployeePaySlipDetails,
    resetEmployeePaySlipDetails,
    employeePaySlipList,
    payslipGenerationStatusList,
    employeePaySlipDetails,
  };
};

export default usePayrollManagement;

import React, { useState } from "react";
import {
  companyDepartmentAtom,
  hRPrivilegeListAtom,
  privilegeCompanyAtom,
  privilegeDetailsAtom,
  privilegeHRNamesAtom,
} from "../../../state/homeDashboard/hRPrivilegeState";
import useFetch from "../../useFetch";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import { toast } from "react-toastify";

const useHRPrivilege = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [privilegeCompany, setPrivilegeCompany] =
    useRecoilState(privilegeCompanyAtom);
  const [companyDepartment, setCompanyDepartment] = useRecoilState(
    companyDepartmentAtom
  );
  const [privilegeHRName, setPrivilegeHRName] =
    useRecoilState(privilegeHRNamesAtom);
  const [hRPrivilegeList, setHRPrivilegeList] =
    useRecoilState(hRPrivilegeListAtom);
  const [privilegeDetails, setPrivilegeDetails] =
    useRecoilState(privilegeDetailsAtom);

  const fetchPrivilegeCompany = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}company/getAllCompaniesExcludeHome`,
      });
      if (res) {
        setPrivilegeCompany(res);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompaniesDept = async (companyId) => {
    setLoading(true);
    try {
      const param = new URLSearchParams({
        companyId,
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}department/getAllDepartmentsById?${param}`,
      });
      if (res) {
        setCompanyDepartment(res?.departmentNames);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrivilegeHRName = async (companyId, department, designation) => {
    setLoading(true);
    try {
      const param = new URLSearchParams({
        companyId,
        department,
        designation,
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employees/getEmployeeAccordingToDepartmentDesignationAndCompanyId?${param}`,
      });
      if (res) {
        setPrivilegeHRName(res?.employees);
        return res?.employees;
      }
      return [];
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const assignHRPrivilege = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}hrPrivilege/createHrPrivilege`,
        data,
      });
      if (res) {
        toast.success(res?.message);
        setPrivilegeCompany([]);
        setCompanyDepartment([]);
        setPrivilegeHRName([]);
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchHRPrivilegeList = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}hrPrivilege/getAllHrPrivileges`,
      });
      if (res) {
        setHRPrivilegeList(res?.data);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrivilegeById = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}hrPrivilege/getHrPrivilegeById/${id}`,
      });
      if (res) {
        setPrivilegeDetails(res?.data);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const updateHRPrivilege = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}hrPrivilege/updateHrPrivilege/${id}`,
        data,
      });
      if (res) {
        toast.success(res?.message);
        setPrivilegeCompany([]);
        setCompanyDepartment([]);
        setPrivilegeHRName([]);
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const resetPrivilegeById = () => setPrivilegeDetails(null);

  // const resetPrivilegeCompany = () => setPrivilegeCompany([])
  const deleteHRPrivilege = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "DELETE",
        url: `${conf.apiBaseUrl}hrPrivilege/deleteHrPrivilege/${id}`,
      });
      if (res) {
        toast.success(res?.message);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchPrivilegeCompany,
    privilegeCompany,
    loading,
    fetchCompaniesDept,
    companyDepartment,
    fetchPrivilegeHRName,
    privilegeHRName,
    assignHRPrivilege,
    fetchHRPrivilegeList,
    hRPrivilegeList,
    fetchPrivilegeById,
    privilegeDetails,
    resetPrivilegeById,
    updateHRPrivilege,
    deleteHRPrivilege,
  };
};

export default useHRPrivilege;

import React, { useState } from 'react'
import useFetch from "../../useFetch";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import { employeeLoginDetailsAtom, enviroSolutionEmployeeLoginAtom, igniteSphereEmployeeLoginAtom, perCompanyEmployeeLoginAtom, surgisolEmployeeLoginAtom, unisolEmployeeLoginAtom } from '../../../state/homeDashboard/employeeLoginState';
import { toast } from "react-toastify";

const useEmployeeLogin = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState("");
    const [unisolEmployeeLogin, setUnisolEmployeeLogin] = useRecoilState(unisolEmployeeLoginAtom);
    const [surgisolEmployeeLogin, setSurgisolEmployeeLogin] = useRecoilState(surgisolEmployeeLoginAtom);
    const [igniteSphereEmployeeLogin, setIgniteSphereEmployeeLogin] = useRecoilState(igniteSphereEmployeeLoginAtom);
    const [enviroSolutionEmployeeLogin, setEnviroSolutionEmployeeLogin] = useRecoilState(enviroSolutionEmployeeLoginAtom);
    const [perCompanyEmployeeLogin, setPerCompanyEmployeeLogin] = useRecoilState(perCompanyEmployeeLoginAtom);
    const [employeeLoginDetails, setEmployeeLoginDetails] = useRecoilState(employeeLoginDetailsAtom);

    const fetchUnisolEmployeeLogin = async () => {
        setLoading(true);
        try {
            const response = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}home/getUnisolEmployeeLoginCredentials`,
            });
            if (response) {
                setUnisolEmployeeLogin(response);
            }
        } catch (error) {
            console.error("Error fetching employee login:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSurgisolEmployeeLogin = async () => {
        setLoading(true);
        try {
            const response = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}home/getSurgisolEmployeeLoginCredentials`,
            });
            if (response) {
                setSurgisolEmployeeLogin(response);
            }
        } catch (error) {
            console.error("Error fetching employee login:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchIgniteSphereEmployeeLogin = async () => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}home/getIgniteSphereEmployeeLoginCredentials`,
            });
            if (res) {
                setIgniteSphereEmployeeLogin(res);
            }
        } catch (error) {
            console.error("Error fetching employee login:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEnviroSolutionEmployeeLogin = async () => {
        setLoading(true);
        try {
            const response = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}home/getEnviroSolutionEmployeeLoginCredentials`,
            });
            if (response) {
                setEnviroSolutionEmployeeLogin(response);
            }
        } catch (error) {
            console.error("Error fetching employee login:", error);
        } finally {
            setLoading(false);
        }
    };

    // all company employee logins
    const fetchPerCompanyEmployeeLogin = async (companyName, page, limit) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                companyName: companyName,
                page: page,
                limit: limit,
            });
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}home/getAllEmployeeLoginCredentials?${params}`,
            });
            if (res) {
                setPerCompanyEmployeeLogin(res);
            }
        } catch (error) {
            console.error("Error fetching employee login:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchEmployeeLoginDetailById = async (id, companyName) => {
        // setEmployeeLoginDetails(null);
        setLoading(true);
        try {
            const params = new URLSearchParams({
                companyName: companyName,
            });
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}home/getEmployeeById/${id}?${params}`,
            });
            if (res) {
                setEmployeeLoginDetails(res);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching employee login:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const updateEmployeeLoginDetail = async (id, companyName, data) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                companyName: companyName,
            });
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}home/updateEmployeeById/${id}?${params}`,
                data: data,
            });
            if (res) {
                toast.success(res?.message);
            }
        } catch (error) {
            console.error("Error updating employee login:", error);
            toast.error(error?.response?.data?.error);
        } finally {
            setLoading(false);
        }
    }

    const resetPerCompanyEmployeeLogin = () => {
        setPerCompanyEmployeeLogin([])
    }

    const resetEmployeeLoginDetails = () => {
        setEmployeeLoginDetails(null);
    }

    return {
        fetchUnisolEmployeeLogin, loading, errors, unisolEmployeeLogin, surgisolEmployeeLogin, igniteSphereEmployeeLogin, enviroSolutionEmployeeLogin,
        perCompanyEmployeeLogin, resetPerCompanyEmployeeLogin, resetEmployeeLoginDetails, fetchEmployeeLoginDetailById, employeeLoginDetails, 
        fetchSurgisolEmployeeLogin, fetchIgniteSphereEmployeeLogin, fetchEnviroSolutionEmployeeLogin, fetchPerCompanyEmployeeLogin, updateEmployeeLoginDetail
    };
}

export default useEmployeeLogin
import React, { useState } from 'react'
import useFetch from '../../useFetch';
import { useRecoilState } from 'recoil';
import conf from '../../../config';
import { toast } from 'react-toastify';
import { empInfoForTerminationAtom, empWiseTerminationListAtom, terminatedEmpByIdAtom, terminatedEmpsListAtom } from '../../../state/offboardingMangement/forEmpTerminateState';
import { confirmAlert } from '../../../utils/alertToast';
import Swal from 'sweetalert2';

const useEmpTermination = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [empInfoForTermination, setEmpInfoForTermination] = useRecoilState(empInfoForTerminationAtom);
    const [terminatedEmpById, setTerminatedEmpById] = useRecoilState(terminatedEmpByIdAtom);
    const [terminatedEmpsList, setTerminatedEmpsList] = useRecoilState(terminatedEmpsListAtom);
    const [empWiseTerminationList, setEmpWiseTerminationList] = useRecoilState(empWiseTerminationListAtom);

    const fetchEmpInfoForTermination = async (id) => {
        setEmpInfoForTermination(null);
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}hrTermination/getEmployeedata?employeeId=${id}`,
            });
            if (res) {
                setEmpInfoForTermination(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error while fetching Employee Info for Termination:", error);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    };

    const fetchTerminatedEmpsList = async ({ page, limit, debouncedSearch, role, department, designation }) => {
        setTerminatedEmpsList([]);
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit, role });
            if (debouncedSearch) params.append("search", debouncedSearch);
            if (department) params.append("department", department);
            if (designation) params.append("designation", designation);

            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}hrTermination/getAllTerminationRequests?${params}`,
            });
            if (res) {
                setTerminatedEmpsList(res);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error while fetching terminated employees list:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmpWiseTerminationList = async ({ page, limit, role, employeeId, id }) => {
        setEmpWiseTerminationList(null);
        setLoading(true);
        try {
            const empId = employeeId ?? id;
            const params = new URLSearchParams({ page, limit, role, employeeId: empId });
            console.log("employeeId", empId);
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}hrTermination/getEmoplyeeTerminations?${params}`,
            });
            if (res) {
                setEmpWiseTerminationList(res);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error while fetching terminated employees list:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const terminateEmployee = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}hrTermination/createTerminationRequest`,
                data: data
            });
            if (res) {
                toast.success(res?.message);
                setLoading(false);
                return res;
            }
        } catch (error) {
            console.log("Error while terminating employee:", error);
            toast.error(error?.response?.data?.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchTerminatedEmpById = async ({id, role}) => {
        setTerminatedEmpById(null);
        setLoading(true);
        try {
            const params = new URLSearchParams({ role });
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}hrTermination/getTerminationById/${id}?${params}`,
            });
            if (res) {
                setTerminatedEmpById(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error while fetching terminated employee by id:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const updateTerminatedEmployee = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}hrTermination/updateterminationRequestbyId/${id}`,
                data: data
            });
            if (res) {
                toast.success(res?.message);
                setLoading(false);
                return res;
            }
        } catch (error) {
            console.log("Error while updating terminated employee:", error);
            toast.error(error?.response?.data?.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const deleteTerminatedEmployee = async (id) => {
        const confirm = await confirmAlert(
            "Are you sure you want to delete this terminating employee?"
        );
        if (!confirm) return;
        setLoading(true);
        if (confirm.isConfirmed) {
            try {
                const res = await fetchData({
                    method: "DELETE",
                    url: `${conf.apiBaseUrl}hrTermination/deleteTerminationRequest/${id}`,
                });
                if (res) {
                    Swal.fire({
                        title: "Deleted!",
                        text: res?.message,
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    setLoading(false);
                    return true;
                }
            } catch (error) {
                console.log("Error while deleting terminated employee:", error);
                toast.error(error?.response?.data?.message);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }
    };

    const approveOrRejectTermination = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}termination/processTermination/${id}`,
                data: data
            });
            if (res) {
                toast.success(res?.message);
                setLoading(false);
                return res;
            }
        } catch (error) {
            console.log(`Error while ${action} termination:`, error);
            toast.error(error?.response?.data?.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return {
        empInfoForTermination,
        fetchEmpInfoForTermination,
        loading,
        terminateEmployee,
        deleteTerminatedEmployee,
        fetchTerminatedEmpById,
        terminatedEmpById,
        updateTerminatedEmployee,
        fetchTerminatedEmpsList,
        terminatedEmpsList,
        fetchEmpWiseTerminationList,
        empWiseTerminationList,
        approveOrRejectTermination
    }
}

export default useEmpTermination
import React, { useState } from 'react'
import useFetch from '../../useFetch';
import { useRecoilState } from 'recoil';
import conf from '../../../config';
import { toast } from 'react-toastify';
import { forAdminEmpResignRequestListAtom, particularEmpResignReqListAtom, empResignReqDetailToAdminAtom } from "../../../state/offboardingMangement/forAdminResign";
const useEmpResignRequest = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [forAdminEmpResignRequestList, setForAdminEmpResignRequestList] = useRecoilState(forAdminEmpResignRequestListAtom);
    const [particularEmpResignReqList, setparticularEmpResignReqList] = useRecoilState(particularEmpResignReqListAtom);
    const [empResignReqDetailToAdmin, SetempResignReqDetailToAdmin] = useRecoilState(empResignReqDetailToAdminAtom);


    const fetchEmpResignReqListToAdmin = async (page, limit, debouncedSearch, role) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("page", page);
            params.append("limit", limit);
            params.append("role", role);
            if (debouncedSearch) params.append("search", debouncedSearch);
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}hrResignation/getEmployeesWithResignations?${params}`,
            });
            if (res) {
                setForAdminEmpResignRequestList(res);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error while fetching Reward Program list:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
    const fetchParticularEmpResignReqList = async (employeeId, page, limit, debouncedSearch, role, status) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ employeeId, page, limit, role });
            if (debouncedSearch) params.append("search", debouncedSearch);
            if (status) params.append("status", status);
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}hrResignation/getEmployeeResignations?${params}`,
            });
            if (res) {
                setparticularEmpResignReqList(res);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error while fetching Perticular Employee Resignation Request list:", error);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    };

    const fetchEmpResignReqDetailToAdmin = async (id, role) => {
        SetempResignReqDetailToAdmin(null);
        setLoading(true);
        try {
            const params = new URLSearchParams({ role });
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}hrResignation/getresignationsbyid/${id}?${params}`,
            });
            if (res) {
                SetempResignReqDetailToAdmin(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error while fetching Reward Program list:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }


    };
    const approveOrRejectResignRequest = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}hrResignation/updateResignationStatus/${id}`,
                data: data,
            });
            if (res) {
                toast.success(res?.message);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error while approving/rejecting Resignation  request:", error);
            toast.error(error?.response?.data?.message);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    };
    return {
        fetchEmpResignReqListToAdmin, loading, forAdminEmpResignRequestList, particularEmpResignReqList, fetchParticularEmpResignReqList,
        empResignReqDetailToAdmin, fetchEmpResignReqDetailToAdmin, approveOrRejectResignRequest

    }

}
export default useEmpResignRequest
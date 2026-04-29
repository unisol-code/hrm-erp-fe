import React, { useState } from 'react'
import useFetch from '../../useFetch';
import { useRecoilState } from 'recoil';
import conf from '../../../config';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { confirmAlert } from '../../../utils/alertToast';
import { empLoanReqDetailToAdminAtom, forAdminEmpLoanRequestListAtom, perticularEmpLoanReqListAtom } from '../../../state/loanRequest/forAminLoanRequest';

const useAdminLoanRequest = () => {
    const [fetchData] = useFetch();  
    const [loading, setLoading] = useState(false);
    const [forAdminEmpLoanRequestList, setForAdminEmpLoanRequestList] = useRecoilState(forAdminEmpLoanRequestListAtom);
    const [perticularEmpLoanReqList, setPerticularEmpLoanReqList] = useRecoilState(perticularEmpLoanReqListAtom);
    const [empLoanReqDetailToAdmin, setEmpLoanReqDetailToAdmin] = useRecoilState(empLoanReqDetailToAdminAtom);

    const fetchEmpLoanReqListToAdmin = async (page, limit, debouncedSearch, role) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("page", page);
            params.append("limit", limit);
            params.append("role", role);
            if (debouncedSearch) params.append("search", debouncedSearch);
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}hrLoan/getEmployeesWithLoanRequests?${params}`,
            });
            if (res) {
                setForAdminEmpLoanRequestList(res);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error while fetching Reward Program list:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchPerticularEmpLoanReqList = async (employeeId, page, limit, debouncedSearch, role, status) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ employeeId, page, limit, role });
            if (debouncedSearch) params.append("search", debouncedSearch);
            if (status) params.append("status", status);
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}hrLoan/getEmployeeLoanRequests?${params}`,
            });
            if (res) {
                setPerticularEmpLoanReqList(res);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error while fetching Perticular Employee Loan Request list:", error);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    };

    const fetchEmpLoanReqDetailToAdmin = async (id, role) => {
        setEmpLoanReqDetailToAdmin(null);
        setLoading(true);
        try {
            const params = new URLSearchParams({ role });
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}hrLoan/getLoanRequestById/${id}?${params}`,
            });
            if (res) {
                setEmpLoanReqDetailToAdmin(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error while fetching Reward Program list:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const approveOrRejectLoanRequest = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}hrLoan/approveLoanRequest/${id}`,
                data: data,
            });
            if (res) {
                toast.success(res?.message);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error while approving/rejecting loan request:", error);
            toast.error(error?.response?.data?.message);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    };

    const approveOrRejectNilLoanRequest = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}hrLoan/processLoanRequestForNillAmount/${id}`,
                data: data,
            });
            if (res) {
                toast.success(res?.message);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error while approving/rejecting nil loan amount request:", error);
            toast.error(error?.response?.data?.message);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    };

    return {
        fetchEmpLoanReqListToAdmin, loading, forAdminEmpLoanRequestList, perticularEmpLoanReqList,
        fetchPerticularEmpLoanReqList, empLoanReqDetailToAdmin, fetchEmpLoanReqDetailToAdmin, approveOrRejectLoanRequest,
        approveOrRejectNilLoanRequest
    };
}

export default useAdminLoanRequest
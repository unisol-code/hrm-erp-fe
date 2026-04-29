import React, { useState } from 'react'
import useFetch from '../../useFetch';
import { useRecoilState } from 'recoil';
import conf from '../../../config';
import { inactiveEmpDetailsDetailsAtom, inActiveEmpListAtom } from '../../../state/offboardingMangement/inactiveEmpState';

const useExEmpDB = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [inActiveEmpList, setInActiveEmpList] = useRecoilState(inActiveEmpListAtom);
    const [inactiveEmpDetails, setInactiveEmpDetails] = useRecoilState(inactiveEmpDetailsDetailsAtom);

    const fetchInactiveEmpDB = async ({ page, limit, debouncedSearch, department, designation }) => {
        setInActiveEmpList([]);
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page,
                limit
            });
            if (debouncedSearch) params.append("employeeName", debouncedSearch);
            if (department) params.append("department", department);
            if (designation) params.append("designation", designation);

            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}employees/getInActiveEmployeesList?${params}`
            });
            if (res) {
                setInActiveEmpList(res);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error while fetching terminated employees list:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const  fetchInactiveEmpDetails = async(id) => {
        setInactiveEmpDetails(null);
        setLoading(false);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}employees/getInActiveEmployeeDetails/${id}`
            });
            if (res) {
                setInactiveEmpDetails(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error while fetching terminated employees list:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    } 

    return { loading, inActiveEmpList, fetchInactiveEmpDB, fetchInactiveEmpDetails, inactiveEmpDetails }
}

export default useExEmpDB
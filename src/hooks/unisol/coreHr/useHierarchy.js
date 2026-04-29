import React from 'react'
import { toast } from "react-toastify";
import { useRecoilState } from 'recoil';
import conf from '../../../config/index';
import { useState } from 'react';
import useFetch from '../../useFetch';
import { hierarchyAtom } from '../../../state/coreHR/hierarchyState';

const useHierarchy = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(true);
    const [hierarchy, setHierarchy] = useRecoilState(hierarchyAtom);

    const fetchHierarchy = async () => {
        setLoading(true);
        try {
            const response = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}hierarchy/getHierarchy`
            });
            if (response) {
                setHierarchy(response?.data);
                setLoading(false);
            }
        } catch (error) {
            // toast.error("Failed to fetch hierarchy");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const updateHirarchy = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}hierarchy/upsertHierarchy`,
                data: data
            });
            if (res) {
                toast.success(res?.message);
                setHierarchy(res);

            }
        } catch (error) {
            toast.error(error?.response?.data?.error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    return { loading, hierarchy, fetchHierarchy, updateHirarchy };
}

export default useHierarchy
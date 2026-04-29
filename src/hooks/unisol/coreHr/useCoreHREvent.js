import { useRecoilState } from 'recoil';
import conf from '../../../config/index';
import { useState } from 'react';
import useFetch from '../../useFetch';
import {  toastState } from '../../../state/toastState';
import { getEventByIdAtom, getEventListAtom } from '../../../state/coreHR/coreHRState';
import { toast } from "react-toastify";

const useCoreHREvent = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState("");
    const [addEvent, setAddEvent] = useRecoilState(toastState);
    const [getEventList, setGetEventList] = useRecoilState(getEventListAtom);
    const [getEventById, setGetEventById] = useState(getEventByIdAtom);
    const [modifyEvent, setModifyEvent] = useRecoilState(toastState);

    const createEvent = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}event/createEvent`,
                data: data
            });
            if (res) {
                setAddEvent(res);
                toast.success(res?.message);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Error updating email template:", error);
            toast.error(error?.response?.data?.error);
            setLoading(false);
        }
    };

    const updateEvent = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}event/updateEvent/${id}`,
                data: data
            });
            if (res) {
                setModifyEvent(res);
                toast.success(res?.message);
                fetchEventList();
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Error updating email template:", error);
            toast.error(error?.response?.data?.error);
            setLoading(false);
        }
    };

    const fetchEventList = async () => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}event/getEvent`,
            });
            if (res) {
                setGetEventList(res);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Error updating email template:", error);
            setLoading(false);
        }
    };

    const fetchEventById = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}event/getEventById/${id}`,
            });
            if (res) {
                setGetEventById(res);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Error updating email template:", error);
            setLoading(false);
        }
    };

    const resetEventById = () => {
        setGetEventById(null);
    };

    return {
        createEvent, loading, errors, addEvent, getEventList, fetchEventList, getEventById,
        fetchEventById, updateEvent, modifyEvent, resetEventById
    }
}

export default useCoreHREvent
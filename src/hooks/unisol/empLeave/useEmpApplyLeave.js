import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import {
    applyLeaveAtom, leaveTypesAtom,
    userForLeaveApplyAtom,
    totalLeavesAtom, leavePendingAtom,
    leaveTakenAtom
} from '../../../state/empLeave/useEmpApplyLeave'
import { toast } from 'react-toastify';

const useEmpApplyLeave = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(true);
    const [leave, setLeave] = useRecoilState(applyLeaveAtom);
    const [leaveType, setLeaveType] = useRecoilState(leaveTypesAtom);
    const [userForApply, setUserForApply] = useRecoilState(userForLeaveApplyAtom);
    const [leavesTotal, setLeavesTotal] = useRecoilState(totalLeavesAtom);
    const [leavesPending, setLeavesPending] = useRecoilState(leavePendingAtom);
    const [leavesTaken, setLeavesTaken] = useRecoilState(leaveTakenAtom)

    const applyLeave = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}leave/applyLeave`,
                data: data,
            });

            if (res) {
                setLeave(res);
                toast.success(res?.message);
            }
        } catch (error) {
            console.error("Error Fetching :", error);
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const allLeaveTypes = async (empId) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}leave/getLeaveTypes?employeeId=${empId}`
            })

            if (res) {
                setLeaveType(res);
            }
        }
        catch (error) {

            console.error("Fetching error during getting Leave Types :", error);
            setLoading(false);
        }
        finally {
            setLoading(false)
        }
    };

    const userForLeaveApply = async () => {
        setLoading(true);
        try {
            fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}leave/getUserForLeaveApply`
            }).then((res) => {
                if (res) {
                    setUserForApply(res);
                } else {
                    console.log("No data")
                }
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Fetching error during user for Leave apply :", error);
            setLoading(false);
        }
        finally {
            setLoading(false)
        }
    };

    const totalLeaves = async (id) => {
        setLoading(true);
        try {
            fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}leave/totalLeaves/${id}`
            }).then((res) => {
                if (res) {
                    setLeavesTotal(res);
                } else {
                    console.log("No data")
                }
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Fetching error during user for Leave apply :", error);
            setLoading(false);
        }
        finally {
            setLoading(false)
        }
    };

    const leavePending = async (id) => {
        setLoading(true);
        try {
            fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}leave/leavePending/${id}`
            }).then((res) => {
                if (res) {
                    setLeavesPending(res);
                } else {
                    console.log("No data")
                }
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Fetching error during user for Leave apply :", error);
            setLoading(false);
        }
        finally {
            setLoading(false)
        }
    };

    const leaveTaken = async (id) => {
        setLoading(true);
        try {
            fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}leave/leaveTaken/${id}`
            }).then((res) => {
                if (res) {
                    setLeavesTaken(res);
                } else {
                    console.log("No data")
                }
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Fetching error during user for Leave apply :", error);
            setLoading(false);
        }
        finally {
            setLoading(false)
        }
    };

    return {
        applyLeave, leave,
        allLeaveTypes, leaveType,
        userForLeaveApply, userForApply,
        totalLeaves, leavesTotal,
        leavePending, leavesPending,
        leaveTaken, leavesTaken, loading
    }
}

export default useEmpApplyLeave

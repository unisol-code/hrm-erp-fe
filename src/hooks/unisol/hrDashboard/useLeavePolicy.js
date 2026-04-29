import { useState } from "react";
import useFetch from "../../useFetch";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import { annualLeavePolicyAtom } from "../../../state/hrDashboard/leavePolicyState";

const useLeavePolicy = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [annualLeavePolicy, setAnnualLeavePolicy] = useRecoilState(annualLeavePolicyAtom);

    const fetchAnnualLeavePolicy = async () => {
        setLoading(true);
        try {
            await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}dashboard/getAnnualLeavePolicy`,
            }).then((res) => {
                console.log("res", res);
                if (res) {
                    setAnnualLeavePolicy(res?.policies);
                    console.log(res);
                }
            });
        } catch (error) {
            console.error("Error fetching  :", error);
            setLoading(false);
        }
        finally{
            setLoading(false)
        }
    };

    return {
        loading,
        fetchData,
        annualLeavePolicy,
        fetchAnnualLeavePolicy
    }
};

export default useLeavePolicy
import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../config";
import useFetch from "../useFetch";
import { employeeListWithIdState, employeeResultState } from "../../state/result/resultState";
import { trainingPolicyState } from "../../state/questionAnswer/questionAnswerState";


const useResult = () => {
    const [fetchData] = useFetch();
    const [contentLoading, setContentLoading] = useState(true);
    const [activeType, setActiveType] = useRecoilState(trainingPolicyState);
    const [employeeListWithId, setEmployeeListWithId] = useRecoilState(employeeListWithIdState);
    const [employeeResult, setEmployeeResult] = useRecoilState(employeeResultState)
    const fetchEmployeeListWithId = async () => {
        setContentLoading(true);
        try {
            const result = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}employees/getCandidatesFullName`
            })
            if (result) {
                setContentLoading(false);
                setEmployeeListWithId(result);
            }
        }
        catch (error) {
            console.log("Error while fetching employee list with id", error);
            setContentLoading(false)
        }

    }
    const fetchAllEmployeeLatestResult = async () => {
        setContentLoading(true);
        try {
            const url = activeType === "Policy" ? `${conf.apiBaseUrl}policyModule/getAllLatestEmployeeResults?for=${activeType}` : `${conf.apiBaseUrl}policyModule/getAllLatestEmployeeResults?for=${activeType}`;
            const result = await fetchData({
                method: "GET",
                url: url
            })
            if (result) {
                setContentLoading(false);
                setEmployeeResult(result);
            }
        }
        catch (error) {
            console.log("Error while fetching all employee latest result", error);
            setContentLoading(false);
        }

    }
    const fetchSpecificResult = async (empId, moduleId) => {
        setContentLoading(true);
        try {
            const url = activeType === "Policy" ? `${conf.apiBaseUrl}policyModule/getAllLatestEmployeeResults?for=${activeType}&employeeId=${empId}&policyModuleId=${moduleId}` : `${conf.apiBaseUrl}policyModule/getAllLatestEmployeeResults?for=${activeType}&employeeId=${empId}&trainingModuleId=${moduleId}`;
            const result = await fetchData({
                method: "GET",
                url: url
            })
            if (result) {
                setContentLoading(false);
                setEmployeeResult(result);
            }
        }
        catch (error) {
            console.log("Error while fetching specific employee result", error);
            setContentLoading(false);
        }


    }
    const resetEmployeeResult = () =>{
        setEmployeeResult([]);
    }
    return { contentLoading, fetchEmployeeListWithId, employeeListWithId, fetchAllEmployeeLatestResult, employeeResult, fetchSpecificResult, resetEmployeeResult }
}

export default useResult
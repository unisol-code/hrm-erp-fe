import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../config";
import useFetch from "../useFetch";
import { getQATitlesListState, getQuestionDetailsState, getSpecificQuestionListState, getTrainingorPolicyTitleState, trainingPolicyState } from "../../state/questionAnswer/questionAnswerState";
import { toast } from "react-toastify";
import { method } from "lodash";
const useQuestionAnswer = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(true);
    const [questionsTitlesList, setQuestionsTitleList] = useRecoilState(getQATitlesListState);
    const [viewQuestions, setViewQuestions] = useRecoilState(getSpecificQuestionListState);
    const [viewQuestionDetails, setViewQuestionDetails] = useRecoilState(getQuestionDetailsState);
    const [activeType, setActiveType] = useRecoilState(trainingPolicyState);
    const [titles, setTitles] = useRecoilState(getTrainingorPolicyTitleState);
    const fetchQATitlesList = async (activeType, page, limit, searchTerm) => {
        setLoading(true);
        setQuestionsTitleList({});
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}questionAndAnswers/getQATitles?for=${activeType}&limit=${limit}&page=${page}&search=${searchTerm}`
            });
            if (res) {
                setLoading(false);
                setQuestionsTitleList(res);
            }
        } catch (err) {
            // toast.error("Unable to fetch data");
            console.error(err);
            setLoading(false);
        }
    };
    // const fetchTrainingPolicyQuestionDetails = async (activeType, policyModuleId) => {

    const fetchTrainingPolicyQuestionDetails = async (activeType, id, limit, page) => {
        setLoading(true);
        setViewQuestions({});

        try {
            const url =
                activeType === "Policy"
                    ? `${conf.apiBaseUrl}questionAndAnswers/getAllQAsOfParticularTitle?for=Policy&policyModuleId=${id}&limit=${limit}&page=${page}`
                    : `${conf.apiBaseUrl}questionAndAnswers/getAllQAsOfParticularTitle?for=Training&trainingModuleId=${id}&page=${page}&limit=${limit}`;

            const res = await fetchData({
                method: "GET",
                url: url,
            });

            if (res) {
                setLoading(false);
                setViewQuestions(res);
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
            setLoading(false);
        }
    };
    const resetTrainingPolicyQuestionDetails = () => {
        setViewQuestions({});
    }
    const resetQATitlesList = () => {
        setQuestionsTitleList({})
    }
    const fetchQuestionDetails = async (qaId, questionId) => {
        setLoading(true);
        setViewQuestions({});
        try {
            const result = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}questionAndAnswers/question/${qaId}/${questionId}`
            })
            if (result) {
                setLoading(false);
                setViewQuestionDetails(result);
            }
        }
        catch (err) {
            console.log(err);
            setLoading(false);
        }
    }
    const resetQuestions = () => {
        setViewQuestions({});
    }
    const resetQuestionDetails = () => {
        setViewQuestionDetails({});
    }
    const fetchTrainingorPolicyTitleState = async () => {
        try {
            setLoading(true)
            const result = await fetchData({
                metod: "GET",
                url: `${conf.apiBaseUrl}questionAndAnswers/getModuleTitlesWithIdForDropDown?for=${activeType}`
            });
            if (result) {
                setLoading(false)
                setTitles(result);
            }
        }
        catch (err) {
            console.log(err);
            setLoading(false)
        }
    }
    const addTrainingOrPolicyQuestion = async (data) => {
        setLoading(true);
        try {
            const result = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}questionAndAnswers/addQAsForParticularTitle`,
                data
            })
            if (result) {
                setLoading(false);
                toast.success(result.message);
            }
        }
        catch (err) {
            toast.error("Unexecpted Error Occured");
            console.log(err);
            setLoading(false);
        }
    }
    const deleteQAForParticularTitle = async (qaId) => {
        setLoading(true);
        try {
            const result = await fetchData({
                method: "DELETE",
                url: `${conf.apiBaseUrl}questionAndAnswers/deleteAllQAsOfParticularTitle/${qaId}`
            });
            if (result) {
                setLoading(false);
                toast.success(result.message)
            }
        }
        catch (error) {
            toast.error("Unexecpted Error Occured");
            console.log(err);
            setLoading(false);
        }
    }
    const deleteParticularQuestion = async (qaId, questionId) => {
        setLoading(true);
        try {
            const result = await fetchData({
                method: "DELETE",
                url: `${conf.apiBaseUrl}questionAndAnswers/question/${qaId}/${questionId}`
            })
            if (result) {
                setLoading(false);
                toast.success(result.message);
            }
        }
        catch (error) {
            toast.error("Unexecpted Error Occured");
            console.log(err);
            setLoading(false);
        }
    }
    const updateParticularQuestion = async (qaId, questionId, data) => {
        setLoading(true);
        try {
            const result = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}questionAndAnswers/question/${qaId}/${questionId}`,
                data
            })
            if (result) {
                setLoading(false);
                toast.success(result.message);
            }
        }
        catch (error) {
            toast.error("Unexecpted Error Occured");
            console.log(err);
            setLoading(false);
        }

    }

    return {
        fetchQATitlesList, loading, questionsTitlesList, fetchTrainingPolicyQuestionDetails, viewQuestions, resetTrainingPolicyQuestionDetails, resetQATitlesList,
        fetchQuestionDetails, viewQuestionDetails, resetQuestions, resetQuestionDetails, fetchTrainingorPolicyTitleState, titles, addTrainingOrPolicyQuestion, deleteQAForParticularTitle,
        deleteParticularQuestion, updateParticularQuestion
    }

}
export default useQuestionAnswer;
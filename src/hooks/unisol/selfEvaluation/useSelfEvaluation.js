import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import {
  selfEvalPolicyListAtom,
  selfEvalPolicyDetailAtom,
  selfEvalTrainingListAtom,
  selfEvalTrainingDetailAtom,
  policyQuestionsAtom,
  trainingQuestionsAtom,
  policyQAPreviewAtom,
  testResultAtom,
  viewTestResultAtom,
  trainingQAPreviewAtom,
} from "../../../state/selfEvaluation/selfEvaluationState";
import { trainingPolicyState } from "../../../state/questionAnswer/questionAnswerState";
import { toast } from "react-toastify";

const useSelfEvaluation = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useRecoilState(trainingPolicyState);
  const [selfEvalPolicyList, setSelfEvalPolicyList] = useRecoilState(
    selfEvalPolicyListAtom
  );
  const [selfEvalPolicyById, setSelfEvalPolicyById] = useRecoilState(
    selfEvalPolicyDetailAtom
  );
  const [selfEvalTrainingList, setSelfEvalTrainingList] = useRecoilState(
    selfEvalTrainingListAtom
  );
  const [selfEvalTrainingById, setSelfEvalTrainingById] = useRecoilState(
    selfEvalTrainingDetailAtom
  );

  const [policyQuestions, setPolicyQuestions] =
    useRecoilState(policyQuestionsAtom);
  const [policyQAPreview, setPolicyQAPreview] =
    useRecoilState(policyQAPreviewAtom);
  const [trainingQuestions, setTrainingQuestions] = useRecoilState(
    trainingQuestionsAtom
  );
  const [testResult, setTestResult] = useRecoilState(testResultAtom);
  const [viewTestResult, setViewTestResult] =
    useRecoilState(viewTestResultAtom);
  const [trainingQAPreview, setTrainingQAPreview] = useRecoilState(
    trainingQAPreviewAtom
  );

  const fetchForPolicyList = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        grade: sessionStorage.getItem("payrollGrade"),
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeePolicyModuleRoute/getPolicyModuleTitlesForSelfEvaluation?${params}`,
      });
      if (res) {
        setSelfEvalPolicyList(res?.grades);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const fetchForPolicyById = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeePolicyModuleRoute/getPolicyModuleByIdForSelfEvaluation/${id}`,
      });
      if (res) {
        setSelfEvalPolicyById(res?.policyModule);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const fetchForTrainigList = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        grade: sessionStorage.getItem("payrollGrade"),
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeeTrainingModuleRoute/training-module-titles-for-self-evaluation?${params}`,
      });
      if (res) {
        setSelfEvalTrainingList(Array.isArray(res?.grades) ? res.grades : []);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const fetchForTrainingById = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeeTrainingModuleRoute/training-module-for-self-evaluation/${id}`,
      });
      if (res) {
        setSelfEvalTrainingById(res?.trainingModule);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const fetchPolicyQuestions = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeePolicyModuleRoute/getAllQAs/${id}`,
      });
      if (res) {
        setLoading(false);
        setPolicyQuestions(res);
      }
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const takePolicyTest = async (data, id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}employeePolicyModuleRoute/checkPolicyAnswers/${id}`,
        data,
      });
      if (res) {
        setLoading(false);
        toast.success(res?.message);
        setPolicyQAPreview(res);
        return res;
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      setLoading(false);
    }
  };

  const resetPolicyQAPreview = async () => {
    setPolicyQAPreview(null);
  }

  const fetchTrainingQuestions = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeeTrainingModuleRoute/getAllQas/${id}`,
      });
      if (res) {
        setLoading(false);
        setTrainingQuestions(res);
      }
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const takeTrainingTest = async (data, id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}employeeTrainingModuleRoute/checkTrainingModuleAnswers/${id}`,
        data,
      });
      if (res) {
        setLoading(false);
        toast.success(res?.message);
        setTrainingQAPreview(res);
        return res;
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      setLoading(false);
      return null;
    }
  };

  const resetTrainingQAPreview = async () => {
    setTrainingQAPreview(null)
  }

  const fetchTestResult = async (id, activeType) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        for: activeType,
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeePolicyModuleRoute/getEmployeeResults/${id}?${params}`,
      });
      if (res) {
        setLoading(false);
        setTestResult(res);
      }
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const fetchViewTestResult = async (id, employeeId) => {
    setLoading(true);
    try {
      // const params = new URLSearchParams({
      //   employeeId: employeeId,
      //   resultId: id,
      // });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeePolicyModuleRoute/getEmployeeResultById/${employeeId}/${id}`,
      });
      if (res) {
        setLoading(false);
        setViewTestResult(res);
      }
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };
  const resetViewTestResult = () => {
    setViewTestResult([]);
  }
  return {
    fetchForPolicyList,
    selfEvalPolicyList,
    fetchForPolicyById,
    selfEvalPolicyById,
    fetchForTrainigList,
    selfEvalTrainingList,
    fetchForTrainingById,
    selfEvalTrainingById, resetTrainingQAPreview,
    loading, fetchTrainingQuestions, takeTrainingTest, resetPolicyQAPreview,
    fetchPolicyQuestions, policyQuestions, takePolicyTest, policyQAPreview,
    trainingQuestions, trainingQAPreview,
    loading,
    fetchPolicyQuestions,
    policyQuestions,
    takePolicyTest,
    policyQAPreview,
    fetchTestResult,
    testResult,
    fetchViewTestResult,
    viewTestResult,
    loading,
    fetchTrainingQuestions,
    takeTrainingTest,
    trainingQuestions,
    trainingQAPreview,
    resetViewTestResult
  };
};

export default useSelfEvaluation;

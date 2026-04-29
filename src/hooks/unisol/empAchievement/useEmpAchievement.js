import React from "react";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import {
  empTrainingProjectListAtom,
  payrollGradeState,
  rewardProgramListAtom,
  vieweEpTrainingProjectListAtom,
  viewRewardProgramAtom,
} from "../../../state/empAchievement/useEmpAchievementState";

const useEmpAchievement = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = React.useState(false);
  const [payrollGrade, setPayrollGrade] = useRecoilState(payrollGradeState);
  const [rewardPrograms, setRewardPrograms] = useRecoilState(
    rewardProgramListAtom
  );
  const [viewRewardProgram, setViewRewardProgram] = useRecoilState(
    viewRewardProgramAtom
  );

  const [empTrainingList, setEmpTrainingList] = useRecoilState(
    empTrainingProjectListAtom
  );

  const [viewEmpTrainingList, setViewEmpTrainingList] = useRecoilState(
    vieweEpTrainingProjectListAtom
  );

  const fetchPayrollGrade = async () => {
    setLoading(true);

    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employees/payrollGrade`,
      });
      if (res) {
        setLoading(false);
        console.log(res);
        setPayrollGrade(res?.payrollGrade);
      }
    } catch (error) {
      console.error("Fetching Expense sales List :", error);
      setLoading(false);
    }
  };
  const fetchRewardPrograms = async (limit, page, grade) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit,
        page,
        grade,
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}rewardProgram/getAllRewardPrograms?${params}`,
      });
      if (res) {
        setLoading(false);
        setRewardPrograms(res);
      }
    } catch (err) {
      console.log("Error to fetch Reward Program List : ", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRewardProgramById = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}rewardProgram/getRewardProgramById/${id}`,
      });
      if (res);
      {
        setLoading(false);
        setViewRewardProgram(res);
      }
    } catch (err) {
      console.log("Error to fetch Reward Program by Id : ", err);
    } finally {
      setLoading(false);
    }
  };

  const createRewardProgram = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}rewardProgram/addRewardProgram`,
        data,
      });
      if (res) {
        setLoading(false);
        toast.success(res?.message);
      }
    } catch (error) {
      toast.error(error || "Unexecpted Error");
    } finally {
      setLoading(false);
    }
  };

  const updateRewardProgram = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}rewardProgram/updateRewardProgram/${id}`,
        data,
      });
      if (res) {
        setLoading(false);
        toast.success(res?.message);
      }
    } catch (error) {
      toast.error(res?.error || "Unexecpted Error");
    } finally {
      setLoading(false);
    }
  };

  const deleteRewardProgramData = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "DELETE",
        url: `${conf.apiBaseUrl}rewardProgram/deleteRewardProgram/${id}`,
      });
      if (res) {
        setLoading(false);
        toast.success(res?.message);
      }
    } catch (error) {
      toast.error(res?.error || "Unexecpted Error");
      console.error("Fetching Expense sales List :", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeTrainingList = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}training/employeeTrainingList`,
      });
      if (res) {
        setEmpTrainingList(res);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error while fetching Employee Training List:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeTrainingListById = async (userid) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}training/employeeTrainingMedia/${userid}`,
      });
      if (res) {
        setViewEmpTrainingList(res);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error while fetching Employee Training List:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    payrollGrade,
    fetchPayrollGrade,
    loading,
    rewardPrograms,
    fetchRewardPrograms,
    viewRewardProgram,
    fetchRewardProgramById,
    createRewardProgram,
    updateRewardProgram,
    deleteRewardProgramData,
    fetchEmployeeTrainingList,
    empTrainingList,
    fetchEmployeeTrainingListById,
    viewEmpTrainingList,
  };
};

export default useEmpAchievement;

import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import { toast } from "react-toastify";

import {
  allQuestionAnswersAtom,
  ratingOverviewAtom,
  selfAppraisalAtom,
  leadershipAppraisalYearAtom,
  submittedLeadershipAppraisaldataAtom,
  finalRatingAtom,
} from "../../../state/appraisal/appraisalState";
import { selfAppraisalDataAtom } from "../../../state/appraisal/appraisalState";
import { set } from "lodash";
import { confirmAlert } from "../../../utils/alertToast";
import Swal from "sweetalert2";

const useExpAppraisal = () => {
  const [questionAnswers, setQuestionAnswers] = useRecoilState(
    allQuestionAnswersAtom
  );
  const [ratingOverview, setRatingOverview] = useRecoilState(ratingOverviewAtom);
  const [leadershipAppraisalData, setLeadershipAppraisalData] = useRecoilState(selfAppraisalDataAtom);
  const [leadershipAppraisalDetails, setleadershipAppraisalDetails] = useRecoilState(selfAppraisalAtom);
  const [leadershipAppraisalYear, setLeadershipAppraisalYear] = useRecoilState(leadershipAppraisalYearAtom);
  const [submittedLeadershipAppraisaldata, setSubmittedLeadershipAppraisaldata] = useRecoilState(submittedLeadershipAppraisaldataAtom);

  const [finalRating, setFinalRating] = useRecoilState(finalRatingAtom);

  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(true);

  //All Questions Answers
  const getAllQuestionsAnswers = async () => {
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}questionAndAnswers/getAllQuestions`,
      }).then((res) => {
        setQuestionAnswers(res?.data);
        setLoading(false);
        // console.log("res:", res?.data);
      });
    } catch (error) {
      console.error("Error Fetching QuestionsAnswers:", error);
      setLoading(false);
    }
  };

  //Rating Overview
  const getRatingOverview = async (rating) => {
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}ratingScale/getRating?rating=${rating}`,
      }).then((res) => {
        setRatingOverview(res);
        setLoading(false);
        // console.log("res:", res);
      });
    } catch (error) {
      console.error("Error Fetching QuestionsAnswers:", error);
      setLoading(false);
    }
  };

  // Leadership Appraisal api start

  const getLeadershipAppraisalDetails = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeeLeadershipAppraisal/getAllLeadershipAppraisals`,
      })
      if (res) {
        setleadershipAppraisalDetails(res?.data);
        setLoading(false);
      };
    } catch (error) {
      console.error("Error Fetching Self Appraisal:", error);
    }
    finally {
      setLoading(false)
    }
  };

  const giveLeadershipAppraisalRating = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}employeeLeadershipAppraisal/giveSelfRating`,
        data: data,
      });
      if (res) {
        toast.success(res.message);
        setLoading(false);
        return true
      }
    } catch (error) {
      console.error("Error during adding leadership appraisal review:", error);
      toast.error(error.response?.data?.message);
      setLoading(false);
      return false
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadershipAppraisalbyid = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeeLeadershipAppraisal/getSubmittedLeadershipAppraisalById/${id}`,
      });

      if (res) {
        setLeadershipAppraisalData(res.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching Self Appraisal 1:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadershipAppraisalRating = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}employeeLeadershipAppraisal/updateSubmittedLeadershipAppraisal/${id}`,
        data: data,
      });
      if (res) {
        toast.success(res.message);
        setLoading(false);
        return true
      }
    } catch (error) {
      console.error("Error during updating leadership appraisal review:", error);
      toast.error(error.response?.data?.message);
      setLoading(false);
      return false
    } finally {
      setLoading(false);
    }
  }

  const fetchEmpLeadershipAppraisalYear = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeeLeadershipAppraisal/getYearsFromSubmittedLeadershipAppraisal`,
      });
      if (res) {
        setLeadershipAppraisalYear(res.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error Fetching Self Appraisal 1:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadershipAppraisalList = async ({ page, limit, year, cycle1, cycle2 }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit
      });
      if (year) params.append("year", year);
      if (cycle1) params.append("cycle1", cycle1);
      if (cycle2) params.append("cycle2", cycle2);

      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeeLeadershipAppraisal/getSubmittedLeadershipAppraisals?${params}`,
      });
      if (res) {
        setSubmittedLeadershipAppraisaldata(res);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error Fetching Self Appraisal 1:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const deleteLeadershipAppraisal = async (id) => {
    const confirm = confirmAlert(
      "Are you sure you want to delete this Leadership Appraisal?"
    );
    if (!confirm) return;
    setLoading(true);
    if (confirm.isConfirmed) {
      try {
        const res = await fetchData({
          method: "DELETE",
          url: `${conf.apiBaseUrl}employeeLeadershipAppraisal/deleteSubmittedLeadershipAppraisal/${id}`,
        });
        if (res) {
          Swal.fire({
            title: "Deleted!",
            text: res?.message,
            icon: "success",
            confirmButtonText: "OK",
          });
          setLoading(false);
          return true;
        }
      } catch (error) {
        console.error("Error during deleting leadership appraisal:", error);
        toast.error(error.response?.data?.message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  }

  const fetchFinalRating = async ({year, cycle1, cycle2}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (cycle1) params.append("cycle1", cycle1);
      if (cycle2) params.append("cycle2", cycle2);
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeeBusinessAppraisal/getFinalRatingOfEmployeeAppraisals?${params}`,
      });
      if (res) {      
        setFinalRating(res.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error Fetching Final Rating:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    leadershipAppraisalDetails,
    questionAnswers,
    getAllQuestionsAnswers,
    getLeadershipAppraisalDetails,
    ratingOverview,
    setRatingOverview,
    getRatingOverview,
    giveLeadershipAppraisalRating,
    fetchLeadershipAppraisalbyid,
    leadershipAppraisalData,
    loading, updateLeadershipAppraisalRating,
    fetchEmpLeadershipAppraisalYear, leadershipAppraisalYear,
    fetchLeadershipAppraisalList, submittedLeadershipAppraisaldata,
    deleteLeadershipAppraisal, fetchFinalRating, finalRating
  };
};

export default useExpAppraisal;

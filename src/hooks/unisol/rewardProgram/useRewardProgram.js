import React, { useState } from "react";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { rewardProgramListAtom } from "../../../state/rewardProgram/rewardProgramState";

const useRewardProgram = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [rewardList, setRewardList] = useRecoilState(rewardProgramListAtom);

  const fetchRewardProgramList = async () => {
    setLoading(false);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeeRewardProgram/my-rewards`,
      });
      if (res) {
        setLoading(false);
        setRewardList(res?.data);
      }
    } catch (error) {
      console.log("Error while fetching Reward Program list:", error);
    } finally {
      setLoading(false);
    }
  };
  return { loading, rewardList, fetchRewardProgramList };
};

export default useRewardProgram;

import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import { toast } from "react-toastify";
import { trainingListAtom } from "../../../state/empTraining/empTrainigState";

const useEmpTraining = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [trainingList, setTrainingList] = useRecoilState(trainingListAtom);

  const fetchTrainingList = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}training/getTraining`,
      });
      if (res) {
        setTrainingList(res?.data?.media);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editTraining = async (formData) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}training/editTraining`,
        data: formData,
      });
      if (res) {
        toast.success(res?.message);
        setLoading(false);
      }
      return res;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    trainingList,
    fetchTrainingList,
    editTraining,
  };
};

export default useEmpTraining;

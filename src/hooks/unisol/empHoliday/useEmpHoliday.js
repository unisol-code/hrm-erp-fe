import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import {
  allHolidayDetailAtom,
  createHolidayAtom,
} from "./../../../state/empHoliday/useEmpHolidayState";
import { toast } from "react-toastify";

const useEmpHoliday = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [allHoliday, setAllHoliday] = useRecoilState(allHolidayDetailAtom);
  const [holiday, setHoliday] = useRecoilState(createHolidayAtom);

  const allHolidayDetails = async (year) => {
    setLoading(true);
    setAllHoliday(null)
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}holiday/getAllHolidayDetails?year=${year}`,
      }).then((res) => {
        if (res) {
          setAllHoliday(res);
          setLoading(false);
        } else {
          console.log("No data");
          setLoading(false);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        "Fetching error during getting all Holiday Details :",
        error
      );
      setLoading(false);
    }
  };

  const createNewHoliday = async (data) => {
    setLoading(true);
    try {
      fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}holiday/createHoliday`,
        data: data,
      }).then((res) => {
        if (res) {
          // setHoliday(res);
          toast.success(res?.message);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error(
        "Fetching error during getting all Holiday Details :",
        error
      );
      setLoading(false);
    }
  };

  return { allHolidayDetails, createNewHoliday, allHoliday,loading };
};

export default useEmpHoliday;

import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import {
  allHolidayDetailAtom,
} from "./../../../state/empHoliday/useEmpHolidayState";
import { toast } from "react-toastify";
import { confirmAlert } from "../../../utils/alertToast";
import Swal from "sweetalert2";

const useEmpHoliday = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [allHoliday, setAllHoliday] = useRecoilState(allHolidayDetailAtom);

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

  const deleteHoliday = async (id) => {
    const confirm = await confirmAlert("Are you sure you want to delete this holiday?");
    if (!confirm) return;
    setLoading(true);
    if (confirm.isConfirmed) {
      try {
        const res = await fetchData({
          method: "DELETE",
          url: `${conf.apiBaseUrl}holiday/deleteHoliday/${id}`,
        })
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
        console.error(
          "Fetching error during getting all Holiday Details :",
          error
        );
        setLoading(false);
      }
    }
  }

  return { allHolidayDetails, createNewHoliday, allHoliday, loading, deleteHoliday };
};

export default useEmpHoliday;

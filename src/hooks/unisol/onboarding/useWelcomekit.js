import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import { toast } from "react-toastify";
import {
  allWelcomeKitsAtom,
  welcomeKitDetailsAtom,
} from "../../../state/onBoarding/welcomeKitState";
// ✅ FIX: import the `useNavigate` HOOK, not the `<Navigate>` COMPONENT
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { confirmAlert, confirmInactive } from "../../../utils/alertToast";

const useWelcomeKit = () => {
  const [welcomeKitList, setWelcomeKitList] =
    useRecoilState(allWelcomeKitsAtom);
  const [welcomeKitDetails, setWelcomeKitDetails] = useRecoilState(
    welcomeKitDetailsAtom
  );

  const [loading, setLoading] = useState(false);
  const [fetchData] = useFetch();

  // ✅ FIX: call the hook ONCE at the top level of this custom hook.
  // The returned `navigate` function is a plain function you can call
  // from anywhere inside this hook — including from async helpers.
  const navigate = useNavigate();

  // 🔹 GET all welcome kits
  const fetchWelcomeKits = async ({
    search = "",
    page = 1,
    limit = 10,
  } = {}) => {
    setWelcomeKitList(null);
    setLoading(true);

    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}welcomeKit/getAllWelcomeKits`,
        params: { search, page, limit },
      });

      if (res) {
        setWelcomeKitList(res);
      }
    } catch (err) {
      console.log("Error while fetching welcome kits", err);
      toast.error("Failed to fetch welcome kits");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 GET welcome kit by ID
  const fetchWelcomeKitById = async (welcomeKitId) => {
    setWelcomeKitDetails(null);
    setLoading(true);

    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}welcomeKit/getWelcomeKitById/${welcomeKitId}`,
      });

      if (res) {
        setWelcomeKitDetails(res);
      }
    } catch (err) {
      console.log("Error while fetching welcome kit details", err);
      toast.error("Failed to fetch welcome kit details");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 CREATE welcome kit
  const createWelcomeKit = async (data) => {
    setLoading(true);

    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}welcomeKit/createWelcomeKit`,
        data,
      });

      if (res?.success) {
        toast.success(res.message || "Welcome kit created successfully");
        // ✅ Now safe — `navigate` is the function returned by useNavigate()
        navigate("/onboardingmanegment/welcomeKit");
      }
    } catch (err) {
      console.log("Error while creating welcome kit", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while creating welcome kit";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 UPDATE welcome kit by ID
  const updateWelcomeKit = async (welcomeKitId, data) => {
    setLoading(true);

    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}welcomeKit/updateWelcomeKit/${welcomeKitId}`,
        data,
      });

      if (res?.success) {
        toast.success(res.message || "Welcome kit updated successfully");
        // ✅ Now safe — same fix
        navigate("/onboardingmanegment/welcomeKit");
      }
    } catch (err) {
      console.log("Error while updating welcome kit", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while updating welcome kit";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 DELETE welcome kit by ID
  const deleteWelcomeKit = async (welcomeKitId) => {
    const result = await confirmAlert(
      "Are you sure you want to delete this Welcome Kit?"
    );

    // ✅ Correct confirmation check
    if (!result.isConfirmed) return false;

    setLoading(true);

    try {
      const res = await fetchData({
        method: "DELETE",
        url: `${conf.apiBaseUrl}welcomeKit/deleteWelcomeKit/${welcomeKitId}`,
      });

      if (res?.success) {
        await Swal.fire({
          title: "Deleted!",
          text: res.message || "Welcome kit deleted successfully",
          icon: "success",
          confirmButtonText: "OK",
        });

        return true;
      }

      return false;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete welcome kit"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 CHANGE welcome kit active/inactive status with confirmation
  const changeWelcomeKitStatus = async (welcomeKitId, isActive) => {
    try {
      // ✅ Ask for confirmation if the item is currently active
      if (isActive) {
        const result = await confirmInactive(
          "Are you sure you want to make this Welcome Kit inactive?"
        );
        if (!result.isConfirmed) return false; // user canceled
      }

      setLoading(true);

      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}welcomeKit/changeWelcomeKitStatus/${welcomeKitId}`,
      });

      if (res?.success) {
        toast.success(res.message || "Status updated successfully");
        return true;
      }

      return false;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update status"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 FETCH welcome kit dropdown options
  const welcomekKitDropdownOptions = async (employeeId = null) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employees/getEmployeeWelcomeKits`,
        params: employeeId ? { employeeId } : {},
      });

      return res?.data || [];
    } catch (error) {
      console.error(
        "Error while fetching welcome kit dropdown options",
        error
      );
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch welcome kit dropdown options"
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    welcomeKitList,
    welcomeKitDetails,
    fetchWelcomeKits,
    fetchWelcomeKitById,
    createWelcomeKit,
    updateWelcomeKit,
    deleteWelcomeKit,
    changeWelcomeKitStatus,
    welcomekKitDropdownOptions,
  };
};

export default useWelcomeKit;
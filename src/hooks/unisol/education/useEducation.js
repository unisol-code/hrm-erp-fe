import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import {
  showEducationalDetailsAtom,
  saveEducationalDetailsAtom,
  deleteEducationalDetailsAtom,
  updateEducationalDetailsAtom,
  getEducationalDetailByIdAtom,
  programSelectionDropAtom,
  specializationsAtom,
} from "../../../state/education/educationState";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useEducation = () => {
  const navigate = useNavigate();
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);

  const [allEduDetails, setAllEduDetails] = useRecoilState(
    showEducationalDetailsAtom
  );
  const [newEduDetails, setNewEduDetails] = useRecoilState(
    saveEducationalDetailsAtom
  );
  const [deleteEduDetails, setDeleteEduDetails] = useRecoilState(
    deleteEducationalDetailsAtom
  );
  const [updateEduDetails, setUpdateEduDetails] = useRecoilState(
    updateEducationalDetailsAtom
  );
  // const [eduDetailsById, setEduDetailsById] = useRecoilState(
  //   getEducationalDetailByIdAtom
  // );

  const [employeeDetailsById, setEmployeeDetailsById] = useRecoilState(
    getEducationalDetailByIdAtom
  );

  const [programSelections, setProgramSelections] = useRecoilState(
    programSelectionDropAtom
  );
  const [specializations, setSpecializations] =
    useRecoilState(specializationsAtom);

  const getEducationalDetails = async (id) => {
    setLoading(true);
    try {
      fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}eductionDetails/showEducationDetails/${id}`,
      }).then((res) => {
        if (res) {
          setAllEduDetails(res);
        }
      });
    } catch (error) {
      console.error("Error while marking Attendence:", error);
      setLoading(false);
    }
  };

  const createEducationalDetails = async (data) => {
    console.log(data);
    setLoading(true);
    try {
      fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}eductionDetails/saveEducationDetails`,
        data: data,
      }).then((res) => {
        if (res) {
          setNewEduDetails(res);
        }
      });
    } catch (error) {
      console.error("Error while marking Attendence:", error);
      setLoading(false);
    }
  };

  const deleteEducationalDetails = async (id) => {
    setLoading(true);
    try {
      fetchData({
        method: "DELETE",
        url: `${conf.apiBaseUrl}eductionDetails/deleteEducationDetails/${id}`,
      }).then((res) => {
        if (res) {
          setDeleteEduDetails(res);
        }
      });
    } catch (error) {
      console.error("Error while marking Attendence:", error);
      setLoading(false);
    }
  };

  const updateEducationalDetails = async (id, data) => {
    setLoading(true);
    try {
      fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}eductionDetails/updateEducationDetails/${id}`,
        data: data,
      }).then((res) => {
        if (res) {
          setUpdateEduDetails(res);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error while marking Attendence:", error);
      setLoading(false);
    }
  };

  // const getEducationalDetailById = async (id) => {
  //   setLoading(true);
  //   try {
  //     fetchData({
  //       method: "GET",
  //       url: `${conf.apiBaseUrl}eductionDetails/document/${id}`,
  //     }).then((res) => {
  //       if (res) {
  //         setLoading(false);
  //         setEduDetailsById(res);
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error while marking Attendence:", error);
  //     setLoading(false);
  //   }
  // };
  const getEmployeeDetailsById = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}professional-details/get/${id}`,
      });
      if (res) {
        setLoading(false);
        setEmployeeDetailsById(res);
      }
    } catch (error) {
      console.error("Error while marking Attendence:", error);
      setLoading(false);
    }
  };

  const getProgramSelectionDrop = async () => {
    setLoading(true);
    try {
      fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}eductionDetails/programSelection`,
      }).then((res) => {
        if (res) {
          setProgramSelections(res);
        }
      });
    } catch (error) {
      console.error("Error while fetching Program Selection:", error);
      setLoading(false);
    }
  };

  const getSpecilization = async (program) => {
    setLoading(true);
    console.log("program", program);
    try {
      const params = new URLSearchParams({
        program: program,
      });
      fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}eductionDetails/specializations?${params}`,
      }).then((res) => {
        if (res) {
          setSpecializations(res);
        }
      });
    } catch (error) {
      console.error("Error while fetching specilization:", error);
      setLoading(false);
    }
  };

  const createProfessionalDetails = async (data, id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}professional-details/update/${id}`,
        data: data,
      });
      if (res) {
        toast(res.message, {
          position: "bottom-right",
          style: {
            fontWeight: "semibold",
            // background: "linear-gradient(90deg, #fff5f5 0%, #e0e7ff 100%)",
          },
        });
        navigate("/emp/educationalOverview");
      }
    } catch (error) {
      console.error("Error while creating Details:", error);
      setLoading(false);
    }
  };

  const resetEducationDetails = () => {
    setEduDetailsById(null);
  };

  return {
    loading,
    resetEducationDetails,
    getEducationalDetails,
    createEducationalDetails,
    deleteEducationalDetails,
    updateEducationalDetails,
    getEmployeeDetailsById,
    getProgramSelectionDrop,
    getSpecilization,
    createProfessionalDetails,
    employeeDetailsById,
    allEduDetails,
    newEduDetails,
    deleteEduDetails,
    updateEduDetails,
    programSelections,
    specializations,
  };
};
export default useEducation;

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import * as Yup from "yup";
import useDashboard from "../../../hooks/unisol/hrDashboard/useDashborad";
import { useFormik } from "formik";
import Select from "react-select";
import useEmpDashboard from "../../../hooks/unisol/empDashboard/empDashboard";

const validationSchema = Yup.object().shape({
  meeting: Yup.string().required("Title is required"),
  date: Yup.date().required("Date is required"),
  time: Yup.string().required("Time is required"),
  location: Yup.string().required("Location is required"),
  attendees: Yup.string().required("Attendes is required"),
  description: Yup.string().required("Description is required"),
  reminder: Yup.date().required("Joining Date is required"),
});

/* const attendees = [
  { value: "clown3.e@example.com", label: "clown3.e@example.com" },
  { value: "abc@gmail.com", label: "abc@gmail.com" },
  { value: "xyz@gmail.com", label: "abc@gmail.com" },
]; */

const ScheduleMeeting = () => {
  const companyId = sessionStorage.getItem("companyId");
  const [open, setOpen] = useState(false);
  const { createNewMeeting } = useDashboard();

  const [attendees, setAttendees] = useState([]);
  const { FetchAllParticipantList, allParticipantList } = useEmpDashboard();

  useEffect(() => {
    FetchAllParticipantList();
    const formattedAttendees = allParticipantList?.map((participant) => ({
      value: participant.officialEmailId,
      label: participant.employeeName,
    }));
    console.log("formattedAttendees : ", formattedAttendees);
    setAttendees(formattedAttendees);
    console.log("attendees : ", attendees);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    //closeDialog();
  };

  const handleSelectChange = (selectedOptions) => {
    // Update Formik state with selected options
    const values = selectedOptions.map((option) => option.value);
    formik.setFieldValue("participants", values);
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      date: "",
      time: "",
      location: "",
      participants: [],
      description: "",
      reminder: "",
    },
    // validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Submitting form...");
      createNewMeeting(values);
      /* try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("date", values.date);
        formData.append("time", values.time);
        formData.append("location", values.location);
        selectedAttendees?.forEach((participant, index) =>
          formData.append(`participants[${index}]`, participant.value)
        );
        formData.append("description", values.description);
        formData.append("reminder", values.reminder);
        formData.append("companyId", companyId);

        console.log("selectedAttendees :", selectedAttendees);
        for (const data of formData.entries()) {
          console.log(`${data[0]}: ${data[1]}`);
        }

        //createNewMeeting(formData);
      } catch (error) {
        console.error("Error during sign-in:", error);
      } */
    },
  });

  /* const [values, setValues] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    attendees: selectedAttendees,
    description: "",
    reminder: "",
  }); */

  return (
    <div>
      <div
        onClick={handleClickOpen}
        className=" cursor-pointer w-[25px] h-[25px] border border-gray-300 rounded-full flex justify-center items-center absolute top-3 right-[25%] hover:bg-blue-400"
      >
        <AddIcon color="primary" className="hover:text-white" />
      </div>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle className="flex items-center justify-between bg-[#CDEDF9] bg-dialog-header">
            Schedule New Meeting{" "}
            <CloseIcon
              className="cursor-pointer"
              onClick={handleClose}
            ></CloseIcon>
          </DialogTitle>
          <DialogContent>
            <div className="w-full flex flex-col py-4 gap-6">
              <div className="grid grid-cols-5 space-x-2">
                <h2 className="col-span-1">Meeting Title :</h2>
                <div className="col-span-4 pr-4">
                  <input
                    className="px-2 w-full h-[40px] rounded-lg border-2 border-gray-400"
                    type="text"
                    placeholder="Project Kickoff"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.meeting && formik.errors.meeting ? (
                    <div className="text-red-500">{formik.errors.meeting}</div>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-5 space-x-2">
                <h2 className="col-span-1">Date & Time :</h2>
                <div className="col-span-4 pr-4 flex gap-4">
                  <input
                    className="px-2 w-full h-[40px] rounded-lg border-2 border-gray-400"
                    type="date"
                    name="date"
                    value={formik.values.date}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.date && formik.errors.date ? (
                    <div className="text-red-500">{formik.errors.date}</div>
                  ) : null}
                  <input
                    className="px-2 w-full h-[40px] rounded-lg border-2 border-gray-400 "
                    type="time"
                    name="time"
                    value={formik.values.time}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.time && formik.errors.time ? (
                    <div className="text-red-500">{formik.errors.time}</div>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-5 space-x-2">
                <h2 className="col-span-1">Location :</h2>
                <div className="col-span-4 pr-4">
                  <input
                    className="px-2 w-full h-[40px] rounded-lg border-2 border-gray-400"
                    type="text"
                    placeholder="Conference Room A"
                    name="location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.location && formik.errors.location ? (
                    <div className="text-red-500">{formik.errors.location}</div>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-5 space-x-2">
                <h2 className="col-span-1">Attendees :</h2>
                <div className="col-span-4 pr-4">
                  <Select
                    className="h-[40px] px-2 placeholder-gray-400 col-span-6"
                    options={attendees}
                    value={attendees.filter((attendee) =>
                      formik.values.participants.includes(attendee.value)
                    )}
                    //value={formik.values.participants} // Bind to Formik's state
                    onChange={handleSelectChange} // Update Formik state
                    isMulti
                  />
                </div>
              </div>
              <div className="grid grid-cols-5 space-x-2">
                <h2 className="col-span-1">Description :</h2>
                <div className="col-span-4 pr-4">
                  <textarea
                    className="px-2 w-full h-[80px] rounded-lg border-2 border-gray-400"
                    type="text"
                    placeholder="Initial meeting for new project"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <div className="text-red-500">
                      {formik.errors.description}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-5 space-x-2">
                <h2 className="col-span-1">Reminder :</h2>
                <div className="col-span-4 pr-4">
                  <select
                    className="px-2 w-[50%] h-[40px] rounded-lg border-2 border-gray-400"
                    id=""
                    name="reminder"
                    value={formik.values.reminder}
                    onChange={formik.handleChange}
                  >
                    <option value="15">15 minutes before</option>
                    <option value="15">30 minutes before</option>
                    <option value="15">45 minutes before</option>
                  </select>
                  {formik.touched.reminder && formik.errors.reminder ? (
                    <div className="text-red-500">{formik.errors.reminder}</div>
                  ) : null}
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <div className="w-full flex justify-center gap-6 py-4 px-6">
              <button
                onClick={handleClose}
                type="button"
                className=" px-10 py-1 bg-[#FFD2D2] bg-opacity-55 border-2 border-[#9B2F2F] text-[#9B2F2F] rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className=" px-10 py-1 bg-[#1BA010] bg-opacity-25 border-2 border-[#338C1D] text-[#338C1D] rounded-md hover:bg-gray-100"
              >
                Save
              </button>
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default ScheduleMeeting;

import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import useEmpDashboard from "../../../../hooks/unisol/empDashboard/empDashboard";
import useDashboard from "../../../../hooks/unisol/hrDashboard/useDashborad";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { format } from "date-fns";
import JoditEditor from "jodit-react";
import { FaRegCalendarAlt, FaRegFileAlt, FaBell } from "react-icons/fa";
import { MdDescription, MdLocationOn } from "react-icons/md";
import { IoPeopleOutline } from "react-icons/io5";
import Button from "../../../../components/Button";

const CreateMeeting = () => {
  const [attendees, setAttendees] = useState([]);
  const { createMeeting, loading } = useDashboard();
  const { FetchAllParticipantList, allParticipantList } = useEmpDashboard();
  const today = new Date();
  const editorRef = useRef(null);
  const joditConfig = {
    readonly: false,
    height: "200px",
    color: "#000000",
  };
  // const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    FetchAllParticipantList();
  }, []);

  const handleSelectChange = (selectedOptions) => {
    // Update Formik state with selected options
    const values = selectedOptions.map((option) => option.value);
    formik.setFieldValue("participants", values);
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    date: Yup.date().required("Date is required"),
    time: Yup.string().required("Time is required"),
    location: Yup.string().required("Location is required"),
    participants: Yup.array().min(1, "Select at least one participant"),
    description: Yup.string().required("Description is required"),
    reminder: Yup.string().required("Reminder is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      date: null,
      time: null,
      location: "",
      participants: [],
      description: "",
      reminder: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formattedDate = values.date
        ? format(new Date(values.date), "yyyy-MM-dd")
        : "";

      const formattedTime = values.time
        ? format(new Date(values.time), "HH:mm")
        : "";

      const meetingData = {
        ...values,
        date: formattedDate,
        time: formattedTime,
        role: "employee",
      };

      await createMeeting(meetingData);
      resetForm();
    },
  });
  console.log(formik.values, formik.errors);
  return (
    <div className="min-h-screen bg-white rounded-2xl w-full mx-auto p-4 shadow-lg border border-gray-100">
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#2d3a4a] tracking-wide drop-shadow-sm">
            Add New Meeting
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Fill out the details below to schedule a meeting
          </p>
        </div>

        {/* Meeting Title */}
        <div className="space-y-1">
          <label
            htmlFor="title"
            className="flex items-center gap-2 text-gray-700 font-medium"
          >
            <FaRegFileAlt className="text-blue-500" /> Title
          </label>
          <input
            id="title"
            placeholder="Meeting Title"
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            className="h-[42px] w-full rounded-xl px-4 border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#318bb1] focus:ring-2 focus:ring-[#b3d8ee] transition-all shadow-sm outline-none"
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-sm text-red-600">{formik.errors.title}</p>
          )}
        </div>

        {/* Date & Time */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <FaRegCalendarAlt className="text-blue-600" /> Date & Time
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                format="dd/MM/yyyy"
                name="date"
                value={formik.values.date}
                minDate={today}
                onChange={(value) => formik.setFieldValue("date", value)}
                slotProps={{
                  textField: {
                    size: "small",
                    className: "bg-gray-50 focus:bg-white rounded-xl",
                  },
                }}
              />
              <TimePicker
                label="Time"
                value={formik.values.time}
                onChange={(selectedTime) => {
                  if (!selectedTime) {
                    formik.setFieldValue("time", null);
                    return;
                  }

                  const now = new Date();
                  const minAllowed = new Date();
                  minAllowed.setMinutes(now.getMinutes() + 30);
                  minAllowed.setSeconds(0);
                  minAllowed.setMilliseconds(0);

                  const selected = new Date(selectedTime);

                  if (
                    formik.values.date?.toDateString() === now.toDateString()
                  ) {
                    if (selected < minAllowed) {
                      formik.setFieldValue("time", minAllowed);
                    } else {
                      formik.setFieldValue("time", selected);
                    }
                  } else {
                    formik.setFieldValue("time", selected);
                  }
                }}
                minTime={
                  formik.values.date?.toDateString() === today.toDateString()
                    ? (() => {
                      const min = new Date();
                      min.setMinutes(min.getMinutes() + 30);
                      min.setSeconds(0);
                      min.setMilliseconds(0);
                      return min;
                    })()
                    : undefined
                }
                slotProps={{
                  textField: {
                    size: "small",
                    className: "bg-gray-50 focus:bg-white rounded-xl",
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          {formik.touched.date && formik.errors.date && (
            <p className="text-sm text-red-600">{formik.errors.date}</p>
          )}
          {formik.touched.time && formik.errors.time && (
            <p className="text-sm text-red-600">{formik.errors.time}</p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label
            htmlFor="location"
            className="flex items-center gap-2 text-gray-700 font-medium"
          >
            <MdLocationOn className="text-green-500" /> Location
          </label>
          <input
            id="location"
            placeholder="Enter location Eg: Zoom Meeting"
            type="text"
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            className="h-[42px] w-full rounded-xl px-4 border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#318bb1] focus:ring-2 focus:ring-[#b3d8ee] shadow-sm outline-none"
          />
          {formik.touched.location && formik.errors.location && (
            <p className="text-sm text-red-600">{formik.errors.location}</p>
          )}
        </div>

        {/* Participants */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <IoPeopleOutline className="text-purple-500" /> Participants
          </label>
          <Select
            className="w-full"
            styles={{
              control: (base, state) => ({
                ...base,
                minHeight: "42px",
                borderRadius: "0.75rem",
                borderColor: state.isFocused ? "#318bb1" : "#d1d5db",
                backgroundColor: state.isFocused ? "#fff" : "#f9fafb",
                transition: "all 0.2s",
              }),
            }}
            options={allParticipantList?.map((participant) => ({
              value: participant.officialEmail,
              label: participant.fullName,
            }))}
            value={(allParticipantList || [])
              .map((p) => ({ value: p.officialEmail, label: p.fullName }))
              .filter((opt) => formik.values.participants.includes(opt.value))}
            onChange={(selectedOptions) => {
              const values = selectedOptions
                ? selectedOptions.map((option) => option.value)
                : [];
              formik.setFieldValue("participants", values);
            }}
            isMulti
          />

          {formik.touched.participants && formik.errors.participants && (
            <p className="text-sm text-red-600">{formik.errors.participants}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label
            htmlFor="description"
            className="flex items-center gap-2 text-gray-700 font-medium"
          >
            <MdDescription className="text-orange-500" /> Description
          </label>
          {/* <textarea
            id="description"
            placeholder="Enter description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            className="w-full h-[80px] rounded-xl px-4 py-2 border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#318bb1] focus:ring-2 focus:ring-[#b3d8ee] shadow-sm outline-none resize-none"
          /> */}
          <JoditEditor
            ref={editorRef}
            value={formik.values.description}
            config={joditConfig}
            onBlur={(newContent) => {
              formik.setFieldValue("description", newContent);
            }}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-sm text-red-600">{formik.errors.description}</p>
          )}
        </div>

        {/* Reminder */}
        <div className="space-y-1">
          <label
            htmlFor="reminder"
            className="flex items-center gap-2 text-gray-700 font-medium"
          >
            <FaBell className="text-yellow-500" /> Reminder
          </label>
          <select
            id="reminder"
            name="reminder"
            value={formik.values.reminder}
            onChange={formik.handleChange}
            className="h-[42px] w-full rounded-xl px-4 border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#318bb1] focus:ring-2 focus:ring-[#b3d8ee] shadow-sm outline-none"
          >
            <option value="" disabled>
              Select Reminder
            </option>
            <option value="5">5 minutes before</option>
            <option value="10">10 minutes before</option>
            <option value="15">15 minutes before</option>
          </select>
          {formik.touched.reminder && formik.errors.reminder && (
            <p className="text-sm text-red-600">{formik.errors.reminder}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            type="submit"
            variant={1}
            text={loading ? "Saving..." : "Save Meeting"}
          />
          <Button variant={3} text="Cancel" />
        </div>
      </form>
    </div>
  );
};

export default CreateMeeting;

import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import useEmpDashboard from "../../../../hooks/unisol/empDashboard/empDashboard";
import useDashboard from "../../../../hooks/unisol/hrDashboard/useDashborad";
import Button from "../../../../components/Button";
import JoditEditor from "jodit-react";
import { useRoles } from "../../../../hooks/auth/useRoles";

const CreateMeeting = () => {
  const [attendees, setAttendees] = useState([]);
  const { FetchAllParticipantList, allParticipantList, loading } =
    useEmpDashboard();
  const { createMeeting, loading: meetLoad } = useDashboard();
  const today = new Date();
  const editorRef = useRef(null);
  const joditConfig = {
    readonly: false,
    height: "200px",
    color: "#000000",
  };

  useEffect(() => {
    FetchAllParticipantList();
  }, []);

  useEffect(() => {
    const formattedAttendees = allParticipantList?.map((participant) => ({
      value: participant.officialEmail,
      label: participant.fullName,
    }));
    console.log("formattedAttendees : ", formattedAttendees);
    setAttendees(formattedAttendees);
  }, [allParticipantList]);

  console.log("attendees : ", attendees, allParticipantList);

  const handleSelectChange = (selectedOptions) => {
    const values = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    formik.setFieldValue("participants", values);
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    date: Yup.date().required("Date is required"),
    time: Yup.string()
      .required("Time is required")
      .test("not-past-time", "Cannot select past time", function (value) {
        const { date } = this.parent;
        if (!date || !value) return true;

        // Break the time into hours and minutes
        const [hours, minutes] = value.split(":").map(Number);

        // Build local date-time from selected date + selected time
        const selectedDate = new Date(date);
        const selectedDateTime = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          hours,
          minutes
        );

        const now = new Date();

        // If selected date is today, block past times
        if (
          selectedDate.toDateString() === now.toDateString() &&
          selectedDateTime < now
        ) {
          return false;
        }

        return true;
      }),

    location: Yup.string().required("Location is required"),
    participants: Yup.array().min(1, "Select at least one participant"),
    description: Yup.string().required("Description is required"),
    reminder: Yup.string().required("Reminder is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().split(" ")[0].slice(0, 5),
      location: "",
      participants: [],
      description: "",
      reminder: "5",
    },
    validationSchema: validationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      const { isSuperAdmin, isHR } = useRoles();
      const role = isSuperAdmin ? "superAdmin" : "hr";

      const meetingData = {
        ...values,
        role: role,
      };

      await createMeeting(meetingData);

      resetForm();
    },
  });

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;

    const now = new Date();
    const minAllowed = new Date();
    minAllowed.setMinutes(now.getMinutes() + 30);
    minAllowed.setSeconds(0);
    minAllowed.setMilliseconds(0);

    const selectedDateTime = new Date(formik.values.date + "T" + selectedTime);

    const isToday =
      formik.values.date &&
      new Date(formik.values.date).toDateString() === now.toDateString();

    if (isToday && selectedDateTime < minAllowed) {
      const adjustedTime = minAllowed.toTimeString().slice(0, 5);
      formik.setFieldValue("time", adjustedTime);
    } else {
      formik.setFieldValue("time", selectedTime);
    }
  };

  const getMinTime = () => {
    if (
      formik.values.date &&
      new Date(formik.values.date).toDateString() === today.toDateString()
    ) {
      const nowPlus30 = new Date();
      nowPlus30.setMinutes(nowPlus30.getMinutes() + 30);
      nowPlus30.setSeconds(0);
      nowPlus30.setMilliseconds(0);
      return nowPlus30.toTimeString().slice(0, 5);
    }
    return "";
  };

  console.log(formik.values, formik.errors);
  return (
    <div className="min-h-screen bg-white shadow-lg rounded-2xl flex flex-col w-full max-w-full mx-auto px-8 py-6">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="w-full text-center">
          <h2 className="text-3xl font-bold text-gray-700">Add New Meeting</h2>
          <p className="text-gray-500 mt-1">
            Fill in the details to schedule a meeting
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            className="w-full h-[44px] rounded-xl px-3 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 placeholder-gray-400"
            name="title"
            placeholder="Enter meeting title"
            value={formik.values.title}
            onChange={formik.handleChange}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-sm text-red-500 mt-1">{formik.errors.title}</p>
          )}
        </div>

        {/* Date & Time */}
        <div>
          <label className="block font-semibold mb-1">Date & Time</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="date"
              className="flex-1 h-[44px] rounded-xl px-3 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100"
              name="date"
              min={today.toISOString().split("T")[0]}
              value={formik.values.date}
              onChange={(e) => {
                formik.setFieldValue("date", e.target.value);
                formik.setFieldValue("time", "");
              }}
            />

            <input
              type="time"
              className="flex-1 h-[44px] rounded-xl px-3 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100"
              name="time"
              min={getMinTime()}
              value={formik.values.time}
              onChange={handleTimeChange}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block font-semibold mb-1">Location</label>
          <input
            type="text"
            className="w-full h-[44px] rounded-xl px-3 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 placeholder-gray-400"
            name="location"
            placeholder="Enter meeting location"
            value={formik.values.location}
            onChange={formik.handleChange}
          />
          {formik.touched.location && formik.errors.location && (
            <p className="text-sm text-red-500 mt-1">
              {formik.errors.location}
            </p>
          )}
        </div>

        {/* Participants */}
        <div>
          <label className="block font-semibold mb-1">Participants</label>
          <Select
            className="w-full"
            name="participants"
            options={attendees}
            value={attendees?.filter((attendee) =>
              formik.values.participants.includes(attendee.value)
            )}
            onChange={handleSelectChange}
            isMulti
          />
          {formik.touched.participants && formik.errors.participants && (
            <p className="text-sm text-red-500 mt-1">
              {formik.errors.participants}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">Description</label>
          {/* <textarea
            className="w-full h-[100px] rounded-xl px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 placeholder-gray-400"
            name="description"
            placeholder="Enter meeting description"
            value={formik.values.description}
            onChange={formik.handleChange}
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
            <p className="text-sm text-red-500 mt-1">
              {formik.errors.description}
            </p>
          )}
        </div>

        {/* Reminder */}
        <div>
          <label className="block font-semibold mb-1">Reminder</label>
          <select
            className="w-full h-[44px] rounded-xl px-3 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100"
            name="reminder"
            value={formik.values.reminder}
            onChange={formik.handleChange}
          >
            <option value="5">5 minutes before</option>
            <option value="10">10 minutes before</option>
            <option value="15">15 minutes before</option>
          </select>
          {formik.touched.reminder && formik.errors.reminder && (
            <p className="text-sm text-red-500 mt-1">
              {formik.errors.reminder}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 pt-4">
          <Button
            text={meetLoad ? "Saving" : "Save Meeting"}
            type="submit"
            variant={1}
          />
          <Button text="Cancel" type="button" variant={3} />
        </div>
      </form>
    </div>
  );
};

export default CreateMeeting;

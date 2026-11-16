import { IoMdClose } from "react-icons/io";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useCoreHREvent from "../../hooks/unisol/coreHr/useCoreHREvent";
import { useTheme } from "../../hooks/theme/useTheme";
import Button from "../Button";

const parseTimeTo24Hour = (time) => {
  if (!time) return "";
  if (/^\d{2}:\d{2}$/.test(time)) return time;
  const match = String(time).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "";
  let h = parseInt(match[1], 10);
  const minutes = match[2];
  const suffix = match[3].toUpperCase();
  if (suffix === "PM" && h !== 12) h += 12;
  if (suffix === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${minutes}`;
};

const convertTo12Hour = (time) => {
  if (!time) return "";
  const [hour, minute] = String(time).split(":");
  let h = parseInt(hour, 10);
  if (Number.isNaN(h) || minute == null) return time;
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${minute} ${suffix}`;
};

const formatDate = (date) => {
  return date ? new Date(date).toISOString().split("T")[0] : "";
};

const AddEvent = ({ onClose, editing, data }) => {
  const { createEvent, updateEvent } = useCoreHREvent();
  const { theme } = useTheme();

  const validationSchema = Yup.object().shape({
    eventTitle: Yup.string().required("Event title is required"),
    eventType: Yup.string().required("Event type is required"),
    eventNote: Yup.string().required("Event note is required"),
    eventDate: Yup.date()
      .min(
        new Date().toISOString().split("T")[0],
        "Event date cannot be in the past"
      )
      .required("Event date is required"),
    eventTime: Yup.string().required("Event time is required"),
    Venue: Yup.string().required("Venue is required"),
    dressCode: Yup.string().required("Dress code is required"),
  });

  const initialValues = {
    eventTitle: data?.eventTitle || "",
    eventType: data?.eventType || "",
    eventNote: data?.eventNote || data?.note || "",
    eventDate: formatDate(data?.eventDate),
    eventTime: parseTimeTo24Hour(data?.eventTime || data?.startTime),
    Venue: data?.Venue || data?.venue || "",
    dressCode: data?.dressCode || "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      eventTitle: values.eventTitle,
      eventType: values.eventType,
      eventNote: values.eventNote,
      eventDate: values.eventDate,
      eventTime: convertTo12Hour(values.eventTime),
      Venue: values.Venue,
      dressCode: values.dressCode,
    };

    try {
      if (data?._id) {
        await updateEvent(data._id, payload);
      } else {
        await createEvent(payload);
      }
      onClose();
    } catch (error) {
      console.error("Error while adding/updating event:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="max-h-[90vh] w-[507px] overflow-y-auto bg-white shadow-lg">
          <div
            className="relative h-[61px] w-full"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            <div className="flex justify-between p-5 px-10">
              <h1 className="text-lg font-semibold text-black">
                {editing ? "Edit Event" : "Add Event"}
              </h1>
              <button type="button" onClick={onClose}>
                <IoMdClose size={24} />
              </button>
            </div>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values }) => (
              <Form className="flex w-full justify-center px-8 py-6">
                <div className="flex w-full flex-col items-start gap-4">
                  <div className="flex w-full flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">
                      Event Title
                    </label>
                    <Field
                      type="text"
                      name="eventTitle"
                      placeholder="Enter Event Title"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <ErrorMessage
                      name="eventTitle"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  <div className="flex w-full flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">
                      Event Type
                    </label>
                    <Field
                      type="text"
                      name="eventType"
                      placeholder="Enter Event Type"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <ErrorMessage
                      name="eventType"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  <div className="flex w-full flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">
                      Event Note
                    </label>
                    <Field
                      as="textarea"
                      rows={3}
                      name="eventNote"
                      placeholder="Enter Event Note"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <ErrorMessage
                      name="eventNote"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  <div className="flex w-full flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">
                      Event Date
                    </label>
                    <Field
                      type="date"
                      name="eventDate"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <ErrorMessage
                      name="eventDate"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  <div className="flex w-full flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">
                      Event Time
                    </label>
                    <Field
                      type="time"
                      name="eventTime"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    {values.eventTime && (
                      <div className="mt-1 text-xs text-gray-500">
                        Selected: {convertTo12Hour(values.eventTime)}
                      </div>
                    )}
                    <ErrorMessage
                      name="eventTime"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  <div className="flex w-full flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">
                      Venue
                    </label>
                    <Field
                      type="text"
                      name="Venue"
                      placeholder="Enter Venue"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <ErrorMessage
                      name="Venue"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  <div className="flex w-full flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">
                      Dress Code
                    </label>
                    <Field
                      type="text"
                      name="dressCode"
                      placeholder="Enter Dress Code"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <ErrorMessage
                      name="dressCode"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  <div className="mt-6 flex w-full justify-center">
                    <Button
                      type="submit"
                      variant={1}
                      text={editing ? "Update" : "Add"}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;

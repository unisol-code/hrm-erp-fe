import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ABSTRACT from "../../assets/images/blue-bg-abstract-2442270127.png";
import useCoreHREvent from "../../hooks/unisol/coreHr/useCoreHREvent";
import { useTheme } from "../../hooks/theme/useTheme";
import Button from "../Button";

const AddEvent = ({ onClose, editing, data }) => {
  console.log("AddEvent", data);
  const { createEvent, updateEvent, fetchEventById, getEventById, addEvent } =
    useCoreHREvent();

  const formatDate = (date) => {
    return date ? new Date(date).toISOString().split("T")[0] : "";
  };

  const validationSchema = Yup.object().shape({
    eventTitle: Yup.string().required("Event title is required"),
    eventDescription: Yup.string().required("Event description is required"),
    eventDate: Yup.date()
      .min(
        new Date().toISOString().split("T")[0],
        "Event date cannot be in the past"
      )
      .required("Event date is required"),
    startTime: Yup.string().required("Start time is required"),
    location: Yup.string().required("Location is required"),
    organizer: Yup.string().required("Organizer is required"),
    category: Yup.string().required("Category is required"),
  });

  const { theme } = useTheme();

  const initialValues = {
    eventTitle: data?.eventTitle || "",
    eventDescription: data?.eventDescription || "",
    eventDate: formatDate(data?.eventDate) || "",
    startTime: data?.startTime || "",
    location: data?.location || "",
    organizer: data?.organizer || "",
    category: data?.category || "",
  };

  // 🔹 helper to convert HH:mm → h:mm AM/PM
  const convertTo12Hour = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    let h = parseInt(hour, 10);
    const suffix = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minute} ${suffix}`;
  };

  const handleSubmit = async (values) => {
    try {
      // 🔹 Convert before save
      const formattedValues = {
        ...values,
        startTime: convertTo12Hour(values.startTime),
      };

      if (!data?._id) {
        await createEvent(formattedValues);
      } else {
        await updateEvent(data?._id, formattedValues);
      }
    } catch (error) {
      console.error("Error while adding/updating event:", error);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="flex justify-center items-center w-screen h-screen">
        <div className="w-[507px] max-h-[90vh] bg-white shadow-lg overflow-y-auto">
          <div
            className="w-full h-[61px] relative"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            <div className="flex justify-between p-5 px-10">
              <h1 className="text-black text-lg font-semibold">
                {editing ? "Edit Event" : "Add Event"}
              </h1>
              <button onClick={onClose}>
                <IoMdClose size={24} />
              </button>
            </div>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form className="w-full flex justify-center py-6 px-8">
                <div className="flex flex-col items-start gap-4 w-full">
                  {/* Event Title */}
                  <div className="flex flex-col w-full">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Event Title
                    </label>
                    <Field
                      type="text"
                      name="eventTitle"
                      placeholder="Enter Event Title"
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                    <ErrorMessage
                      name="eventTitle"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Event Description */}
                  <div className="flex flex-col w-full">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Event Description
                    </label>
                    <Field
                      as="textarea"
                      rows={3}
                      name="eventDescription"
                      placeholder="Enter Event Description"
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                    <ErrorMessage
                      name="eventDescription"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Event Date */}
                  <div className="flex flex-col w-full">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Event Date
                    </label>
                    <Field
                      type="date"
                      name="eventDate"
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                    <ErrorMessage
                      name="eventDate"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Start Time */}
                  <div className="flex flex-col w-full">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <Field
                      type="time"
                      name="startTime"
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                    {values.startTime && (
                      <div className="text-xs text-gray-500 mt-1">
                        Selected: {convertTo12Hour(values.startTime)}
                      </div>
                    )}
                    <ErrorMessage
                      name="startTime"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Location */}
                  <div className="flex flex-col w-full">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <Field
                      type="text"
                      name="location"
                      placeholder="Enter Location"
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                    <ErrorMessage
                      name="location"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Organizer */}
                  <div className="flex flex-col w-full">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Organizer
                    </label>
                    <Field
                      type="text"
                      name="organizer"
                      placeholder="Enter Organizer"
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                    <ErrorMessage
                      name="organizer"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Category */}
                  <div className="flex flex-col w-full">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <Field
                      type="text"
                      name="category"
                      placeholder="Enter Category"
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center w-full mt-6">
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

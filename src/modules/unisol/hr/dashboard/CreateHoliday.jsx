import { useFormik } from "formik";
import * as Yup from "yup";
import useEmpHoliday from "../../../../hooks/unisol/empHoliday/useEmpHoliday";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import Button from "../../../../components/Button";
import LoaderSpinner from "../../../../components/LoaderSpinner";

const CreateHoliday = () => {
  const { createNewHoliday, loading } = useEmpHoliday();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const validationSchema = Yup.object({
    holidayTitle: Yup.string().required("Title is required"),
    date: Yup.date().required("Date is required"),
    type: Yup.string().required("Type is required"),
  });

  const formik = useFormik({
    initialValues: {
      holidayTitle: "",
      date: "",
      type: "Public",
      location: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const superAdminId = sessionStorage.getItem("superAdminId");
      const holidayData = { ...values };
      await createNewHoliday(holidayData);
      formik.resetForm();
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl px-[100px] py-6 min-h-[513px]">
      <h2 className="text-2xl text-center text-gray-700 font-semibold mb-8">
        Create Holiday
      </h2>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
        {/* Holiday Title */}
        <div className="grid grid-cols-7 items-start gap-[30px]">
          <label className="font-semibold col-span-1 mt-2">Holiday Title</label>
          <div className="col-span-6">
            <input
              type="text"
              name="holidayTitle"
              placeholder="Enter holiday title"
              className="h-[40px] w-full rounded-xl px-3 border border-gray-400 placeholder-gray-500"
              value={formik.values.holidayTitle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.holidayTitle && formik.errors.holidayTitle && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.holidayTitle}</div>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="grid grid-cols-7 items-start gap-[30px]">
          <label className="font-semibold col-span-1 mt-2">Date</label>
          <div className="col-span-6">
            <input
              type="date"
              name="date"
              className="h-[40px] w-full rounded-xl px-3 border border-gray-400 placeholder-gray-500"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.date && formik.errors.date && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.date}</div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-7 items-start gap-[30px]">
          <label className="font-semibold col-span-1 mt-2">Location</label>
          <div className="col-span-6">
            <input
              type="text"
              name="location"
              placeholder="Enter location"
              className="h-[40px] w-full rounded-xl px-3 border border-gray-400 placeholder-gray-500"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>

        {/* Type */}
        <div className="grid grid-cols-7 items-start gap-[30px]">
          <label className="font-semibold col-span-1 mt-2">Type</label>
          <div className="col-span-6">
            <select
              name="type"
              className="h-[40px] w-full rounded-xl px-3 border border-gray-400 text-gray-700"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="Public">Public</option>
              <option value="Office">Office Only</option>
              <option value="Regional">Regional</option>
            </select>
            {formik.touched.type && formik.errors.type && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.type}</div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-6 pt-6">
          <Button type="submit" variant={1} text="Create" />
          <Button variant={3} text="Cancel" onClick={() => navigate(-1)} />
        </div>
      </form>
    </div>
  );
};

export default CreateHoliday;

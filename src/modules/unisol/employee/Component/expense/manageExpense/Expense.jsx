import Box from "@mui/material/Box";
import { Tab } from "@mui/material";
import { TabContext } from "@mui/lab";
import { TabList } from "@mui/lab";
import { TabPanel } from "@mui/lab";
import { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import useEmpExpense from "../../../../../../hooks/unisol/empExpense/useEmpExpense";
import { useFormik } from "formik";
import * as Yup from "yup";
import Breadcrumb from "../../../../../../components/BreadCrumb";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaymentsIcon from "@mui/icons-material/Payments";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";
import {
  FaUser,
  FaBuilding,
  FaUserTie,
  FaIdBadge,
  FaRegCalendarAlt,
  FaCity,
  FaMoneyBillWave,
} from "react-icons/fa";
import { MdCategory, MdDescription } from "react-icons/md";
import {
  ExpenseCalender,
  ManageExpenseFood,
  ManageExpenseLodging,
  ViewStatus,
  ManageExpenseOther,
  ManageExpenseTravel,
  ExpenseHistory,
  ManageExpenseGift,
  ManageExpenseStationary,
} from "../index";
import Button from "../../../../../../components/Button";
import ManageExpenseDA from "./ManageExpenseDA";


const manageExpenseValidationSchema = Yup.object({
  date: Yup.date().required("Date is required"),
  city: Yup.string().required("City is required"),
  category: Yup.string().required("Category is required"),
  expenseDetails: Yup.object().when('category', {
    is: (category) => ['Food', 'Travel', 'Lodging', 'Gifts', 'Stationary', 'Other'].includes(category),
    then: (schema) => schema.shape({
      receipts: Yup.array()
        .min(1, "At least one receipt is required")
        .required("Receipt is required"),
    }),
    otherwise: (schema) => schema,
  }),
});

const Expense = () => {
  const [value, setValue] = useState("1");
  const [selectedCity, setSelectedCity] = useState("");
  const empId = sessionStorage.getItem("empId");

  const {
    loading,
    fetachNameAndDepartment,
    nameDeptManager,
    expenseCategory,
    category, attendaceExpense,
    createExpenseOther,
    createAdvanceExpense,
    createExpenseTravel, addTravelExpense,
    createExpenseDA,
    createExpenseFood, addFoodExpense,
    createExpenseGift,
    createExpenseStationary,
    fetchCityHQ,
    cityHQ,
    resetCategory,
    createExpenseLodging, addLodgingExpense,
    addDailyAllowance,
    resetAddFoodExpense,
    resetAddDAExpense,
    resetAddTravelExpense,
    resetAddLodgingExpense
  } = useEmpExpense();

  useEffect(() => {
    fetachNameAndDepartment(empId);
    fetchCityHQ();
  }, []);

  console.log("attendaceExpense:", attendaceExpense);

  const [foodLimit, setFoodLimit] = useState(null);
  const [daLimit, setDALimit] = useState(null);
  const [travelLimit, setTravelLimit] = useState(null);
  const [lodgingLimit, setLodgingLimit] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState(null);

  // Update attendance status whenever attendanceExpense changes from API
  useEffect(() => {
    if (attendaceExpense) {
      setAttendanceStatus(attendaceExpense);
    }
  }, [attendaceExpense]);

  const today = new Date();

  const manageExpenseFormik = useFormik({
    initialValues: {
      employeeId: empId,
      date: today,
      city: "",
      category: "", // Default to empty string
      expenseDetails: {},
      receipts: [],
    },
    validationSchema: manageExpenseValidationSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
         if (values.category === "Daily Allowance" && daLimit?.islimitExceeded) {
      if (!values.expenseDetails.receipts || values.expenseDetails.receipts.length === 0) {
        setFieldError('expenseDetails.receipts', 'At least one receipt is required');
        return;
      }
    }
        const isPresent = (attendanceStatus === "Present");
        if (!isPresent) {
          setShowMessage(true);
          return;
        }
        const { receipts, expenseDetails, date, ...rest } = values;
        // Format date to YYYY-MM-DD
        // const formattedDate = new Date(date).toISOString().split('T')[0];
        const formattedDate = new Date(date).toLocaleDateString("en-CA");
        const data = {
          ...rest,
          ...expenseDetails,
          date: formattedDate,
          employeeId: empId,
          name: nameDeptManager?.data?.employeeName,
        };
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
          if (key === "receipts" && Array.isArray(data[key])) {
            data[key].forEach((receipt) => {
              if (receipt.file) {
                formData.append("receipts", receipt.file);
              }
            });
          } else if (key === "amount" && typeof data[key] === "object") {
            Object.keys(data[key]).forEach((subKey) => {
              formData.append(`amount[${subKey}]`, data[key][subKey]);
            });
          } else {
            formData.append(key, data[key]);
          }
        });

        const handleSuccess = () => {
          resetForm();
          setSelectedCity("");
          setValue("4");
        };

        const category = manageExpenseFormik.values.category;

        if (category === "Travel") {
          const isSuccess = await createExpenseTravel(formData);
          if (isSuccess) handleSuccess();
        } else if (category === "Lodging") {
          const isSuccess = await createExpenseLodging(formData);
          if (isSuccess) handleSuccess();
        } else if (category === "Food") {
          const isSuccess = await createExpenseFood(formData);
          if (isSuccess) handleSuccess();
        } else if (category === "Gifts") {
          const isSuccess = await createExpenseGift(formData);
          if (isSuccess) handleSuccess();
        } else if (category === "Stationary") {
          const isSuccess = await createExpenseStationary(formData);
          if (isSuccess) handleSuccess();
        } else if (category === "Other") {
          const isSuccess = await createExpenseOther(formData);
          if (isSuccess) handleSuccess();
        } else if (category === "Daily Allowance") {
          if (category === "Daily Allowance") {
            const isSuccess = await createExpenseDA(formData);
            if (isSuccess) {
              handleSuccess();
            }
          }
        }
      } catch (error) {
        console.error("Error while creating expense:", error);
      }
    },
  });

  const advanceExpenseFormik = useFormik({
    initialValues: {
      employeeId: empId,
      name: nameDeptManager?.data?.employeeName || "",
      date: null,
      amount: "",
      description: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      date: Yup.date().required("Date is required"),
      amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be a positive number"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await createAdvanceExpense(values);
        resetForm();
        setValue("4");
      } catch (error) {
        console.error("Error while creating advance expense:", error);
      }
    },
  });

  // Fetch categories when date and city change
  useEffect(() => {
    const date = manageExpenseFormik.values.date;
    const city = manageExpenseFormik.values.city;

    if (date && city) {
      resetCategory();
      expenseCategory(date, city);
    }
  }, [
    manageExpenseFormik.values.date,
    manageExpenseFormik.values.city,
  ]);

  // Reset foodLimit and Recoil state when inputs change
  useEffect(() => {
    setFoodLimit(null);
    setDALimit(null);
    setTravelLimit(null);
    setLodgingLimit(null);
    resetAddFoodExpense();
    resetAddDAExpense();
    resetAddTravelExpense();
    resetAddLodgingExpense();
  }, [
    manageExpenseFormik.values.date,
    manageExpenseFormik.values.city,
    manageExpenseFormik.values.category,
  ]);

  // Update foodLimit from Recoil state
  useEffect(() => {
    if (addFoodExpense) {
      setFoodLimit(addFoodExpense);
    }
  }, [addFoodExpense]);

  useEffect(() => {
    console.log("addDailyAllowance changed:", addDailyAllowance);
    if (addDailyAllowance) {
      setDALimit(addDailyAllowance)
    }
  }, [addDailyAllowance]);

  useEffect(() => {
    if (addTravelExpense) {
      setTravelLimit(addTravelExpense);
    }
  }, [addTravelExpense]);

  useEffect(() => {
    if (addLodgingExpense) {
      setLodgingLimit(addLodgingExpense);
    }
  }, [addLodgingExpense]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCityChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedCity(selectedValue);

    manageExpenseFormik.setFieldValue("city", selectedValue);
    manageExpenseFormik.setFieldTouched("city", true);

    if (selectedValue) {
      manageExpenseFormik.setFieldValue("category", "");
    } else {
      manageExpenseFormik.setFieldValue("category", "");
      resetCategory();
    }
  };

  const handleExpenseChange = (e) => {
    const value = e.target.value;
    manageExpenseFormik.setFieldValue("category", value);
    manageExpenseFormik.setFieldTouched("category", true);
  };

  const handleChildDataChange = (data) => {
    manageExpenseFormik.setFieldValue("expenseDetails", data);
  };

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb
        linkText={[
          { text: "Dashboard", href: "/EmployeeDashboard" },
          {
            text:
              value === "1"
                ? "Expense"
                : value === "2"
                  ? "Manage Expense"
                  // : value === "3"
                  //   ? "Advance Expense"
                  : value === "4"
                    ? "View Status"
                    : "Expense History",
          },
        ]}
      />
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box
            sx={{
              width: "100%",
              borderBottom: 1,
              borderColor: "divider",
              borderRadius: 4,
              backgroundColor: "white",
              height: 60,
              marginBottom: 2,
            }}
          >
            <TabList
              onChange={handleChange}
              centered
              sx={{
                width: "100%",
                height: 60,
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                paddingLeft: 8,
                paddingRight: 8,
                "& .MuiTabs-indicator": {
                  height: "6px",
                  borderRadius: "6px 6px 0 0",
                  background:
                    "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
                  transition: "all 0.3s",
                },
                "& .Mui-selected": {
                  color: "#2575fc",
                  fontWeight: "bold",
                },
              }}
            >
              <Tab
                icon={<CalendarMonthIcon />}
                iconPosition="start"
                label="Calender"
                value="1"
                sx={{ flex: 1, minWidth: 0 }}
              />
              <Tab
                icon={<ReceiptLongIcon />}
                iconPosition="start"
                label="Manage Expense"
                value="2"
                sx={{ flex: 1, minWidth: 0 }}
              />
              {/* <Tab
                icon={<PaymentsIcon />}
                iconPosition="start"
                label="Advance Expense"
                value="3"
                sx={{ flex: 1, minWidth: 0 }}
              /> */}
              <Tab
                icon={<VisibilityIcon />}
                iconPosition="start"
                label="View Status"
                value="4"
                sx={{ flex: 1, minWidth: 0 }}
              />
              <Tab
                icon={<HistoryIcon />}
                iconPosition="start"
                label="Expense History"
                value="5"
                sx={{ flex: 1, minWidth: 0 }}
              />
            </TabList>
          </Box>

          <TabPanel style={{ padding: 0 }} value="1" className="h-auto">
            <ExpenseCalender />
          </TabPanel>

          <TabPanel style={{ padding: 0 }} value="2">
            <form onSubmit={manageExpenseFormik.handleSubmit}>
              <div className="flex flex-col px-4 md:px-8 lg:px-14 pt-6 pb-8 rounded-2xl bg-white shadow-lg">
                <div className="w-full flex justify-center">
                  <h2 className="text-3xl font-bold text-[#2d3a4a] px-8 pt-4 pb-8 tracking-wide drop-shadow-sm">
                    Submit New Expense
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-3 items-center">
                      <label className="text-lg font-semibold text-[#3b4a5a] col-span-1 flex items-center gap-2">
                        <FaUser className="text-blue-500" /> Name
                      </label>
                      <input
                        type="text"
                        placeholder={nameDeptManager?.data?.employeeName}
                        className="h-[40px] rounded-xl px-4 placeholder-gray-400 border border-gray-300 col-span-2 bg-gray-200 cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <label className="text-lg font-semibold text-[#3b4a5a] col-span-1 flex items-center gap-2">
                        <FaBuilding className="text-green-500" /> Department
                      </label>
                      <input
                        type="text"
                        placeholder={nameDeptManager?.data?.department}
                        className="h-[40px] rounded-xl px-4 placeholder-gray-400 border border-gray-300 col-span-2 bg-gray-200 cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-3 items-center">
                      <label className="text-lg font-semibold text-[#3b4a5a] col-span-1 flex items-center gap-2">
                        <FaUserTie className="text-purple-500" /> Manager
                      </label>
                      <input
                        type="text"
                        placeholder={nameDeptManager?.data?.manager}
                        className="h-[40px] rounded-xl px-4 placeholder-gray-400 border border-gray-300 col-span-2 bg-gray-200 cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <label className="text-lg font-semibold text-[#3b4a5a] col-span-1 flex items-center gap-2">
                        <FaIdBadge className="text-orange-500" /> Designation
                      </label>
                      <input
                        type="text"
                        placeholder={nameDeptManager?.data?.designation}
                        className="h-[40px] rounded-xl px-4 placeholder-gray-400 border border-gray-300 col-span-2 bg-gray-200 cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-t border-gray-300 mt-8 mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="grid grid-cols-3 items-center">
                    <label className="text-lg font-semibold text-[#3b4a5a] col-span-1 flex items-center gap-2">
                      <FaRegCalendarAlt className="text-red-500" /> Date
                    </label>
                    <div className="col-span-2">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="date"
                          format="dd/MM/yyyy"
                          value={manageExpenseFormik.values.date}
                          maxDate={today}
                          onChange={(value) =>
                            manageExpenseFormik.setFieldValue("date", value)
                          }
                          slotProps={{
                            textField: {
                              className:
                                "w-full bg-gray-50 focus:bg-white focus:border-[#318bb1] focus:ring-2 focus:ring-[#b3d8ee] transition-all duration-200 shadow-sm hover:border-[#709EB1] outline-none",
                              fullWidth: true,
                              variant: "outlined",
                              size: "small",
                              sx: {
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "0.75rem",
                                  height: "40px",
                                },
                              },
                            },
                          }}
                        />
                        {manageExpenseFormik.touched.date &&
                          manageExpenseFormik.errors.date && (
                            <div className="text-sm text-red-600 font-medium mt-1 animate-pulse">
                              {manageExpenseFormik.errors.date}
                            </div>
                          )}
                      </LocalizationProvider>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center">
                    <label className="text-lg font-semibold text-[#3b4a5a] col-span-1 flex items-center gap-2">
                      <FaCity className="text-indigo-500" /> City
                    </label>
                    <select
                      className="h-[40px] rounded-xl px-4 placeholder-gray-400 border border-gray-300 col-span-2 bg-gray-50 focus:bg-white focus:border-[#318bb1] focus:ring-2 focus:ring-[#b3d8ee] transition-all duration-200 shadow-sm hover:border-[#709EB1] outline-none"
                      value={manageExpenseFormik.values.city}
                      onChange={handleCityChange}
                    >
                      <option value="" disabled>
                        Select City
                      </option>
                      {cityHQ.map((c, index) => (
                        <option key={index} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-3 items-center">
                    <label className="text-lg font-semibold text-[#3b4a5a] col-span-1 flex items-center gap-2">
                      <MdCategory className="text-yellow-500" /> Expense Category
                    </label>
                    <select
                      className="h-[40px] rounded-xl px-4 placeholder-gray-400 border border-gray-300 col-span-2 bg-gray-50 focus:bg-white focus:border-[#318bb1] focus:ring-2 focus:ring-[#b3d8ee] transition-all duration-200 shadow-sm hover:border-[#709EB1] outline-none"
                      value={manageExpenseFormik.values.category}
                      onChange={handleExpenseChange}
                      disabled={!selectedCity}
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {category.map((c, index) => (
                        <option key={index} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-8">
                  {manageExpenseFormik.values.category === "Travel" && (
                    <ManageExpenseTravel
                      handleDataChange={handleChildDataChange}
                      formik={manageExpenseFormik}
                      // selectedCity={selectedCity}
                      travelLimit={travelLimit}
                    />
                  )}
                  {manageExpenseFormik.values.category === "Food" && (
                    <ManageExpenseFood
                      handleDataChange={handleChildDataChange}
                      formik={manageExpenseFormik}
                      selectedCity={selectedCity}
                      foodLimit={foodLimit}
                    />
                  )}
                  {manageExpenseFormik.values.category === "Gifts" && (
                    <ManageExpenseGift
                      handleDataChange={handleChildDataChange}
                      formik={manageExpenseFormik}
                    />
                  )}
                  {manageExpenseFormik.values.category === "Stationary" && (
                    <ManageExpenseStationary
                      handleDataChange={handleChildDataChange}
                      formik={manageExpenseFormik}
                    />
                  )}
                  {manageExpenseFormik.values.category === "Lodging" && (
                    <ManageExpenseLodging
                      handleDataChange={handleChildDataChange}
                      formik={manageExpenseFormik}
                      lodgingLimit={lodgingLimit}
                    />
                  )}
                  {manageExpenseFormik.values.category === "Other" && (
                    <ManageExpenseOther
                      handleDataChange={handleChildDataChange}
                      formik={manageExpenseFormik}
                    />
                  )}
                  {manageExpenseFormik.values.category === "Daily Allowance" && (
                    <ManageExpenseDA
                      handleDataChange={handleChildDataChange}
                      formik={manageExpenseFormik}
                      daLimit={daLimit}
                    />
                  )}
                </div>

                <div className="flex justify-center items-center flex-col gap-4 py-10">
                  <Button 
                    type="submit" 
                    variant={1} 
                    text={loading ? "Submitting..." : "Submit Expense"} 
                    disabled={attendanceStatus !== "Present" || loading} 
                  />
                  {attendanceStatus && attendanceStatus !== "Present" && (() => {
                    const expenseDate = new Date(manageExpenseFormik.values.date);
                    const today = new Date();
                    const isToday = expenseDate.toDateString() === today.toDateString();
                    const formattedDate = expenseDate.toLocaleDateString("en-GB");

                    return (
                      <div className="text-lg font-semibold text-red-500 text-center">
                        Cannot submit expense for {formattedDate} as you {isToday ? 'are' : 'were'} on leave {isToday ? 'today' : 'that day'}.
                      </div>
                    );
                  })()}
                </div>
              </div>
            </form>
          </TabPanel>

          <TabPanel style={{ padding: 0 }} value="3">
            <form onSubmit={advanceExpenseFormik.handleSubmit}>
              {/* ...advance expense form (unchanged)... */}
            </form>
          </TabPanel>

          <TabPanel style={{ padding: 0 }} value="4">
            <ViewStatus />
          </TabPanel>

          <TabPanel style={{ padding: 0 }} value="5">
            <ExpenseHistory />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

export default Expense;
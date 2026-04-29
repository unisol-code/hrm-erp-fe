import { useEffect, useState } from "react";
import useEmpHoliday from "../../../../hooks/unisol/empHoliday/useEmpHoliday";
import { useTheme } from "../../../../hooks/theme/useTheme";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import { date } from "yup";
import  Select  from 'react-select'
const HolidayList = () => {
  const { allHolidayDetails, allHoliday, loading } = useEmpHoliday();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const yearOptions = years.map((year) => ({
    value: year,
    label: year.toString(),
  }));
  const [year, setYear] = useState(currentYear)

  useEffect(() => {
    if(year){
    allHolidayDetails(year);
    }
  }, [year]);

  let serialNo = 1; // Initialize Serial Number

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
      .replace(/ /g, "-")
  };

  const formatDay = (date) => {
    const dayDate = new Date(date);
    const dayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(dayDate);
    return dayName;
  }

  const { theme } = useTheme();

  if (loading || !allHoliday) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    )
  }
  return (
    <div className="bg-white rounded-2xl flex flex-col w-full pb-6 h-[513px]">
      {/* Header */}
      <div
        style={{ backgroundColor: theme.secondaryColor }}
        className="w-full h-[75px] rounded-t-2xl flex justify-between gap-3 items-center px-6 text-[21px] text-black">

        <h2>{`Company Holiday List for ${year}`}</h2>
        <Select
          options={yearOptions}
          value={yearOptions.find(
            (opt) => opt.value === year
          )}
          onChange={(option) =>
            setYear(option ? option.value : null)
          }
          placeholder="Select Year"
          isClearable
          menuPortalTarget={document.body}
          styles={{
            container: (base) => ({ ...base, minWidth: 120 }),
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
        />
      </div>

      {/* Holiday Table */}
      <div className="px-10 pt-6 h-[438px] overflow-y-scroll scrollbar-hide">
        <table className="w-full border-collapse border border-gray-300">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">Sr.No</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Day</th>
              <th className="px-4 py-2">Occasion</th>
            </tr>
          </thead>
          <tbody>
            {/* Table Body */}
            {allHoliday?.companyHolidays?.length > 0 ? (
              allHoliday.companyHolidays.flatMap((row, index) =>
                row?.holidays?.map((holiday, i) => (
                  <tr key={`${index}-${i}`} className="hover:bg-gray-100">
                    {/* Serial Number Column */}
                    <td className="border border-gray-300 px-4 py-2">
                      {serialNo++}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {formatDate(holiday?.date)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {holiday?.day || formatDay(holiday?.date)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {holiday?.holidayTitle}
                    </td>
                  </tr>
                )) || []
              )
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-lg font-medium">
                  No holidays available.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div >
  );
};

export default HolidayList;

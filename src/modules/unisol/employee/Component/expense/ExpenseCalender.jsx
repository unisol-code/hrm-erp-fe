import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enGB } from "date-fns/locale";
import useEmpExpense from "../../../../../hooks/unisol/empExpense/useEmpExpense";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Setup localizer
const locales = { "en-GB": enGB };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const ExpenseCalendar = () => {
  const [expenses, setExpenses] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { fetchExpenseStatus, expStatus, loading } = useEmpExpense();
  const empId = sessionStorage.getItem("empId");
  const { theme } = useTheme();

  useEffect(() => {
    if (expStatus?.data?.length > 0) {
      const formattedExpenses = expStatus.data.map((expense) => ({
        title: `${expense.expenseCategory} - ₹${expense.amount} (${expense.status})`,
        start: new Date(expense.date),
        end: new Date(expense.date),
        allDay: true,
        resource: expense,
      }));
      setExpenses(formattedExpenses);
    } else {
      setExpenses([]);
    }
  }, [expStatus]);

  useEffect(() => {
    if (!empId) return;
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    fetchExpenseStatus(empId, month, year, "approved");
  }, [currentDate, empId]);

  // Handle navigation
  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  // Custom event style
  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: theme.primaryColor,
        color: "white",
        borderRadius: "6px",
        padding: "2px 4px",
        fontSize: "0.85em",
        display: "flex",
        wordBreak: "break-word"
      },
    };
  };
  const CompactEvent = ({ event }) => (
    <span>
      {event.resource.expenseCategory} - ₹{event.resource.amount}
    </span>
  );

  return (
    <div className="bg-white p-4 rounded-2xl">
      {loading && !expenses.length ? (
        <div className="w-full flex items-center justify-center py-10">
          <LoaderSpinner />
        </div>
      ) : (
        <Calendar
          localizer={localizer}
          events={expenses}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          culture="en-GB"
          views={["month"]}
          date={currentDate}
          onNavigate={handleNavigate}
          eventPropGetter={eventStyleGetter}
          components={{
            event: CompactEvent,
            month: {
              event: CompactEvent,
            },
          }}
          popup
        />

      )}
    </div>
  );
};
export default ExpenseCalendar;
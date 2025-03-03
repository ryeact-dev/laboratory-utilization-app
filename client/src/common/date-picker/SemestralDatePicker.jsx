import { useGetActiveSemestralDate } from "@/hooks/termSemSchoolYear.hook";
import { getWeekDatesExcludeSunday, isWeekday } from "@/lib/helpers/dateTime";
import { forwardRef } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { endOfWeek, format, subWeeks } from "date-fns";
import { CalendarDays } from "lucide-react";

export default function SemestralDatePicker({
  date,
  setDate,
  isLastDayOfTheWeek,
  isWeeklyUtilization = false,
  isTermUtilizations = false,
}) {
  const { isLoading, data: semestralDate } = useGetActiveSemestralDate();

  const DatePickerRef = forwardRef(({ value, onClick }, ref) => (
    <div className="w-full lg:mx-3">
      <button
        type="button"
        className={`btn btn-sm btn-secondary h-10 animate-none font-medium normal-case text-white ${
          isLoading && "!w-[176x]"
        }`}
        onClick={onClick}
        ref={ref}
      >
        <CalendarDays size={20} strokeWidth={2.5} />
        {isLoading
          ? "Loading Dates..."
          : isLastDayOfTheWeek
            ? format(
                new Date(getWeekDatesExcludeSunday(value)?.weekDates[5]),
                "EEE, MMM dd yyyy",
              )
            : getWeekDatesExcludeSunday(value)?.week || "No Dates was set"}
      </button>
    </div>
  ));

  const startDate = new Date(semestralDate?.data[0]?.starting_date);
  const endDate = new Date(semestralDate?.data[1]?.ending_date);

  const currentDate = new Date();
  // SET THE DATEPICKER MAX DATE BASED ON THE CURRENT DATE IF WEEKLY UTILIZATION
  const lastDateOfPreviousWeek = endOfWeek(subWeeks(currentDate, 1));
  const lastDateOfCurrentWeek = endOfWeek(currentDate);
  const lastDateOfSelectedWeek = endOfWeek(date);

  // IF WEEKLY UTILIZATION IT WILL CHOOSE AUTOMATICALLY THE LAST DATE OF THE WEEK
  const maxDate = isWeeklyUtilization
    ? lastDateOfCurrentWeek
    : isTermUtilizations
      ? lastDateOfPreviousWeek
      : endDate;

  // IF TERM OR WEEKLY UTILIZATION IT WILL CHOOSE AUTOMATICALLY THE LAST DATE OF THE WEEK
  const selectedDate =
    isWeeklyUtilization || isTermUtilizations ? lastDateOfSelectedWeek : date;

  const onDateChange = (date) => {
    const lastDateOfSelectedWeek = endOfWeek(date);
    setDate(lastDateOfSelectedWeek);
  };

  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date) => onDateChange(date)}
      minDate={new Date(startDate)}
      maxDate={maxDate}
      customInput={<DatePickerRef />}
      filterDate={isWeekday}
    />
  );
}

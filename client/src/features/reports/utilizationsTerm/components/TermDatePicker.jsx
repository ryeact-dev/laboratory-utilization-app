import { DatePicker } from "@/common/date-picker/DatePicker";
import { getWeekDatesExcludeSunday } from "@/lib/helpers/dateTime";
import { endOfWeek, format, subWeeks } from "date-fns";

export default function TermDatePicker({ date, setDate }) {
  const currentDate = new Date();

  const lastDateOfSelectedWeek = endOfWeek(date);
  const lastDateOfPreviousWeek = endOfWeek(subWeeks(currentDate, 1));

  const formattedDate = (date) => {
    if (!date) return "No Selected Date";
    return format(
      new Date(getWeekDatesExcludeSunday(date)?.weekDates[5]),
      "EEE, MMM dd yyyy",
    );
  };

  const onDateChange = (date) => {
    const lastDateOfSelectedWeek = endOfWeek(date);
    setDate(lastDateOfSelectedWeek);
  };

  return (
    <DatePicker
      date={lastDateOfSelectedWeek}
      setDate={onDateChange}
      maxDate={lastDateOfPreviousWeek}
      formattedDate={formattedDate}
      className={"mx-3"}
    />
  );
}

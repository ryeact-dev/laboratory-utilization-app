import { DatePicker } from "@/common/date-picker/DatePicker";
import { getWeekDatesExcludeSunday } from "@/lib/helpers/dateTime";
import { endOfWeek } from "date-fns";

export default function ReportsUtilizationDatePicker({ date, setDate }) {
  const minDate = new Date("2021-01-01");
  const currentDate = new Date();

  const lastDateOfSelectedWeek = endOfWeek(date, { weekStartsOn: 1 });
  const lastDateOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 1 });

  const formattedDate = (date) => {
    return getWeekDatesExcludeSunday(date)?.week;
  };

  const onDateChange = (date) => {
    const lastDateOfSelectedWeek = endOfWeek(date);
    setDate(lastDateOfSelectedWeek);
  };

  return (
    <DatePicker
      date={lastDateOfSelectedWeek}
      setDate={onDateChange}
      formattedDate={formattedDate}
      minDate={minDate}
      maxDate={lastDateOfCurrentWeek}
    />
  );
}

import { DatePicker } from "@/common/date-picker/DatePicker";
import { getWeekDatesExcludeSunday } from "@/lib/helpers/dateTime";
import { endOfWeek } from "date-fns";

export default function LabMonitoringDatePicker({ date, setDate }) {
  const currentDate = new Date();

  const lastDateOfSelectedWeek = endOfWeek(date, { weekStartsOn: 1 });
  const lastDateOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 1 });

  const formattedDate = (date) => {
    if (!date) return "No Selected Date";
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
      maxDate={lastDateOfCurrentWeek}
      formattedDate={formattedDate}
      className={"mx-3"}
    />
  );
}

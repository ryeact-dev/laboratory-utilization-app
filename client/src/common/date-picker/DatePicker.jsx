import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { CalendarDays } from "lucide-react";

export function DatePicker({
  variant = "default",
  formattedDate,
  date,
  setDate,
  minDate,
  maxDate,
  excludeDates,
  className,
  ...rest
}) {
  // Convert the date to PH timezone
  const phDate = date ? utcToZonedTime(date, "Asia/Manila") : null;

  const handleDateSelect = (selectedDate) => {
    // Convert selected date to UTC before passing it up
    const utcDate = selectedDate
      ? zonedTimeToUtc(selectedDate, "Asia/Manila")
      : null;
    setDate(utcDate);
  };

  return (
    <Popover key={phDate?.getDate()}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          className={cn(
            "min-w-56 justify-center font-normal shadow-none",
            className,
          )}
        >
          <CalendarDays strokeWidth={2.5} />
          {phDate ? formattedDate(phDate) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          required
          mode="single"
          selected={phDate}
          onSelect={handleDateSelect}
          defaultMonth={phDate}
          disabled={[
            { dayOfWeek: [0] },
            { after: maxDate },
            { before: minDate },
            excludeDates,
          ]}
          initialFocus
          {...rest}
        />
      </PopoverContent>
    </Popover>
  );
}

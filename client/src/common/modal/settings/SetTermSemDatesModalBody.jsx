import { useState } from "react";
import {
  addYears,
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  format,
} from "date-fns";

import { useSetDates } from "@/hooks/termSemSchoolYear.hook";
import { Button } from "@/common/ui/button";
import { CircleX, LoaderCircle, Send } from "lucide-react";
import { Label } from "@/common/ui/label";
import { DatePicker } from "@/common/date-picker/DatePicker";

// COMPONENT FUNCTION
function SetTermSemDatesModalBody({ closeModal, extraObject }) {
  const currentDate = new Date();
  const startingMonths = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 12,
    currentDate.getDate(),
  );

  const formattedDate = (date) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  const {
    termSemId,
    whatTermSem,
    schoolYearId,
    selectedSchoolYear,
    currentStartingDate,
    currentEndingDate,
    isSchoolYear,
  } = extraObject;

  const selectedStartingDate = currentStartingDate
    ? new Date(currentStartingDate)
    : new Date();

  const selectedEndingDate = currentEndingDate
    ? new Date(currentEndingDate)
    : new Date();

  const [startingDate, setStartingDate] = useState(selectedStartingDate);
  const [endingDate, setEndingDate] = useState(selectedEndingDate);

  const setDatesMutation = useSetDates(closeModal);

  const endingMonths = new Date(
    startingDate.getFullYear(),
    startingDate.getMonth() + 4,
    startingDate.getDate(),
  );

  let totalWeeks = differenceInCalendarWeeks(
    new Date(endingDate),
    new Date(startingDate),
  );

  let totalDays =
    differenceInCalendarDays(new Date(endingDate), new Date(startingDate)) -
    totalWeeks * 7;

  let totalMonths = differenceInCalendarMonths(
    new Date(endingDate),
    new Date(startingDate),
  );

  const dateCalculation = isSchoolYear
    ? `Total: ${totalMonths} month(s)`
    : `Total: ${totalWeeks} week(s) ${
        totalDays > 0 ? `and ${totalDays} day(s)` : ""
      }`;

  const onSubmitDates = (evt) => {
    evt.preventDefault();

    let forUpdatingData = {
      startDate: format(startingDate, "MMM-dd-yyyy"),
      endingDate: format(endingDate, "MMM-dd-yyyy"),
    };

    if (isSchoolYear) {
      forUpdatingData = {
        ...forUpdatingData,
        schoolYearId,
        selectedSchoolYear,
      };
    } else {
      forUpdatingData = {
        ...forUpdatingData,
        termSemId,
        whatTermSem,
      };
    }

    setDatesMutation.mutate({ forUpdatingData, isSchoolYear });
  };

  // RETURN SECTION
  return (
    <form
      onSubmit={(evt) => onSubmitDates(evt)}
      className="min-h-full flex-col justify-between md:flex"
    >
      <article className="flex items-start justify-center gap-4">
        <div className="flex flex-col items-center space-y-2">
          <Label className="pl-2">Starting Date:</Label>
          <DatePicker
            date={startingDate}
            setDate={(date) => setStartingDate(date)}
            minDate={new Date("2023-08-01")}
            maxDate={!isSchoolYear && startingMonths}
            formattedDate={formattedDate}
            className={"min-w-28"}
          />
        </div>

        <div className="flex flex-col items-center space-y-2">
          <Label className="pl-2">Ending Date:</Label>
          <DatePicker
            date={endingDate}
            setDate={(date) => setEndingDate(date)}
            minDate={startingDate}
            maxDate={!isSchoolYear ? endingMonths : addYears(currentDate, 1)}
            formattedDate={formattedDate}
            className={"min-w-28"}
          />
        </div>
      </article>
      <article className="border-neutral/20 mx-auto mt-6 w-fit rounded-lg border px-4 py-2 text-center text-lg font-semibold">
        <h2>{dateCalculation}</h2>
      </article>
      <article className="mt-6 flex w-full justify-end space-x-2">
        <Button variant="destructive" onClick={() => closeModal()}>
          <p className="flex items-center gap-1">
            <CircleX size={18} strokeWidth={2.5} />
            Cancel
          </p>
        </Button>
        <Button type="submit" variant="secondary" className="w-40">
          {setDatesMutation.isPending ? (
            <>
              <LoaderCircle
                className="-ms-1 me-2 animate-spin"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              Submitting
            </>
          ) : (
            <span className="flex items-center gap-1">
              <Send size={18} strokeWidth={2} />
              Submit
            </span>
          )}
        </Button>
      </article>
    </form>
  );
}

export default SetTermSemDatesModalBody;

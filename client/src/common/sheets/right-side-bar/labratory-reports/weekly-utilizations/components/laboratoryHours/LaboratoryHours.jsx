import { calculateUsageTime } from "@/lib/helpers/dateTime";
import { Clock9 } from "lucide-react";
import { useDeferredValue } from "react";

const DIV_CLASS =
  "flex w-full items-center justify-center gap-2 rounded-md bg-primary/50 px-1 py-2 text-sm font-mediun text-foreground";

export default function LaboratoryHours({
  listOfUsage,
  getTotalWeekLaboratoryHours,
  isLoadingTotalPreviousUsage,
  totalHoursOfPreviousUsage,
}) {
  const listOfRegularClass = listOfUsage?.filter(
    (subject) => subject.is_regular_class === true,
  );
  const listOfReservationClass = listOfUsage?.filter(
    (subject) => subject.is_regular_class === false,
  );

  while (listOfRegularClass?.length < 7) {
    listOfRegularClass.push({ usage_date: null, usage_hours: null });
  }

  while (listOfReservationClass?.length < 7) {
    listOfReservationClass.push({ usage_date: null, usage_hours: null });
  }

  const regularSubTotal = useDeferredValue(
    listOfRegularClass?.reduce((total, usage) => {
      return total + usage.usage_hours;
    }, 0),
  );

  const reservationSubTotal = useDeferredValue(
    listOfReservationClass?.reduce((total, usage) => {
      return total + usage.usage_hours;
    }, 0),
  );

  const previousTotal = !isLoadingTotalPreviousUsage
    ? totalHoursOfPreviousUsage
    : 0;

  const currentTotal = reservationSubTotal + regularSubTotal;
  const totalLabHours = previousTotal + currentTotal;

  // Returns the totalHours to the parent component
  getTotalWeekLaboratoryHours(totalLabHours);

  const calculateTime = (time, bool) => {
    const result = calculateUsageTime(time, bool);
    const isMins = Number(result) < 1;
    return { isMins, result };
  };

  return (
    <div className="flex gap-4">
      <div className={DIV_CLASS}>
        <p>Current Usage:</p>
        <div className="flex items-center gap-1">
          <Clock9 size={16} />
          <p>
            {calculateTime(currentTotal, true).result
              ? `${
                  calculateTime(currentTotal, true).isMins
                    ? calculateTime(currentTotal, true)
                        .result.toString()
                        .split(".")[1]
                    : calculateTime(currentTotal, true).result
                } ${
                  calculateTime(currentTotal, true).result === 1
                    ? "hr"
                    : calculateTime(currentTotal, true).result < 1
                      ? "mins"
                      : "hrs"
                }`
              : "0"}
          </p>
        </div>
      </div>

      <div className={DIV_CLASS}>
        <p>Previous Usage:</p>
        <div className="flex items-center gap-1">
          <Clock9 size={16} />
          <p>
            {calculateTime(previousTotal, true).result
              ? `${
                  calculateTime(previousTotal, true).isMins
                    ? calculateTime(previousTotal, true)
                        .result.toString()
                        .split(".")[1]
                    : calculateTime(previousTotal, true).result
                } ${
                  calculateTime(previousTotal, true).result === 1
                    ? "hr"
                    : calculateTime(previousTotal, true).result < 1
                      ? "mins"
                      : "hrs"
                }`
              : "0"}
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-1 py-2 text-sm font-medium">
        <p>Total Usage:</p>
        <div className="flex items-center gap-1">
          <Clock9 size={16} strokeWidth={3} />
          <p>
            {calculateTime(totalLabHours, true).result
              ? `${
                  calculateTime(totalLabHours, true).isMins
                    ? calculateTime(totalLabHours, true)
                        .result.toString()
                        .split(".")[1]
                    : calculateTime(totalLabHours, true).result
                } ${
                  calculateTime(totalLabHours, true).result === 1
                    ? "hr"
                    : calculateTime(totalLabHours, true).result < 1
                      ? "mins"
                      : "hrs"
                }`
              : "0"}
          </p>
        </div>
      </div>
    </div>
  );
}

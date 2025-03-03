import { calculateUsageTime } from "@/lib/helpers/dateTime";
import { format } from "date-fns";

function UsageAndFooter({
  listOfRegularClass,
  listOfReservationClass,
  previousTotal,
  regularSubTotal,
  reservationSubTotal,
}) {
  const currentTotal = reservationSubTotal + regularSubTotal;
  const totalLabHours = previousTotal + currentTotal;

  const pClass = "w-full text-sm text-center mx-2 pt-2 border-gray-900";

  const calculateTime = (time, bool) => {
    const result = Number(calculateUsageTime(time, bool));
    const isMins = result < 1;
    return { isMins, result };
  };

  return (
    <>
      <div className="flex justify-around">
        <div className="flex w-full">
          <div className="flex-[2] border border-t-0 border-gray-900">
            {listOfRegularClass?.map((usage, index) => (
              <div key={index} className="flex w-full justify-center">
                <div className="flex w-[86px] shrink-0 border-r border-gray-900">
                  <p className={`${pClass} ${index < 6 && "border-b pt-2"}`}>
                    {usage.usage_date
                      ? format(new Date(usage.usage_date), "MM/dd/yy")
                      : "\u00a0\u00a0\u00a0"}
                  </p>
                </div>
                <p className={`${pClass} ${index < 6 && "border-b pt-2"}`}>
                  {usage.usage_hours
                    ? `${
                        calculateTime(usage.usage_hours, true).isMins
                          ? calculateTime(usage.usage_hours, true)
                              .result.toString()
                              .split(".")[1]
                          : calculateTime(usage.usage_hours, true).result
                      } ${
                        calculateTime(usage.usage_hours, true).result === 1
                          ? "hr"
                          : calculateTime(usage.usage_hours, true).result < 1
                            ? "mins"
                            : "hrs"
                      }`
                    : "\u00a0\u00a0"}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-1 items-center justify-center border-b border-r border-gray-900">
            <p className="break-words text-sm">
              {calculateTime(regularSubTotal, true).result > 0
                ? `${
                    calculateTime(regularSubTotal, true).isMins
                      ? calculateTime(regularSubTotal, true)
                          .result.toString()
                          .split(".")[1]
                      : calculateTime(regularSubTotal, true).result
                  } ${
                    calculateTime(regularSubTotal, true).result === 1
                      ? "hr"
                      : calculateTime(regularSubTotal, true).result < 1
                        ? "mins"
                        : "hrs"
                  }`
                : "\u00a0"}
            </p>
          </div>
        </div>

        <div className="flex w-full">
          <div className="flex-[2] border-b border-r border-gray-900">
            {listOfReservationClass?.map((usage, index) => (
              <div key={index} className="flex w-full justify-center">
                <div className="flex w-[86px] shrink-0 border-r border-gray-900">
                  <p className={`${pClass} ${index < 6 && "border-b pt-2"}`}>
                    {usage.usage_date
                      ? format(new Date(usage.usage_date), "MM-dd-yy")
                      : "\u00a0\u00a0\u00a0"}
                  </p>
                </div>
                <p className={`${pClass} ${index < 6 && "border-b pt-2"}`}>
                  {usage.usage_hours
                    ? `${calculateTime(usage.usage_hours, true).result} ${
                        calculateTime(usage.usage_hours, true).result < 2
                          ? "hr"
                          : calculateTime(usage.usage_hours, true).result < 1
                            ? "mins"
                            : "hrs"
                      }`
                    : "\u00a0\u00a0"}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-1 items-center justify-center border-b border-gray-900">
            <p className="break-words text-sm">
              {calculateTime(reservationSubTotal, true).result > 0
                ? `${
                    calculateTime(reservationSubTotal, true).isMins
                      ? calculateTime(reservationSubTotal, true)
                          .result.toString()
                          .split(".")[1]
                      : calculateTime(reservationSubTotal, true).result
                  } ${
                    calculateTime(reservationSubTotal, true).result === 1
                      ? "hr"
                      : calculateTime(reservationSubTotal, true).result < 1
                        ? "mins"
                        : "hrs"
                  }`
                : "\u00a0"}
            </p>
          </div>
        </div>

        <div className="flex w-full">
          <div className="flex w-full flex-col justify-around border border-t-0 border-gray-900 px-4 text-right">
            <p>Current:</p>
            <p>Previous:</p>
            <p>Total:</p>
          </div>
          <div className="flex w-full flex-col justify-around border-b border-r border-gray-900 px-4">
            <p className="border-b border-gray-900 pb-1">
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
                : previousTotal
                  ? 0
                  : "\u00a0"}
            </p>
            <p className="border-b border-gray-900 pb-1">
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
                : "\u00a0"}
            </p>
            <p className="border-b border-gray-900 pb-1">
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
                : "\u00a0"}
            </p>
          </div>
        </div>
      </div>
      <footer className="mt-4">
        <div className="flex w-full gap-1 px-8 text-sm italic">
          <p className="font-semibold">NOTE:</p>
          <p className="text-left">
            This form shall be prepared in two (2) copies; one (1) copy shall be
            submitted to the Department Head every Monday following the week of
            laboratory use, while the other shall be filed by the laboratory
            custodian with the corresponding laboratory attendance attached.
          </p>
        </div>
        <div className="mt-14 border-b border-t-8 border-gray-900 pt-1"></div>
        <p className="font-serifs mt-2 text-sm">
          F-13050-206/ Rev. #1 / Effectivity: July 23, 2021
        </p>
      </footer>
    </>
  );
}

export default UsageAndFooter;

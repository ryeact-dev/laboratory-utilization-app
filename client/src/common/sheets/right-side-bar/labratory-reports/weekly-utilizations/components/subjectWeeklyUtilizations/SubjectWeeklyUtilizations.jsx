import { useDeferredValue } from "react";
import UsageAndFooter from "./components/UsageAndFooter";
import ReportBody from "./components/ReportBody";
import logoUrl from "@/assets/UMLogo1.webp";
import headerText from "@/assets/academic_affairs_office_header.png";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import { format } from "date-fns";
import { eSign } from "@/lib/helpers/esignatures";

function SubjectWeeklyUtilizations({
  date,
  laboratory,
  componentToPrintRef,
  listOfUsage,
  currentUser,
  schedule,
  singleReport,
  totalHoursOfPreviousUsage,
  isLoadingTotalPreviousUsage,
  weekNumber,
}) {
  const whatToDisplay = listOfUsage ? "data" : null;

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

  // RENDER SECTION
  return (
    <>
      {whatToDisplay === null && (
        <NoRecordsFound>No records found.</NoRecordsFound>
      )}
      {whatToDisplay === "data" && (
        <article
          ref={componentToPrintRef}
          className="forPrint font-sans text-gray-900"
        >
          <header
            htmlFor="university-header-1"
            className="mt-2 flex w-full items-center justify-between gap-3"
          >
            <div className="flex flex-[3]">
              <figure className="my-auto ml-4 w-36 text-center">
                <img src={logoUrl} />
              </figure>
              <div className="border-l-2 border-gray-900">
                <figure className="w-80 pl-2 pt-1 text-center">
                  <img src={headerText} alt="weekly-header-text" />
                </figure>
                <h3 className="pl-3 pt-1 text-sm font-semibold">
                  WEEKLY LABORATORY UTILIZATION REPORT
                </h3>
              </div>
            </div>

            <div className="flex flex-[1.5] justify-end">
              {singleReport && singleReport?.dean_acknowledged && (
                <div className="w-full border-2 border-[#444484] p-1">
                  <div className="flex w-full flex-col items-end border-[1px] border-dashed border-[#444484] px-2 py-1 text-[#444484]">
                    <div className="-mb-6 w-full">
                      <p className="text-xl font-semibold uppercase">
                        Received:
                      </p>
                    </div>
                    <img
                      src={eSign("Jenny Rose Perocillo")}
                      className="h-14 w-24 object-contain object-center"
                      alt="esign"
                    />
                    <p className="-mt-6 text-sm font-semibold uppercase">
                      {`J. R. Perocillo, Dean's Office`}{" "}
                    </p>
                    <p className="-mt-1 text-sm font-semibold">
                      Date:{" "}
                      {format(
                        new Date(singleReport?.dean_acknowledged),
                        "MMM dd, yyyy",
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </header>
          {/* Divider */}
          <div className="mb-2 mt-4 border-b border-t-8 border-gray-900 pt-1"></div>
          {/* For Print */}
          {weekNumber && (
            <>
              <ReportBody
                singleReport={singleReport}
                schedule={schedule}
                currentUser={currentUser}
                weekNumber={weekNumber}
                laboratory={laboratory}
              />

              <UsageAndFooter
                listOfRegularClass={listOfRegularClass || []}
                listOfReservationClass={listOfReservationClass || []}
                previousTotal={previousTotal}
                regularSubTotal={regularSubTotal}
                reservationSubTotal={reservationSubTotal}
              />
            </>
          )}
        </article>
      )}
    </>
  );
}

export default SubjectWeeklyUtilizations;

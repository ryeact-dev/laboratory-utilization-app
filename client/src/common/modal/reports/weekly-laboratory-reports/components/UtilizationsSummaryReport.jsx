import {
  getRelativeWeekNumber,
  calculateUsageTime,
} from "@/lib/helpers/dateTime";
import { eSign } from "@/lib/helpers/esignatures";

function UtilizationsSummaryReport({
  listOfLaboratoryUsage,
  getClassLaboratoryUtilizations,
  componentToPrintRef,
  selectedDate,
  termDates,
  report,
}) {
  const summaryHeaderClass = "border border-grey-100 pl-2";
  const tableHeaderClass =
    "py-3.5 text-base font-semibold text-center border-grey-100 ";
  const acculatedHrsClass =
    "w-full text-base text-center border-grey-100 border-t-0 py-1";

  return (
    <article ref={componentToPrintRef} className="forPrint text-grey-100">
      <h2 className="my-3 text-center text-2xl font-bold tracking-wide">
        WEEKLY LABORATORY UTILIZATION REPORT
      </h2>
      <header
        htmlFor="weekly-summary-header"
        className="flex items-center text-lg font-semibold"
      >
        <div className="w-full">
          <h2 className={`${summaryHeaderClass}`}>
            Department: Laboratory Management Office
          </h2>
          <h2 className={`${summaryHeaderClass} border-t-0`}>
            Laboratory: {report?.laboratory}
          </h2>
        </div>
        <div className="w-full">
          <h2 className={`${summaryHeaderClass}`}>
            Date: <span>{selectedDate}</span>
          </h2>
          <h2 className={`${summaryHeaderClass} border-t-0`}>
            For week no.:{" "}
            <span className="pl-2">
              {getRelativeWeekNumber(termDates?.starting_date, selectedDate) ||
                0}
            </span>
          </h2>
        </div>
      </header>
      <div
        htmlFor="weekly-summary-table-header"
        className="mt-4 flex items-center justify-between"
      >
        <div className={`${tableHeaderClass} w-2/4 border`}>
          <p>Subject Code & Title</p>
        </div>
        <div className={`${tableHeaderClass} w-full border-b border-t`}>
          <p>Name of Instructor</p>
        </div>
        <div className="w-full text-center text-base font-semibold">
          <h2 className="border-grey-100 w-full border pb-[5px] pt-0.5">
            Accumulated Laboratory Utilization
          </h2>
          <div className="flex items-center justify-between text-sm">
            <p className="border-grey-100 w-full border border-t-0">Current</p>
            <p className="border-grey-100 w-full border-b border-t-0">
              Previous
            </p>
            <p className="border-grey-100 w-full border border-t-0">Total</p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-row md:flex-col">
        {listOfLaboratoryUsage
          ?.sort((a, b) => a.Subject.localeCompare(b.Subject))
          .map((schedule, index) => (
            <div
              key={index}
              className={`flex w-full flex-col items-start justify-between md:flex-row ${
                index % 2 === 0 ? "bg-base-100/5" : ""
              } `}
            >
              <div className="border-grey-100 w-2/4 border border-t-0 py-1 text-center">
                <h2 className="text-base font-medium">{schedule.Subject}</h2>
              </div>
              <div className="border-grey-100 w-full border-b border-t-0 py-1 text-center">
                <h2 className="text-base font-medium">
                  {schedule.Description}
                </h2>
              </div>
              <div className="flex w-full items-center justify-between">
                <h2 className={`${acculatedHrsClass} border font-normal`}>
                  {calculateUsageTime(
                    getClassLaboratoryUtilizations(schedule.SubjectId)
                      ?.current_usage,
                  )}
                </h2>
                <h2 className={`${acculatedHrsClass} border-b font-normal`}>
                  {calculateUsageTime(
                    getClassLaboratoryUtilizations(schedule.SubjectId)
                      ?.previous_usage,
                  )}
                </h2>
                <h2 className={`${acculatedHrsClass} border font-semibold`}>
                  {calculateUsageTime(
                    getClassLaboratoryUtilizations(schedule.SubjectId)?.total,
                  )}
                </h2>
              </div>
            </div>
          ))}
      </div>
      {/* <footer className='mt-16 flex items-start px-8'>
        <div className='w-full flex flex-col justify-end'>
          <p>Prepared by:</p>
          <div className=''>
            {eSign(custodian) === null ? (
              <p className='h-14'></p>
            ) : (
              <img
                src={eSign(custodian)}
                className='w-24 h-14 object-contain object-center'
                alt='esign'
              />
            )}
            <h2 className='text-lg font-bold mt-2 -mb-1'>{custodian}</h2>
            <p>Laboratory Custodian</p>
          </div>
        </div>
        <div className='w-full flex flex-col justify-end'>
          <p>Noted by:</p>
          <div className=''>
            <img
              src={eSign('Arnel Ang')}
              className='w-24 h-14 object-contain object-center'
              alt='esign'
            />
            <h2 className='text-lg font-bold mt-2 -mb-1'>Arnel Ang</h2>
            <p>LMO - Supervisor</p>
          </div>
        </div>
      </footer> */}
    </article>
  );
}

export default UtilizationsSummaryReport;

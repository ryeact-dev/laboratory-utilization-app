import { format } from "date-fns";
import logoUrl from "@/assets/UMLogo1.webp";
import headerText from "@/assets/academic_affairs_header.png";
import { getWeekDatesExcludeSunday } from "@/lib/helpers/dateTime";

export default function AttendanceHeaderAndDates({
  laboratory,
  date,
  listOfUsage,
  listOfDates,
}) {
  return (
    <>
      <div htmlFor="university-header" className="flex w-full text-xl">
        <figure className="my-auto mr-3 w-72 text-center">
          <img
            src={logoUrl}
            alt="umtc-logo"
            className="border border-gray-800 px-4 py-3.5"
          />
        </figure>
        <div className="w-full py-1">
          <div className="m-auto border border-gray-800 pb-2 text-center">
            <figure className="mx-auto w-64 py-1 text-center">
              <img src={headerText} alt="header-text" />
            </figure>

            <p className="-mt-1 text-sm">
              {" "}
              {`[ \u00a0\u00a0 ] Main  [ \u2713 ] Branch `}{" "}
              <span className="border-b border-gray-800 text-base">
                {
                  "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0 Tagum \u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"
                }
              </span>
            </p>
          </div>
          <div className="border border-t-0 border-gray-800 pt-1 text-center text-sm font-semibold">
            LABORATORY ATTENDANCE LOGSHEET
          </div>
        </div>
      </div>

      {/* Laboratory Details */}
      <div className="grid grid-cols-1 py-2 font-medium md:grid-cols-3">
        {/* Laboratory Name and Dates */}
        <div className="w-full">
          <div className="flex w-full items-center gap-2">
            <p className="pl-2">Laboratory:</p>
            <div className="-mt-2 w-full pr-4">
              <p className="pl-4">{laboratory}</p>
              <p className="w-full border-b border-gray-800"></p>
            </div>
          </div>

          <div className="mt-1 flex w-full items-center gap-2">
            <p className="min-w-36 pl-2">Dates Covered:</p>
            <div className="-mt-2 w-full pr-1">
              <p className="pl-4">{getWeekDatesExcludeSunday(date).week}</p>
              <p className="-ml-3 -mt-1 w-full border-b border-gray-800"></p>
            </div>
          </div>
        </div>

        {/* Subject COde and Time */}
        <div className="w-full">
          <div className="flex w-full items-center gap-2">
            <p className="min-w-36 pl-2">Subject Code:</p>
            <div className="-mt-2 w-full pr-4">
              <p className="pl-4">{listOfUsage[0].code}</p>
              <p className="w-full border-b border-gray-800"></p>
            </div>
          </div>

          <div className="mt-1 flex w-full items-center gap-2">
            <p className="pl-2"> Time:</p>
            <div className="-mt-2 w-full pr-4">
              <p className="pl-4">
                {format(new Date(listOfUsage[0].sched_start_time), "hh:mma")} -{" "}
                {format(new Date(listOfUsage[0].sched_end_time), "hh:mma")}
              </p>
              <p className="-mt-1 w-full border-b border-gray-800"></p>
            </div>
          </div>
        </div>

        {/* Subject title and Instructor */}
        <div className="w-full">
          <div className="flex w-full items-center gap-2">
            <p className="min-w-28 pl-2">Subject Title:</p>
            <div className="-mt-2 w-full pr-4">
              <p className="pl-4">{listOfUsage[0].title}</p>
              <p className="w-full border-b border-gray-800"></p>
            </div>
          </div>

          <div className="mt-1 flex w-full items-center gap-2">
            <p className="pl-2">Insructor:</p>
            <div className="-mt-2 w-full pr-4">
              <p className="pl-4">
                {listOfUsage[0].instructor_name
                  ? listOfUsage[0].instructor_name
                  : listOfUsage[0].instructor
                    ? listOfUsage[0].instructor
                    : "Not yet assigned"}
              </p>
              <p className="-mt-1 w-full border-b border-gray-800"></p>
            </div>
          </div>
        </div>
      </div>

      <div htmlFor="logsheet-header" className="text-left text-sm">
        <div className="flex items-center justify-between">
          <div className="w-full min-w-[233px] border border-gray-800 bg-[#d9d9d9] py-[11px] text-center text-base">
            Name of Student
          </div>
          {listOfDates.map(({ usage_date }, index) => (
            <div
              key={index}
              className="h-12 w-96 border border-l-0 border-gray-800 bg-[#d9d9d9] align-bottom"
            >
              <p className="border-b border-gray-800 px-1">
                Date:{" "}
                {usage_date
                  ? format(new Date(usage_date), "MM-dd-yy")
                  : "\u00a0"}
              </p>
              <p className="w-full pt-0.5 text-center">Signature</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

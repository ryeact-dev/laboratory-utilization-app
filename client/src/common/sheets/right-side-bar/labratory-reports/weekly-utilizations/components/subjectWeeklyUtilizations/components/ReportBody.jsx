import { eSign } from "@/lib/helpers/esignatures";
import { techAssistants } from "@/lib/helpers/techAssistants";

import { format } from "date-fns";

export default function ReportBody({
  weekNumber,
  laboratory,
  schedule,
  singleReport,
  currentUser,
}) {
  const {
    instructor,
    code,
    title,
    sched_end_time,
    sched_start_time,
    subject_start_time,
    subject_end_time,
  } = schedule;

  const techAssistant = techAssistants(laboratory);
  const currentUserAsCustodian =
    currentUser.role === "Custodian" ? currentUser.fullName : null;

  const currentCustodian = singleReport?.custodian
    ? singleReport.custodian
    : currentUserAsCustodian;

  const labCustodian =
    currentCustodian === instructor ? techAssistant : currentCustodian;

  // RENDER SECTION
  return (
    <>
      <div className="border border-gray-900 px-4 pt-4">
        <p className="text-right">
          Week No.: <span className="pl-4 pr-2">{weekNumber}</span>
        </p>
        <p className="text-right">
          Date:{" "}
          <span className="pl-4 pr-2">
            {singleReport
              ? format(new Date(singleReport.created_at), "MMM dd, yyyy")
              : format(new Date(), "MMM dd, yyyy")}
          </span>
        </p>
        <div className="-mb-4 leading-7">
          <div className="flex gap-4">
            <p>To: </p>
            <p className="border-b border-gray-900">Dr. Gina Fe Israel</p>
          </div>
          <p className="pl-10">Dean of College</p>
        </div>
        <p className="mt-10">Sir/Madam:</p>
        <p className="mb-6 px-16 text-center leading-7 tracking-wide">
          Respectfully submitting to your office the individual laboratory
          utilization report of{" "}
          <span className="font-semibold">{instructor} </span> covering the
          dates as stated below.
        </p>
      </div>

      <div className="flex items-center">
        <div className="flex h-44 w-full flex-col justify-between border border-t-0 border-gray-900 px-4 pt-4">
          <h2>Prepared By:</h2>
          <div className="flex items-end justify-between">
            <div className="-mt-10 flex w-56 flex-col">
              {singleReport && (
                <div className="mx-auto">
                  {/* If custodian is same as the instructor then then show eSign will be tech assistant */}
                  {currentCustodian === instructor ? (
                    eSign(labCustodian) === null ||
                    !singleReport.custodian_esign ? (
                      <p className="h-14"></p>
                    ) : (
                      <img
                        src={eSign(labCustodian)}
                        className="h-14 w-24 object-contain object-bottom"
                        alt="esign-tech-assistant"
                      />
                    )
                  ) : (
                    <img
                      src={
                        import.meta.env.VITE_LOCAL_BASE_URL +
                        singleReport.custodian_esign
                      }
                      className="h-14 w-24 object-contain object-bottom"
                      alt="esign-custodian"
                    />
                  )}
                </div>
              )}

              <p className="w-full break-words border-b border-gray-900 text-center font-semibold leading-5">
                {labCustodian}
                {currentCustodian === instructor && " - Tech. Asst."}
              </p>
              <p className="text-center">Laboratory Custodian</p>
            </div>
            <div className="text-center">
              <p className="border-b border-gray-900 font-semibold">
                {singleReport
                  ? format(new Date(singleReport.created_at), "MMM dd, yyyy")
                  : `\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0`}
              </p>
              <p>Date</p>
            </div>
          </div>
        </div>
        <div className="flex h-44 w-full flex-col justify-between border-b border-r border-gray-900 px-4 pt-4">
          <h2>Acknowledged By:</h2>
          <div className="flex items-end justify-between">
            <div className="-mt-10 flex w-56 flex-col">
              {singleReport?.instructor_acknowledged && (
                <div className="mx-auto">
                  {singleReport.instructor_esign === null ? (
                    <p className="h-14"></p>
                  ) : (
                    <img
                      src={
                        import.meta.env.VITE_LOCAL_BASE_URL +
                        singleReport.instructor_esign
                      }
                      className="h-14 w-24 object-contain object-center"
                      alt="esign"
                    />
                  )}
                </div>
              )}
              <p className="w-full break-words border-b border-gray-900 text-center font-semibold leading-5">
                {singleReport?.instructor_acknowledged
                  ? instructor
                    ? instructor
                    : "No yet assigned"
                  : ""}
              </p>
              <p className="text-center">Instructor</p>
            </div>
            <div className="text-center">
              <p className="border-b border-gray-900 font-semibold">
                {singleReport?.instructor_acknowledged
                  ? format(
                      new Date(singleReport.instructor_acknowledged),
                      "MMM dd, yyyy",
                    )
                  : `\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0`}
              </p>
              <p>Date</p>
            </div>
          </div>
        </div>
      </div>
      {/* Box 2 */}
      <div className="mt-4 grid grid-flow-row grid-cols-3">
        <div className="col-span-3 border border-gray-900 p-2">
          Laboratory: {laboratory}
        </div>
        <div className="w-full border border-t-0 border-gray-900 p-2">
          Code: {code}{" "}
        </div>
        <div className="w-full border-b border-gray-900 p-2">
          Course: {title}{" "}
        </div>
        <div className="w-full border border-t-0 border-gray-900 p-2">
          Time:{" "}
          {format(
            new Date(
              subject_start_time
                ? `2024-03-15T${subject_start_time}`
                : sched_start_time,
            ),
            "hh:mm a",
          )}{" "}
          -{" "}
          {format(
            new Date(
              subject_start_time
                ? `2024-03-15T${subject_end_time}`
                : sched_end_time,
            ),
            "hh:mm a",
          )}{" "}
        </div>
        <div className="flex w-full items-center justify-center border border-t-0 border-gray-900 px-2 text-center">
          <p>Regular Class</p>
        </div>
        <div className="flex w-full items-center justify-center border-b border-gray-900 px-2 text-center">
          <p>Laboratory Make-up</p>
        </div>
        <div className="row-span-2 flex w-full items-center justify-center border border-t-0 border-gray-900 px-2 text-center">
          <p>Total Lab Hours </p>
        </div>
        <div className="flex items-center justify-around text-sm">
          <p className="flex h-full flex-1 items-center justify-center border border-t-0 border-gray-900 text-center">
            Date(s)
          </p>
          <p className="flex h-full flex-1 items-center justify-center border-b border-gray-900 text-center">
            # of Hours
          </p>
          <p className="flex h-full flex-1 items-center justify-center border border-t-0 border-gray-900 text-center">
            Sub Total
          </p>
        </div>
        <div className="flex items-center justify-around text-sm">
          <p className="flex h-full flex-1 items-center justify-center border-b border-r border-gray-900 text-center">
            Date(s)
          </p>
          <p className="flex h-full flex-1 items-center justify-center border-b border-gray-900 text-center">
            # of Hours
          </p>
          <p className="flex h-full flex-1 items-center justify-center border-b border-l border-gray-900 text-center">
            Sub Total
          </p>
        </div>
      </div>
    </>
  );
}

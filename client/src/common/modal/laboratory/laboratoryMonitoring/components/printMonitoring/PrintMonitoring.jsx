import labMonitoringHeader from "@/assets/labMonitoringHeader.png";
import labMonitoringFooter from "@/assets/labMonitoringFooter.png";
import { getRelativeWeekNumber } from "@/lib/helpers/dateTime";
import { format } from "date-fns";
import { technicianOnDuty } from "@/lib/helpers/techAssistants";
import { eSign } from "@/lib/helpers/esignatures";
import { COMPUTING_LAB_REMARKS } from "@/globals/initialValues";

import workstationMonitoringForm from "@/assets/workstationMonitoringForm.webp";

export default function PrintMonitoring({
  componentToPrintRef,
  listOfLabMonitoring,
  currentUser,
  termSemStartingDate,
  laboratory,
}) {
  // Generate the PC Numbers
  const pcNumbers = Array(9)
    .fill("")
    .map((item, index) => index + 1);

  // Generate the Date Header
  const monitoringHeader = Array(5).fill("Date:");

  const weekNumber = getRelativeWeekNumber(
    termSemStartingDate,
    listOfLabMonitoring[0]?.usage_date,
  );

  const internetSpeed = (monitoringData) => {
    const filterData = monitoringData.filter(
      (item) => item.remark === "Internet Speed",
    );
    return `${filterData[0]?.problem} MBPS`;
  };

  // Student PC Remarks
  const pcRemark = (monitoringData, usageDate) => {
    const remarkCreatedDate = new Date(monitoringData?.created_at);

    if (remarkCreatedDate !== usageDate) return "\u00a0";

    const filterData = monitoringData.filter(
      (item) =>
        item.remark !== "Internet Speed" && item.remark !== "No problems found",
    );

    if (filterData.length === 0) return "\u00a0";

    let remarks = "";
    if (filterData.length > 1) {
      remarks = filterData.map((item) => item.remark.split(".")[0]).join(", ");
    } else {
      remarks = filterData[0]?.remark.split(".")[0];
    }
    return remarks;
  };

  // Teacher Remarks
  const teacherPCRemarks = (monitoringData) => {
    // For each node filter each details
    const filterData = monitoringData
      .map((monitoring) => {
        const teacherRemark = monitoring.details.filter(
          (item) => Number(item.unit_number) === 51,
        );

        return { problem: teacherRemark[0]?.problem || "" };
      })
      .filter((result) => result.problem.trim() !== "");

    if (filterData.length === 0) return "\u00a0";

    let remarks = "";
    if (filterData.length > 1) {
      remarks = filterData.map((item) => item.problem.split(".")[0]).join(", ");
    } else {
      remarks = filterData[0]?.problem.split(".")[0];
    }
    return remarks;
  };

  return (
    <div
      // className="text-grey-100 forPrint -mt-1.5 h-full w-full bg-white font-[calibri]"
      className="relative -mt-1.5 h-full w-full font-[calibri] text-gray-700"
      ref={componentToPrintRef}
    >
      {/* Background Image */}
      <header className="absolute left-0 top-0 -z-10">
        <img
          src={workstationMonitoringForm}
          alt="labMonitoringHeader"
          className="w-full object-cover"
        />
      </header>

      {/* Sub Header */}
      <section className="w-full pt-40">
        <div className="-mt-1 flex w-full">
          <div className="flex-1">
            <p className="pl-2 text-center font-semibold">
              {`Week ${weekNumber}`}
            </p>
          </div>

          <div className="flex-1">
            <p className="ml-20 font-semibold">
              {format(
                new Date(listOfLabMonitoring[0]?.sched_start_time),
                "hh:mma",
              )}{" "}
              -
              {format(
                new Date(listOfLabMonitoring[0]?.sched_end_time),
                "hh:mma",
              )}
            </p>
          </div>

          <div className="flex-1">
            <p className="font-semibold">{laboratory}</p>
          </div>
        </div>

        <div className="flex w-full">
          <div className="flex-1">
            <p className="text-center font-semibold">
              {listOfLabMonitoring[0]?.code}
            </p>
          </div>

          <div className="flex-1">
            <p className="ml-20 font-semibold">
              {listOfLabMonitoring[0]?.title}
            </p>
          </div>

          <div className="flex-1">
            <p className="font-semibold">
              {listOfLabMonitoring[0]?.instructor}
            </p>
          </div>
        </div>
      </section>

      {/*  Body  */}
      <section className="mt-4">
        <div className="ml-20 flex">
          {monitoringHeader.map((date, index) => (
            <div key={index} className={`flex-1`}>
              {/* Date */}
              <p className="ml-16 text-sm font-medium leading-4">
                {listOfLabMonitoring[index]?.usage_date
                  ? format(
                      new Date(listOfLabMonitoring[index]?.usage_date),
                      "MMM dd, yyyy",
                    )
                  : "\u00a0"}
              </p>

              {/* Internet Speed */}
              <p className="ml-16 mt-1 text-sm font-medium">
                {listOfLabMonitoring[index]?.usage_date
                  ? internetSpeed(listOfLabMonitoring[index]?.details)
                  : "\u00a0"}
              </p>

              {/* PC Numbers */}
              {listOfLabMonitoring[index]?.usage_date && (
                <div className="mt-14">
                  {pcNumbers.map((pcNumber, index) => (
                    <div key={index} className="flex">
                      <p className="">{pcNumber}</p>
                      <div className="">
                        <p className="">
                          {`\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0 ${
                            listOfLabMonitoring[index]?.usage_date
                              ? pcRemark(
                                  listOfLabMonitoring[index]?.details,
                                  listOfLabMonitoring[index]?.usage_date,
                                )
                              : "\u00a0"
                          } \u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Problem Remarks */}
      {/* <section className="border-grey-100 mx-1 flex border-[1px]">
        <div className="flex-[2] p-1">
          <p className="-mt-1 text-sm font-medium">Problem/Defect:</p>
          <div className="flex flex-wrap">
            {COMPUTING_LAB_REMARKS.slice(3, 6).map(({ remark, width }) => (
              <p key={remark} className={`text-xs ${width} `}>
                {remark}
              </p>
            ))}
          </div>
          <div className="flex flex-wrap">
            {COMPUTING_LAB_REMARKS.slice(7, 10).map(({ remark, width }) => (
              <p key={remark} className={`text-xs ${width} `}>
                {remark}
              </p>
            ))}
          </div>
          <div className="flex flex-wrap">
            {COMPUTING_LAB_REMARKS.slice(11, 13).map(({ remark, width }) => (
              <p key={remark} className={`text-xs ${width}`}>
                {remark}
                {remark === "h. others" && (
                  <span className="border-grey-100 border-b-[1px]">{`\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0`}</span>
                )}
              </p>
            ))}
          </div>
        </div>
        <div className="border-grey-100 flex-[1.5] border-l-[1px] p-1">
          <p className="-mt-1 text-sm font-medium">Remarks</p>
        </div>
      </section> */}

      {/* Custodian Name */}
      {/* <section className="mx-1 mb-1 mt-8">
        <div className="flex items-end justify-end gap-1">
          <p className="-mb-2">Laboratory Custodian:</p>
          <div className="-mt-1 flex w-72 flex-col items-center justify-center">
            <img
              src={currentUser.esignURL}
              className="h-10 w-24 object-cover object-center"
              alt="esign"
            />
            <p className="-mt-3">{currentUser.fullName}</p>
            <p className="border-grey-100 -mt-7 w-full border-b-[1px]">{`\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0`}</p>
          </div>
        </div>
      </section> */}
      {/* Form Number */}
      {/* <footer className="-mt-0.5 w-full">
        <img
          src={labMonitoringFooter}
          alt="labMonitoringFooter"
          className="w-full object-cover"
        />
      </footer> */}
    </div>
  );
}

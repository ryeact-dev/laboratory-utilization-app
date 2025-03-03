import { format, isSameDay } from "date-fns";
import { technicianOnDuty } from "@/lib/helpers/techAssistants";
import { eSign } from "@/lib/helpers/esignatures";

import ListOfProblems from "./components/list-of-problems/ListOfProblems";
import PrintMonitoringHeaders from "./components/print-monitoring-headers/PrintMonitoringHeaders";

export default function PrintMonitoring({
  componentToPrintRef,
  listOfLabMonitoring,
  weekNumber,
  laboratory,
  currentUser,
}) {
  // Generate the Date Header
  const monitoringHeader = Array(5).fill("Date:");

  const internetSpeed = (monitoringData) => {
    const filterData = monitoringData.filter(
      (item) => item.remark === "Internet Speed",
    );
    return `${filterData[0]?.problem} MBPS`;
  };

  // Student PC Remarks
  const noProblemsFound = (monitoringData, usageDate) => {
    if (!usageDate) return false;

    const filterData = monitoringData.filter(
      (item) =>
        item.remark === "No problems found" &&
        isSameDay(new Date(item.usage_date), new Date(usageDate)),
    );

    console.log("filterData", filterData);

    return filterData.length === 0 ? false : true;
  };

  // Student PC Remarks
  const othersProblemFound = (monitoringData, usageDate) => {
    if (!usageDate) return false;

    const filterData = monitoringData.filter(
      (item) =>
        item.remark === "Others" &&
        isSameDay(new Date(item.usage_date), new Date(usageDate)),
    );

    return filterData[0]?.problem;
  };

  const isCustodianTheTeacher =
    currentUser.fullName === listOfLabMonitoring[0]?.instructor;
  const techOnDuty = technicianOnDuty(laboratory);

  const checkedBy = isCustodianTheTeacher ? techOnDuty : currentUser.fullName;
  const checkedByEsignURL = isCustodianTheTeacher
    ? eSign(techOnDuty)
    : import.meta.env.VITE_LOCAL_BASE_URL + currentUser.esignURL;

  return (
    <div
      // className="text-grey-100 forPrint -mt-1.5 h-full w-full bg-white font-[calibri]"
      className="forPrint relative -mt-1.5 h-full w-full font-[calibri] text-black"
      ref={componentToPrintRef}
    >
      {/* Print Monitoring Headers */}
      <PrintMonitoringHeaders
        weekNumber={weekNumber}
        listOfLabMonitoring={listOfLabMonitoring}
        laboratory={laboratory}
      />

      {/*  Body  */}
      <div className="ml-11 mr-14 grid grid-cols-5">
        {monitoringHeader.map((date, index) => (
          <div key={index} className="mt-4">
            {/* Date */}
            <p className="ml-24 text-sm font-medium leading-4">
              {listOfLabMonitoring[index]?.usage_date
                ? format(
                    new Date(listOfLabMonitoring[index]?.usage_date),
                    "MMM dd, yyyy",
                  )
                : "\u00a0"}
            </p>

            {/* Internet Speed */}
            <p className="ml-24 mt-1 text-sm font-medium">
              {listOfLabMonitoring[index]?.usage_date
                ? internetSpeed(listOfLabMonitoring[index]?.details)
                : "\u00a0"}
            </p>

            <div key={index} className="ml-3 mt-1 text-xs">
              <p>
                {noProblemsFound(
                  listOfLabMonitoring[index]?.details,
                  listOfLabMonitoring[index]?.usage_date,
                )
                  ? `✔`
                  : "\u00a0"}
              </p>
            </div>

            {/* PC Numbers */}
            <ListOfProblems
              singleMonitoringData={listOfLabMonitoring[index]?.details}
              usageDate={listOfLabMonitoring[index]?.usage_date}
            />

            <div className="mt-12 h-14 px-4 pt-1 text-xs leading-3">
              {noProblemsFound(
                listOfLabMonitoring[index]?.details,
                listOfLabMonitoring[index]?.usage_date,
              )
                ? "All units checked and functioning."
                : othersProblemFound()}
            </div>
          </div>
        ))}
      </div>

      {/* Custodian Name */}
      <footer className="mx-2 mb-1 mt-8">
        <div className="-mt-1 flex w-72 flex-col items-center justify-center">
          <img
            src={checkedByEsignURL}
            className="h-10 w-24 object-cover object-center"
            alt="esign"
          />
          <p className="-mt-3">{checkedBy}</p>
        </div>
        <div className="my-6">{"\u00a0"}</div>
      </footer>
    </div>
  );
}

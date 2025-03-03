import { useGetUtilizationsWithDateRange } from "@/hooks/utilizations.hook";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import ForPrintWeeklyAttendance from "./components/forPrintWeeklyAttendance/ForPrintWeeklyAttendance";
import ReportHeader from "../report-header/ReportHeader";

export default function UtilizationsWeeklyAttendanceSheetBody({ dataObj }) {
  const {
    weekDates,
    date,
    subjectId,
    laboratory,
    selectedTermAndSem,
    schedule,
    weekNumber,
    activeSchoolYear,
    currentUser,
  } = dataObj;

  const { isLoading: isLoadingUsage, data: listOfUsage } =
    useGetUtilizationsWithDateRange(
      subjectId,
      laboratory, //  undefined if no laboratory to passed
      activeSchoolYear,
      weekDates,
      selectedTermAndSem,
      false, // true if data needs to aggregate
    );

  const whatToDisplay =
    !isLoadingUsage && listOfUsage?.length > 0 ? "data" : null;

  // RENDER SECTION
  return (
    <>
      <ReportHeader schedule={schedule} weekNumber={weekNumber} />
      {isLoadingUsage ? (
        <LoadingSpinner />
      ) : whatToDisplay === "data" ? (
        <ForPrintWeeklyAttendance
          listOfUsage={listOfUsage}
          classlist={listOfUsage[0]?.students}
          date={date}
          laboratory={laboratory}
          currentUser={currentUser}
        />
      ) : (
        <NoRecordsFound>No Records Found.</NoRecordsFound>
      )}
    </>
  );
}

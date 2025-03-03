import { useRef } from "react";
import ReactToPrint from "react-to-print";
import UtilizationsSummaryReport from "./components/UtilizationsSummaryReport";
import UtilizationDataTable from "./components/UtilizationsDataTable";
import { format } from "date-fns";
import { useGetLaboratoryWeeklyUtilizations } from "@/hooks/utilizations.hook";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import Information from "@/common/information/Information";
import { useGetSelectedTermSemDates } from "@/hooks/termSemSchoolYear.hook";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import { getWeekDatesExcludeSunday } from "@/lib/helpers/dateTime";
import { TEMPORARY_DEAN_UUID } from "@/globals/initialValues";
import { useSubmitLabWeeklyReport } from "@/hooks/laboratoryWeeklyUsage.hook";
import { useGetSchedulerSchedules } from "@/hooks/schedules.hook";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import { Button } from "@/common/ui/button";
import { CircleCheck, CircleX, Printer } from "lucide-react";

const aggregatedSubjects = (listOfSubjects) => {
  if (listOfSubjects.length === 0) return [];
  const aggregatedSubjects = [];

  listOfSubjects?.forEach((subject) => {
    const index = aggregatedSubjects.findIndex((aggregatedSubject) => {
      return aggregatedSubject.SubjectId === subject.SubjectId;
    });

    if (index === -1) aggregatedSubjects.push(subject);
  });

  return aggregatedSubjects;
};

export default function WeeklyLaboratoryReportsModalBody({
  extraObject,
  closeModal,
}) {
  const { report, selectedTermAndSem, activeSchoolYear, wasAcknowledged } =
    extraObject;

  const componentToPrintRef = useRef();

  const date = new Date(report.selected_date);

  const { currentUser } = useGetCurrentUserData();

  const { mutate: onSingleAknowledgeMutation, isPending } =
    useSubmitLabWeeklyReport(closeModal);

  const { data: termDates = [] } = useGetSelectedTermSemDates(
    selectedTermAndSem,
    activeSchoolYear,
    true,
  );

  const selectedTermAndSemDates = termDates?.filter(
    (date) => date.term_sem === selectedTermAndSem,
  )[0];

  const { isLoading: isLoadingSchedule, data: listOfSchedule = [] } =
    useGetSchedulerSchedules(
      report.laboratory,
      activeSchoolYear,
      selectedTermAndSem,
      currentUser,
    );

  const {
    isLoading: isLoadingUsage,
    data: listOfUsage = [],
    isError,
    error,
  } = useGetLaboratoryWeeklyUtilizations(
    report.laboratory,
    activeSchoolYear,
    selectedTermAndSem,
    undefined, // undefined if no subjectId
    date,
    listOfSchedule,
  );

  isError && ToastNotification("error", error?.response.data);

  const printSummaryReportBtn = (
    <button
      type="button"
      // disabled={listOfUsage?.length === 0}
      className="btn btn-secondary btn-sm h-10 text-sm font-medium normal-case text-white"
    >
      <Printer size={20} strokeWidth={2.5} />
      Print Summary Report
    </button>
  );

  const whatToDisplay =
    !isLoadingSchedule && listOfSchedule?.length > 0 ? "data" : null;

  // FORMAT SELECTED DATE
  const selectedDate = format(
    new Date(getWeekDatesExcludeSunday(date)?.weekDates[5]),
    "MMM dd, yyyy",
  );

  // Filter the usage by subjectId
  const getClassLaboratoryUtilizations = (subjectId) => {
    const usage = listOfUsage?.filter(
      (usage) => usage.subject_id === subjectId,
    );
    return usage[0];
  };

  const onAcknowledgeClick = () => {
    const forUpdatingData = {
      report,
      deanId: TEMPORARY_DEAN_UUID,
    };

    onSingleAknowledgeMutation({ forUpdatingData, isNew: false });
  };

  // AGGREGATE SUBJECTS (REMOVE DUPLICATION OF SUBJECTS)
  const listOfSubjects =
    !isLoadingSchedule && listOfSchedule?.length > 0
      ? aggregatedSubjects(listOfSchedule)?.filter(
          (schedule) => schedule.ScheduleData.program === currentUser.program,
        )
      : [];

  // RENDER SECTION
  return (
    <>
      {whatToDisplay === null && (
        <NoRecordsFound>No records found.</NoRecordsFound>
      )}
      {whatToDisplay === "data" && (
        <div className="h-max">
          <div className="items-center justify-between md:-mt-2 md:flex">
            <div className="items-center gap-3 md:flex">
              {currentUser.role !== "Faculty" &&
                currentUser.role !== "Program Head" && (
                  <ReactToPrint
                    // pageStyle={'@page { size: landscape; }'}
                    trigger={() => printSummaryReportBtn}
                    content={() => componentToPrintRef.current}
                  />
                )}

              {!wasAcknowledged ? (
                <Button
                  onClick={onAcknowledgeClick}
                  type="button"
                  variant="secondary"
                  disabled={isPending}
                >
                  <CircleCheck size={20} strokeWidth={2.5} />
                  {isPending ? "Submitting.." : "Acknowledge"}
                </Button>
              ) : (
                <div className="flex h-10 items-center gap-3 rounded-lg border border-green-600 bg-green-700/10 px-4 py-2 text-green-600">
                  <CircleCheck size={20} strokeWidth={2.5} /> Acknowledged
                </div>
              )}
            </div>
            <div>
              <p className="-mb-1 text-right text-xl font-medium text-secondary">
                Week No: {report.week_number}
              </p>
              <p>{getWeekDatesExcludeSunday(date)?.week}</p>
            </div>
          </div>
          {/* <Information
            title={"Print Info"}
            message={
              "For better print result please set the ff. settings: Scaling: 100, Papersize: A4, Layout: Landscape"
            }
            className={"mb-4 mt-2"}
          /> */}
          <UtilizationDataTable
            getClassLaboratoryUtilizations={getClassLaboratoryUtilizations}
            listOfSchedule={listOfSubjects}
            laboratory={report?.laboratory}
            selectedTermAndSem={selectedTermAndSem}
            activeSchoolYear={activeSchoolYear}
            currentUser={currentUser}
          />

          <UtilizationsSummaryReport
            getClassLaboratoryUtilizations={getClassLaboratoryUtilizations}
            listOfSchedule={listOfSubjects}
            currentUser={currentUser}
            componentToPrintRef={componentToPrintRef}
            termDates={selectedTermAndSemDates}
            report={report}
            selectedDate={selectedDate}
          />
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <Button type="button" variant="destructive" onClick={closeModal}>
          <CircleX size={20} strokeWidth={2.5} /> Close
        </Button>
      </div>
    </>
  );
}

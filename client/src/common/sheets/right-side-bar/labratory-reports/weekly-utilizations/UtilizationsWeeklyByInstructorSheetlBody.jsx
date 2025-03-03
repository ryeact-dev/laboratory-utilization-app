import { useRef } from "react";
import ReactToPrint from "react-to-print";
import {
  useGetPreviousUtilizations,
  useGetUtilizationsWithDateRange,
} from "@/hooks/utilizations.hook";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import Information from "@/common/information/Information";
import {
  useGetSubmittedWeeklyReports,
  useSubmitReport,
} from "@/hooks/instructorWeeklyUsage.hook";
import SubjectWeeklyUtilizations from "./components/subjectWeeklyUtilizations/SubjectWeeklyUtilizations";
import LaboratoryHours from "./components/laboratoryHours/LaboratoryHours";
import LaboratoryUtilizations from "./components/laboratoryUtilizations/LaboratoryUtilizations";
import {
  TEMPORARY_DEAN_UUID,
  WEEKLY_USER_ROLE_STEP,
} from "@/globals/initialValues";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { Button } from "@/common/ui/button";
import Stepper from "@/common/stepper/Stepper";
import { Label } from "@/common/ui/label";
import ReportHeader from "../report-header/ReportHeader";
import { CircleCheck, Printer, Send } from "lucide-react";

const STEPS = ["Custodian", "Instructor", "Dean"];

export default function UtilizationsWeeklyByInstructorSheetlBody({ dataObj }) {
  const componentToPrintRef = useRef();

  const {
    weekDates,
    date,
    laboratory,
    schedule,
    selectedTermAndSem,
    weekNumber,
    currentUser,
    activeSchoolYear,
  } = dataObj;

  // *REPORT MUTATION
  const { mutate: onSubmitReportMutation, isPending } = useSubmitReport();

  // *FETCH LIST OF USAGE FOR SELECTED SUBJECT
  const { isLoading: isLoadingUsage, data: listOfUsage = [] } =
    useGetUtilizationsWithDateRange(
      schedule.subject_id,
      laboratory, //  undefined if no laboratory to passed
      activeSchoolYear,
      weekDates,
      selectedTermAndSem,
      false, // true if data needs to aggregate
    );

  // *FETCH SINGLE REPORT
  const { data: singleReport } = useGetSubmittedWeeklyReports({
    subjectId: schedule?.subject_id,
    weekDates,
  });

  const isForAcknowledgement = singleReport?.step > 0;

  // *FETCH PREVIOUS SUBJECT USAGE
  const { isLoading: isLoadingTotalPreviousUsage, data: subjectUsage } =
    useGetPreviousUtilizations(
      schedule.code,
      schedule.title,
      activeSchoolYear,
      weekDates[0], // base date
    );

  // *COMPONENT LOGIC
  const submitBtnDisable =
    singleReport?.step && !isPending
      ? singleReport?.step >= WEEKLY_USER_ROLE_STEP[currentUser.role]
      : false;

  // PROPS DRILL TO CHILDRENS TO GET THE TOTAL LABORATORY HOURS
  let usageHours;
  const getTotalWeekLaboratoryHours = (totalLabHours) => {
    usageHours = totalLabHours;
  };

  // IF THE CUSTODIAN IS THE SAME AS THE INSTRUCTOR THEN IT WILL SEND DIRECTLY TO THE DEAN
  const userStep = currentUser.userId === schedule.instructor_id ? 2 : null;

  const onSubmit = (evt) => {
    evt.preventDefault();

    let forAddingData = {
      scheduleId: schedule.id,
      utilizationId: listOfUsage[0]?.id,
      usageDate: listOfUsage[0]?.usage_date,
      subjectId: schedule.subject_id,
      subjectCode: schedule.code,
      subjectTitle: schedule.title,
      weekDates,
      selectedDate: weekDates[weekDates.length - 1],
      activeSchoolYear,
    };

    if (currentUser.role === "Custodian") {
      // IF THE CUSTODIAN WILL ACKNOWLEDGE THE REPORT THAT WAS SUBMITTED TO HIM/HER FROM ANOTHER LAB CUSTODIAN
      if (isForAcknowledgement) {
        forAddingData = {
          ...forAddingData,
          deanId: TEMPORARY_DEAN_UUID,
        };
      } else {
        // IF THE CUSTODIAN SUBMITS REPORT TO THE INSTRUCTOR
        forAddingData = {
          ...forAddingData,
          termSem: selectedTermAndSem,
          laboratory,
          usageHours,
          weekNumber: Number(weekNumber),
          instructorId: schedule.instructor_id,
          userStep,
        };
      }
    } else if (
      currentUser.role === "Faculty" ||
      currentUser.role === "Program Head"
    ) {
      forAddingData = {
        ...forAddingData,
        deanId: TEMPORARY_DEAN_UUID,
      };
    } else if (currentUser.role === "Dean") {
      // forAddingData = {
      //   ...forAddingData,
      // };
    } else return ToastNotification("error", "Unauthorized User");

    if (currentUser.role === "Custodian") {
      if (isForAcknowledgement) {
        onSubmitReportMutation({ forAddingData, isNew: false });
      } else {
        onSubmitReportMutation({ forAddingData, isNew: true });
      }
    } else {
      onSubmitReportMutation({ forAddingData, isNew: false });
    }
  };

  // *PRINT BUTTON COMPONENT
  const printResultsBtn = (
    <Button className="float-right">
      <Printer size={20} strokeWidth={2.5} /> Print Utilization Report
    </Button>
  );

  // RENDER SECTION
  return isLoadingUsage ? (
    <LoadingSpinner />
  ) : (
    <div className="h-full space-y-4">
      <Stepper steps={STEPS} singleReport={singleReport} />
      <ReportHeader schedule={schedule} weekNumber={weekNumber} />
      <div className="space-y-4">
        <LaboratoryHours
          listOfUsage={listOfUsage}
          getTotalWeekLaboratoryHours={getTotalWeekLaboratoryHours}
          isLoadingTotalPreviousUsage={isLoadingTotalPreviousUsage}
          totalHoursOfPreviousUsage={subjectUsage?.totalHoursOfPreviousUsage}
        />
        <LaboratoryUtilizations
          schedule={schedule}
          currentUser={currentUser}
          listOfUsage={listOfUsage}
        />
      </div>

      {/* For Print Component */}
      <SubjectWeeklyUtilizations
        isLoadingTotalPreviousUsage={isLoadingTotalPreviousUsage}
        totalHoursOfPreviousUsage={subjectUsage?.totalHoursOfPreviousUsage}
        schedule={schedule}
        currentUser={currentUser}
        listOfUsage={listOfUsage}
        weekDates={weekDates}
        date={date}
        subjectId={schedule.subject_id}
        laboratory={laboratory}
        componentToPrintRef={componentToPrintRef}
        singleReport={singleReport}
        weekNumber={weekNumber}
      />

      {/* For Print Component */}
      {/* {new Date(date) <= currentDate &&
        !isSameWeek(currentDate, date, { weekStartsOn: 1 }) && ( */}
      <div>
        {currentUser.role !== "Faculty" &&
          currentUser.role !== "Program Head" && (
            <Information
              title={"Print Info"}
              message={
                "For better print result please set the ff. settings: Scaling: 95-96, Papersize: A4, Layout: Portrait"
              }
            />
          )}
        <div className="mb-2 mt-4 flex justify-between gap-2">
          <form onSubmit={onSubmit} className="flex gap-2">
            {currentUser.role !== "STA" && currentUser.role !== "Admin" ? (
              submitBtnDisable && isForAcknowledgement ? (
                currentUser.role === "Custodian" && isForAcknowledgement ? (
                  <Label className="flex w-48 shrink-0 items-center justify-center gap-2 rounded-lg border border-secondary px-4 py-2 text-secondary">
                    <CircleCheck size={18} /> Submitted
                  </Label>
                ) : (
                  <Label className="flex w-48 shrink-0 items-center justify-center gap-2 rounded-lg border border-green-500 px-4 py-2 text-green-500">
                    <CircleCheck size={18} /> Acknowledged
                  </Label>
                )
              ) : (
                <Button
                  variant="secondary"
                  type="submit"
                  className="w-48 shrink-0"
                  disabled={submitBtnDisable && !isForAcknowledgement}
                >
                  {currentUser.role === "Custodian" && !isForAcknowledgement ? (
                    <>
                      <Send strokeWidth={3} /> <p>Submit Report</p>
                    </>
                  ) : (
                    <>
                      <CircleCheck strokeWidth={3} /> <p>Acknowlegde</p>
                    </>
                  )}
                </Button>
              )
            ) : null}
          </form>
          {currentUser.role !== "Faculty" &&
            currentUser.role !== "Program Head" && (
              <ReactToPrint
                pageStyle={"@page { size: portrait; }"}
                trigger={() => printResultsBtn}
                content={() => componentToPrintRef.current}
              />
            )}
        </div>
      </div>
      {/* )} */}
    </div>
  );
}

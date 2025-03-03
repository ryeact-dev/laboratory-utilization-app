import { useCallback, useRef, useState } from "react";
import { modalStore } from "@/store";
import ReactToPrint from "react-to-print";
import UtilizationsSummaryReport from "./components/UtilizationsSummaryReport";
import UtilizationDataTable from "./components/UtilizationsDataTable";
import { endOfWeek, format, subWeeks } from "date-fns";
import TitleCard from "@/common/titleCard/TitleCard";
import SelectLaboratory from "@/common/select/SelectLaboratory";
import { useGetLaboratoryWeeklyUtilizations } from "@/hooks/utilizations.hook";

import { useSearchParams } from "react-router-dom";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import Information from "@/common/information/Information";
import SelectSchedule from "@/common/select/SelectSchedule";
import { useGetSelectedTermSemDates } from "@/hooks/termSemSchoolYear.hook";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import {
  getRelativeWeekNumber,
  getWeekDatesExcludeSunday,
} from "@/lib/helpers/dateTime";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import { useGetSchedulerSchedules } from "@/hooks/schedules.hook";
import TermDatePicker from "./components/TermDatePicker";
import { Button } from "@/common/ui/button";
import { Badge } from "@/common/ui/badge";
import ActiveAcademicDuration from "@/common/active-academic-duration/ActiveAcademicDuration";
import { Printer } from "lucide-react";

const aggregatedSubjects = (listOfSubjects) => {
  const aggregatedSubjects = [];

  listOfSubjects.forEach((subject) => {
    const index = aggregatedSubjects.findIndex((aggregatedSubject) => {
      return aggregatedSubject.SubjectId === subject.SubjectId;
    });
    if (index === -1) aggregatedSubjects.push(subject);
  });

  return aggregatedSubjects;
};

export default function UtilizationsTerm({
  currentUser,
  activeTermSem,
  activeSchoolYear,
  termSemStartingDate,
}) {
  const componentToPrintRef = useRef();

  const initialSelectedLaboratory =
    currentUser.laboratory.length > 0 ? currentUser.laboratory[0] : "";

  const [searchParams, setSearchParams] = useSearchParams({
    q: initialSelectedLaboratory,
    termsem: activeTermSem,
  });

  const laboratory = searchParams.get("q") || "";
  const selectedTermAndSem = searchParams.get("termsem") || activeTermSem;

  const { data: termDates } = useGetSelectedTermSemDates(
    selectedTermAndSem,
    activeSchoolYear,
    true, // True if semestral
  );

  const selectedTermAndSemDates = termDates?.filter(
    (date) => date.term_sem === selectedTermAndSem,
  )[0];

  const currentDate = new Date();
  const lastDayOfPreviousWeek = endOfWeek(subWeeks(currentDate, 1));

  const [date, setDate] = useState(lastDayOfPreviousWeek);

  const openModal = modalStore((state) => state.openModal);

  const { isLoading: isLoadingSchedule, data: listOfSchedule = [] } =
    useGetSchedulerSchedules(
      laboratory,
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
    laboratory,
    activeSchoolYear,
    selectedTermAndSem,
    undefined, // undefined if no subjectId
    date,
    listOfSchedule,
  );

  isError && ToastNotification("error", error?.response.data);

  const onLaboratoryChange = useCallback(
    (value) => {
      setSearchParams((prev) => {
        prev.set("q", value);
        return prev;
      });
    },
    [setSearchParams],
  );

  const headerSection = (
    <article className="flex flex-col justify-between gap-2 lg:flex-row">
      <div className="-mt-2 flex items-center gap-2">
        <div>
          <p className="mb-1 text-sm font-normal text-secondary">Laboratory</p>
          <SelectLaboratory
            laboratory={laboratory}
            onLaboratoryChange={onLaboratoryChange}
            currentUser={currentUser}
          />
        </div>
        <div>
          <p className="mb-1 text-sm font-normal text-secondary">
            Term and Sem
          </p>
          <SelectSchedule
            selectedTermAndSem={selectedTermAndSem}
            setSearchParams={setSearchParams}
          />
        </div>
        <div className="-ml-3">
          <p className="mb-1 ml-3 text-sm font-normal text-secondary">Date</p>
          <TermDatePicker date={date} setDate={setDate} />
        </div>
      </div>
      <div className="text-center leading-6 md:text-right">
        <ActiveAcademicDuration
          activeSchoolYear={activeSchoolYear}
          activeTermSem={activeTermSem}
        />
      </div>
    </article>
  );

  // AGGREGATE SUBJECTS (REMOVE DUPLICATION OF SUBJECTS)
  const listOfSubjects =
    !isLoadingSchedule && listOfSchedule?.length > 0
      ? aggregatedSubjects(listOfSchedule)
      : [];

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

  const weekNumber = () => {
    if (activeTermSem !== selectedTermAndSem) {
      return (
        getRelativeWeekNumber(
          selectedTermAndSemDates?.starting_date,
          selectedDate,
        ) || 0
      );
    } else {
      return getRelativeWeekNumber(termSemStartingDate, selectedDate) || 0;
    }
  };

  const onSubmitReportClick = () => {
    // if (weekNumber() <= 0 || weekNumber() > 10) {
    //   ToastNotification('error', 'Invalid week number');
    //   return;
    // }

    const selectedDate = format(
      new Date(getWeekDatesExcludeSunday(date)?.weekDates[5]),
      "yyyy-MM-dd",
    );

    const forAddingData = {
      laboratory,
      selectedDate,
      selectedTermAndSem,
      weekNumber: weekNumber(),
    };

    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: `Submit this report now?`,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.SUBMIT_LABORATORY_WEEKLY_USAGE,
        forAddingData,
      },
    };

    openModal(payload);
  };

  const isPrintDisabled =
    (weekNumber() <= 0 || weekNumber() > 10) && currentUser.role !== "Admin";

  const printSummaryReportBtn = (
    <Button type="button" disabled={isPrintDisabled}>
      <Printer size={20} strokeWidth={2.5} />
      Print Summary Report
    </Button>
  );

  // RENDER SECTION
  return (
    <TitleCard
      title={headerSection}
      topMargin="-mt-2"
      width="lg:min-w-[1200px]"
    >
      {whatToDisplay === null && (
        <NoRecordsFound>No records found.</NoRecordsFound>
      )}
      {whatToDisplay === "data" && (
        <div className="-mt-2 h-max">
          {/* <div className="items-center justify-between md:-mt-2 md:flex">
            <div className="items-center gap-3 md:flex">
              <ReactToPrint
                // pageStyle={'@page { size: landscape; }'}
                trigger={() => printSummaryReportBtn}
                content={() => componentToPrintRef.current}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={onSubmitReportClick}
                disabled={weekNumber() <= 0 || weekNumber() > 10}
                className="font-semibold"
              >
                <LuSend size={20} strokeWidth={2.5} />
                Submit Report
              </Button>
            </div>
            <div>
              <p className="-mb-1 text-right text-lg font-medium text-secondary">
                Week No: {weekNumber()}
              </p>
              <Badge className="shadow-none hover:bg-primary hover:shadow-none">
                {getWeekDatesExcludeSunday(date)?.week}
              </Badge>
            </div>
          </div>
          <Information
            title={"Print Info"}
            message={
              "For better print result please set the ff. settings: Scaling: 100, Papersize: A4, Layout: Landscape"
            }
            className={"mb-4 mt-2"}
          /> */}
          <UtilizationDataTable
            getClassLaboratoryUtilizations={getClassLaboratoryUtilizations}
            listOfSchedule={listOfSubjects}
            laboratory={laboratory}
            selectedTermAndSem={selectedTermAndSem}
            activeSchoolYear={activeSchoolYear}
          />

          {/* <UtilizationsSummaryReport
            getClassLaboratoryUtilizations={getClassLaboratoryUtilizations}
            listOfSchedule={listOfSubjects}
            currentUser={currentUser}
            componentToPrintRef={componentToPrintRef}
            termDates={selectedTermAndSemDates}
            laboratory={laboratory}
            selectedDate={selectedDate}
          /> */}
        </div>
      )}
    </TitleCard>
  );
}

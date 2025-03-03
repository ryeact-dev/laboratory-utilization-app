import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetUtilizationsWithDateRange } from "@/hooks/utilizations.hook";
import {
  getRelativeWeekNumber,
  getWeekDatesExcludeSunday,
} from "@/lib/helpers/dateTime";
import TitleCard from "@/common/titleCard/TitleCard";
import SelectLaboratory from "@/common/select/SelectLaboratory";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { useGetSchedulerSchedules } from "@/hooks/schedules.hook";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import SelectSchedule from "@/common/select/SelectSchedule";
import { format } from "date-fns";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import { modalStore } from "@/store";
import { useGetSelectedTermSemDates } from "@/hooks/termSemSchoolYear.hook";
import { Button } from "@/common/ui/button";
import ActiveAcademicDuration from "@/common/active-academic-duration/ActiveAcademicDuration";
import { getSubjectSchedules } from "@/lib/helpers/classUtilizations";
import { Send } from "lucide-react";
import ReportsUtilizationCard from "./components/reports-utilization-card/ReportsUtilizationCard";
import ReportsUtilizationDatePicker from "./components/reports-utilization-date-picker/ReportsUtilizationDatePicker";

export default function UtilizationsWeekly({
  currentUser,
  activeTermSem,
  activeSchoolYear,
  termSemStartingDate,
}) {
  const openModal = modalStore((state) => state.openModal);

  const initialSelectedLaboratory =
    currentUser.laboratory.length > 0 ? currentUser.laboratory[0] : "";

  const [searchParams, setSearchParams] = useSearchParams({
    q: initialSelectedLaboratory,
    termsem: activeTermSem,
  });

  const laboratory = searchParams.get("q") || "";
  const selectedTermAndSem = searchParams.get("termsem") || activeTermSem;

  // Get the last of the previous week for utilization basis
  const currentDate = new Date();
  // const lastDayOfPreviousWeek = endOfWeek(subWeeks(currentDate, 1));
  const [date, setDate] = useState(currentDate);

  const weekDates = getWeekDatesExcludeSunday(date).weekDates;

  const { isLoading: isLoadingTermdates, data: termDates } =
    useGetSelectedTermSemDates(selectedTermAndSem, activeSchoolYear, true);

  const {
    isLoading,
    data: listOfSchedules = [],
    error: scheduleError,
    isError: scheduleIsError,
  } = useGetSchedulerSchedules(
    laboratory,
    activeSchoolYear,
    selectedTermAndSem,
    currentUser,
    true,
    date,
  );
  scheduleIsError && ToastNotification("error", scheduleError?.response.data);

  const {
    isLoading: isLoadingUsage,
    data: listOfUsage = [],
    isError,
    error,
  } = useGetUtilizationsWithDateRange(
    undefined, // undefined if no subjectId
    laboratory,
    activeSchoolYear,
    weekDates,
    selectedTermAndSem,
    true, // true if data needs to aggregate
  );
  isError && ToastNotification("error", error?.response.data);

  const filterUsageById = useCallback(
    (id) => {
      return listOfUsage?.filter((usage) => usage.subject_id === id)[0];
    },
    [listOfUsage],
  );

  // FORMAT SELECTED DATE
  const lastDayOfTheWeek = format(new Date(weekDates[5]), "MMM dd, yyyy");

  // COMPUTE THE WEEK NUMBER
  const weekNumber = useCallback(
    (isSemestral) => {
      const selectedTerm = selectedTermAndSem.split("-")[0];

      let startingDate =
        selectedTerm.trim() === "1st Term" || selectedTerm.trim() === "Summer"
          ? termDates[0]?.starting_date
          : termDates[1]?.starting_date;

      if (isSemestral) {
        startingDate = termDates[0]?.starting_date;
      }

      return getRelativeWeekNumber(startingDate, lastDayOfTheWeek) || 0;
    },
    [selectedTermAndSem, termDates, lastDayOfTheWeek],
  );

  const onSubmitAll = () => {
    const uniqueSubjectIds = new Set(); // Initialize a Set to track unique subject_ids

    const forAddingData = listOfSchedules
      ?.map((schedule) => {
        // console.log(
        //   schedule.RegularClass,
        //   schedule.Subject,
        //   schedule.SubjectId,
        //   schedule.ClassSchedule,
        // );
        if (!schedule.RegularClass) return null;

        // Check for duplicate subject_id
        if (uniqueSubjectIds.has(schedule.SubjectId)) return null; // Skip if already processed
        uniqueSubjectIds.add(schedule.SubjectId); // Add to set

        // Check if the subject's last schedule is beyond the current date to be able to submit the report
        const { subjectSchedule, firstUsageDate } =
          getSubjectSchedules(
            schedule.ScheduleData.recurrence_rule,
            weekDates,
            listOfUsage,
            schedule.SubjectId,
            schedule.ScheduleData.code,
          ) || {};

        const subjectLastScheduleOftheWeek =
          subjectSchedule[subjectSchedule.length - 1]?.date;

        // console.log(subjectSchedules);

        const isSubmittable =
          new Date(subjectLastScheduleOftheWeek) < new Date();

        // If the report is not submittable, return null
        if (!isSubmittable) return null;

        const { usage_hours: usageHours = 0, id: utilizationId } =
          filterUsageById(schedule?.SubjectId) || {};

        // If the custodian is the same as the instructor then it will send directly to the dean
        const userStep =
          currentUser.userId === schedule.ScheduleData.instructor_id ? 2 : null;

        return {
          subjectId: schedule.SubjectId,
          scheduleId: schedule.ScheduleId,
          subjectCode: schedule.ScheduleData.code,
          subjectTitle: schedule.ScheduleData.title,
          // custodianId: currentUser.userId,
          instructor: schedule.ScheduleData.instructor,
          instructorId: schedule.ScheduleData.instructor_id,
          weekDates,
          userStep,
          laboratory,
          weekNumber: Number(weekNumber(schedule.ScheduleData.isSemestral)),
          usageHours,
          usageDate: firstUsageDate, // Date for Orientation Conducted
          utilizationId,
          selectedDate: weekDates[weekDates.length - 1],
          activeSchoolYear,
        };
      })
      .filter(
        (report) =>
          report !== null && report?.instructor !== "Not yet assigned",
      );

    const payload = {
      title: "List of reports to be submitted",
      bodyType: MODAL_BODY_TYPES.SUBMIT_MANY_WEEKLY_USAGE,
      extraObject: forAddingData,
      size: "max-w-3xl",
    };

    openModal(payload);
  };

  // Filter by subject id and check if there are two schedules for the same subject (regular and make-up)
  // removed the make up schedule from the list and return true if there is no duplicate schedules

  const onCheckSubjectId = (subjectId, scheduleId) => {
    const filteredSchedule = listOfSchedules?.filter(
      (usage) => usage.SubjectId === subjectId,
    );

    if (filteredSchedule?.length > 1) {
      const isRegularClass = listOfSchedules?.filter(
        (schedule) =>
          schedule.ScheduleId === scheduleId &&
          schedule.ScheduleData.class_schedule === 0,
      )[0]?.RegularClass;

      return isRegularClass;
    } else return true;
  };

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
    <article className="flex w-full flex-col items-start justify-between lg:flex-row">
      <div>
        <div className="my-2 flex items-center gap-2 sm:my-0 sm:flex-row">
          <div>
            <h2 className="mb-1 text-sm text-secondary"> Laboratory</h2>
            <SelectLaboratory
              laboratory={laboratory}
              onLaboratoryChange={onLaboratoryChange}
              currentUser={currentUser}
            />
          </div>
          <div>
            <h2 className="mb-1 text-sm text-secondary"> Term and Sem</h2>
            <SelectSchedule
              selectedTermAndSem={selectedTermAndSem}
              setSearchParams={setSearchParams}
            />
          </div>
          <div>
            <h2 className="mb-1 text-sm text-secondary"> Weekdate</h2>
            <ReportsUtilizationDatePicker date={date} setDate={setDate} />
          </div>
        </div>

        {/* Send All reports button */}
        {currentUser.role === "Custodian" && (
          <Button
            variant="secondary"
            className="mt-3 font-semibold"
            onClick={onSubmitAll}
          >
            <Send size={18} /> Submit all reports
          </Button>
        )}
      </div>
      <div className="flex-1 text-center leading-6 lg:text-right">
        <ActiveAcademicDuration
          activeSchoolYear={activeSchoolYear}
          activeTermSem={selectedTermAndSem}
        />
      </div>
    </article>
  );

  // RENDER SECTION
  return (
    <TitleCard
      title={headerSection}
      topMargin="-mt-2"
      width="lg:min-w-[1000px] xl:min-w-[1200px]"
      minHeight="min-h-min"
    >
      {isLoading && isLoadingUsage ? (
        <LoadingSpinner />
      ) : !isLoading && listOfSchedules.length === 0 ? (
        <NoRecordsFound>No Records Found</NoRecordsFound>
      ) : (
        <article className="-mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* TODO: 
            ADDED A CLASS SCHEDULE TO FILTER OUT THE ABOVE 0
            0 - REGULAR CLASS, 1 - MANUAL TIME SCHEDULE
          */}
          {listOfSchedules
            ?.sort((a, b) => a.Subject.localeCompare(b.Subject))
            .map((schedule, index) => {
              if (onCheckSubjectId(schedule.SubjectId, schedule.ScheduleId)) {
                return (
                  schedule.SubjectId && (
                    <ReportsUtilizationCard
                      key={index}
                      usage={filterUsageById(schedule.SubjectId)}
                      schedule={schedule.ScheduleData}
                      selectedTermAndSem={selectedTermAndSem}
                      weekDates={weekDates}
                      date={date}
                      weekNumber={weekNumber}
                      laboratory={laboratory}
                      currentUser={currentUser}
                      activeSchoolYear={activeSchoolYear}
                      termSemStartingDate={termSemStartingDate}
                      isLoadingTermdates={isLoadingTermdates}
                    />
                  )
                );
              }
            })}
        </article>
      )}
    </TitleCard>
  );
}

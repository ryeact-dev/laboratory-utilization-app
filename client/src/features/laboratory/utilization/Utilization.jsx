import { useCallback } from "react";
import { isSameDay, isSameWeek } from "date-fns";
import {
  LIST_OF_ALLOWED_USERS,
  WEEKDAYS_NAMES_COLORS,
} from "@/globals/initialValues";
import TitleCard from "@/common/titleCard/TitleCard";
import SelectLaboratory from "@/common/select/SelectLaboratory";
import { useGetUtilizationSchedules } from "@/hooks/schedules.hook";
import { useGetLaboratoryUtilizations } from "@/hooks/utilizations.hook";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import { useSearchParams } from "react-router-dom";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import ActiveAcademicDuration from "@/common/active-academic-duration/ActiveAcademicDuration";
import { calculateUsageTime } from "@/lib/helpers/dateTime";
import LaboratoryUtilizationTab from "./components/laboratory-utilization-tab/LaboratoryUtilizationTab";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import SelectSchedule from "@/common/select/SelectSchedule";
import LaboratoryUtilizationCard from "./components/laboratory-utilization-card/LaboratoryUtilizationCard";

export default function Utilization({
  currentUser,
  activeSchoolYear,
  activeTermSem,
}) {
  const initialSelectedLaboratory =
    currentUser.laboratory.length > 0 ? currentUser.laboratory[0] : "";

  const [searchParams, setSearchParams] = useSearchParams({
    q: initialSelectedLaboratory,
    tab: "1",
    termsem: activeTermSem,
  });

  const laboratory = searchParams.get("q") || "";
  const tab = searchParams.get("tab") || "1";
  const selectedTermAndSem = searchParams.get("termsem") || activeTermSem;

  // const [seletedClassSchedule, setSelectedClassSchedule] = useState(
  //   getClassScheduleTruDate(new Date()),
  // );

  // FETCH THE LIST OF UTILIZATION SCHEDULES FROM SCHEDULE TABLES
  const {
    isLoading,
    data: listOfSchedules = [],
    isError,
    error,
  } = useGetUtilizationSchedules(
    laboratory,
    activeSchoolYear,
    selectedTermAndSem,
    // tab 1 is daily utilization schedules, tab 2 is not ended utilization schedules
    tab,
  );
  isError && ToastNotification("error", error?.response.data);

  const scheduledIds = listOfSchedules?.map((item) => item.id);

  // FETCH ALL UTILIZATIONS FROM UTILIZATIONS TABLE FOR UTILIZATION BUTTONS COMPONENT
  const { isLoading: isLoadingUsage, data: listOfUsage } =
    useGetLaboratoryUtilizations(
      laboratory,
      activeSchoolYear,
      selectedTermAndSem,
      scheduledIds,
    );

  const onLaboratoryChange = useCallback(
    (value) => {
      setSearchParams((prev) => {
        prev.set("q", value);
        return prev;
      });
    },
    [setSearchParams],
  );

  const weekdayDisplay = (day) => {
    const { name, color } =
      WEEKDAYS_NAMES_COLORS.filter((item) => item.rule === day)[0] || {};

    return { color, name };
  };

  const isClassScheduledThisWeek = (schedule) => {
    if (!schedule.is_regular_class) {
      const withinThisWeek = isSameWeek(
        new Date(schedule.sched_start_time),
        new Date(),
        { weekStartsOn: 1 },
      );

      if (!withinThisWeek && tab === "1") {
        return false;
      }
      return true;
    }

    return true;
  };

  const isOngoingClass = useCallback(
    (scheduleId) => {
      const { start_time, end_time, usage_hours } =
        listOfUsage?.filter((item) => {
          const addtionalFilter =
            tab === "1"
              ? isSameDay(new Date(item.usage_date), new Date())
              : !item.usage_hours;

          return item.schedule_id === scheduleId && addtionalFilter;
        })[0] || {};

      return isLoadingUsage
        ? "Loading..."
        : start_time
          ? end_time
            ? calculateUsageTime(usage_hours)
            : "On-going class"
          : "No utilization";
    },
    [listOfUsage, isLoadingUsage, tab],
  );

  // RENDER SECTION
  return (
    <TitleCard
      title={
        <article className="-mt-1 flex flex-col items-center gap-2 lg:flex-row lg:justify-between">
          <div className="relative">
            <div className="my-2 flex items-center gap-2 sm:my-0 sm:flex-row">
              <div>
                <h2 className="mb-1 text-sm text-secondary">Laboratory</h2>
                <SelectLaboratory
                  laboratory={laboratory}
                  onLaboratoryChange={onLaboratoryChange}
                  currentUser={currentUser}
                />
              </div>
              <div>
                <h2 className="mb-1 text-sm text-secondary">Term and Sem</h2>
                <SelectSchedule
                  selectedTermAndSem={selectedTermAndSem}
                  setSearchParams={setSearchParams}
                />
              </div>
            </div>
            {LIST_OF_ALLOWED_USERS.includes(currentUser.role) && (
              <div className="mt-4">
                {/* Only appears on Admin users */}
                <LaboratoryUtilizationTab
                  tab={tab}
                  setSearchParams={setSearchParams}
                />
              </div>
            )}
            {/* {selectClassSchedule} */}
          </div>
          <div className="text-center leading-6 lg:text-right">
            <ActiveAcademicDuration
              activeSchoolYear={activeSchoolYear}
              activeTermSem={activeTermSem}
            />
          </div>
        </article>
      }
      topMargin="-mt-2"
    >
      {/* <ScheduleColorLabel /> */}
      {!isLoading && listOfSchedules ? (
        <article className="-mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {!laboratory || listOfSchedules?.length === 0 ? (
            <NoRecordsFound className={"col-span-1 md:col-span-3"}>
              No Records Found
            </NoRecordsFound>
          ) : null}

          {listOfSchedules?.map((schedule, index) => {
            return (
              isClassScheduledThisWeek(schedule) && (
                <LaboratoryUtilizationCard
                  key={index}
                  schedule={schedule}
                  weekdayDisplay={weekdayDisplay}
                  isOngoingClass={isOngoingClass}
                  currentUser={currentUser}
                  listOfUsage={listOfUsage}
                  isLoadingUsage={isLoadingUsage}
                  laboratory={laboratory}
                  tab={tab}
                />
              )
            );
          })}
        </article>
      ) : (
        <LoadingSpinner />
      )}
    </TitleCard>
  );
}

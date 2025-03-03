import { useRef, lazy, useCallback } from "react";
import ReactToPrint from "react-to-print";
import { useSearchParams } from "react-router-dom";
import TitleCard from "@/common/titleCard/TitleCard";
import SelectLaboratory from "@/common/select/SelectLaboratory";
import { useGetSchedulerSchedules } from "@/hooks/schedules.hook";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import SelectSchedule from "@/common/select/SelectSchedule";
import {
  LIST_OF_ALLOWED_USERS_FOR_BORROWER_SLIP,
  USER_ONLY_FOR_VIEWING_AND_ACKNOWLEDGE,
} from "@/globals/initialValues";
import Information from "@/common/information/Information";
import { Button } from "@/common/ui/button";
import SchedulerMenuOptions from "./components/scheduler-menu-options/SchedulerMenuOptions";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import { Printer } from "lucide-react";

const SchedulerView = lazy(
  () => import("./components/schedulerView/SchedulerView"),
);

export default function Scheduler() {
  const scheduleObj = useRef(null);
  const componentToPrintRef = useRef();

  const {
    currentUser,
    activeSchoolYear,
    activeTermSem,
    termSemStartingDate,
    termSemEndingDate,
  } = useGetCurrentUserData();

  const initialSelectedLaboratory =
    currentUser?.laboratory.length > 0 ? currentUser?.laboratory[0] : "";

  const [searchParams, setSearchParams] = useSearchParams({
    q: initialSelectedLaboratory,
    termsem: activeTermSem,
  });

  const laboratory = searchParams.get("q") || "";
  const selectedTermAndSem = searchParams.get("termsem") || activeTermSem;

  const {
    isLoading,
    data: listOfSchedules,
    error,
    isError,
  } = useGetSchedulerSchedules(
    laboratory,
    activeSchoolYear,
    selectedTermAndSem,
    currentUser,
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

  const printScheduleBtn = (
    <Button className={`hidden px-6 text-white md:inline-flex`}>
      <Printer size={20} strokeWidth={2.5} /> Print Schedule
    </Button>
  );

  const reactToPrintBtn = (
    <ReactToPrint
      trigger={() => printScheduleBtn}
      content={() => componentToPrintRef.current}
    />
  );

  const removeCustodianFromList = [
    ...USER_ONLY_FOR_VIEWING_AND_ACKNOWLEDGE,
  ].slice(0, 3);

  const isAllowedtoPrintSchedule =
    LIST_OF_ALLOWED_USERS_FOR_BORROWER_SLIP.slice(0, 2).includes(
      currentUser?.role,
    );

  const headerSection = (
    <header className="flex flex-col items-center justify-between sm:flex-row">
      <div className="mx-auto flex w-full items-end gap-2">
        <div>
          <h2 className="mb-1 text-sm text-secondary">Laboratory</h2>
          <SelectLaboratory
            laboratory={laboratory}
            onLaboratoryChange={onLaboratoryChange}
            currentUser={currentUser}
          />
        </div>
        {isAllowedtoPrintSchedule && (
          <div>
            <h2 className="mb-1 text-sm text-secondary">Term and Sem</h2>
            <SelectSchedule
              selectedTermAndSem={selectedTermAndSem}
              setSearchParams={setSearchParams}
            />
          </div>
        )}
        {isAllowedtoPrintSchedule && reactToPrintBtn}
      </div>
      <div className="w-full">
        {isAllowedtoPrintSchedule && (
          <SchedulerMenuOptions
            usersAllowedToViewSchedule={removeCustodianFromList}
            currentUser={currentUser}
            scheduleObj={scheduleObj}
            laboratory={laboratory}
            termSemStartingDate={termSemStartingDate}
            termSemEndingDate={termSemEndingDate}
            selectedTermAndSem={selectedTermAndSem}
            activeSchoolYear={activeSchoolYear}
          />
        )}
      </div>
    </header>
  );

  return (
    <TitleCard
      title={headerSection}
      topMargin="-mt-2"
      width={"lg:min-w-[1200px]"}
    >
      {isAllowedtoPrintSchedule && (
        <Information
          className={"-mt-4 mb-6"}
          title={"Print Info"}
          message={
            "For better print result please set the ff. settings: Scaling: 50-51, Papersize: A4, Orientation: Landscape."
          }
        />
      )}
      {!isLoading ? (
        <div className="overflow-hidden rounded-md border border-gray-400 pt-3">
          <SchedulerView
            activeSchoolYear={activeSchoolYear}
            activeTermSem={activeTermSem}
            currentUser={currentUser}
            laboratory={laboratory}
            componentToPrintRef={componentToPrintRef}
            scheduleObj={scheduleObj}
            listOfSchedules={listOfSchedules}
          />
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </TitleCard>
  );
}

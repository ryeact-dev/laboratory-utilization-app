import SelectLaboratory from "@/common/select/SelectLaboratory";
import { useCallback, useRef, useState } from "react";
import { getWeekDatesExcludeSunday } from "@/lib/helpers/dateTime";
import { useSearchParams } from "react-router-dom";
import TitleCard from "@/common/titleCard/TitleCard";
import { useGetUtilizationRemarks } from "@/hooks/remarks.hook";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import LabMonitoringData from "./components/LabMonitoringData";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import { useGetSelectedTermSemDates } from "@/hooks/termSemSchoolYear.hook";
import SelectSchedule from "@/common/select/SelectSchedule";
import LabMonitoringDatePicker from "./components/LabMonitoringDatePicker";

export default function LaboratoryMonitoringSummary({
  currentUser,
  activeTermSem,
  activeSchoolYear,
}) {
  const componentToPrintRef = useRef();

  const [date, setDate] = useState(new Date());
  const weekDates = getWeekDatesExcludeSunday(date).weekDates;

  const initialSelectedLaboratory =
    currentUser.laboratory.length > 0 ? currentUser.laboratory[0] : "";

  const [searchParams, setSearchParams] = useSearchParams({
    q: initialSelectedLaboratory,
    termsem: activeTermSem,
  });
  const laboratory = searchParams.get("q") || "";
  const selectedTermAndSem = searchParams.get("termsem") || activeTermSem;

  const { isLoading, data: listOfLabMonitoring = [] } =
    useGetUtilizationRemarks(
      undefined,
      laboratory,
      activeSchoolYear,
      weekDates,
      selectedTermAndSem,
    );

  const { data: termDates } = useGetSelectedTermSemDates(
    selectedTermAndSem,
    activeSchoolYear,
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

  const headerSection = (
    <article className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row">
      <div className="flex flex-[3] flex-col items-center lg:flex-row lg:items-start">
        <SelectLaboratory
          laboratory={laboratory}
          onLaboratoryChange={onLaboratoryChange}
          currentUser={currentUser}
        />
        <div className="pl-2">
          <SelectSchedule
            selectedTermAndSem={selectedTermAndSem}
            setSearchParams={setSearchParams}
          />
        </div>
        <LabMonitoringDatePicker date={date} setDate={setDate} />
      </div>
      <div className="flex-1 text-center leading-6 lg:text-right">
        <p>{selectedTermAndSem}</p>
        <p>{activeSchoolYear}</p>
      </div>
    </article>
  );

  return (
    <TitleCard
      title={headerSection}
      topMargin="-mt-2"
      width="md:min-w-[1200px]"
      minHeight="min-h-min"
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : !isLoading && listOfLabMonitoring.length > 0 ? (
        <LabMonitoringData
          listOfLabMonitoring={listOfLabMonitoring}
          weekDates={weekDates}
          componentToPrintRef={componentToPrintRef}
          laboratory={laboratory}
          TermSemStartingDate={termDates?.starting_date}
          date={date}
          currentUser={currentUser}
        />
      ) : (
        <NoRecordsFound>No Records found.</NoRecordsFound>
      )}
    </TitleCard>
  );
}

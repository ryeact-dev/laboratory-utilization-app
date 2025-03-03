import SelectLaboratory from "@/common/select/SelectLaboratory";
import TitleCard from "@/common/titleCard/TitleCard";
import { useGetDashboardUtilizations } from "@/hooks/utilizations.hook";
import SubjectUtilization from "./components/subjectUtilization/SubjectUtilization";
import { useSearchParams } from "react-router-dom";
import SelectSchedule from "@/common/select/SelectSchedule";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import { useGetSelectedTermSemDates } from "@/hooks/termSemSchoolYear.hook";
import MemoedListOfNoClassDays from "@/common/listOfNoClassDays/ListOfNoClassDays";
import { format } from "date-fns";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import { useCallback } from "react";
import { useGetCurrentUserData } from "@/hooks/users.hook";

const selectSubjects = (data) => {
  let subjectIdHolder;
  return data
    .sort((a, b) => a.code - b.code)
    .filter((subject) => subject.is_regular_class)
    .filter((subject) => {
      if (subjectIdHolder !== subject.subject_id) {
        subjectIdHolder = subject.subject_id;
        return true;
      }
    })
    .map((usage) => {
      return {
        label: `${usage.code}-${usage.title.toUpperCase()}`,
        value: usage.subject_id,
        instructor: usage.instructor,
        startTime: usage.sched_start_time,
        endTime: usage.sched_end_time,
      };
    });
};

export default function SubjectUtilizations({ currentUser }) {
  const { activeSchoolYear, activeTermSem } = useGetCurrentUserData();

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

  const activatedTermSem = termDates?.filter(
    (date) => date.term_sem === selectedTermAndSem,
  )[0];

  const {
    isLoading,
    isSuccess,
    data: utilizationData = [],
  } = useGetDashboardUtilizations(
    laboratory,
    activeSchoolYear,
    selectedTermAndSem,
    activatedTermSem?.ending_date,
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

  let subjectsList = "";
  if (!isLoading && isSuccess && utilizationData?.length > 0)
    subjectsList = selectSubjects(utilizationData);

  const headerSection = (
    <header className="flex flex-col-reverse items-center md:flex-row md:items-start md:justify-between">
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

      <div className="text-right">
        <p className="text-base font-medium text-secondary">
          {selectedTermAndSem}
        </p>
        <p className="text-base">
          {activatedTermSem?.starting_date &&
            `${format(new Date(activatedTermSem?.starting_date), "MMM dd, yyyy")} -
                ${format(new Date(activatedTermSem?.ending_date), "MMM dd, yyyy")}`}
        </p>
      </div>
    </header>
  );

  console.log(subjectsList);

  // RENDER SECTION
  return (
    <TitleCard
      title={headerSection}
      topMargin={"-mt-2"}
      width="xl:min-w-[1200px] mx-auto overflow-hidden"
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : !isLoading && utilizationData?.length === 0 ? (
        <NoRecordsFound>No records found</NoRecordsFound>
      ) : (
        <section className="flex flex-col items-center justify-center gap-4 md:flex-row md:items-start">
          <SubjectUtilization
            activatedTermSem={activatedTermSem}
            laboratory={laboratory}
            utilizationData={utilizationData}
            activeSchoolYear={activeSchoolYear}
            selectedTermAndSem={selectedTermAndSem}
            subjects={subjectsList || []}
          />

          <div className="mt-2 w-full md:flex-1 lg:w-[40%]">
            <MemoedListOfNoClassDays
              activeSchoolYear={activeSchoolYear}
              selectedTermAndSem={selectedTermAndSem}
              isDashboard={true}
            />
          </div>
        </section>
      )}
    </TitleCard>
  );
}

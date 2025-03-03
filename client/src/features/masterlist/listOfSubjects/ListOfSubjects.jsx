import { useGetListOfPaginatedSubjects } from "@/hooks/subjects.hook";
import TitleCard from "@/common/titleCard/TitleCard";
import { useSearchParams } from "react-router-dom";
import { getSemester } from "@/lib/helpers/termSem";
import { CardDescription, CardHeader } from "@/common/ui/card";
import ListOfSubjectsTable from "./components/list-of-subjects-table/ListOfSubjectsTable";
import SearchDebounceInput from "@/common/inputs/SearchDebounceInput";
import SelectSchedule from "@/common/select/SelectSchedule";
import AddEditSubjectBtn from "./components/add-subject-btn/AddEditSubjectBtn";

export default function ListOfSubjects({
  currentUser,
  activeSchoolYear,
  activeTermSem,
}) {
  let termsem = activeTermSem.includes(" - ")
    ? activeTermSem.split(" - ")[1]
    : activeTermSem;

  if (termsem === "1st Sem") {
    termsem = "First Semester";
  } else if (termsem === "2nd Sem") {
    termsem = "Second Semester";
  }

  const [searchParams, setSearchParams] = useSearchParams({
    q: "",
    page: "1",
    termsem: termsem,
  });
  const subjectCode = searchParams.get("q");
  const page = searchParams.get("page") || 1;
  const selectedTermAndSem = searchParams.get("termsem") || termsem;

  const {
    isLoading,
    data: paginatedSubjects,
    isPlaceholderData,
  } = useGetListOfPaginatedSubjects(
    Number(page - 1),
    activeSchoolYear,
    selectedTermAndSem,
    subjectCode,
    20,
    true, // isSemestral
  );

  const onSearchValueChange = (value) => {
    setSearchParams((prev) => {
      prev.set("q", value);
      prev.set("page", "1");
      return prev;
    });
  };

  const onPageClick = (pageNumber) => {
    setSearchParams((prev) => {
      prev.set("page", pageNumber);
      return prev;
    });
  };

  const headerSection = (
    <header className="-mb-8 flex items-center justify-between">
      <CardHeader className="flex w-full flex-row items-center justify-between gap-2 p-0 pb-3">
        <div className="flex-1">
          <h2 className="mb-1 text-sm text-secondary">Semester</h2>
          <SelectSchedule
            selectedTermAndSem={selectedTermAndSem}
            setSearchParams={setSearchParams}
            isSemestral={true}
          />
        </div>
        <div className="!m-0 flex-1">
          <div>
            <CardDescription className="mb-1">
              <p className="text-end text-sm font-thin text-white/80">
                List of all subjects for{" "}
                <span className="font-medium">
                  {selectedTermAndSem}, {activeSchoolYear}
                </span>
              </p>
            </CardDescription>
            <div className="flex items-center justify-end gap-2">
              <div className="relative">
                <SearchDebounceInput
                  setterFunction={onSearchValueChange}
                  placeholder={"Search subject code..."}
                  className="pl-8 sm:w-[150px] lg:w-[250px]"
                />
              </div>
              <AddEditSubjectBtn currentUser={currentUser} />
            </div>
          </div>
        </div>
      </CardHeader>
    </header>
  );

  const whatToDisplay = !isLoading && paginatedSubjects ? "data" : null;

  // RENDER SECTION
  return (
    <TitleCard title={headerSection} topMargin="-mt-1">
      {!whatToDisplay && (
        <p className="text-center text-lg">No Data to be displayed</p>
      )}
      {whatToDisplay === "data" && (
        <ListOfSubjectsTable
          currentUser={currentUser}
          activeSchoolYear={activeSchoolYear}
          listItems={paginatedSubjects}
          page={page}
          onPageClick={onPageClick}
          isPlaceholderData={isPlaceholderData}
        />
      )}
    </TitleCard>
  );
}

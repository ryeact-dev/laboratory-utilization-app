import { useDeferredValue } from "react";
import { useGetPaginatedStudents } from "@/hooks/students.hook";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import TitleCard from "@/common/titleCard/TitleCard";
import TopSideButtons from "@/common/buttons/TopSideButtons";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import { useSearchParams } from "react-router-dom";
import { modalStore } from "@/store";
import ListOfStudentTable from "./components/list-of-student-table/ListOfStudentTable";
import { CardDescription, CardHeader, CardTitle } from "@/common/ui/card";
import SearchDebounceInput from "@/common/inputs/SearchDebounceInput";
import { UserRoundPlus } from "lucide-react";

export default function ListOfStudents({ currentUser, activeSchoolYear }) {
  const openModal = modalStore((state) => state.openModal);

  const [searchParams, setSearchParams] = useSearchParams({
    q: "",
    page: "1",
  });
  const studentIdNumber = searchParams.get("q");
  const page = searchParams.get("page") || 1;

  const deferredStudentIdNumber = useDeferredValue(studentIdNumber);

  const {
    isLoading,
    data: paginatedStudents,
    isPlaceholderData,
  } = useGetPaginatedStudents(Number(page - 1), deferredStudentIdNumber, 50);

  const onStudentIdNumberChange = (value) => {
    setSearchParams((prev) => {
      prev.set("q", value);
      prev.set("page", 1);
      return prev;
    });
  };

  const onPageClick = (pageNumber) => {
    setSearchParams((prev) => {
      prev.set("page", pageNumber);
      return prev;
    });
  };

  const editStudent = (student) => {
    const payload = {
      title: "Update Student Info",
      bodyType: MODAL_BODY_TYPES.STUDENT_ADD_NEW,
      extraObject: student,
    };

    openModal(payload);
  };

  // const deleteStudent = (studentIdNumber, studentUUID) => {
  //   const message = (
  //     <label>
  //       Remove this student with ID Number:{' '}
  //       <span className='font-semibold text-primary'>{studentIdNumber} </span>
  //       in the students list?
  //     </label>
  //   );

  //   openModal({
  //     title: 'Confirmation',
  //     bodyType: MODAL_BODY_TYPES.CONFIRMATION,
  //     extraObject: {
  //       message,
  //       type: CONFIRMATION_MODAL_CLOSE_TYPES.STUDENT_DELETE,
  //       forDeletionData: { studentIdNumber, studentUUID, activeSchoolYear },
  //     },
  //   });
  // };

  const btnName = (
    <p className="flex items-center justify-center gap-1 font-medium">
      <UserRoundPlus size={14} strokeWidth={2.5} /> Add Student
    </p>
  );

  const headerSection = (
    <header className="-mb-8 flex items-center justify-between">
      <CardHeader className="space-y-0 px-0">
        <CardTitle className="text-secondary">List of Students</CardTitle>
        <CardDescription>
          <p className="text-sm font-thin">
            Students Count: {paginatedStudents?.countResult}
          </p>
        </CardDescription>
      </CardHeader>

      <div className="flex items-center gap-2">
        <div className="w-full">
          <SearchDebounceInput
            type="search"
            placeholder="Search ID number here..."
            className="font-normal placeholder:text-xs placeholder:font-thin"
            setterFunction={(evt) => onStudentIdNumberChange(evt)}
          />
        </div>
        <TopSideButtons
          btnName={btnName}
          title="Add New Student"
          bodyType={MODAL_BODY_TYPES.STUDENT_ADD_NEW}
        />
      </div>
    </header>
  );

  // RENDER SECTION
  return (
    <TitleCard
      title={headerSection}
      topMargin="-mt-1"
      minHeight="min-h-[870px]"
    >
      {isLoading || isPlaceholderData ? (
        <LoadingSpinner />
      ) : !paginatedStudents ? (
        <h1 className="text-center">No Data to be dispalyed</h1>
      ) : (
        <>
          <ListOfStudentTable
            activeSchoolYear={activeSchoolYear}
            currentUser={currentUser}
            isPlaceholderData={isPlaceholderData}
            listItems={paginatedStudents}
            page={page}
            onPageClick={onPageClick}
          />
        </>
      )}
    </TitleCard>
  );
}

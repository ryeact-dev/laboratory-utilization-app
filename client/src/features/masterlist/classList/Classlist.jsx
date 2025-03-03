import { useParams } from "react-router-dom";
import TitleCard from "@/common/titleCard/TitleCard";
import ClasslistStudents from "./components/classlistStudents/ClasslistStudents";
import { useGetSingleSubject } from "@/hooks/subjects.hook";
import ListOfAllStudents from "./components/list-of-all-students/ListOfAllStudents";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import { CircleUserRound, LaptopMinimal } from "lucide-react";

function Classlist({ activeSchoolYear, activeTermSem, currentUser }) {
  const { subjectId } = useParams();

  const { isLoading: isFetchingSubject, data: fetchedSubject } =
    useGetSingleSubject(subjectId, activeSchoolYear);

  const isSubjectActive = activeTermSem === fetchedSubject?.data[0].term_sem;
  const subject = fetchedSubject?.data[0];

  // RENDER SECTION
  return (
    <TitleCard topMargin="-mt-2" width="lg:min-w-[1300px]">
      <form className="mb-2">
        {isFetchingSubject ? (
          <div className="my-2 flex items-center justify-center">
            <LoadingSpinner />
            <p>Loading Subject Details</p>
          </div>
        ) : fetchedSubject ? (
          <>
            <div
              style={{ fontFamily: "Roboto Mono" }}
              className="-mt-8 mb-6 flex items-center justify-center gap-8 text-xl font-semibold uppercase text-secondary"
            >
              <div className="flex items-center gap-2">
                <LaptopMinimal size={24} />
                <p>
                  {subject?.code}-{subject?.title}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CircleUserRound size={24} />
                <p>{subject?.instructor}</p>
              </div>
            </div>
            <div className="flex gap-6">
              <ListOfAllStudents
                subjectId={subjectId}
                classlist={fetchedSubject?.data[0].students || []}
                isSubjectActive={isSubjectActive}
                userRole={currentUser?.role}
              />
              <ClasslistStudents
                activeSchoolYear={activeSchoolYear}
                fetchedSubject={fetchedSubject}
                isSubjectActive={isSubjectActive}
              />
            </div>
          </>
        ) : (
          <p>No data to be display</p>
        )}
      </form>
    </TitleCard>
  );
}

export default Classlist;

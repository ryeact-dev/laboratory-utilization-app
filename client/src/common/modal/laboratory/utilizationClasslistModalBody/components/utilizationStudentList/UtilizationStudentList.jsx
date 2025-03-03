import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { useGetPaginatedClasslist } from "@/hooks/students.hook";
import { useUpdateStudentAttendance } from "@/hooks/utilizations.hook";
import WifiVoucher from "./components/WifiVoucher";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import StudentBarCodeReader from "../studentBarCodeReader/StudentBarCodeReader";
import StudentsClasslistCard from "./components/StudentsClasslistCard";
import { Button } from "@/common/ui/button";
import { addMinutes } from "date-fns";
import { X } from "lucide-react";

function UtilizationStudentList({
  classlist,
  attendance,
  studentTimelog,
  activeSchoolYear,
  usageId,
  usageDate,
  currentUser,
  laboratory,
  closeModal,
  isEdit,
  subjectStartTime,
}) {
  const { isLoading, data: paginatedClasslist } = useGetPaginatedClasslist(
    0,
    classlist,
    null,
  );

  // const subjectClasslist = paginatedClasslist?.students.map(
  //   (student, index) => {
  //     return {
  //       ...student,
  //       isPresent: attendance[index],
  //       timeStamp: studentTimelog[index],
  //     };
  //   }
  // );

  const isPresentMutation = useUpdateStudentAttendance();

  const togglePresentAbsent = (usageId, attendanceIndex, isPresent) => {
    let isStudentPresent = "true";

    if (isPresent === "true" && currentUser.role === "STA") {
      ToastNotification("info", "Student is already present");
      return;
    }

    isStudentPresent = isPresent === "true" ? "false" : "true";

    const studentAttendanceDate = isEdit
      ? addMinutes(new Date(subjectStartTime), 5)
      : new Date(usageDate);

    const updatedAttendance = {
      usageId,
      attendanceIndex,
      isPresent: isStudentPresent,
      usageDate: studentAttendanceDate,
    };

    isPresentMutation.mutate(updatedAttendance);
  };

  const whatToDisplay = !isLoading && paginatedClasslist ? "data" : null;

  // RENDER SECTION
  return (
    <>
      {whatToDisplay === null && <LoadingSpinner />}
      {whatToDisplay === "data" && (
        <section className="-mt-6 h-full w-full rounded-lg">
          <article className="mb-2 flex flex-col-reverse items-start justify-between gap-6 p-2 md:flex-row">
            <div className="mb-4 flex-1 md:mb-0">
              <StudentBarCodeReader
                usageId={usageId}
                attendance={attendance}
                paginatedClasslist={paginatedClasslist || []}
                togglePresentAbsent={togglePresentAbsent}
              />
            </div>
            <div className="flex-1">
              <WifiVoucher laboratory={laboratory} />
            </div>
          </article>
          <article>
            <StudentsClasslistCard
              paginatedClasslist={paginatedClasslist || []}
              togglePresentAbsent={togglePresentAbsent}
              attendance={attendance}
              usageId={usageId}
            />
          </article>
          <div className="float-right mt-6">
            <Button variant="destructive" onClick={closeModal} className="w-26">
              <X size={22} />
              Close
            </Button>
          </div>
        </section>
      )}
    </>
  );
}
export default UtilizationStudentList;

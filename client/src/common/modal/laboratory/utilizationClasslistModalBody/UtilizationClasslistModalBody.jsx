import UtilizationStudentList from "./components/utilizationStudentList/UtilizationStudentList";
import { useGetUtilizationScheduledClasslist } from "@/hooks/utilizations.hook";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import { useEffect } from "react";

function UtilizationClasslistModalBody({ closeModal, extraObject }) {
  const { usageId, usageDate, classlist, usageDetails, isEdit } = extraObject;

  const { currentUser, activeSchoolYear } = useGetCurrentUserData();

  const { isLoading: isFethcingUsage, data: fetchedUsage } =
    useGetUtilizationScheduledClasslist(usageId, activeSchoolYear);

  const status = !isFethcingUsage && fetchedUsage ? "form" : null;

  const attendance = fetchedUsage?.data[0]?.students_attendance || [];
  const studentTimeLog = fetchedUsage?.data[0]?.students_time_log || [];
  const laboratory = fetchedUsage?.data[0]?.laboratory || "";

  useEffect(() => {
    if (isFethcingUsage || isEdit) return;
    const endTime = fetchedUsage?.data[0]?.end_time;
    const startTime = fetchedUsage?.data[0]?.start_time;
    startTime ? (endTime ? closeModal() : null) : closeModal();
  }, [isFethcingUsage, fetchedUsage, isEdit]);

  return (
    <>
      {status === null && <LoadingSpinner />}
      {status === "form" && (
        <UtilizationStudentList
          currentUser={currentUser}
          attendance={attendance}
          studentTimeLog={studentTimeLog}
          laboratory={laboratory}
          usageId={usageId}
          usageDate={usageDate}
          classlist={classlist}
          activeSchoolYear={activeSchoolYear}
          closeModal={closeModal}
          isEdit={isEdit}
          subjectStartTime={usageDetails?.subjectStartTime}
        />
      )}
    </>
  );
}

export default UtilizationClasslistModalBody;

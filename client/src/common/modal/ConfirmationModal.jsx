import { useState } from "react";
import {
  useAddUtilization,
  useCancelLaboratoryUtilization,
  useEndClassUtilization,
} from "@/hooks/utilizations.hook";
import ConfirmationModalBody from "./ConfirmationModalBody";
import {
  useDeleteUser,
  useLogoutUser,
  usePageReload,
  useUpdateUserStatus,
} from "@/hooks/users.hook";
import { useDeleteSubject, useRemoveStudents } from "@/hooks/subjects.hook";
import { useDeleteStudent } from "@/hooks/students.hook";
import { useDeleteSchedule } from "@/hooks/schedules.hook";
import {
  useDeleteNoClassSchedule,
  useDeleteSchoolYear,
} from "@/hooks/termSemSchoolYear.hook";
import { useDeleteSoftware } from "@/hooks/softwares.hook";
import { useDeleteHardware } from "@/hooks/hardwares.hook";
import {
  useDeleteSubmittedReport,
  useUpdateManyReports,
} from "@/hooks/instructorWeeklyUsage.hook";
import {
  useSubmitLabWeeklyReport,
  useUpdateManyLabWeeklyReports,
} from "@/hooks/laboratoryWeeklyUsage.hook";
import {
  useCreateBorrowerSlip,
  useDeleteBorrowerSlip,
  useDeleteBorrowerSlipItem,
} from "@/hooks/borrowerSlip.hook";
import {
  useDeleteStockCard,
  useLaboratoryDeleteStockCardItems,
} from "@/hooks/stockCard.hook";
import { useAcknowledgeMISM, useDeleteMISM } from "@/hooks/stockCardMISM.hook";
import { useDeletelaboratoryOrientation } from "@/hooks/laboratoryOrientation.hook";

export default function ConfirmationModal({ extraObject, closeModal }) {
  const [isLoading, setIsLoading] = useState(false);

  const deleteClasslistStudent = useRemoveStudents();
  const deleteUserMutation = useDeleteUser(closeModal, setIsLoading);
  const deleteSubjectMutation = useDeleteSubject(closeModal, setIsLoading);
  const deleteStudentMutation = useDeleteStudent(closeModal, setIsLoading);
  const deleteScheduleMutation = useDeleteSchedule(closeModal, setIsLoading);
  const deleteSoftwareMutation = useDeleteSoftware(closeModal, setIsLoading);
  const deleteHardwareMutation = useDeleteHardware(closeModal, setIsLoading);
  const deleteBorrowerSlipMutation = useDeleteBorrowerSlip(
    closeModal,
    setIsLoading,
  );
  const deleteStockCardMutation = useDeleteStockCard(closeModal, setIsLoading);
  const deleteStockCardItemMutation = useLaboratoryDeleteStockCardItems(
    closeModal,
    setIsLoading,
  );
  const deleteMISMMutation = useDeleteMISM(closeModal, setIsLoading);
  const acknowlegdeMISMMutation = useAcknowledgeMISM(closeModal, setIsLoading);

  const deleteBorrowerSlipItemMutation = useDeleteBorrowerSlipItem(
    closeModal,
    setIsLoading,
  );

  const createBorrowerSlipMutation = useCreateBorrowerSlip(
    closeModal,
    setIsLoading,
  );

  const addUtilizationMutation = useAddUtilization(closeModal, setIsLoading);
  const endUtilizationMutation = useEndClassUtilization(
    closeModal,
    setIsLoading,
  );

  const deleteSubmittedReportMutation = useDeleteSubmittedReport(
    closeModal,
    setIsLoading,
  );

  const deleteLaboratoryOrientationMutation = useDeletelaboratoryOrientation(
    closeModal,
    setIsLoading,
  );

  const updateManyReportsStatusMutation = useUpdateManyReports(
    closeModal,
    setIsLoading,
  );
  const updateManyLabWeeklyReportsMutation = useUpdateManyLabWeeklyReports(
    closeModal,
    setIsLoading,
  );

  const laboratoryWeeklyUtilizationMutation = useSubmitLabWeeklyReport(
    closeModal,
    setIsLoading,
  );

  const cancelUtilizationMutation = useCancelLaboratoryUtilization(
    closeModal,
    setIsLoading,
  );
  const deleteSchoolYearMutation = useDeleteSchoolYear(
    closeModal,
    setIsLoading,
  );
  const deleteNoClassDateMutation = useDeleteNoClassSchedule(
    closeModal,
    setIsLoading,
  );

  const updateUserStatusMutation = useUpdateUserStatus(
    closeModal,
    setIsLoading,
  );
  const logoutUserMutation = useLogoutUser(closeModal, setIsLoading);
  const pageReloadMutation = usePageReload(closeModal, setIsLoading);

  return (
    <ConfirmationModalBody
      isLoading={isLoading}
      extraObject={extraObject}
      closeModal={closeModal}
      deleteHardwareMutation={deleteHardwareMutation}
      deleteSoftwareMutation={deleteSoftwareMutation}
      deleteUserMutation={deleteUserMutation}
      deleteSubjectMutation={deleteSubjectMutation}
      deleteClasslistStudent={deleteClasslistStudent}
      addUtilizationMutation={addUtilizationMutation}
      cancelUtilizationMutation={cancelUtilizationMutation}
      endUtilizationMutation={endUtilizationMutation}
      deleteStudentMutation={deleteStudentMutation}
      deleteScheduleMutation={deleteScheduleMutation}
      deleteSchoolYearMutation={deleteSchoolYearMutation}
      deleteNoClassDateMutation={deleteNoClassDateMutation}
      updateManyReportsStatusMutation={updateManyReportsStatusMutation}
      laboratoryWeeklyUtilizationMutation={laboratoryWeeklyUtilizationMutation}
      updateManyLabWeeklyReportsMutation={updateManyLabWeeklyReportsMutation}
      deleteBorrowerSlipMutation={deleteBorrowerSlipMutation}
      deleteStockCardMutation={deleteStockCardMutation}
      createBorrowerSlipMutation={createBorrowerSlipMutation}
      deleteBorrowerSlipItemMutation={deleteBorrowerSlipItemMutation}
      deleteMISMMutation={deleteMISMMutation}
      acknowlegdeMISMMutation={acknowlegdeMISMMutation}
      logoutUserMutation={logoutUserMutation}
      pageReloadMutation={pageReloadMutation}
      updateUserStatusMutation={updateUserStatusMutation}
      deleteStockCardItemMutation={deleteStockCardItemMutation}
      deleteLaboratoryOrientationMutation={deleteLaboratoryOrientationMutation}
      deleteSubmittedReportMutation={deleteSubmittedReportMutation}
    />
  );
}

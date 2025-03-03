import { CONFIRMATION_MODAL_CLOSE_TYPES } from "@/globals/globalConstantUtil";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { CircleX, LoaderCircle, Send } from "lucide-react";

export default function ConfirmationModalBody({
  isLoading,
  extraObject,
  closeModal,
  deleteSubjectMutation,
  deleteUserMutation,
  deleteClasslistStudent,
  addUtilizationMutation,
  cancelUtilizationMutation,
  endUtilizationMutation,
  deleteStudentMutation,
  deleteScheduleMutation,
  deleteSchoolYearMutation,
  deleteNoClassDateMutation,
  deleteSoftwareMutation,
  deleteHardwareMutation,
  logoutUserMutation,
  pageReloadMutation,
  updateManyReportsStatusMutation,
  laboratoryWeeklyUtilizationMutation,
  updateManyLabWeeklyReportsMutation,
  deleteBorrowerSlipMutation,
  deleteStockCardMutation,
  createBorrowerSlipMutation,
  deleteBorrowerSlipItemMutation,
  deleteMISMMutation,
  acknowlegdeMISMMutation,
  updateUserStatusMutation,
  deleteStockCardItemMutation,
  deleteLaboratoryOrientationMutation,
  deleteSubmittedReportMutation,
}) {
  const {
    message,
    type,
    userId,
    forAddingData,
    forDeletionData,
    forUpdatingData,
  } = extraObject;

  const navigate = useNavigate();

  const proceedWithYes = () => {
    // * USER SECTION
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.UPDATE_USER_STATUS) {
      // positive response, call api or call the mutate function
      updateUserStatusMutation.mutate(forUpdatingData);
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.USERS_DELETE) {
      // positive response, call api or call the mutate function
      deleteUserMutation.mutate(userId);
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.LOGOUT_USER) {
      // positive response, call api or call the mutate function
      logoutUserMutation.mutate();
      // window.location.href = '/login';
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.PAGE_RELOAD) {
      // positive response, call api or call the mutate function
      pageReloadMutation.mutate();
      // window.location.href = '/login';
    }
    // *============================

    // * ACADEMIC DURATION SECTION
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.SCHOOL_YEAR_DELETE) {
      // positive response, call api or call the mutate function
      deleteSchoolYearMutation.mutate(forDeletionData);
    }
    // *============================

    // * MASTERLIST SECTION
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.SUBJECT_DELETE) {
      // positive response, call api or call the mutate function
      deleteSubjectMutation.mutate(forDeletionData);
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.REMOVE_CLASSLIST_STUDENT) {
      // positive response, call api or call the mutate function
      deleteClasslistStudent.mutate(forDeletionData);
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.STUDENT_DELETE) {
      // positive response, call api or call the mutate function
      deleteStudentMutation.mutate(forDeletionData);
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.NO_CLASS_DATE_DELETE) {
      // positive response, call api or call the mutate function
      deleteNoClassDateMutation.mutate(forDeletionData);
    }
    // *============================

    // * SCHEDULE SECTION
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.SCHEDULE_DELETE) {
      // positive response, call api or call the mutate function
      deleteScheduleMutation.mutate(forDeletionData);
    }
    // *============================

    // * UTILIZATION SECTION
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.START_CLASS) {
      // positive response, call api or call the mutate function
      addUtilizationMutation.mutate(forAddingData);
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.END_CLASS) {
      // positive response, call api or call the mutate function
      endUtilizationMutation.mutate(forAddingData);
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.CANCEL_CLASS) {
      // positive response, call api or call the mutate function
      cancelUtilizationMutation.mutate(forDeletionData);
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.DELETE_LAB_ORIENTATION) {
      // positive response, call api or call the mutate function
      deleteLaboratoryOrientationMutation.mutate(forDeletionData);
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.UPDATE_ALL_REPORTS_STATUS) {
      // positive response, call api or call the mutate function
      updateManyReportsStatusMutation.mutate(forUpdatingData);
    }
    if (
      type ===
      CONFIRMATION_MODAL_CLOSE_TYPES.UPDATE_ALL_LABORATORY_REPORTS_STATUS
    ) {
      // positive response, call api or call the mutate function
      updateManyLabWeeklyReportsMutation.mutate(forUpdatingData);
    }
    if (
      type === CONFIRMATION_MODAL_CLOSE_TYPES.SUBMIT_LABORATORY_WEEKLY_USAGE
    ) {
      // positive response, call api or call the mutate function
      laboratoryWeeklyUtilizationMutation.mutate({
        forAddingData,
        isNew: true,
      });
    }

    if (
      type === CONFIRMATION_MODAL_CLOSE_TYPES.INSTRUCTOR_WEEKLY_USAGE_DELETE
    ) {
      // positive response, call api or call the mutate function
      deleteSubmittedReportMutation.mutate(forDeletionData);
    }

    // *============================

    // * INVENTORY SECTION
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.SOFTWARE_DELETE) {
      // positive response, call api or call the mutate function
      deleteSoftwareMutation.mutate(forDeletionData);
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.HARDWARE_DELETE) {
      // positive response, call api or call the mutate function
      deleteHardwareMutation.mutate(forDeletionData);
    }
    // *============================

    // * BORROWER SLIP SECTION
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.BORROWER_SLIP_CREATE) {
      // positive response, call api or call the mutate function
      createBorrowerSlipMutation.mutate({ forAddingData, isNew: true });
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.BORROWER_SLIP_DELETE) {
      // positive response, call api or call the mutate function
      deleteBorrowerSlipMutation.mutate(forDeletionData);
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.BORROWER_SLIP_DELETE_ITEM) {
      // positive response, call api or call the mutate function
      deleteBorrowerSlipItemMutation.mutate({ forDeletionData });
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.BORROWER_SLIP_DELETE_ITEM) {
      // positive response, call api or call the mutate function
      deleteBorrowerSlipItemMutation.mutate({ forDeletionData });
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.BORROWER_SLIP_LIST) {
      // positive response, call api or call the mutate function
      navigate("/lumens/app/inventory-borrower-slip", { replace: true });
      closeModal();
    }

    // *============================

    // * STOCK CARD SECTION
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.STOCK_CARD_DELETE) {
      // positive response, call api or call the mutate function
      deleteStockCardMutation.mutate(forDeletionData);
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.STOCK_CARD_MISM_DELETE) {
      // positive response, call api or call the mutate function
      deleteMISMMutation.mutate(forDeletionData.mismId);
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.STOCK_CARD_MISM_ACKNOWLEDGE) {
      // positive response, call api or call the mutate function
      acknowlegdeMISMMutation.mutate({ forUpdatingData });
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.STOCK_CARD_DELETE_ITEM) {
      // positive response, call api or call the mutate function
      deleteStockCardItemMutation.mutate({ forDeletionData });
    }
    // *============================
  };

  return (
    <>
      <div className="mt-8 text-center">{message}</div>
      <div className="float-end mt-12 flex gap-2">
        <Button size="sm" variant="destructive" onClick={() => closeModal()}>
          <p className="flex items-center gap-1">
            <CircleX size={18} strokeWidth={2.5} />
            Cancel
          </p>
        </Button>

        <Button
          size="sm"
          variant="secondary"
          className="w-40 font-semibold"
          onClick={() => proceedWithYes()}
          disabled={isLoading}
        >
          <p className="flex items-center gap-1">
            {isLoading ? (
              <>
                <LoaderCircle
                  className="-ms-1 me-2 animate-spin"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Submitting
              </>
            ) : (
              <>
                <Send size={16} strokeWidth={2.5} />
                Confirm
              </>
            )}
          </p>
        </Button>
      </div>
    </>
  );
}

import { modalStore } from "@/store";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import ConfirmationModal from "@/common/modal/ConfirmationModal";
import UploadClasslistBatchStudents from "@/features/masterlist/classList/components/ClasslistStudents/components/uploadClasslistBatchStudents";
import SetWifiVoucher from "@/features/settings/listOfUsers/components/SetWifiVoucher";
import ScheduleInfoMoldal from "@/features/laboratory/scheduler/components/SchedulerView/components/ScheduleInfoModal";
import AddUserModalBody from "@/common/modal/user/addUserModalBody/AddUserModalBody";
import PasswordResetModalBody from "@/common/modal/user/PasswordResetModalBody";
import UpdateUserPasswordBodyModal from "@/common/modal/user/updateUserPasswordBodyModal/UpdateUserPasswordBodyModal";
import AddAfterUsageRemarksModalBody from "@/common/modal/laboratory/addAfterUsageRemarksModalBody/AddAfterUsageRemarksModalBody";
import ListOfLabMonitoringModalBody from "@/common/modal/laboratory/laboratoryMonitoring/ListOfLabMonitoringModalBody";
import AddSubjectModalBody from "@/common/modal/subject/addSubjectModalBody/AddSubjectModalBody";
import AddScheduleModalBody from "@/common/modal/laboratory/addScheduleModalBody/AddScheduleModalBody";
import AddStudentModalBody from "@/common/modal/student/addStudentModalBody/AddStudentModalBody";
import AddNoCLassBodyModal from "@/common/modal/settings/addNoCLassBodyModal/AddNoCLassBodyModal";
import AddSchoolYearBodyModal from "@/common/modal/settings/AddSchoolYearBodyModal";
import SetTermSemDatesModalBody from "@/common/modal/settings/SetTermSemDatesModalBody";
import AddSoftwareBodyModal from "@/common/modal/inventory/addSoftwareBodyModal/AddSoftwareBodyModal";
import AddHardwareBodyModal from "@/common/modal/inventory/addHardwareBodyModal/AddHardwareBodyModal";
import AddUpgradesBodyModal from "@/common/modal/inventory/addUpgradesBodyModal/AddUpgradesBodyModal";
import UtilizationClasslistModalBody from "@/common/modal/laboratory/utilizationClasslistModalBody/UtilizationClasslistModalBody";
import TransferScheduleModalBody from "@/common/modal/laboratory/transferSchedule/TransferScheduleModalBody";
import PrintBorrowerSlipModalBody from "@/common/modal/inventory/borrowerSlip/printBorrowerSlip/PrintBorrowerSlipModalBody";
import CreateStockCardModalBody from "@/common/modal/inventory/stockCard/createStockCard/CreateStockCardModalBody";
import AddStockCardItemsModalBody from "@/common/modal/inventory/stockCard/addStockCardItems/AddStockCardItemsModalBody.jsx";
import ReleaseStockCardItemsModalBody from "@/common/modal/inventory/stockCard/releaseStockCardItems/ReleaseStockCardItemsModalBody";
import PrintMISMModalBody from "@/common/modal/inventory/stockCard/printMISM/PrintMISMModalBody";
import SubmitMISMModalBody from "@/common/modal/inventory/stockCard/submitMISM/SubmitMISMModalBody";
import AddEditBorrowerSlipItemModalBody from "@/common/modal/inventory/borrowerSlip/addEditBorrowerSlipItem/AddEditBorrowerSlipItemModalBody";
import ReleaseBorrowerSlipModalBody from "@/common/modal/inventory/borrowerSlip/releaseBorrowerSlip/ReleaseBorrowerSlipModalBody";
import ReturnBorrowerSlipModalBody from "@/common/modal/inventory/borrowerSlip/returnBorrowerSlip/ReturnBorrowerSlipModalBody";
import AddReservationModalBody from "@/common/modal/laboratory/addReservationModal/AddReservationModalBody";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/common/ui/dialog";
import AssignUserLaboratoriesModlBody from "@/common/modal/user/assign-user-laboratories/AssignUserLaboratoriesModalBody";
import AssignUserOfficeModalBody from "@/common/modal/user/assign-user-offices/AssignUserOfficeModalBody";
import WeeklyLaboratoryReportsModalBody from "@/common/modal/reports/weekly-laboratory-reports/WeeklyLaboratoryReportsModalBody";
import SubmissionOfWeeklyUsageModalBody from "@/common/modal/reports/submission-of-weekly-usage/SubmissionOfWeeklyUsageModalBody";
import SubmissionOfLaboratoryOrientationModalBody from "@/common/modal/reports/submission-of-laboratory-orientation/SubmissionOfLaboratoryOrientationModalBody";
import UpdateUtilizationUsageModalBody from "@/common/modal/reports/update-utilization-usage/UpdateUtilizationUsageModalBody";

export default function ModalLayout() {
  const [isOpen, bodyType, size, extraObject, title, closeModal] = modalStore(
    (state) => [
      state.isOpen,
      state.bodyType,
      state.size,
      state.extraObject,
      state.title,
      state.closeModal,
    ],
  );

  const close = () => {
    closeModal();
  };

  // RENDER SECTION
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className={`${size}`}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold tracking-wide">
            {title}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          {/* <button
          type="button"
          className="btn-circle btn-secondary btn-sm absolute right-3 top-3 z-10 text-white transition duration-200 ease-in"
          onClick={() => close()}
        >
          ✕
        </button> */}

          {/* Loading modal body according to different modal type */}
          {
            {
              [MODAL_BODY_TYPES.ACKNOWLEDGE_MANY_ORIENTATIONS]: (
                <SubmissionOfLaboratoryOrientationModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.AFTER_USAGE_REMARKS_OPEN]: (
                <AddAfterUsageRemarksModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.BORROWER_SLIP_PRINT]: (
                <PrintBorrowerSlipModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.BORROWER_SLIP_RELEASE]: (
                <ReleaseBorrowerSlipModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.BORROWER_SLIP_RETURN]: (
                <ReturnBorrowerSlipModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.SCHOOL_YEAR_ADD_NEW]: (
                <AddSchoolYearBodyModal
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.NO_CLASS_ADD_NEW]: (
                <AddNoCLassBodyModal
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.STUDENT_ADD_NEW]: (
                <AddStudentModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.SUBJECT_ADD_NEW]: (
                <AddSubjectModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.CLASSLIST_BACTH_UPLOAD]: (
                <UploadClasslistBatchStudents
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.SCHEDULE_ADD_NEW]: (
                <AddScheduleModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.SCHEDULE_RESERVATION]: (
                <AddReservationModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.SCHEDULE_TRANSFER]: (
                <TransferScheduleModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.SCHEDULE_INFO]: (
                <ScheduleInfoMoldal
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.SUBMIT_MANY_WEEKLY_USAGE]: (
                <SubmissionOfWeeklyUsageModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.UTILIZATION_CLASSLIST_OPEN]: (
                <UtilizationClasslistModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.UTILIZATION_UPDATE]: (
                <UpdateUtilizationUsageModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.USERS_ADD_NEW]: (
                <AddUserModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.USER_ASSIGN_LABORATORIES]: (
                <AssignUserLaboratoriesModlBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.USER_ASSIGN_OFFICES]: (
                <AssignUserOfficeModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.USERS_RESET_PASSWORD]: (
                <PasswordResetModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.USERS_UPDATE_PASSWORD]: (
                <UpdateUserPasswordBodyModal
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.SET_WIFI_VOUCHER]: (
                <SetWifiVoucher closeModal={close} extraObject={extraObject} />
              ),

              [MODAL_BODY_TYPES.SOFTWARE_ADD]: (
                <AddSoftwareBodyModal
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.HARDWARE_ADD]: (
                <AddHardwareBodyModal
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.BORROWER_SLIP_ADD_ITEM]: (
                <AddEditBorrowerSlipItemModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.STOCK_CARD_ADD_NEW]: (
                <CreateStockCardModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.STOCK_CARD_ADD_ITEM]: (
                <AddStockCardItemsModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.STOCK_CARD_RELEASE_ITEM]: (
                <ReleaseStockCardItemsModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.STOCK_CARD_MISM_SUBMIT]: (
                <SubmitMISMModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.STOCK_CARD_MISM_PRINT]: (
                <PrintMISMModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.TERM_SEM_SET_DATES]: (
                <SetTermSemDatesModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),

              [MODAL_BODY_TYPES.UPGRADE_DETAILS]: (
                <AddUpgradesBodyModal
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.VIEW_MONITORING]: (
                <ListOfLabMonitoringModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.VIEW_LABORATORY_UTILIZATIONS]: (
                <WeeklyLaboratoryReportsModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.CONFIRMATION]: (
                <ConfirmationModal
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.DEFAULT]: <div></div>,
            }[bodyType]
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}

{
  /* <div
className={`modal backdrop-blur-[1px] ${isOpen ? "modal-open" : ""} overflow-auto`}
>
<div
  className={`modal-box max-h-full overflow-visible border-2 border-base-300/50 ${
    size ? size : "max-w-lg"
  }`}
>
 
</div>
</div> */
}

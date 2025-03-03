import { Button } from "@/common/ui/button";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";

export default function CancelClassButton({
  usageId,
  currentUser,
  laboratory,
  schedule,
  openModal,
  usageStartTime,
  usageEndTime,
}) {
  // ON CANCEL CLICK
  const onCancelClassClick = (usageId, currentUser, laboratory) => {
    const { code, title } = schedule;

    const forDeletionData = {
      usageId,
      cancelledBy: currentUser.fullName,
      laboratory,
      code,
      subjectTitle: title,
    };

    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: `Cancel / Delete the utilization for this class? `,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.CANCEL_CLASS,
        forDeletionData,
      },
    };

    openModal(payload);
  };

  const cancelClassBtnIsDisabled = usageStartTime && !usageEndTime;

  return (
    <Button
      size="sm"
      type="button"
      disabled={!cancelClassBtnIsDisabled}
      variant="outline"
      onClick={() => onCancelClassClick(usageId, currentUser, laboratory)}
      className={`w-full ${
        !cancelClassBtnIsDisabled
          ? ""
          : "border-none bg-primary/80 hover:!bg-primary/70"
      }`}
    >
      Cancel Class
    </Button>
  );
}

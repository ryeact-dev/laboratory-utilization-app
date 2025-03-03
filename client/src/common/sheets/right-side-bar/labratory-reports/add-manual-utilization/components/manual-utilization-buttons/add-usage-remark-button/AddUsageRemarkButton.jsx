import { Button } from "@/common/ui/button";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";

export default function AddUsageRemarkButton({
  openModal,
  usageId,
  laboratory,
  usageEndTime,
  usageStartTime,
  usageDate,
}) {
  // ON REMARKS CLICK
  const openRemarksModal = (usageId, laboratory) => {
    const payload = {
      title: `After usage remarks`,
      bodyType: MODAL_BODY_TYPES.AFTER_USAGE_REMARKS_OPEN,
      extraObject: { usageId, laboratory, usageDate },
      size: "max-w-xl",
    };

    openModal(payload);
  };

  const remarksBtnIsDisabled = usageStartTime !== null && usageEndTime === null;

  return (
    <div className="w-full min-w-max">
      <Button
        size="sm"
        variant={"destructive"}
        className="w-full font-semibold"
        disabled={!remarksBtnIsDisabled}
        onClick={() => openRemarksModal(usageId, laboratory)}
      >
        Remarks
      </Button>
    </div>
  );
}

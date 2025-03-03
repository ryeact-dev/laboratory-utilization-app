import { Button } from "@/common/ui/button";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";

export default function ClasslistButton({
  openModal,
  usageId,
  schedule,
  usageStartTime,
  usageEndTime,
  usageDate,
}) {
  // ON CLASSLIST CLICK
  const openClasslistModal = (usageId) => {
    const { code, title, students } = schedule;

    const subjecTitle = `Classlist of ${code}-${title}`;

    const payload = {
      title: "",
      bodyType: MODAL_BODY_TYPES.UTILIZATION_CLASSLIST_OPEN,
      extraObject: { usageId, classlist: students, usageDate },
      size: "max-w-4xl",
    };

    openModal(payload);
  };

  const classlistBtnIsDisabled =
    (usageStartTime && !usageEndTime) || !schedule?.students;

  return (
    <div className="w-full min-w-max">
      <Button
        size="sm"
        variant={"destructive"}
        className="w-full font-semibold"
        disabled={!classlistBtnIsDisabled}
        onClick={() => openClasslistModal(usageId)}
      >
        Classlist
      </Button>
    </div>
  );
}

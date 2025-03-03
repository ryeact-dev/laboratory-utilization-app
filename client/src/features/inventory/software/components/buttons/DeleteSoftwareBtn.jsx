import { modalStore } from "@/store";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import { Button } from "@/common/ui/button";
import { Trash } from "lucide-react";

function DeleteSoftwareBtn({ softwareId }) {
  const openModal = modalStore((state) => state.openModal);

  const onDeleteSoftware = (softwareId) => {
    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: `Are you sure you want to delete this software?`,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.SOFTWARE_DELETE,
        forDeletionData: softwareId,
      },
    };

    openModal(payload);
  };

  return (
    <div className="tooltip tooltip-primary" data-tip="delete">
      <Button onClick={() => onDeleteSoftware(softwareId)}>
        <Trash size={20} className="hover:text-primary" />
      </Button>
    </div>
  );
}

export default DeleteSoftwareBtn;

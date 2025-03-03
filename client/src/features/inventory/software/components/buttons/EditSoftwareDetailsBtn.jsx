import { modalStore } from "@/store";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import { SquarePen } from "lucide-react";
import { Button } from "@/common/ui/button";

function EditSoftwareDetailsBtn({ softwareOBJ }) {
  const openModal = modalStore((state) => state.openModal);

  const openEditSubjectModal = (softwareData) => {
    const title = softwareData ? "Update Subject" : "Add New Subject";

    const payload = {
      title,
      bodyType: MODAL_BODY_TYPES.SOFTWARE_ADD,
      extraObject: softwareData,
    };

    openModal(payload);
  };

  return (
    <div className="tooltip tooltip-primary" data-tip="edit">
      <Button onClick={() => openEditSubjectModal(softwareOBJ)}>
        <SquarePen size={20} className="hover:text-primary" />
      </Button>
    </div>
  );
}

export default EditSoftwareDetailsBtn;

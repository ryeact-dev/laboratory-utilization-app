import { modalStore } from "@/store";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";

import { Button } from "@/common/ui/button";
import { CirclePlus, SquarePen } from "lucide-react";

function AddEditSubjectBtn({
  currentUser,
  subjectObj = null,
  selectedTermAndSem,
}) {
  const openModal = modalStore((state) => state.openModal);

  const openAddEditSubjectModal = (currentUser, subject) => {
    const title = subject ? "Update Subject" : "Add Subject";

    const payload = {
      title,
      bodyType: MODAL_BODY_TYPES.SUBJECT_ADD_NEW,
      extraObject: { subject, currentUser, selectedTermAndSem },
    };

    openModal(payload);
  };

  return (
    <div className="float-right inline-block">
      {subjectObj === null ? (
        <Button
          variant="secondary"
          className="px-6"
          onClick={() => openAddEditSubjectModal(currentUser, subjectObj)}
        >
          <CirclePlus size={18} strokeWidth={3} /> <span>Add Subject</span>
        </Button>
      ) : (
        <Button
          className="font-normal"
          variant="ghost"
          onClick={() => openAddEditSubjectModal(currentUser, subjectObj)}
        >
          <SquarePen size={16} />
          <span>Edit Subject</span>
        </Button>
      )}
    </div>
  );
}

export default AddEditSubjectBtn;

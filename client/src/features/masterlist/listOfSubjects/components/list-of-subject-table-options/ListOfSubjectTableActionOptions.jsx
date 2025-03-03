import { Button } from "@/common/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/common/ui/dropdown-menu";

import { useNavigate } from "react-router-dom";
import { modalStore } from "@/store";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import { Ellipsis, SquarePen, Trash, Users } from "lucide-react";

export default function ListOfSubjectTableOptions({
  subject = null,
  currentUser,
  activeSchoolYear,
}) {
  const navigate = useNavigate();
  const openModal = modalStore((state) => state.openModal);

  const btnBtnClick = (subjectId) => {
    navigate(`/lumens/app/subjects/${subjectId}`);
  };

  const openAddEditSubjectModal = (currentUser, subject) => {
    const payload = {
      title: "Update Subject",
      bodyType: MODAL_BODY_TYPES.SUBJECT_ADD_NEW,
      extraObject: { subject, currentUser },
    };

    openModal(payload);
  };

  const deleteSubject = (subjectId, activeSchoolYear, currentUserName) => {
    const forDeletionData = {
      subjectId,
      activeSchoolYear,
      currentUserName,
    };

    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: `Are you sure you want to delete this subject?`,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.SUBJECT_DELETE,
        forDeletionData,
      },
    };

    openModal(payload);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => btnBtnClick(subject.id)}>
          <Users size={16} />
          Classlist
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => openAddEditSubjectModal(currentUser, subject)}
        >
          <SquarePen size={16} />
          Edit Subject
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:!bg-primary"
          onClick={() =>
            deleteSubject(subject?.id, activeSchoolYear, currentUser.fullName)
          }
        >
          <Trash size={16} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

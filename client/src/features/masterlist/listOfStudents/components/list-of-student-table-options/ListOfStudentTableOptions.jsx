import { Button } from "@/common/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/common/ui/dropdown-menu";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import { modalStore } from "@/store";
import { Ellipsis, Trash, Users } from "lucide-react";

export default function ListOfStudentTableOptions({
  student,
  activeSchoolYear,
  currentUser,
}) {
  const openModal = modalStore((state) => state.openModal);

  const editStudent = (student) => {
    const payload = {
      title: "Update Student Info",
      bodyType: MODAL_BODY_TYPES.STUDENT_ADD_NEW,
      extraObject: student,
    };

    openModal(payload);
  };

  const deleteStudent = (studentIdNumber, studentUUID) => {
    const message = (
      <label>
        Remove this student with ID Number:{" "}
        <span className="font-semibold text-primary">{studentIdNumber} </span>
        in the students list?
      </label>
    );

    openModal({
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.STUDENT_DELETE,
        forDeletionData: { studentIdNumber, studentUUID, activeSchoolYear },
      },
    });
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
        <DropdownMenuItem onClick={() => editStudent(student)}>
          <Users size={16} />
          Edit Student
        </DropdownMenuItem>

        {currentUser.role === "Admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:!bg-primary"
              onClick={() => deleteStudent(student.id_number, student?.id)}
            >
              <Trash size={16} />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { modalStore } from "@/store";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import { SquarePen } from "lucide-react";
import Avatar from "@/common/avatar/Avatar";
import { Card, CardContent, CardFooter } from "@/common/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";
import { Badge } from "@/common/ui/badge";
import {
  SUB_CARD_BG_CLASS,
  TABLE_HEADER_BADGE_CLASS,
} from "@/globals/initialValues";
import PaginationBlock from "@/common/pagination-block/PaginationBlock";
import ListOfStudentTableOptions from "../list-of-student-table-options/ListOfStudentTableOptions";

export default function ListOfStudentTable({
  currentUser,
  activeSchoolYear,
  listItems,
  page,
  onPageClick,
  isPlaceholderData,
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

  // const deleteStudent = (studentIdNumber, studentUUID) => {
  //   const message = (
  //     <label>
  //       Remove this student with ID Number:{' '}
  //       <span className='font-semibold text-primary'>{studentIdNumber} </span>
  //       in the students list?
  //     </label>
  //   );

  //   openModal({
  //     title: 'Confirmation',
  //     bodyType: MODAL_BODY_TYPES.CONFIRMATION,
  //     extraObject: {
  //       message,
  //       type: CONFIRMATION_MODAL_CLOSE_TYPES.STUDENT_DELETE,
  //       forDeletionData: { studentIdNumber, studentUUID, activeSchoolYear },
  //     },
  //   });
  // };

  return (
    <Card className={`${SUB_CARD_BG_CLASS}`}>
      <CardContent className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                Student
              </TableHead>

              <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                Options
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listItems?.students?.map((student, index) => (
              <TableRow key={index}>
                <TableCell style={{ fontFamily: "Roboto Mono" }}>
                  <p className="text-secondary">{student.id_number}</p>
                  <p className="uppercase">
                    {student.full_name ? student.full_name : "No name provided"}
                  </p>
                </TableCell>

                <TableCell>
                  <ListOfStudentTableOptions
                    currentUser={currentUser}
                    student={student}
                    activeSchoolYear={activeSchoolYear}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <PaginationBlock
          count={listItems?.studentsCount}
          total={listItems?.totalStudents}
          hasMore={listItems?.hasMore}
          page={page}
          onPageClick={onPageClick}
          isPlaceholderData={isPlaceholderData}
        />
      </CardFooter>
    </Card>
  );
}

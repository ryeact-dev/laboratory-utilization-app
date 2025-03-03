import { useState } from "react";
import { modalStore } from "@/store";
import { useRemoveStudents } from "@/hooks/subjects.hook";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import { useGetPaginatedClasslist } from "@/hooks/students.hook";
import SubjectDetails from "./components/SubjectDetails";
import { Button } from "@/common/ui/button";
import { Badge } from "@/common/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/common/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";
import { TABLE_HEADER_BADGE_CLASS } from "@/globals/initialValues";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import { Users } from "lucide-react";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";

function ClasslistStudents({
  fetchedSubject,
  activeSchoolYear,
  isSubjectActive,
}) {
  const { currentUser } = useGetCurrentUserData();

  const openModal = modalStore((state) => state.openModal);

  const classlist = fetchedSubject?.data[0].students || [];
  const subjectId = fetchedSubject?.data[0].id || [];

  const [page, setPage] = useState(0);

  const {
    isLoading,
    data: paginatedClasslist,
    isPlaceholderData,
  } = useGetPaginatedClasslist(page, classlist, 20);

  const deleteClasslistStudentMutation = useRemoveStudents();

  // Function to remove the student from the class
  const removeStudent = (studentId) => {
    const updatedClasslist = classlist.filter((uuid) => uuid !== studentId);

    const forDeletionData = {
      subjectId,
      updatedClasslist,
      activeSchoolYear,
    };

    deleteClasslistStudentMutation.mutate(forDeletionData);
  };

  const onBatchUploadClick = () => {
    const payload = {
      title: "Batch Upload",
      bodyType: MODAL_BODY_TYPES.CLASSLIST_BACTH_UPLOAD,
      extraObject: { subjectId, activeSchoolYear, classlist },
    };

    openModal(payload);
  };

  const studentWorkstationNumber = (index) => {
    if (page === 0) {
      index = index <= 20 ? index++ : 20;
    } else if (page === 1) {
      index = index <= 40 ? 20 + index++ : 40;
    } else if (page === 2) {
      index = index <= 60 ? 40 + index++ : 60;
    }
    return index < 10 ? `0${index}` : index;
  };

  // RENDER SECTION
  return (
    <article className="-mt-3 w-full flex-col">
      <article className="mb-3 flex items-center justify-between">
        <p className="text-xl font-medium tracking-wide">Subject Classlist</p>
        <Button
          size="sm"
          variant="secondary"
          type="button"
          onClick={onBatchUploadClick}
          className="font-semibold"
        >
          <Users strokeWidth={2.5} /> Upload Batch Students
        </Button>
      </article>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Card>
          <CardHeader>
            <SubjectDetails fetchedSubject={fetchedSubject} />
          </CardHeader>
          <CardContent className="">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                    PC No.
                  </TableHead>
                  <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                    ID No.
                  </TableHead>
                  <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                    Name
                  </TableHead>

                  <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedClasslist &&
                  classlist.length > 0 &&
                  paginatedClasslist.students?.map(
                    ({ id_number, full_name, id }, index) => (
                      <TableRow key={index}>
                        <TableCell
                          className=""
                          style={{ fontFamily: "Roboto Mono" }}
                        >
                          {studentWorkstationNumber(index + 1)}
                        </TableCell>

                        <TableCell
                          className=""
                          style={{ fontFamily: "Roboto Mono" }}
                        >
                          {id_number}
                        </TableCell>
                        <TableCell className="">{full_name}</TableCell>

                        <TableCell className="flex flex-col">
                          {currentUser.role === "Admin" || isSubjectActive ? (
                            <Badge
                              onClick={() => removeStudent(id)}
                              className="flex w-16 justify-center rounded-full border-none py-0 font-normal shadow-none hover:cursor-pointer hover:!bg-primary/80 hover:font-medium"
                            >
                              remove
                            </Badge>
                          ) : (
                            ""
                          )}
                        </TableCell>
                      </TableRow>
                    ),
                  )}
              </TableBody>
            </Table>

            {paginatedClasslist?.hasMore ? (
              <p className="mt-2 text-center">***Nothing Follows***</p>
            ) : null}
          </CardContent>

          <CardFooter className="mt-3 flex items-center justify-between gap-4">
            <div>
              <label className="px-2 text-xs">Page: {page + 1}</label>
            </div>
            <div>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setPage((old) => Math.max(old - 1, 0))}
                disabled={page === 0}
              >
                Previous
              </Button>

              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => {
                  if (!isPlaceholderData || paginatedClasslist?.hasMore) {
                    setPage((old) => old + 1);
                  }
                }}
                disabled={
                  paginatedClasslist?.hasMore &&
                  fetchedSubject.data[0].students.length > 0
                }
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </article>
  );
}

export default ClasslistStudents;

import { useState } from "react";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { useAddClasslistStudent } from "@/hooks/subjects.hook";
import { useGetStudentOnClasslistPage } from "@/hooks/students.hook";
import { Input } from "@/common/ui/input";
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

export default function ListOfAllStudents({
  subjectId,
  classlist,
  isSubjectActive,
  userRole,
}) {
  const [page, setPage] = useState(0);
  const [studentIdNumber, setStudentIdNumber] = useState("");

  const { activeSchoolYear } = useGetCurrentUserData();

  const {
    isLoading,
    data: paginatedStudents,
    isPlaceholderData,
  } = useGetStudentOnClasslistPage(page, studentIdNumber);

  const addStudentMutation = useAddClasslistStudent();

  const isOnClasslist = (studentUUID) => {
    const index = classlist.findIndex((uuid) => uuid === studentUUID);
    return Boolean(index > -1);
  };

  const onAddStudent = (evt, studentId, subjectId) => {
    evt.preventDefault();
    if (isOnClasslist(studentId)) {
      ToastNotification("info", "Student already added");
      return;
    }

    if (classlist.length >= 55) {
      ToastNotification("error", "Classlist is full");
      return;
    }

    addStudentMutation.mutate({ studentId, subjectId, activeSchoolYear });
    setStudentIdNumber("");
  };

  const onStudentIDNumberChange = (evt) => {
    const value = evt.target.value;
    setStudentIdNumber(value);
    setPage(0);
  };

  const onStudentIDNumberKeyPress = (evt) => {
    const value = evt.target.value;

    if (evt.key === "Enter") {
      evt.preventDefault();

      const student = paginatedStudents?.students.filter(
        (student) => student.id_number === Number(value),
      );

      if (student.length === 0) {
        ToastNotification("error", "Student Id Number not exists.");
        return;
      }

      if (classlist.length >= 55) {
        ToastNotification("error", "Classlist is full");
        return;
      }

      const studentId = student[0].id;
      onAddStudent(evt, studentId, subjectId);
    }
  };

  // console.log(paginatedStudents?.students);
  // RENDER SECTION
  return isLoading ? (
    <p>Loading Data</p>
  ) : (
    <section className="-mt-2 w-5/6 flex-col">
      <article className="mb-3">
        <p className="text-xl font-medium tracking-wide">
          List of all students
        </p>
      </article>

      <Card>
        <CardHeader>
          <article className="w-full">
            <Input
              type="text"
              value={studentIdNumber || ""}
              placeholder="Search ID number here"
              onKeyDown={(evt) => onStudentIDNumberKeyPress(evt)}
              onChange={(evt) => onStudentIDNumberChange(evt)}
            />
          </article>
        </CardHeader>
        <CardContent className="">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                  ID No.
                </TableHead>
                <TableHead className={TABLE_HEADER_BADGE_CLASS}>Name</TableHead>
                <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.students?.map(
                ({ id_number, full_name, id }, index) => (
                  <TableRow key={index}>
                    <TableCell
                      className=""
                      style={{ fontFamily: "Roboto Mono" }}
                    >
                      {id_number}
                    </TableCell>

                    <TableCell className="">{full_name}</TableCell>

                    <TableCell className="flex flex-col">
                      {isSubjectActive || userRole === "Admin" ? (
                        <Badge
                          onClick={(evt) => onAddStudent(evt, id, subjectId)}
                          className={`w-16 justify-center rounded-full border-none py-0 font-normal shadow-none hover:cursor-pointer hover:font-medium ${
                            isOnClasslist(id)
                              ? "bg-green-600 px-4 hover:bg-green-600/80"
                              : "bg-accent px-6 hover:bg-accent/80"
                          } `}
                        >
                          {isOnClasslist(id) ? "added" : "add"}
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
          {!paginatedStudents.hasMore ? (
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
                if (!isPlaceholderData && paginatedStudents.hasMore) {
                  setPage((old) => old + 1);
                }
              }}
              disabled={isPlaceholderData || !paginatedStudents.hasMore}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}

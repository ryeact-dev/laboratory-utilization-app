import { Button } from "@/common/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";
import { TABLE_HEADER_BADGE_CLASS } from "@/globals/initialValues";
import { format } from "date-fns";
import { SquarePen } from "lucide-react";

function StudentAttendance({
  page,
  subjectClasslist,
  listOfDates,
  listOfAggregatedUsage,
  studentWorkstationNumber,
  currentUser,
  onEditStudentsAttendance,
}) {
  // RENDER SECTION
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>PCN</TableHead>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>Name</TableHead>
            {listOfDates.map(({ usage_date }, index) => (
              <TableHead key={index} className={`${TABLE_HEADER_BADGE_CLASS}`}>
                <div className="flex items-center justify-center gap-2">
                  {currentUser.role === "Admin" && usage_date && (
                    <Button
                      onClick={() =>
                        onEditStudentsAttendance(
                          listOfAggregatedUsage[0].usage_details[index],
                        )
                      }
                      className="p-0"
                      variant="icon"
                    >
                      <SquarePen />
                    </Button>
                  )}
                  <p className="text-center">
                    {usage_date && format(new Date(usage_date), "MM/dd")}
                  </p>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjectClasslist.map(({ full_name }, index) => (
            <TableRow key={index} className="hover items-center">
              <TableHead className="w-10 text-sm font-semibold">
                <h2>
                  {full_name
                    ? `${
                        index < 9 && page === 0
                          ? `0${studentWorkstationNumber(index + 1)}`
                          : `${studentWorkstationNumber(index + 1)}`
                      }`
                    : "\u00a0"}
                </h2>
              </TableHead>
              <TableHead className="text-left text-sm font-normal uppercase">
                <h2 className="">{full_name ? full_name : ""}</h2>
              </TableHead>
              {listOfAggregatedUsage[0]?.usage_details.map(
                (usage, usageIndex) => (
                  <TableCell key={usageIndex} className={`text-center`}>
                    {usage?.date && (
                      <h2
                        className={`mx-auto font-bold ${
                          usage.students_attendance[
                            studentWorkstationNumber(index)
                          ] === "false" ||
                          !usage.students_attendance[
                            studentWorkstationNumber(index)
                          ]
                            ? "text-primary"
                            : "text-green-600"
                        }`}
                      >
                        {full_name === null
                          ? "\u00a0\u00a0"
                          : !usage.students_attendance[
                                studentWorkstationNumber(index)
                              ]
                            ? "x"
                            : `${
                                usage.students_attendance[
                                  studentWorkstationNumber(index)
                                ] === "true"
                                  ? "\u2713"
                                  : usage.students_attendance[
                                        studentWorkstationNumber(index)
                                      ] === "false"
                                    ? "x"
                                    : "\u00a0\u00a0"
                              }`}
                      </h2>
                    )}
                  </TableCell>
                ),
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default StudentAttendance;

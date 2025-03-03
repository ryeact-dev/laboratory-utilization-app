import PaginationBlock from "@/common/pagination-block/PaginationBlock";
import { Badge } from "@/common/ui/badge";
import { Card, CardContent, CardFooter } from "@/common/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";

import {
  SUB_CARD_BG_CLASS,
  TABLE_HEADER_BADGE_CLASS,
} from "@/globals/initialValues";
import { extractTermSem } from "@/lib/helpers/termSem";
import { format } from "date-fns";
import ListOfSubjectTableOptions from "../list-of-subject-table-options/ListOfSubjectTableActionOptions";

export default function ListOfSubjectsTable({
  currentUser,
  activeSchoolYear,
  listItems,
  page,
  onPageClick,
  isPlaceholderData,
}) {
  return (
    <Card className={`${SUB_CARD_BG_CLASS}`}>
      <CardContent className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                Code & Title
              </TableHead>

              <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                Instructor
              </TableHead>

              <TableHead className={TABLE_HEADER_BADGE_CLASS}>Time</TableHead>
              {/* <TableHead>
                <Badge className={TABLE_HEADER_BADGE_CLASS}>
                  <p className="px-2">Term</p>
                </Badge>
              </TableHead> */}
              <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody style={{ fontFamily: "Roboto Mono" }}>
            {listItems?.subjects?.map((subject) => (
              <TableRow key={subject.id}>
                {/* <TableCell className="">
                  <Badge
                    className={`bg-green-500/10 text-green-500 hover:bg-green-500/10`}
                  >
                    {subject.code}
                  </Badge>
                </TableCell> */}

                <TableCell className="">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-secondary">{subject.code}</p>
                      <Badge
                        className={`bg-green-500/10 px-2 py-0 text-[10px] text-green-500 shadow-none hover:bg-green-500/10`}
                      >
                        {subject.program}
                      </Badge>
                    </div>
                    <p>{subject.title ? subject.title.toUpperCase() : "N/A"}</p>
                  </div>
                </TableCell>

                <TableCell>
                  <p className="capitalize text-secondary">
                    {subject.instructor_name
                      ? subject.instructor_name.toLowerCase()
                      : "No Instructor yet"}
                  </p>
                  <p className="text-xs text-gray-400">{subject.department}</p>
                </TableCell>
                <TableCell className="flex flex-col">
                  {format(
                    new Date(`2023-10-10T${subject.start_time}`),
                    "hh:mma",
                  )}
                  -
                  {format(new Date(`2023-10-10T${subject.end_time}`), "hh:mma")}
                  <p className="text-xs text-gray-400">
                    {extractTermSem(subject.term_sem).term}
                  </p>
                </TableCell>
                {/* <TableCell>
                  <Badge
                    className={`${extractTermSem(subject.term_sem).term === "1st Term" ? "bg-secondary/10 text-secondary hover:bg-secondary/10" : "bg-green-400/10 text-green-400 hover:bg-green-400/10"}`}
                  >
                    {extractTermSem(subject.term_sem).term}
                  </Badge>
                </TableCell> */}

                <TableCell>
                  <ListOfSubjectTableOptions
                    activeSchoolYear={activeSchoolYear}
                    subject={subject}
                    currentUser={currentUser}
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

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
import React from "react";

export default function ListOfOrientationTable({ orientationData }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={`${TABLE_HEADER_BADGE_CLASS} `}>
            <p>Code & Title</p>
          </TableHead>
          <TableHead className={TABLE_HEADER_BADGE_CLASS}>Instructor</TableHead>

          <TableHead className={TABLE_HEADER_BADGE_CLASS}>Laboratory</TableHead>
          <TableHead className={TABLE_HEADER_BADGE_CLASS}>
            Date Conducted
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orientationData.map((orientation, index) => (
          <TableRow key={index}>
            <TableCell className="flex items-center gap-2">
              {orientation.subject_code} - {orientation.subject_title}
            </TableCell>

            <TableCell>{orientation.instructor}</TableCell>

            <TableCell>
              <p>{orientation.laboratory}</p>
            </TableCell>

            <TableCell>
              <p>
                {format(new Date(orientation.date_conducted), "MMM. dd, yyyy")}
              </p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

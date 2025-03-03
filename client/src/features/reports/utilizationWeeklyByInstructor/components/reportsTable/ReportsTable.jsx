import { format } from "date-fns";
import { TableCell, TableRow } from "@/common/ui/table";
import ReportsTableOptions from "./components/reports-table-options/ReportsTableOptions";
import { Checkbox } from "@/common/ui/checkbox";
import { Badge } from "@/common/ui/badge";
import { Check, X } from "lucide-react";

export default function ReportsTable({
  reports,
  selectReport,
  setSelectReport,
  setSelectAll,
  wasAcknowledged,
  currentUser,
  activeSchoolYear,
}) {
  const onCheckedChange = (subjectId) => {
    const isSelected = selectReport.includes(subjectId);
    setSelectAll(false);
    setSelectReport((prev) => {
      if (isSelected) {
        return prev.filter((id) => id !== subjectId);
      } else {
        return [...prev, subjectId];
      }
    });
  };

  const acknowledgementBadges = (step) => {
    switch (step) {
      case 1:
        return (
          <div className="flex items-center gap-2">
            <Badge variant={"error"} className={"text-[11px]"}>
              <X size={12} className="mr-0.5" /> Instructor{" "}
            </Badge>
            <Badge variant={"error"} className={"text-[11px]"}>
              <X size={12} className="mr-1" /> Dean{" "}
            </Badge>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center gap-2">
            <Badge variant={"success"} className={"text-[11px]"}>
              <Check size={12} className="mr-1" /> Instructor{" "}
            </Badge>
            <Badge variant={"error"} className={"text-[11px]"}>
              <X size={12} className="mr-1" /> Dean{" "}
            </Badge>
          </div>
        );
      default:
        break;
    }
  };

  return reports?.map((subject, index) => (
    <TableRow key={index}>
      <TableCell className="flex items-center gap-2">
        {subject.instructor === currentUser.fullName && !wasAcknowledged && (
          <div className="w-7">
            <Checkbox
              checked={selectReport.includes(subject.id)}
              onCheckedChange={() => onCheckedChange(subject.id)}
            />
          </div>
        )}
        <div style={{ fontFamily: "Roboto Mono" }} className="uppercase">
          <p className="font-bold text-secondary">
            {subject.code} - {subject.title}
          </p>
          <p className="-mt-0.5">
            {" "}
            {format(
              new Date(`2024-03-15T${subject.subject_start_time}`),
              "hh:mma",
            )}{" "}
            -{" "}
            {format(
              new Date(`2024-03-15T${subject.subject_end_time}`),
              "hh:mma",
            )}
          </p>
        </div>
      </TableCell>

      <TableCell>
        <div className="">
          <p>{subject.instructor}</p>

          {currentUser.role === "Admin" ? (
            acknowledgementBadges(subject.step)
          ) : (
            <p className="text-xs text-gray-400">
              {subject.instructor_department}
            </p>
          )}
        </div>
      </TableCell>

      {/* <TableCell style={{ fontFamily: "Roboto Mono" }}>
          {format(new Date(`2024-03-15T${subject.start_time}`), "hh:mma")} -{" "}
          {format(new Date(`2024-03-15T${subject.end_time}`), "hh:mma")}
        </TableCell> */}

      <TableCell>
        <p>{subject.laboratory}</p>
        <p className="text-xs text-gray-400">{subject.custodian || "N/A"}</p>
      </TableCell>

      <TableCell className="text-center">
        {/* <p>{`Week ${subject.week_number}` || 0}</p> */}
        <Badge
          variant={"secondaryFaded"}
          className={"rounded-full"}
        >{`Week ${subject.week_number || 0}`}</Badge>
        {/* <p>{subject.week_number || 0}</p> */}
        {/* <p
            className="text-xs text-gray-400"
            style={{ fontFamily: "Roboto Mono" }}
          >
            {format(new Date(subject.created_at), "MMM. dd, yyyy")}
          </p> */}
      </TableCell>

      <TableCell>
        <ReportsTableOptions
          currentUser={currentUser}
          activeSchoolYear={activeSchoolYear}
          wasAcknowledged={wasAcknowledged}
          weekDates={subject.weekdates}
          date={subject.selected_date}
          laboratory={subject.laboratory}
          schedule={subject}
          selectedTermAndSem={subject.term_sem}
        />
      </TableCell>
    </TableRow>
  ));
}

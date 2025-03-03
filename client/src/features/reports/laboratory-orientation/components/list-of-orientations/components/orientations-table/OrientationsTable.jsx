import { format } from "date-fns";
import { TableCell, TableRow } from "@/common/ui/table";
import { Checkbox } from "@/common/ui/checkbox";
import OrientationsTableOptions from "./components/orietatation-table-options/OrientationsTableOptions";

export default function OrientationsTable({
  orientations,
  selectOrientation,
  setSelectOrientation,
  setSelectAll,
  onOpenOrientationSheetContainer,
  onAcknoledgeOrientation,
  currentUser,
  tab,
}) {
  const onCheckedChange = (subjectId) => {
    const isSelected = selectOrientation.includes(subjectId);
    setSelectAll(false);
    setSelectOrientation((prev) => {
      if (isSelected) {
        return prev.filter((id) => id !== subjectId);
      } else {
        return [...prev, subjectId];
      }
    });
  };

  return orientations.map((orientation, index) => (
    <TableRow key={index}>
      <TableCell className="flex items-center gap-2">
        {orientation.status === 0 && currentUser?.role === "Custodian" && (
          <div className="w-7">
            <Checkbox
              checked={selectOrientation.includes(orientation.id)}
              onCheckedChange={() => onCheckedChange(orientation.id)}
            />
          </div>
        )}
        <div>
          <p className="text-base font-medium uppercase text-secondary">
            {orientation.subject_code} - {orientation.subject_title}
          </p>
          <p className="-mt-0.5 text-sm text-foreground/80">
            {" "}
            {format(new Date(orientation.sched_start_time), "hh:mma")} -{" "}
            {format(new Date(orientation.sched_end_time), "hh:mma")}
          </p>
        </div>
      </TableCell>

      <TableCell>{orientation.instructor}</TableCell>

      <TableCell>
        <p>{orientation.laboratory}</p>
      </TableCell>

      <TableCell>
        <p>{format(new Date(orientation.date_conducted), "MMM. dd, yyyy")}</p>
      </TableCell>

      <TableCell>
        <OrientationsTableOptions
          tab={tab}
          currentUser={currentUser}
          orientation={orientation}
          onAcknoledgeOrientation={onAcknoledgeOrientation}
          onOpenOrientationSheetContainer={onOpenOrientationSheetContainer}
          index={index}
        />
      </TableCell>
    </TableRow>
  ));
}

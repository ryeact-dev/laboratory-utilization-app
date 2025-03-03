import { TableCell, TableRow } from "@/common/ui/table";
import { Checkbox } from "@/common/ui/checkbox";
import { Button } from "@/common/ui/button";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import { modalStore } from "@/store";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import { ClipboardList } from "lucide-react";

export default function LaboratoryReportsTable({
  reports,
  selectReport,
  setSelectReport,
  setSelectAll,
  wasAcknowledged,
  selectedTermAndSem,
  activeSchoolYear,
}) {
  const openModal = modalStore((state) => state.openModal);

  const { currentUser } = useGetCurrentUserData();

  const onOpenUtilizationModal = (report) => {
    // MODAL CALL
    const payload = {
      title: `Laboratory Utilizations`,
      bodyType: MODAL_BODY_TYPES.VIEW_LABORATORY_UTILIZATIONS,
      extraObject: {
        report,
        selectedTermAndSem,
        activeSchoolYear,
        wasAcknowledged,
      },
      size: "max-w-5xl",
    };

    openModal(payload);
  };

  const filteredReports = reports.filter((report) =>
    currentUser.laboratory.includes(report.laboratory),
  );

  const onCheckedChange = (reportId) => {
    const isSelected = selectReport.includes(reportId);
    setSelectAll(false);
    setSelectReport((prev) => {
      if (isSelected) {
        return prev.filter((id) => id !== reportId);
      } else {
        return [...prev, reportId];
      }
    });
  };
  return filteredReports
    ?.sort((a, b) => a.week_number - b.week_number)
    .map((report, index) => (
      <TableRow key={index}>
        <TableCell className="flex items-center gap-2">
          {!wasAcknowledged && (
            <div className="w-7">
              <Checkbox
                checked={selectReport.includes(report.id)}
                onCheckedChange={() => onCheckedChange(report.id)}
              />
            </div>
          )}
          <div>
            <p>{report.laboratory}</p>
            <p className="text-xs text-gray-400">{report.custodian}</p>
          </div>
        </TableCell>

        <TableCell>
          <p> Week {report.week_number}</p>
          {/* <p className="text-xs text-gray-400">
            {" "}
            {format(new Date(report.created_at), "MMM dd, yyyy")}
          </p> */}
        </TableCell>

        <TableCell>
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenUtilizationModal(report)}
          >
            <ClipboardList size={16} strokeWidth={2} />
          </Button>
        </TableCell>
      </TableRow>
    ));
}

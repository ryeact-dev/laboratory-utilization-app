import { Button } from "@/common/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/common/ui/dropdown-menu";
import {
  CirclePlus,
  ClipboardList,
  Ellipsis,
  FileCheck,
  MonitorCheck,
} from "lucide-react";

export default function ReportsUtilizationCardOptions({
  onOpenSheetContainer,
  currentUser,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`-mt-2 flex items-center justify-center border-0 bg-transparent p-1`}
        >
          <Ellipsis size={16} strokeWidth={2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 overflow-hidden p-1">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => onOpenSheetContainer("lab-utilizations")}
          >
            <ClipboardList size={16} strokeWidth={2} />
            Utilizations
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onOpenSheetContainer("lab-attendance")}
          >
            <FileCheck size={16} strokeWidth={2} />
            Attendance
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onOpenSheetContainer("lab-monitoring")}
          >
            <MonitorCheck size={16} strokeWidth={2} />
            Monitoring
          </DropdownMenuItem>

          {currentUser.role === "Admin" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onOpenSheetContainer("add-manual-utilization")}
              >
                <CirclePlus size={16} strokeWidth={2} />
                Add Utilization
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

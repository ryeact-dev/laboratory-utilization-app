import { Button } from "@/common/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/ui/dropdown-menu";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import { modalStore } from "@/store";
import { Ellipsis, MonitorUp, SquarePen, Trash } from "lucide-react";

export default function HardwareOptions({
  hardwareOBJ,
  school_year,
  laboratory,
}) {
  const openModal = modalStore((state) => state.openModal);

  const openUpgradeModal = () => {
    const payload = {
      title: "Upgrade Details",
      bodyType: MODAL_BODY_TYPES.UPGRADE_DETAILS,
      extraObject: { hardwareOBJ, laboratory },
      size: "max-w-2xl",
    };

    openModal(payload);
  };

  const openEditSubjectModal = () => {
    const hardwareData = {
      ...hardwareOBJ,
      school_year,
    };

    const payload = {
      title: "Update Hardware Info",
      bodyType: MODAL_BODY_TYPES.HARDWARE_ADD,
      extraObject: { hardwareData },
    };

    openModal(payload);
  };

  const onDeleteHardware = () => {
    const hardwareId = hardwareOBJ.id;

    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: `Are you sure you want to delete this hardware?`,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.HARDWARE_DELETE,
        forDeletionData: hardwareId,
      },
    };

    openModal(payload);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup="true" size="icon" variant="ghost">
            <Ellipsis className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={openUpgradeModal}>
            <MonitorUp size={16} />
            Upgrades
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openEditSubjectModal}>
            <SquarePen size={16} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:!bg-primary"
            onClick={onDeleteHardware}
          >
            <Trash size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

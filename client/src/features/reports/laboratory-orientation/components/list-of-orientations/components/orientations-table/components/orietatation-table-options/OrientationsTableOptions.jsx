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
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import { modalStore } from "@/store";
import {
  ClipboardList,
  Ellipsis,
  SquarePen,
  ThumbsUp,
  Trash,
} from "lucide-react";

export default function OrientationsTableOptions({
  onOpenOrientationSheetContainer,
  onAcknoledgeOrientation,
  index,
  orientation,
  currentUser,
  tab,
}) {
  const openModal = modalStore((state) => state.openModal);

  const onDeleteOrientationClick = () => {
    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: "Are you sure you want to delete this orientation?",
        type: CONFIRMATION_MODAL_CLOSE_TYPES.DELETE_LAB_ORIENTATION,
        forDeletionData: orientation?.id,
      },
      size: "max-w-md",
    };

    openModal(payload);
  };

  const onUpdateOrientationClick = () => {
    const payload = {
      title: "Update Orientation checklist",
      bodyType: MODAL_BODY_TYPES.ACKNOWLEDGE_MANY_ORIENTATIONS,
      extraObject: {
        orientationData: [orientation],
        isForAcknowledgement: false,
      },
      size: "max-w-3xl",
    };
    openModal(payload);
  };

  const isAllowedToUpdateChecklist =
    tab === "2" &&
    (currentUser?.role === "Custodian" || currentUser?.role === "Admin");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`-mt-2 flex items-center justify-center border-0 bg-transparent p-1`}
        >
          {/* <LuEllipsis className="h-4 w-4" /> */}
          <Ellipsis size={16} strokeWidth={2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 overflow-hidden p-1">
        <DropdownMenuGroup>
          {orientation?.status === 0 && currentUser?.role === "Custodian" && (
            <DropdownMenuItem onClick={() => onAcknoledgeOrientation(index)}>
              <ThumbsUp size={16} strokeWidth={2} />
              Acknowledge
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => onOpenOrientationSheetContainer(index, "single")}
          >
            <ClipboardList size={16} strokeWidth={2} />
            Details
          </DropdownMenuItem>

          {isAllowedToUpdateChecklist && (
            <DropdownMenuItem onClick={() => onUpdateOrientationClick()}>
              <SquarePen size={16} strokeWidth={2} />
              Update checklist
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => onDeleteOrientationClick()}>
            <Trash size={16} strokeWidth={2} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
